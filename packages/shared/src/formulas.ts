// ============================================
// IADES Educational Simulation Formulas
// ============================================
// All formulas are simplified educational models.
// They do NOT represent actual military-grade calculations.
// Parameters are configurable for learning purposes.

import { WEATHER_FACTORS } from './constants';

/**
 * Simplified Radar Detection Probability
 * Based on a simplified version of the radar range equation.
 *
 * P_detect = clamp(
 *   (radarPower * antennaGain * targetRCS) /
 *   (detectionThreshold * range^4) *
 *   weatherFactor * (1 - ecmFactor) * altitudeFactor,
 *   0, 1
 * )
 *
 * All values are educational approximations.
 */
export function calculateDetectionProbability(params: {
  radarPower: number;        // Relative radar power (1-100)
  antennaGain: number;       // Relative antenna gain (1-50)
  targetRCS: number;         // Radar cross section m²
  range: number;             // Distance in km
  detectionThreshold: number; // Sensitivity threshold (default 1)
  weather: string;           // Weather condition key
  ecmLevel: number;          // 0-1 electronic countermeasure factor
  altitude: number;          // Target altitude in meters
  radarMaxRange: number;     // Maximum radar range in km
}): number {
  const {
    radarPower,
    antennaGain,
    targetRCS,
    range,
    detectionThreshold = 1,
    weather,
    ecmLevel,
    altitude,
    radarMaxRange,
  } = params;

  // Range factor: probability decreases with range^2 (simplified from range^4)
  const rangeFactor = Math.max(0, 1 - Math.pow(range / radarMaxRange, 2));

  // RCS factor: larger targets easier to detect
  const rcsFactor = Math.min(1, Math.log10(targetRCS + 1) / 2 + 0.5);

  // Radar quality factor
  const radarQuality = (radarPower * antennaGain) / (100 * 50 * detectionThreshold);

  // Weather factor
  const weatherFactor = WEATHER_FACTORS[weather as keyof typeof WEATHER_FACTORS] ?? 1.0;

  // ECM reduction
  const ecmFactor = 1 - ecmLevel * 0.5;

  // Altitude factor: very low altitude harder to detect (terrain masking)
  let altitudeFactor = 1.0;
  if (altitude < 100) altitudeFactor = 0.4;
  else if (altitude < 500) altitudeFactor = 0.6;
  else if (altitude < 1000) altitudeFactor = 0.8;
  else if (altitude < 3000) altitudeFactor = 0.9;

  const probability = rangeFactor * rcsFactor * radarQuality * weatherFactor * ecmFactor * altitudeFactor;

  return clamp(probability, 0, 1);
}

/**
 * Simplified Interception Probability
 *
 * P_intercept = baseAccuracy
 *   * targetTypeFactor
 *   * speedFactor
 *   * altitudeMatchFactor
 *   * sensorQuality
 *   * weatherFactor
 *   * (1 - ecmFactor)
 */
export function calculateInterceptionProbability(params: {
  baseAccuracy: number;      // System base accuracy 0-1
  targetSpeed: number;       // Mach
  interceptorSpeed: number;  // Mach
  targetAltitude: number;    // meters
  systemMinAlt: number;      // meters
  systemMaxAlt: number;      // meters
  targetRCS: number;         // m²
  weather: string;
  ecmLevel: number;
  range: number;             // engagement range km
  systemMaxRange: number;    // max range km
  targetType: string;        // threat type
}): number {
  const {
    baseAccuracy,
    targetSpeed,
    interceptorSpeed,
    targetAltitude,
    systemMinAlt,
    systemMaxAlt,
    targetRCS,
    weather,
    ecmLevel,
    range,
    systemMaxRange,
    targetType,
  } = params;

  // Speed factor: harder to intercept faster targets
  const speedRatio = interceptorSpeed > 0 ? targetSpeed / interceptorSpeed : 10;
  const speedFactor = speedRatio <= 0.5 ? 1.0
    : speedRatio <= 1.0 ? 0.85
    : speedRatio <= 2.0 ? 0.6
    : speedRatio <= 5.0 ? 0.3
    : 0.1;

  // Altitude match factor: better if target is well within envelope
  let altitudeFactor = 1.0;
  if (targetAltitude < systemMinAlt || targetAltitude > systemMaxAlt) {
    altitudeFactor = 0.05; // Nearly impossible outside envelope
  } else {
    const altRange = systemMaxAlt - systemMinAlt;
    const mid = (systemMinAlt + systemMaxAlt) / 2;
    const deviation = Math.abs(targetAltitude - mid) / (altRange / 2);
    altitudeFactor = 1.0 - deviation * 0.3;
  }

  // Range factor: accuracy drops at extreme range
  const rangeFactor = range <= systemMaxRange * 0.6 ? 1.0
    : range <= systemMaxRange * 0.8 ? 0.85
    : range <= systemMaxRange ? 0.65
    : 0.1;

  // Target type difficulty multiplier
  const typeDifficulty: Record<string, number> = {
    BALLISTIC_MISSILE: 0.5,
    CRUISE_MISSILE: 0.7,
    UAV: 0.9,
    DRONE_SWARM: 0.4,
    FIGHTER_AIRCRAFT: 0.65,
    BOMBER_AIRCRAFT: 0.8,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.75,
    TACTICAL_MISSILE: 0.6,
    HYPERSONIC: 0.2,
  };
  const typeFactor = typeDifficulty[targetType] ?? 0.5;

  // RCS factor: easier to hit larger targets
  const rcsFactor = targetRCS >= 5 ? 1.0
    : targetRCS >= 1 ? 0.9
    : targetRCS >= 0.1 ? 0.75
    : targetRCS >= 0.01 ? 0.5
    : 0.3;

  // Weather
  const weatherFactor = WEATHER_FACTORS[weather as keyof typeof WEATHER_FACTORS] ?? 1.0;

  // ECM
  const ecmFactor = 1 - ecmLevel * 0.4;

  const probability = baseAccuracy * speedFactor * altitudeFactor * rangeFactor * typeFactor * rcsFactor * weatherFactor * ecmFactor;

  return clamp(probability, 0, 0.99); // Cap at 99% - nothing is perfect
}

/**
 * Calculate engagement cost
 */
export function calculateEngagementCost(params: {
  interceptorCost: number;   // USD per missile
  radarOperatingCostPerHour: number;
  engagementDuration: number; // seconds
  missilesFired: number;
}): number {
  const { interceptorCost, radarOperatingCostPerHour, engagementDuration, missilesFired } = params;
  const radarCost = (radarOperatingCostPerHour / 3600) * engagementDuration;
  const missileCost = interceptorCost * missilesFired;
  return radarCost + missileCost;
}

/**
 * Calculate detection time based on radar scan rate and range
 */
export function calculateDetectionTime(params: {
  scanRate: number;          // seconds per full rotation
  range: number;             // km to target
  targetSpeed: number;       // km/h
}): number {
  const { scanRate, range, targetSpeed } = params;
  // Average detection happens within 1-2 scan cycles
  const scanCycles = 1 + Math.random();
  const baseTime = scanRate * scanCycles;
  // Closer targets detected faster
  const rangePenalty = range > 200 ? 5 : range > 100 ? 3 : 1;
  return baseTime + rangePenalty;
}

/**
 * Calculate time to impact
 */
export function calculateTimeToImpact(params: {
  range: number;             // km
  speed: number;             // Mach
}): number {
  const speedKmPerSec = params.speed * 0.343; // Mach to km/s
  return params.range / speedKmPerSec;
}

/**
 * Utility: clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
