// ============================================
// IADES Simulation Engine
// ============================================
// Educational simulation engine implementing the 8-step engagement cycle:
// 1. Detect Threat  2. Classify Threat  3. Assign Interceptor
// 4. Launch Interceptor  5. Track Engagement  6. Resolve Outcome
// 7. Calculate Cost  8. Generate Report

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
  status: 'INBOUND' | 'DETECTED' | 'CLASSIFIED' | 'ENGAGED' | 'INTERCEPTED' | 'MISSED' | 'IMPACT';
  launchTime: number;
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
  interceptorSpeed: number;
  reloadTime: number;
  cost: number;
  operatingCostPerHour: number;
  maxTargets: number;
  currentTargets: number;
  readyAt: number; // simulation time when ready to fire again
  missileType: string;
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

export async function runSimulation(simulationId: string): Promise<void> {
  try {
    // Fetch simulation with scenario
    const simulation = await prisma.simulation.findUnique({
      where: { id: simulationId },
      include: { scenario: true },
    });

    if (!simulation) throw new Error('Simulation not found');

    // Update status
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: 'RUNNING' },
    });

    const config = simulation.config as Record<string, any>;
    const scenario = simulation.scenario;
    const attackerSetup = scenario.attackerSetup as Record<string, any>;
    const defenderSetup = scenario.defenderSetup as Record<string, any>;

    // Load all systems and threats from DB
    const allSystems = await prisma.airDefenceSystem.findMany();
    const allThreats = await prisma.threat.findMany();

    // Build simulation state
    const events: SimEvent[] = [];
    const engagements: EngagementRecord[] = [];
    let simTime = 0;
    const maxDuration = config.maxDuration || 300;
    const weather = config.weatherCondition || 'CLEAR';
    const ecmLevel = config.ecmLevel || 0;

    // Initialize defender systems
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
        interceptorSpeed: systemData.interceptorSpeed,
        reloadTime: systemData.reloadTime,
        cost: systemData.cost,
        operatingCostPerHour: systemData.operatingCostPerHour,
        maxTargets: systemData.maxSimultaneousTargets,
        currentTargets: 0,
        readyAt: 0,
        missileType: systemData.missileType,
      };
    }).filter(Boolean) as SimSystem[];

    // Initialize threat waves
    const simThreats: SimThreat[] = [];
    const waves = attackerSetup.waves || [];
    for (const wave of waves) {
      for (const wt of wave.threats || []) {
        const threatData = allThreats.find(t => t.id === wt.threatId);
        if (!threatData) continue;
        for (let i = 0; i < (wt.count || 1); i++) {
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
          });
        }
      }
    }

    // If no systems or threats, generate demo data
    if (simSystems.length === 0 && simThreats.length === 0) {
      // Create demo engagement for educational purposes
      const demoSystems = allSystems.slice(0, 3);
      const demoThreats = allThreats.slice(0, 5);

      for (const sys of demoSystems) {
        simSystems.push({
          id: uuid(), systemId: sys.id, name: sys.name, category: sys.category,
          lat: 28.6 + (Math.random() - 0.5) * 0.5,
          lng: 77.2 + (Math.random() - 0.5) * 0.5,
          maxRange: sys.maxRange, minRange: sys.minRange,
          minAlt: sys.minAltitude, maxAlt: sys.maxAltitude,
          accuracy: sys.accuracy, interceptorSpeed: sys.interceptorSpeed,
          reloadTime: sys.reloadTime, cost: sys.cost,
          operatingCostPerHour: sys.operatingCostPerHour,
          maxTargets: sys.maxSimultaneousTargets, currentTargets: 0, readyAt: 0,
          missileType: sys.missileType,
        });
      }

      for (let i = 0; i < demoThreats.length; i++) {
        const t = demoThreats[i];
        simThreats.push({
          id: uuid(), threatId: t.id, name: t.name, type: t.type,
          speed: t.maxSpeed,
          altitude: (t.minAltitude + t.maxAltitude) / 2,
          rcs: t.rcs, targetLat: 28.6, targetLng: 77.2,
          launchLat: 30 + Math.random(), launchLng: 72 + Math.random(),
          status: 'INBOUND', launchTime: 10 + i * 20,
        });
      }
    }

    // ---- SIMULATION LOOP ----
    const timeStep = 1; // 1 second per step
    let totalCost = 0;

    while (simTime <= maxDuration) {
      // Check for newly launched threats
      for (const threat of simThreats) {
        if (threat.status === 'INBOUND' && threat.launchTime <= simTime) {
          events.push({
            id: uuid(), timestamp: simTime,
            type: 'THREAT_LAUNCHED',
            data: { threatId: threat.id, name: threat.name, type: threat.type },
          });

          // STEP 1: DETECTION
          for (const system of simSystems) {
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

                events.push({
                  id: uuid(), timestamp: detTime,
                  type: 'THREAT_DETECTED',
                  data: {
                    threatId: threat.id, name: threat.name,
                    detectedBy: system.name, probability: detectionProb,
                    range: distance,
                  },
                });

                // STEP 2: CLASSIFICATION (2-5 seconds after detection)
                const classTime = detTime + 2 + Math.random() * 3;
                threat.status = 'CLASSIFIED';
                events.push({
                  id: uuid(), timestamp: classTime,
                  type: 'THREAT_CLASSIFIED',
                  data: { threatId: threat.id, type: threat.type, speed: threat.speed, altitude: threat.altitude },
                });

                // STEP 3: ASSIGN INTERCEPTOR (Only capable systems)
                const availableSystem = simSystems.find(s => {
                  if (s.category === 'RADAR' || s.currentTargets >= s.maxTargets || s.readyAt > simTime || s.accuracy <= 0) {
                    return false;
                  }
                  const systemKey = findSystemKey(s.name);
                  if (systemKey && SYSTEM_THREAT_MULTIPLIERS[systemKey]) {
                    const multiplier = SYSTEM_THREAT_MULTIPLIERS[systemKey][threat.type];
                    if (multiplier === 0.0) return false; // Not capable against this threat type
                  }
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

                  // STEP 6: RESOLVE
                  const engagementRange = calculateDistance(
                    availableSystem.lat, availableSystem.lng,
                    threat.launchLat, threat.launchLng
                  ) * 0.6;

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

                  const success = Math.random() < interceptProb;

                  // STEP 7: COST
                  const engagementCost = calculateEngagementCost({
                    interceptorCost: availableSystem.cost * 0.01, // missile cost as fraction of system
                    radarOperatingCostPerHour: availableSystem.operatingCostPerHour,
                    engagementDuration: flightTime,
                    missilesFired: success ? 1 : 2, // fire 2 if miss
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

                    // Threat impacts
                    events.push({
                      id: uuid(), timestamp: interceptAttemptTime + 10,
                      type: 'THREAT_IMPACT',
                      data: { threatId: threat.id, threatName: threat.name },
                    });
                    threat.status = 'IMPACT';
                  }

                  // STEP 8: Record engagement
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

                  // System reload
                  availableSystem.readyAt = interceptAttemptTime + availableSystem.reloadTime;
                  availableSystem.currentTargets--;
                }

                break; // Only detect by first capable system
              }
            }
          }
        }
      }

      simTime += timeStep;

      // Break early if all threats resolved
      if (simThreats.every(t => ['INTERCEPTED', 'MISSED', 'IMPACT'].includes(t.status))) {
        break;
      }
    }

    // ---- GENERATE RESULTS ----
    const totalThreatsCount = simThreats.length;
    const detected = simThreats.filter(t => t.status !== 'INBOUND').length;
    const intercepted = simThreats.filter(t => t.status === 'INTERCEPTED').length;
    const missed = simThreats.filter(t => t.status === 'MISSED' || t.status === 'IMPACT').length;
    const impacted = simThreats.filter(t => t.status === 'IMPACT').length;

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
      engagements,
    };

    // Save events
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

    // Save replay data
    await prisma.replayData.create({
      data: {
        simulationId,
        duration: simTime,
        events: events as any,
        snapshot: {
          systems: simSystems.map(s => ({
            id: s.id, systemId: s.systemId, name: s.name, lat: s.lat, lng: s.lng,
          })),
          zones: ((simulation.scenario.mapConfig as any)?.zones) || [],
        },
      },
    });

    // Save analytics
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

    // Update simulation
    await prisma.simulation.update({
      where: { id: simulationId },
      data: {
        status: 'COMPLETED',
        results: results as any,
        duration: simTime,
        completedAt: new Date(),
      },
    });

    // Update user stats
    await prisma.user.update({
      where: { id: simulation.userId },
      data: {
        simulationsRun: { increment: 1 },
        interceptionRate: results.interceptionRate,
        totalCostSpent: { increment: totalCost },
      },
    });

    console.log(`✅ Simulation ${simulationId} completed: ${intercepted}/${totalThreatsCount} intercepted`);
  } catch (error) {
    console.error(`❌ Simulation ${simulationId} failed:`, error);
    await prisma.simulation.update({
      where: { id: simulationId },
      data: { status: 'FAILED' },
    });
  }
}

/**
 * Calculate distance between two lat/lng points in km (Haversine formula)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
