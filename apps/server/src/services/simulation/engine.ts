// ============================================
// IADES Simulation Engine — v2 (Enhanced)
// ============================================
// Implements the 8-step engagement cycle PLUS:
//   • ARM (Anti-Radiation Missile) mechanics: ARMs target defender radars
//   • A2A self-defense: fighters fire back at incoming SAMs
//   • External radar bonus: RADAR systems boost nearby AD accuracy

import { prisma } from '../../config/database';
import {
  calculateDetectionProbability,
  calculateInterceptionProbability,
  calculateEngagementCost,
  calculateDetectionTime,
  findSystemKey,
  SYSTEM_THREAT_MULTIPLIERS,
} from '@iades/shared';
import { v4 as uuid } from 'uuid';

// ---- Interfaces ----

interface SimThreat {
  id: string;
  threatId: string;
  name: string;
  type: string;
  speed: number;
  altitude: number;
  rcs: number;
  targetLat: number;
  targetLng: number;
  launchLat: number;
  launchLng: number;
  status: 'INBOUND' | 'DETECTED' | 'CLASSIFIED' | 'ENGAGED' | 'INTERCEPTED' | 'MISSED' | 'IMPACT' | 'ARM_SEEKING';
  launchTime: number;
  // For fighter aircraft — track remaining A2A ammo
  bvrAmmo: number;      // BVR AAM count (default 4 for modern jets, 2 for legacy)
  srAmmo: number;       // SR AAM count (default 2)
  isModernFighter: boolean;
}

interface SimSystem {
  id: string;
  systemId: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  maxRange: number;
  minRange: number;
  minAlt: number;
  maxAlt: number;
  accuracy: number;
  baseAccuracy: number;         // original accuracy before modifiers
  interceptorSpeed: number;
  reloadTime: number;
  cost: number;
  operatingCostPerHour: number;
  maxTargets: number;
  currentTargets: number;
  readyAt: number;
  missileType: string;
  // Radar degradation state
  radarDestroyed: boolean;      // true = this system's own radar is destroyed
  radarDegraded: boolean;       // true = this system's radar is partially damaged
  destroyed: boolean;           // true = system itself is completely destroyed
}

interface SimEvent {
  id: string;
  timestamp: number;
  type: string;
  data: Record<string, unknown>;
}

interface EngagementRecord {
  id: string;
  threatId: string;
  threatName: string;
  systemId: string;
  systemName: string;
  detectionTime: number;
  classificationTime: number;
  assignmentTime: number;
  launchTime: number;
  interceptTime: number;
  success: boolean;
  probability: number;
  cost: number;
  reason: string;
}

// ---- Helpers ----

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Returns true if a system is considered a "modern" AD system eligible for radar bonuses */
function isModernAdSystem(sys: SimSystem): boolean {
  const n = sys.name.toLowerCase();
  return (
    n.includes('s-400') || n.includes('s-300') || n.includes('barak') ||
    n.includes('patriot') || n.includes('pac-3') || n.includes('nasams') ||
    n.includes('iris-t') || n.includes('sky sabre') || n.includes('l-sam') ||
    n.includes('akash-ng') || n.includes('spyder') || n.includes('qrsam') ||
    n.includes('cheongung') || n.includes('type-03') || n.includes('samp/t') ||
    n.includes('mica ng') || n.includes('hq-9') || n.includes('hq-16') ||
    n.includes('buk-m3') || n.includes('arrow') || n.includes('sm-3') ||
    n.includes('sm-6') || n.includes('tor-m2') || n.includes('pantsir')
  );
}

/** Returns true if a threat type is an anti-radiation missile */
function isARM(type: string): boolean {
  return type === 'ANTI_RADIATION_MISSILE';
}

/** Returns true if a threat type is an air-to-air missile (used as floating threat) */
function isA2AMissile(type: string): boolean {
  return type === 'AIR_TO_AIR_MISSILE';
}

/** Returns true if threat is a fighter/aircraft that can self-defend */
function isFighterClass(type: string): boolean {
  return type === 'FIGHTER_AIRCRAFT' || type === 'BOMBER_AIRCRAFT' || type === 'ATTACK_HELICOPTER';
}

/** Returns true if threat is an air superiority jet */
function isAirSuperiorityJet(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes('f-22') ||
    n.includes('f-15ex') ||
    n.includes('j-20') ||
    n.includes('su-35') ||
    n.includes('su-57') ||
    n.includes('j-16') ||
    n.includes('typhoon') ||
    n.includes('rafale') ||
    n.includes('kf-21') ||
    n.includes('su-30') ||
    n.includes('mig-31') ||
    n.includes('f-15c') ||
    n.includes('f-15k') ||
    n.includes('j-10') ||
    n.includes('f-16')
  );
}

/** Compute effective accuracy with radar bonus applied */
function computeEffectiveAccuracy(
  sys: SimSystem,
  activeRadarCount: number,
  radarDestroyedCount: number
): number {
  let acc = sys.baseAccuracy;

  // Radar bonus for modern systems
  if (isModernAdSystem(sys) && sys.category !== 'RADAR') {
    const bonusRadars = Math.max(0, activeRadarCount - radarDestroyedCount);
    if (bonusRadars >= 1) {
      // +8% for first external radar, +3% for each additional (cap at +20%)
      const bonus = Math.min(0.20, 0.08 + (bonusRadars - 1) * 0.03);
      acc = Math.min(0.99, acc + bonus);
    }
  }

  // Radar degradation penalties
  if (sys.radarDestroyed) {
    const hasExternalRadar = activeRadarCount - radarDestroyedCount > 0;
    const hasModernPeers = true; // simplified: assume other modern systems exist
    if (hasExternalRadar) {
      // Can use external radar but -30% hit rate
      acc = acc * 0.70;
    } else if (hasModernPeers) {
      // Using peer system's radar — -60% hit rate
      acc = acc * 0.40;
    } else {
      // No radar at all — nearly non-functional
      acc = acc * 0.15;
    }
  } else if (sys.radarDegraded) {
    acc = acc * 0.80;
  }

  return Math.max(0.01, Math.min(0.99, acc));
}

// ============================================
// MAIN SIMULATION FUNCTION
// ============================================

export async function runSimulation(simulationId: string): Promise<void> {
  try {
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: { scenario: true },
    });

    if (!simulation) throw new Error('Simulation not found');

    await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: 'RUNNING' },
    });

    const config = simulation.config as Record<string, any>;
    const scenario = simulation.scenario;
    const attackerSetup = scenario.attackerSetup as Record<string, any>;
    const defenderSetup = scenario.defenderSetup as Record<string, any>;

    const allSystems = await prisma.airDefenceSystem.findMany();
    const allThreats = await prisma.threat.findMany();

    const events: SimEvent[] = [];
    const engagements: EngagementRecord[] = [];
    let simTime = 0;
    const maxDuration = config.maxDuration || 300;
    const weather = config.weatherCondition || 'CLEAR';
    const ecmLevel = config.ecmLevel || 0;

    // ---- Build Defender Systems ----
    const simSystems: SimSystem[] = (defenderSetup.systems || []).map((placed: any) => {
      const systemData = allSystems.find(s => s.id === placed.systemId);
      if (!systemData) return null;
      return {
        id: placed.id || uuid(),
        systemId: systemData.id,
        name: systemData.name,
        category: systemData.category,
        lat: placed.lat,
        lng: placed.lng,
        maxRange: systemData.maxRange,
        minRange: systemData.minRange,
        minAlt: systemData.minAltitude,
        maxAlt: systemData.maxAltitude,
        accuracy: systemData.accuracy,
        baseAccuracy: systemData.accuracy,
        interceptorSpeed: systemData.interceptorSpeed,
        reloadTime: systemData.reloadTime,
        cost: systemData.cost,
        operatingCostPerHour: systemData.operatingCostPerHour,
        maxTargets: systemData.maxSimultaneousTargets,
        currentTargets: 0,
        readyAt: 0,
        missileType: systemData.missileType,
        radarDestroyed: false,
        radarDegraded: false,
        destroyed: false,
      };
    }).filter(Boolean) as SimSystem[];

    // ---- Build Attacker Threats ----
    const simThreats: SimThreat[] = [];
    const waves = attackerSetup.waves || [];
    for (const wave of waves) {
      for (const wt of wave.threats || []) {
        const threatData = allThreats.find(t => t.id === wt.threatId);
        if (!threatData) continue;
        for (let i = 0; i < (wt.count || 1); i++) {
          const isModern = threatData.type === 'FIGHTER_AIRCRAFT' &&
            (threatData.name.toLowerCase().includes('block iii') ||
             threatData.name.toLowerCase().includes('f-16') ||
             threatData.name.toLowerCase().includes('rafale') ||
             threatData.name.toLowerCase().includes('su-30') ||
             threatData.name.toLowerCase().includes('j-10'));
          simThreats.push({
            id: uuid(),
            threatId: threatData.id,
            name: threatData.name,
            type: threatData.type,
            speed: threatData.maxSpeed,
            altitude: (threatData.minAltitude + threatData.maxAltitude) / 2,
            rcs: threatData.rcs,
            targetLat: 0,
            targetLng: 0,
            launchLat: wt.launchLat || 30,
            launchLng: wt.launchLng || 72,
            status: 'INBOUND',
            launchTime: wave.time || 0,
            bvrAmmo: isModern ? 4 : 2,
            srAmmo: 2,
            isModernFighter: isModern,
          });
        }
      }
    }

    // ---- Demo fallback ----
    if (simSystems.length === 0 && simThreats.length === 0) {
      const demoSystems = allSystems.slice(0, 3);
      const demoThreats = allThreats.filter(t =>
        t.type !== 'ANTI_RADIATION_MISSILE' && t.type !== 'AIR_TO_AIR_MISSILE'
      ).slice(0, 5);

      for (const sys of demoSystems) {
        simSystems.push({
          id: uuid(), systemId: sys.id, name: sys.name, category: sys.category,
          lat: 28.6 + (Math.random() - 0.5) * 0.5,
          lng: 77.2 + (Math.random() - 0.5) * 0.5,
          maxRange: sys.maxRange, minRange: sys.minRange,
          minAlt: sys.minAltitude, maxAlt: sys.maxAltitude,
          accuracy: sys.accuracy, baseAccuracy: sys.accuracy,
          interceptorSpeed: sys.interceptorSpeed,
          reloadTime: sys.reloadTime, cost: sys.cost,
          operatingCostPerHour: sys.operatingCostPerHour,
          maxTargets: sys.maxSimultaneousTargets, currentTargets: 0, readyAt: 0,
          missileType: sys.missileType,
          radarDestroyed: false, radarDegraded: false, destroyed: false,
        });
      }

      for (let i = 0; i < demoThreats.length; i++) {
        const t = demoThreats[i];
        simThreats.push({
          id: uuid(), threatId: t.id, name: t.name, type: t.type,
          speed: t.maxSpeed, altitude: (t.minAltitude + t.maxAltitude) / 2,
          rcs: t.rcs, targetLat: 28.6, targetLng: 77.2,
          launchLat: 30 + Math.random(), launchLng: 72 + Math.random(),
          status: 'INBOUND', launchTime: 10 + i * 20,
          bvrAmmo: 4, srAmmo: 2, isModernFighter: false,
        });
      }
    }

    // ============================================
    // SIMULATION LOOP
    // ============================================
    const timeStep = 1;
    let totalCost = 0;

    while (simTime <= maxDuration) {
      // --- Count active radar systems for bonus calculation ---
      const activeRadarSystems = simSystems.filter(
        s => s.category === 'RADAR' && !s.destroyed
      );
      const destroyedRadarSystems = simSystems.filter(
        s => s.category === 'RADAR' && s.destroyed
      );
      const activeRadarCount = activeRadarSystems.length;
      const radarDestroyedCount = destroyedRadarSystems.length;

      // Update effective accuracy for all systems based on radar state
      for (const sys of simSystems) {
        if (!sys.destroyed) {
          sys.accuracy = computeEffectiveAccuracy(sys, activeRadarCount, radarDestroyedCount);
        }
      }

      // --- Process each threat ---
      for (const threat of simThreats) {
        if (threat.status !== 'INBOUND' || threat.launchTime > simTime) continue;

        // =========================================
        // PHASE A: ARM — Anti-Radiation Missile
        // ARMs seek active defender radar emitters
        // =========================================
        if (isARM(threat.type)) {
          threat.status = 'CLASSIFIED';

          events.push({
            id: uuid(), timestamp: simTime,
            type: 'THREAT_LAUNCHED',
            data: { threatId: threat.id, name: threat.name, type: 'ANTI_RADIATION_MISSILE',
                    message: 'ARM launched — seeking active radar emissions' },
          });

          // Find the closest active radar target (category=RADAR first, then any system with radar)
          const radarTargets = simSystems.filter(s => !s.destroyed && !s.radarDestroyed);
          if (radarTargets.length === 0) {
            // No active radars to home on — ARM continues but finds nothing
            threat.status = 'MISSED';
            events.push({
              id: uuid(), timestamp: simTime + 15,
              type: 'ARM_NO_TARGET',
              data: { threatId: threat.id, message: 'ARM found no active radar emitters — missed' },
            });
            continue;
          }

          // Sort by distance — ARM homes on nearest active emitter
          const sortedRadarTargets = radarTargets.sort((a, b) => {
            const da = calculateDistance(a.lat, a.lng, threat.launchLat, threat.launchLng);
            const db = calculateDistance(b.lat, b.lng, threat.launchLat, threat.launchLng);
            return da - db;
          });
          const targetSystem = sortedRadarTargets[0];

          const armFlightTime = 8 + Math.random() * 10;
          const armImpactTime = simTime + armFlightTime;

          events.push({
            id: uuid(), timestamp: simTime + 2,
            type: 'ARM_LAUNCHED',
            data: {
              threatId: threat.id,
              targetSystemId: targetSystem.id,
              targetSystemName: targetSystem.name,
              message: `ARM homing on ${targetSystem.name} radar emissions`,
            },
          });

          // ARM hit probability: 70% base, reduced if radar shuts down
          const armHitProb = 0.70;
          const armHit = Math.random() < armHitProb;

          if (armHit) {
            const isStandaloneRadar = targetSystem.category === 'RADAR';
            if (isStandaloneRadar) {
              // Standalone radar destroyed — nearby AD systems must operate degraded
              targetSystem.destroyed = true;
              threat.status = 'INTERCEPTED'; // ARM succeeded in its mission
              events.push({
                id: uuid(), timestamp: armImpactTime,
                type: 'RADAR_DESTROYED',
                data: {
                  threatId: threat.id,
                  systemId: targetSystem.id,
                  systemName: targetSystem.name,
                  message: `RADAR DESTROYED: ${targetSystem.name} knocked out by ARM. Nearby AD systems operating at reduced accuracy.`,
                },
              });
              // Flag all AD systems that their radar is gone
              for (const sys of simSystems) {
                if (!sys.destroyed && sys.category !== 'RADAR') {
                  sys.radarDestroyed = true;
                  events.push({
                    id: uuid(), timestamp: armImpactTime + 1,
                    type: 'DEFENDER_DEGRADED',
                    data: {
                      systemId: sys.id,
                      systemName: sys.name,
                      reason: 'Dedicated radar destroyed — using own/peer system radar at -30% accuracy',
                    },
                  });
                }
              }
            } else {
              // Hit an AD system's integrated radar — degrade but don't destroy
              targetSystem.radarDestroyed = true;
              threat.status = 'INTERCEPTED';
              events.push({
                id: uuid(), timestamp: armImpactTime,
                type: 'RADAR_HIT',
                data: {
                  threatId: threat.id,
                  systemId: targetSystem.id,
                  systemName: targetSystem.name,
                  message: `ARM hit ${targetSystem.name} radar — system degraded, operating at reduced accuracy`,
                },
              });
            }
          } else {
            threat.status = 'MISSED';
            events.push({
              id: uuid(), timestamp: armImpactTime,
              type: 'ARM_MISS',
              data: {
                threatId: threat.id,
                targetSystemName: targetSystem.name,
                message: `ARM missed ${targetSystem.name} — radar activated countermeasures`,
              },
            });
          }

          continue; // ARM processing complete — skip normal intercept logic
        }

        // =========================================
        // PHASE B: Normal Threats (including fighters)
        // =========================================

        events.push({
          id: uuid(), timestamp: simTime,
          type: 'THREAT_LAUNCHED',
          data: { threatId: threat.id, name: threat.name, type: threat.type },
        });

        // STEP 1: DETECTION
        let detected = false;
        for (const system of simSystems) {
          if (system.destroyed) continue;
          if (system.category === 'RADAR' || system.maxRange > 0) {
            const distance = calculateDistance(
              system.lat, system.lng, threat.launchLat, threat.launchLng
            );

            const detectionProb = calculateDetectionProbability({
              radarPower: 80,
              antennaGain: 40,
              targetRCS: threat.rcs,
              range: distance,
              detectionThreshold: 1,
              weather,
              ecmLevel,
              altitude: threat.altitude,
              radarMaxRange: system.maxRange,
            });

            if (Math.random() < detectionProb) {
              const detTime = simTime + 3 + Math.random() * 5;
              threat.status = 'DETECTED';
              detected = true;

              events.push({
                id: uuid(), timestamp: detTime,
                type: 'THREAT_DETECTED',
                data: {
                  threatId: threat.id, name: threat.name,
                  detectedBy: system.name, probability: detectionProb, range: distance,
                },
              });

              // STEP 2: CLASSIFICATION
              const classTime = detTime + 2 + Math.random() * 3;
              threat.status = 'CLASSIFIED';
              events.push({
                id: uuid(), timestamp: classTime,
                type: 'THREAT_CLASSIFIED',
                data: { threatId: threat.id, type: threat.type, speed: threat.speed, altitude: threat.altitude },
              });

              // STEP 3: ASSIGN INTERCEPTOR
              const availableSystem = simSystems.find(s => {
                if (s.category === 'RADAR' || s.destroyed) return false;
                if (s.currentTargets >= s.maxTargets || s.readyAt > simTime || s.accuracy < 0) return false;

                const systemKey = findSystemKey(s.name);
                if (systemKey && SYSTEM_THREAT_MULTIPLIERS[systemKey]) {
                  const multiplier = SYSTEM_THREAT_MULTIPLIERS[systemKey][threat.type];
                  if (multiplier === 0.0) return false;
                }
                const launchDistance = calculateDistance(s.lat, s.lng, threat.launchLat, threat.launchLng);
                const interceptDistance = launchDistance * 0.4;
                if (interceptDistance > s.maxRange) return false;
                return true;
              });

              if (availableSystem) {
                const assignTime = classTime + 1 + Math.random() * 2;
                events.push({
                  id: uuid(), timestamp: assignTime,
                  type: 'INTERCEPTOR_ASSIGNED',
                  data: { threatId: threat.id, systemId: availableSystem.id, systemName: availableSystem.name },
                });

                // STEP 4: LAUNCH
                const launchDelay = assignTime + 2 + Math.random() * 3;
                availableSystem.currentTargets++;
                events.push({
                  id: uuid(), timestamp: launchDelay,
                  type: 'INTERCEPTOR_LAUNCHED',
                  data: { threatId: threat.id, systemName: availableSystem.name },
                });

                // STEP 5: TRACK
                const flightTime = 5 + Math.random() * 15;
                const interceptAttemptTime = launchDelay + flightTime;

                events.push({
                  id: uuid(), timestamp: launchDelay + flightTime / 2,
                  type: 'TRACKING_UPDATE',
                  data: { threatId: threat.id, systemName: availableSystem.name, phase: 'MID_COURSE' },
                });

                const engagementRange = calculateDistance(
                  availableSystem.lat, availableSystem.lng,
                  threat.launchLat, threat.launchLng
                ) * 0.4;

                // =========================================
                // A2A SELF-DEFENSE — Fighters fire back
                // =========================================
                let samSurvived = true; // Assume SAM reaches target unless A2A shoots it down
                if (isFighterClass(threat.type)) {
                  // Fighter detects incoming SAM with its onboard radar
                  const detectionChance = threat.isModernFighter ? 0.75 : 0.50;
                  const fighterDetectsSam = Math.random() < detectionChance;

                  if (fighterDetectsSam) {
                    events.push({
                      id: uuid(), timestamp: launchDelay + 1,
                      type: 'A2A_RADAR_WARNING',
                      data: {
                        threatId: threat.id,
                        fighterName: threat.name,
                        message: `${threat.name} RWR detected incoming SAM from ${availableSystem.name}`,
                      },
                    });

                    // Decide BVR vs SR based on engagement range and ammo
                    const useBVR = engagementRange > 30 && threat.bvrAmmo > 0;
                    const useSR = !useBVR && threat.srAmmo > 0;

                    if (useBVR || useSR) {
                      const a2aHitProb = 0.60;
                      const a2aType = useBVR ? 'BVR' : 'SHORT_RANGE';

                      if (useBVR) threat.bvrAmmo--;
                      else threat.srAmmo--;

                      events.push({
                        id: uuid(), timestamp: launchDelay + 2,
                        type: 'A2A_FIRED',
                        data: {
                          threatId: threat.id,
                          fighterName: threat.name,
                          a2aType,
                          targetSystem: availableSystem.name,
                          hitProbability: a2aHitProb,
                          message: `${threat.name} fired ${a2aType} A2A missile at incoming SAM`,
                        },
                      });

                      const a2aSuccess = Math.random() < a2aHitProb;
                      if (a2aSuccess) {
                        samSurvived = false; // A2A shot down the incoming SAM
                        events.push({
                          id: uuid(), timestamp: launchDelay + flightTime * 0.6,
                          type: 'A2A_INTERCEPT_SUCCESS',
                          data: {
                            threatId: threat.id,
                            fighterName: threat.name,
                            a2aType,
                            message: `${threat.name} A2A missile destroyed incoming SAM from ${availableSystem.name}`,
                          },
                        });
                      } else {
                        events.push({
                          id: uuid(), timestamp: launchDelay + flightTime * 0.6,
                          type: 'A2A_INTERCEPT_FAILURE',
                          data: {
                            threatId: threat.id,
                            fighterName: threat.name,
                            a2aType,
                            message: `${threat.name} A2A missed — SAM continues`,
                          },
                        });
                      }
                    }
                  }
                }

                // =========================================
                // A2A ESCORT COVER — Escorts protect wingmen
                // =========================================
                if (samSurvived) {
                  const escort = simThreats.find(esc =>
                    esc.id !== threat.id &&
                    isFighterClass(esc.type) &&
                    isAirSuperiorityJet(esc.name) &&
                    ['INBOUND', 'DETECTED', 'CLASSIFIED', 'ENGAGED'].includes(esc.status) &&
                    esc.bvrAmmo > 0
                  );

                  if (escort) {
                    const isModern = escort.name.includes('F-22') || escort.name.includes('J-20') || escort.name.includes('Su-57');
                    const detectProb = isModern ? 0.85 : 0.65;
                    if (Math.random() < detectProb) {
                      escort.bvrAmmo--;

                      events.push({
                        id: uuid(), timestamp: launchDelay + 2,
                        type: 'A2A_FIRED',
                        data: {
                          threatId: escort.id,
                          fighterName: escort.name,
                          a2aType: 'BVR',
                          targetSystem: availableSystem.name,
                          message: `🛡️ ESCORT COVER: Escort fighter ${escort.name} locked SAM targeting wingman ${threat.name}. Fired BVR AAM to defend wingman!`,
                        },
                      });

                      const a2aSuccess = Math.random() < 0.60;
                      if (a2aSuccess) {
                        samSurvived = false;
                        events.push({
                          id: uuid(), timestamp: launchDelay + flightTime * 0.6,
                          type: 'A2A_INTERCEPT_SUCCESS',
                          data: {
                            threatId: escort.id,
                            fighterName: escort.name,
                            a2aType: 'BVR',
                            message: `💥 ESCORT SUCCESS: SAM destroyed in flight by ${escort.name}'s escort BVR missile!`,
                          },
                        });
                      } else {
                        events.push({
                          id: uuid(), timestamp: launchDelay + flightTime * 0.6,
                          type: 'A2A_INTERCEPT_FAILURE',
                          data: {
                            threatId: escort.id,
                            fighterName: escort.name,
                            a2aType: 'BVR',
                            message: `💨 ESCORT MISS: Escort BVR missile fired by ${escort.name} missed the SAM.`,
                          },
                        });
                      }
                    }
                  }
                }

                // STEP 6: RESOLVE INTERCEPTION
                // (only if SAM wasn't shot down by A2A)
                let success = false;
                if (samSurvived) {
                  const interceptProb = calculateInterceptionProbability({
                    baseAccuracy: availableSystem.accuracy,
                    targetSpeed: threat.speed,
                    interceptorSpeed: availableSystem.interceptorSpeed,
                    targetAltitude: threat.altitude,
                    systemMinAlt: availableSystem.minAlt,
                    systemMaxAlt: availableSystem.maxAlt,
                    targetRCS: threat.rcs,
                    weather,
                    ecmLevel,
                    range: engagementRange,
                    systemMaxRange: availableSystem.maxRange,
                    targetType: threat.type,
                    systemName: availableSystem.name,
                    missileName: availableSystem.missileType,
                  });

                  success = Math.random() < interceptProb;

                  // STEP 7: COST
                  const engagementCost = calculateEngagementCost({
                    interceptorCost: availableSystem.cost * 0.01,
                    radarOperatingCostPerHour: availableSystem.operatingCostPerHour,
                    engagementDuration: flightTime,
                    missilesFired: success ? 1 : 2,
                  });
                  totalCost += engagementCost;

                  if (success) {
                    threat.status = 'INTERCEPTED';
                    events.push({
                      id: uuid(), timestamp: interceptAttemptTime,
                      type: 'INTERCEPTION_SUCCESS',
                      data: {
                        threatId: threat.id, threatName: threat.name,
                        systemName: availableSystem.name,
                        probability: interceptProb, cost: engagementCost,
                        radarBonus: availableSystem.accuracy > availableSystem.baseAccuracy ?
                          +(availableSystem.accuracy - availableSystem.baseAccuracy).toFixed(3) : 0,
                      },
                    });
                  } else {
                    threat.status = 'MISSED';
                    events.push({
                      id: uuid(), timestamp: interceptAttemptTime,
                      type: 'INTERCEPTION_FAILURE',
                      data: {
                        threatId: threat.id, threatName: threat.name,
                        systemName: availableSystem.name,
                        probability: interceptProb, cost: engagementCost,
                        reason: 'Interception probability roll failed',
                      },
                    });
                    if (isAirSuperiorityJet(threat.name)) {
                      events.push({
                        id: uuid(), timestamp: interceptAttemptTime + 10,
                        type: 'THREAT_RTB',
                        data: { threatId: threat.id, threatName: threat.name, message: `${threat.name} completed escort patrol and returned to base.` },
                      });
                      threat.status = 'MISSED';
                    } else {
                      events.push({
                        id: uuid(), timestamp: interceptAttemptTime + 10,
                        type: 'THREAT_IMPACT',
                        data: { threatId: threat.id, threatName: threat.name },
                      });
                      threat.status = 'IMPACT';
                    }
                  }

                  // STEP 8: Record
                  engagements.push({
                    id: uuid(),
                    threatId: threat.id,
                    threatName: threat.name,
                    systemId: availableSystem.id,
                    systemName: availableSystem.name,
                    detectionTime: detTime,
                    classificationTime: classTime,
                    assignmentTime: assignTime,
                    launchTime: launchDelay,
                    interceptTime: interceptAttemptTime,
                    success,
                    probability: interceptProb,
                    cost: engagementCost,
                    reason: success ? 'Successful interception' : 'Probability roll failure',
                  });

                  availableSystem.readyAt = interceptAttemptTime + availableSystem.reloadTime;
                  availableSystem.currentTargets--;

                } else {
                  // SAM was shot down by A2A — log it
                  threat.status = 'MISSED'; // Threat survived (defender's SAM was destroyed)
                  events.push({
                    id: uuid(), timestamp: interceptAttemptTime,
                    type: 'INTERCEPTION_FAILURE',
                    data: {
                      threatId: threat.id, threatName: threat.name,
                      systemName: availableSystem.name,
                      probability: 0,
                      cost: 0,
                      reason: `Interceptor missile destroyed by ${threat.name} A2A self-defense`,
                    },
                  });
                  if (isAirSuperiorityJet(threat.name)) {
                    events.push({
                      id: uuid(), timestamp: interceptAttemptTime + 10,
                      type: 'THREAT_RTB',
                      data: { threatId: threat.id, threatName: threat.name, message: `${threat.name} completed escort patrol and returned to base.` },
                    });
                    threat.status = 'MISSED';
                  } else {
                    events.push({
                      id: uuid(), timestamp: interceptAttemptTime + 10,
                      type: 'THREAT_IMPACT',
                      data: { threatId: threat.id, threatName: threat.name },
                    });
                    threat.status = 'IMPACT';
                  }
                  availableSystem.currentTargets--;
                }
              }

              break; // Detected by first capable system — move on
            }
          }
        }
      }

      simTime += timeStep;

      // Break early if all threats resolved
      const allResolved = simThreats.every(t =>
        ['INTERCEPTED', 'MISSED', 'IMPACT', 'ARM_SEEKING'].includes(t.status)
      );
      if (allResolved) break;
    }

    // ---- RESULTS ----
    const totalThreatsCount = simThreats.length;
    const detected = simThreats.filter(t => t.status !== 'INBOUND').length;
    const intercepted = simThreats.filter(t => t.status === 'INTERCEPTED').length;
    const missed = simThreats.filter(t => t.status === 'MISSED' || t.status === 'IMPACT').length;
    const impacted = simThreats.filter(t => t.status === 'IMPACT').length;
    const radarsDestroyed = simSystems.filter(s => s.destroyed || s.radarDestroyed).length;

    const results = {
      totalThreats: totalThreatsCount,
      threatsDetected: detected,
      threatsIntercepted: intercepted,
      threatsMissed: missed,
      threatsImpacted: impacted,
      interceptionRate: totalThreatsCount > 0 ? intercepted / totalThreatsCount : 0,
      detectionRate: totalThreatsCount > 0 ? detected / totalThreatsCount : 0,
      totalCost,
      costPerEngagement: engagements.length > 0 ? totalCost / engagements.length : 0,
      costPerSuccessfulInterception: intercepted > 0 ? totalCost / intercepted : 0,
      interceptorsUsed: engagements.length,
      radarOperatingCost: totalCost * 0.1,
      radarsDestroyed,
      engagements,
    };

    if (events.length > 0) {
      await prisma.simulationEvent.createMany({
        data: events.map(e => ({
          simulationId,
          timestamp: e.timestamp,
          type: e.type,
          data: e.data as any,
        })),
      });
    }

    await prisma.replayData.create({
      data: {
        simulationId,
        duration: simTime,
        events: events as any,
        snapshot: {
          systems: simSystems.map(s => ({
            id: s.id, systemId: s.systemId, name: s.name, lat: s.lat, lng: s.lng,
            destroyed: s.destroyed, radarDestroyed: s.radarDestroyed,
          })),
          zones: ((simulation.scenario.mapConfig as any)?.zones) || [],
        },
      },
    });

    await prisma.analyticsRecord.create({
      data: {
        simulationId,
        interceptionRate: results.interceptionRate,
        detectionRate: results.detectionRate,
        costEfficiency: results.costPerSuccessfulInterception,
        radarEffectiveness: results.detectionRate * 0.9,
        threatPenetrationRate: totalThreatsCount > 0 ? impacted / totalThreatsCount : 0,
        systemUtilization: simSystems.length > 0 ? engagements.length / simSystems.length : 0,
      },
    });

    await prisma.simulation.update({
      where: { id: simulationId },
      data: {
        status: 'COMPLETED',
        results: results as any,
        duration: simTime,
        completedAt: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: simulation.userId },
      data: {
        simulationsRun: { increment: 1 },
        interceptionRate: results.interceptionRate,
        totalCostSpent: { increment: totalCost },
      },
    });

    console.log(`✅ Simulation ${simulationId} completed: ${intercepted}/${totalThreatsCount} intercepted | ${radarsDestroyed} radars destroyed`);
  } catch (error) {
    console.error(`❌ Simulation ${simulationId} failed:`, error);
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: 'FAILED' },
    });
  }
}
