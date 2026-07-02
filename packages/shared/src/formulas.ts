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

// System-specific threat capabilities & multipliers (real-world estimates)
export const SYSTEM_THREAT_MULTIPLIERS: Record<string, Record<string, number>> = {
  'S-400': {
    BALLISTIC_MISSILE: 0.90, // S-400 is excellent at ABM
    CRUISE_MISSILE: 0.95,
    UAV: 0.95,
    DRONE_SWARM: 0.70,
    FIGHTER_AIRCRAFT: 0.98,
    BOMBER_AIRCRAFT: 0.98,
    ATTACK_HELICOPTER: 0.95,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.95,
    HYPERSONIC: 0.35,
  },
  'Barak 8 ER': {
    BALLISTIC_MISSILE: 0.45, // ER variant has active booster and enhanced ABM tracking
    CRUISE_MISSILE: 0.90,
    UAV: 0.92,
    DRONE_SWARM: 0.65,
    FIGHTER_AIRCRAFT: 0.95,
    BOMBER_AIRCRAFT: 0.95,
    ATTACK_HELICOPTER: 0.92,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.85,
    HYPERSONIC: 0.15,
  },
  'Barak 8': {
    BALLISTIC_MISSILE: 0.40, // Standard MRSAM has limited ABM capability
    CRUISE_MISSILE: 0.85,
    UAV: 0.90,
    DRONE_SWARM: 0.60,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.75,
    HYPERSONIC: 0.05,
  },
  'SPYDER': {
    BALLISTIC_MISSILE: 0.00, // SPYDER SR/MR has no ABM capability
    CRUISE_MISSILE: 0.85,
    UAV: 0.95,
    DRONE_SWARM: 0.75,
    FIGHTER_AIRCRAFT: 0.90,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.95,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.40,
    HYPERSONIC: 0.00,
  },
  'Pechora': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.55,
    UAV: 0.65,
    DRONE_SWARM: 0.30,
    FIGHTER_AIRCRAFT: 0.75,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.75,
    LOITERING_MUNITION: 0.40,
    TACTICAL_MISSILE: 0.20,
    HYPERSONIC: 0.00,
  },
  'Akash-NG': {
    BALLISTIC_MISSILE: 0.70, // Active seeker, can intercept short-range ballistic
    CRUISE_MISSILE: 0.90,
    UAV: 0.90,
    DRONE_SWARM: 0.60,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.70,
    HYPERSONIC: 0.05,
  },
  'Akash': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.70,
    UAV: 0.80,
    DRONE_SWARM: 0.40,
    FIGHTER_AIRCRAFT: 0.85,
    BOMBER_AIRCRAFT: 0.85,
    ATTACK_HELICOPTER: 0.80,
    LOITERING_MUNITION: 0.70,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  'QRSAM': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.80,
    UAV: 0.90,
    DRONE_SWARM: 0.70,
    FIGHTER_AIRCRAFT: 0.88,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.40,
    HYPERSONIC: 0.00,
  },
  'VSHORAD': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.35,
    UAV: 0.75,
    DRONE_SWARM: 0.35,
    FIGHTER_AIRCRAFT: 0.65,
    BOMBER_AIRCRAFT: 0.60,
    ATTACK_HELICOPTER: 0.80,
    LOITERING_MUNITION: 0.70,
    TACTICAL_MISSILE: 0.10,
    HYPERSONIC: 0.00,
  },
  'Igla-S': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.30,
    UAV: 0.70,
    DRONE_SWARM: 0.30,
    FIGHTER_AIRCRAFT: 0.60,
    BOMBER_AIRCRAFT: 0.55,
    ATTACK_HELICOPTER: 0.75,
    LOITERING_MUNITION: 0.65,
    TACTICAL_MISSILE: 0.05,
    HYPERSONIC: 0.00,
  },
  'RBS-70': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.45,
    UAV: 0.75,
    DRONE_SWARM: 0.40,
    FIGHTER_AIRCRAFT: 0.70,
    BOMBER_AIRCRAFT: 0.65,
    ATTACK_HELICOPTER: 0.80,
    LOITERING_MUNITION: 0.75,
    TACTICAL_MISSILE: 0.15,
    HYPERSONIC: 0.00,
  },
  'Anti-Drone': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.00,
    UAV: 0.90,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.00,
    BOMBER_AIRCRAFT: 0.00,
    ATTACK_HELICOPTER: 0.10,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.00,
    HYPERSONIC: 0.00,
  },
  'HQ-9P': {
    BALLISTIC_MISSILE: 0.40,
    CRUISE_MISSILE: 0.85,
    UAV: 0.90,
    DRONE_SWARM: 0.65,
    FIGHTER_AIRCRAFT: 0.95,
    BOMBER_AIRCRAFT: 0.95,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.75,
    HYPERSONIC: 0.05,
  },
  'LY-80': {
    BALLISTIC_MISSILE: 0.10,
    CRUISE_MISSILE: 0.80,
    UAV: 0.85,
    DRONE_SWARM: 0.55,
    FIGHTER_AIRCRAFT: 0.90,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.80,
    TACTICAL_MISSILE: 0.70,
    HYPERSONIC: 0.00,
  },
  'HQ-17AE': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.80,
    UAV: 0.90,
    DRONE_SWARM: 0.75,
    FIGHTER_AIRCRAFT: 0.85,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  'Spada 2000': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.75,
    UAV: 0.85,
    DRONE_SWARM: 0.65,
    FIGHTER_AIRCRAFT: 0.85,
    BOMBER_AIRCRAFT: 0.85,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.80,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  'FM-90': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.65,
    UAV: 0.75,
    DRONE_SWARM: 0.45,
    FIGHTER_AIRCRAFT: 0.80,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.80,
    LOITERING_MUNITION: 0.65,
    TACTICAL_MISSILE: 0.20,
    HYPERSONIC: 0.00,
  },
  'Anza': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.30,
    UAV: 0.70,
    DRONE_SWARM: 0.30,
    FIGHTER_AIRCRAFT: 0.60,
    BOMBER_AIRCRAFT: 0.55,
    ATTACK_HELICOPTER: 0.75,
    LOITERING_MUNITION: 0.65,
    TACTICAL_MISSILE: 0.05,
    HYPERSONIC: 0.00,
  },
  'SM-3 Block IIA': {
    BALLISTIC_MISSILE: 0.96,
    CRUISE_MISSILE: 0.00,
    UAV: 0.00,
    DRONE_SWARM: 0.00,
    FIGHTER_AIRCRAFT: 0.10,
    BOMBER_AIRCRAFT: 0.20,
    ATTACK_HELICOPTER: 0.00,
    LOITERING_MUNITION: 0.00,
    TACTICAL_MISSILE: 0.85,
    HYPERSONIC: 0.85,
  },
  'Centurion LPWS': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.40,
    UAV: 0.88,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.15,
    BOMBER_AIRCRAFT: 0.10,
    ATTACK_HELICOPTER: 0.40,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.10,
    HYPERSONIC: 0.00,
  },
  'HQ-19': {
    BALLISTIC_MISSILE: 0.95,
    CRUISE_MISSILE: 0.00,
    UAV: 0.00,
    DRONE_SWARM: 0.00,
    FIGHTER_AIRCRAFT: 0.10,
    BOMBER_AIRCRAFT: 0.15,
    ATTACK_HELICOPTER: 0.00,
    LOITERING_MUNITION: 0.00,
    TACTICAL_MISSILE: 0.80,
    HYPERSONIC: 0.80,
  },
  'LD-2000': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.45,
    UAV: 0.85,
    DRONE_SWARM: 0.82,
    FIGHTER_AIRCRAFT: 0.15,
    BOMBER_AIRCRAFT: 0.10,
    ATTACK_HELICOPTER: 0.40,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.10,
    HYPERSONIC: 0.00,
  },
  'Sosna-R': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.75,
    UAV: 0.88,
    DRONE_SWARM: 0.80,
    FIGHTER_AIRCRAFT: 0.85,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.40,
    HYPERSONIC: 0.05,
  },
  'Gibka-S': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.50,
    UAV: 0.80,
    DRONE_SWARM: 0.75,
    FIGHTER_AIRCRAFT: 0.70,
    BOMBER_AIRCRAFT: 0.65,
    ATTACK_HELICOPTER: 0.80,
    LOITERING_MUNITION: 0.80,
    TACTICAL_MISSILE: 0.10,
    HYPERSONIC: 0.00,
  },
  'Type-03 Kai': {
    BALLISTIC_MISSILE: 0.30,
    CRUISE_MISSILE: 0.88,
    UAV: 0.90,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.75,
    HYPERSONIC: 0.20,
  },
  'Type-81C': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.70,
    UAV: 0.85,
    DRONE_SWARM: 0.80,
    FIGHTER_AIRCRAFT: 0.82,
    BOMBER_AIRCRAFT: 0.80,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.80,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  'L-SAM': {
    BALLISTIC_MISSILE: 0.90,
    CRUISE_MISSILE: 0.80,
    UAV: 0.85,
    DRONE_SWARM: 0.70,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.70,
    TACTICAL_MISSILE: 0.80,
    HYPERSONIC: 0.65,
  },
  'LAMD': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.72,
    UAV: 0.88,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.30,
    BOMBER_AIRCRAFT: 0.20,
    ATTACK_HELICOPTER: 0.40,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  'SM-6 Dual II': {
    BALLISTIC_MISSILE: 0.60,
    CRUISE_MISSILE: 0.92,
    UAV: 0.90,
    DRONE_SWARM: 0.88,
    FIGHTER_AIRCRAFT: 0.95,
    BOMBER_AIRCRAFT: 0.95,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.85,
    HYPERSONIC: 0.50,
  },
  'MICA NG': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.88,
    UAV: 0.90,
    DRONE_SWARM: 0.88,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.50,
    HYPERSONIC: 0.05,
  },
  'Arrow 3': {
    BALLISTIC_MISSILE: 0.97,
    CRUISE_MISSILE: 0.00,
    UAV: 0.00,
    DRONE_SWARM: 0.00,
    FIGHTER_AIRCRAFT: 0.00,
    BOMBER_AIRCRAFT: 0.00,
    ATTACK_HELICOPTER: 0.00,
    LOITERING_MUNITION: 0.00,
    TACTICAL_MISSILE: 0.88,
    HYPERSONIC: 0.88,
  },
  'Mantis': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.40,
    UAV: 0.88,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.15,
    BOMBER_AIRCRAFT: 0.10,
    ATTACK_HELICOPTER: 0.40,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.10,
    HYPERSONIC: 0.00,
  },
  // ---- Russia ----
  'S-300PMU2': {
    BALLISTIC_MISSILE: 0.70, // Limited ABM vs short-range ballistics
    CRUISE_MISSILE: 0.88,
    UAV: 0.90,
    DRONE_SWARM: 0.60,
    FIGHTER_AIRCRAFT: 0.95,
    BOMBER_AIRCRAFT: 0.96,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.82,
    TACTICAL_MISSILE: 0.80,
    HYPERSONIC: 0.25,
  },
  'Tor-M2': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.82,
    UAV: 0.90,
    DRONE_SWARM: 0.78,
    FIGHTER_AIRCRAFT: 0.80,
    BOMBER_AIRCRAFT: 0.75,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.35,
    HYPERSONIC: 0.00,
  },
  'Buk-M3': {
    BALLISTIC_MISSILE: 0.20,
    CRUISE_MISSILE: 0.85,
    UAV: 0.88,
    DRONE_SWARM: 0.65,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.88,
    LOITERING_MUNITION: 0.84,
    TACTICAL_MISSILE: 0.75,
    HYPERSONIC: 0.10,
  },
  'Pantsir-S2': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.78,
    UAV: 0.88,
    DRONE_SWARM: 0.80,
    FIGHTER_AIRCRAFT: 0.82,
    BOMBER_AIRCRAFT: 0.78,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.30,
    HYPERSONIC: 0.00,
  },
  // ---- China ----
  'HQ-9C': {
    BALLISTIC_MISSILE: 0.50,
    CRUISE_MISSILE: 0.90,
    UAV: 0.92,
    DRONE_SWARM: 0.68,
    FIGHTER_AIRCRAFT: 0.97,
    BOMBER_AIRCRAFT: 0.97,
    ATTACK_HELICOPTER: 0.92,
    LOITERING_MUNITION: 0.86,
    TACTICAL_MISSILE: 0.80,
    HYPERSONIC: 0.10,
  },
  'HQ-11': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.78,
    UAV: 0.88,
    DRONE_SWARM: 0.72,
    FIGHTER_AIRCRAFT: 0.82,
    BOMBER_AIRCRAFT: 0.78,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.84,
    TACTICAL_MISSILE: 0.32,
    HYPERSONIC: 0.00,
  },
  'HQ-16B': {
    BALLISTIC_MISSILE: 0.15,
    CRUISE_MISSILE: 0.85,
    UAV: 0.88,
    DRONE_SWARM: 0.60,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.92,
    ATTACK_HELICOPTER: 0.88,
    LOITERING_MUNITION: 0.82,
    TACTICAL_MISSILE: 0.75,
    HYPERSONIC: 0.05,
  },
  // ---- USA ----
  'Patriot PAC-3': {
    BALLISTIC_MISSILE: 0.85,
    CRUISE_MISSILE: 0.92,
    UAV: 0.90,
    DRONE_SWARM: 0.72,
    FIGHTER_AIRCRAFT: 0.95,
    BOMBER_AIRCRAFT: 0.95,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.85,
    TACTICAL_MISSILE: 0.90,
    HYPERSONIC: 0.45,
  },
  'NASAMS 3': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.90,
    UAV: 0.92,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.92,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.55,
    HYPERSONIC: 0.05,
  },
  // ---- UK ----
  'Sky Sabre': {
    BALLISTIC_MISSILE: 0.00,
    CRUISE_MISSILE: 0.86,
    UAV: 0.90,
    DRONE_SWARM: 0.85,
    FIGHTER_AIRCRAFT: 0.90,
    BOMBER_AIRCRAFT: 0.88,
    ATTACK_HELICOPTER: 0.90,
    LOITERING_MUNITION: 0.88,
    TACTICAL_MISSILE: 0.45,
    HYPERSONIC: 0.05,
  },
  // ---- Germany ----
  'IRIS-T SLM': {
    BALLISTIC_MISSILE: 0.30,
    CRUISE_MISSILE: 0.90,
    UAV: 0.92,
    DRONE_SWARM: 0.86,
    FIGHTER_AIRCRAFT: 0.92,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.92,
    LOITERING_MUNITION: 0.90,
    TACTICAL_MISSILE: 0.55,
    HYPERSONIC: 0.10,
  },
  // ---- South Korea ----
  'Cheongung-II': {
    BALLISTIC_MISSILE: 0.45,
    CRUISE_MISSILE: 0.88,
    UAV: 0.90,
    DRONE_SWARM: 0.75,
    FIGHTER_AIRCRAFT: 0.90,
    BOMBER_AIRCRAFT: 0.90,
    ATTACK_HELICOPTER: 0.88,
    LOITERING_MUNITION: 0.84,
    TACTICAL_MISSILE: 0.78,
    HYPERSONIC: 0.15,
  },
  'Cheongung': {
    BALLISTIC_MISSILE: 0.20,
    CRUISE_MISSILE: 0.85,
    UAV: 0.88,
    DRONE_SWARM: 0.70,
    FIGHTER_AIRCRAFT: 0.88,
    BOMBER_AIRCRAFT: 0.88,
    ATTACK_HELICOPTER: 0.85,
    LOITERING_MUNITION: 0.80,
    TACTICAL_MISSILE: 0.72,
    HYPERSONIC: 0.10,
  },
};

export function findSystemKey(systemName: string): string | undefined {
  const name = systemName.toLowerCase();
  // S-400 / S-300 must be checked before generic 's-3' check
  if (name.includes('s-400') || name.includes('s400')) return 'S-400';
  if (name.includes('s-300pmu2') || name.includes('s300pmu2') || name.includes('favorit')) return 'S-300PMU2';
  if (name.includes('barak 8 er') || name.includes('barak-8 er')) return 'Barak 8 ER';
  if (name.includes('barak-8') || name.includes('barak 8') || name.includes('mrsam')) return 'Barak 8';
  if (name.includes('spyder') || name.includes('syder')) return 'SPYDER';
  if (name.includes('pechora')) return 'Pechora';
  if (name.includes('akash-ng')) return 'Akash-NG';
  if (name.includes('akash')) return 'Akash';
  if (name.includes('qrsam')) return 'QRSAM';
  if (name.includes('vshorad manpad') || name.includes('vshorad (mistral)')) return 'VSHORAD';
  if (name.includes('vshorad') || name.includes('mistral')) return 'VSHORAD';
  if (name.includes('igla')) return 'Igla-S';
  if (name.includes('anza')) return 'Anza';
  if (name.includes('hq-9c') || name.includes('hq9c')) return 'HQ-9C';
  if (name.includes('hq-9p') || name.includes('hq9p')) return 'HQ-9P';
  if (name.includes('hq-16b') || name.includes('hq16b')) return 'HQ-16B';
  if (name.includes('ly-80') || name.includes('ly80') || name.includes('hq-16') || name.includes('hq16')) return 'LY-80';
  if (name.includes('hq-17ae') || name.includes('hq17ae') || name.includes('hq-17') || name.includes('hq17')) return 'HQ-17AE';
  if (name.includes('hq-11') || name.includes('hq11') || name.includes('red flag-11')) return 'HQ-11';
  if (name.includes('spada 2000') || name.includes('spada')) return 'Spada 2000';
  if (name.includes('fm-90') || name.includes('fm90') || name.includes('hq-7') || name.includes('hq7')) return 'FM-90';
  if (name.includes('rbs')) return 'RBS-70';
  if (name.includes('anti-drone') || name.includes('smash')) return 'Anti-Drone';
  if (name.includes('sm-3') || name.includes('sm3')) return 'SM-3 Block IIA';
  if (name.includes('centurion') || name.includes('lpws') || name.includes('c-ram')) return 'Centurion LPWS';
  if (name.includes('hq-19') || name.includes('hq19')) return 'HQ-19';
  if (name.includes('ld-2000') || name.includes('ld2000')) return 'LD-2000';
  if (name.includes('gibka')) return 'Gibka-S';
  if (name.includes('sosna')) return 'Sosna-R';
  if (name.includes('tor-m2') || name.includes('torm2') || name.includes('sa-15') || name.includes('gauntlet')) return 'Tor-M2';
  if (name.includes('buk-m3') || name.includes('bukm3') || name.includes('viking') || name.includes('sa-17') || name.includes('buk')) return 'Buk-M3';
  if (name.includes('pantsir-s2') || name.includes('pantsir') || name.includes('sa-22')) return 'Pantsir-S2';
  if (name.includes('type-03') || name.includes('chū-sam') || name.includes('chu-sam')) return 'Type-03 Kai';
  if (name.includes('type-81')) return 'Type-81C';
  if (name.includes('l-sam') || name.includes('lsam')) return 'L-SAM';
  if (name.includes('lamd')) return 'LAMD';
  if (name.includes('sm-6') || name.includes('sm6') || name.includes('type-45')) return 'SM-6 Dual II';
  if (name.includes('mica ng') || name.includes('micang')) return 'MICA NG';
  if (name.includes('arrow-3') || name.includes('arrow 3')) return 'Arrow 3';
  if (name.includes('mantis')) return 'Mantis';
  if (name.includes('patriot pac-3') || name.includes('pac-3') || name.includes('patriot')) return 'Patriot PAC-3';
  if (name.includes('nasams 3') || name.includes('nasams')) return 'NASAMS 3';
  if (name.includes('sky sabre') || name.includes('land ceptor') || name.includes('camm')) return 'Sky Sabre';
  if (name.includes('iris-t slm') || name.includes('iris-t')) return 'IRIS-T SLM';
  if (name.includes('cheongung-ii') || name.includes('km-sam mk.ii') || name.includes('m-sam mk.ii')) return 'Cheongung-II';
  if (name.includes('cheongung') || name.includes('km-sam')) return 'Cheongung';
  return undefined;
}

/**
 * Normalizes missile name and returns capability multipliers based on target type
 */
export function getMissileThreatMultiplier(missileName: string, threatType: string): number | undefined {
  const name = missileName.toLowerCase();
  const type = threatType.toUpperCase();
  
  let normalizedType = type;
  if (type.startsWith('BALLISTIC')) normalizedType = 'BALLISTIC';
  else if (type.startsWith('CRUISE')) normalizedType = 'CRUISE';
  else if (type.startsWith('FIGHTER')) normalizedType = 'FIGHTER';
  else if (type.startsWith('BOMBER')) normalizedType = 'FIGHTER';
  else if (type.startsWith('UAV') || type.startsWith('LOITERING') || type.includes('LOITERING')) normalizedType = 'UAV';
  else if (type.startsWith('SWARM') || type.includes('SWARM')) normalizedType = 'SWARM';
  else if (type.startsWith('HYPERSONIC')) normalizedType = 'HYPERSONIC';
  else if (type.startsWith('GLIDE') || type.includes('GLIDE')) normalizedType = 'GLIDE_BOMB';
  else if (type.startsWith('ROCKET') || type.startsWith('TACTICAL') || type.startsWith('TACTICAL_MISSILE')) normalizedType = 'ROCKET';
  
  if (name.includes('40n6e')) {
    const table: Record<string, number> = { BALLISTIC: 0.92, HYPERSONIC: 0.50, FIGHTER: 0.96, UAV: 0.60, SWARM: 0.30, CRUISE: 0.65, GLIDE_BOMB: 0.40, ROCKET: 0.40 };
    return table[normalizedType] ?? 0.5;
  }
  if (name.includes('48n6')) {
    const table: Record<string, number> = { BALLISTIC: 0.85, HYPERSONIC: 0.30, FIGHTER: 0.98, UAV: 0.90, SWARM: 0.65, CRUISE: 0.95, GLIDE_BOMB: 0.80, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('9m96e2')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.10, FIGHTER: 0.98, UAV: 0.98, SWARM: 0.88, CRUISE: 0.98, GLIDE_BOMB: 0.95, ROCKET: 0.95 };
    return table[normalizedType] ?? 0.8;
  }
  if (name.includes('barak') && (name.includes('er') || name.includes('extended'))) {
    const table: Record<string, number> = { BALLISTIC: 0.45, HYPERSONIC: 0.15, FIGHTER: 0.95, UAV: 0.92, SWARM: 0.65, CRUISE: 0.90, GLIDE_BOMB: 0.85, ROCKET: 0.85 };
    return table[normalizedType] ?? 0.75;
  }
  if (name.includes('barak') || name.includes('mrsam')) {
    const table: Record<string, number> = { BALLISTIC: 0.25, HYPERSONIC: 0.05, FIGHTER: 0.92, UAV: 0.90, SWARM: 0.60, CRUISE: 0.85, GLIDE_BOMB: 0.80, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('derby')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.90, UAV: 0.95, SWARM: 0.75, CRUISE: 0.85, GLIDE_BOMB: 0.85, ROCKET: 0.85 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('python')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.92, UAV: 0.96, SWARM: 0.80, CRUISE: 0.80, GLIDE_BOMB: 0.90, ROCKET: 0.90 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('5v27')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.75, UAV: 0.65, SWARM: 0.30, CRUISE: 0.55, GLIDE_BOMB: 0.40, ROCKET: 0.40 };
    return table[normalizedType] ?? 0.5;
  }
  if (name.includes('vshorad') || name.includes('mistral') || name.includes('rbs')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.88, UAV: 0.94, SWARM: 0.78, CRUISE: 0.78, GLIDE_BOMB: 0.82, ROCKET: 0.82 };
    return table[normalizedType] ?? 0.4;
  }
  if (name.includes('igla')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.82, UAV: 0.88, SWARM: 0.72, CRUISE: 0.72, GLIDE_BOMB: 0.78, ROCKET: 0.78 };
    return table[normalizedType] ?? 0.4;
  }
  if (name.includes('hq-9p') || name.includes('hq9p')) {
    const table: Record<string, number> = { BALLISTIC: 0.40, HYPERSONIC: 0.05, FIGHTER: 0.95, UAV: 0.90, SWARM: 0.65, CRUISE: 0.85, GLIDE_BOMB: 0.80, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.75;
  }
  if (name.includes('hq-16') || name.includes('ly-80') || name.includes('ly80')) {
    const table: Record<string, number> = { BALLISTIC: 0.10, HYPERSONIC: 0.00, FIGHTER: 0.90, UAV: 0.85, SWARM: 0.55, CRUISE: 0.80, GLIDE_BOMB: 0.75, ROCKET: 0.75 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('hq-17') || name.includes('hq17')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.85, UAV: 0.90, SWARM: 0.75, CRUISE: 0.80, GLIDE_BOMB: 0.80, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.75;
  }
  if (name.includes('aspide') || name.includes('spada')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.85, UAV: 0.85, SWARM: 0.65, CRUISE: 0.75, GLIDE_BOMB: 0.75, ROCKET: 0.75 };
    return table[normalizedType] ?? 0.7;
  }
  if (name.includes('fm-90') || name.includes('fm90') || name.includes('hq-7') || name.includes('hq7')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.80, UAV: 0.75, SWARM: 0.45, CRUISE: 0.65, GLIDE_BOMB: 0.60, ROCKET: 0.60 };
    return table[normalizedType] ?? 0.6;
  }
  if (name.includes('anza')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.60, UAV: 0.70, SWARM: 0.30, CRUISE: 0.30, GLIDE_BOMB: 0.30, ROCKET: 0.30 };
    return table[normalizedType] ?? 0.4;
  }
  if (name.includes('sm-3') || name.includes('sm3')) {
    const table: Record<string, number> = { BALLISTIC: 0.96, HYPERSONIC: 0.85, FIGHTER: 0.10, UAV: 0.00, SWARM: 0.00, CRUISE: 0.00, GLIDE_BOMB: 0.00, ROCKET: 0.85 };
    return table[normalizedType] ?? 0.1;
  }
  if (name.includes('sm-6') || name.includes('sm6')) {
    const table: Record<string, number> = { BALLISTIC: 0.60, HYPERSONIC: 0.50, FIGHTER: 0.95, UAV: 0.90, SWARM: 0.88, CRUISE: 0.92, GLIDE_BOMB: 0.90, ROCKET: 0.90 };
    return table[normalizedType] ?? 0.8;
  }
  if (name.includes('arrow-3') || name.includes('arrow 3')) {
    const table: Record<string, number> = { BALLISTIC: 0.97, HYPERSONIC: 0.88, FIGHTER: 0.00, UAV: 0.00, SWARM: 0.00, CRUISE: 0.00, GLIDE_BOMB: 0.00, ROCKET: 0.88 };
    return table[normalizedType] ?? 0.1;
  }
  if (name.includes('l-sam') || name.includes('lsam')) {
    const table: Record<string, number> = { BALLISTIC: 0.90, HYPERSONIC: 0.65, FIGHTER: 0.92, UAV: 0.85, SWARM: 0.70, CRUISE: 0.80, GLIDE_BOMB: 0.80, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.75;
  }
  if (name.includes('hq-19') || name.includes('hq19')) {
    const table: Record<string, number> = { BALLISTIC: 0.95, HYPERSONIC: 0.80, FIGHTER: 0.10, UAV: 0.00, SWARM: 0.00, CRUISE: 0.00, GLIDE_BOMB: 0.00, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.1;
  }
  if (name.includes('c-ram') || name.includes('centurion') || name.includes('lpws')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.15, UAV: 0.88, SWARM: 0.85, CRUISE: 0.40, GLIDE_BOMB: 0.60, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.5;
  }
  if (name.includes('ld-2000') || name.includes('ld2000') || name.includes('mantis')) {
    const table: Record<string, number> = { BALLISTIC: 0.00, HYPERSONIC: 0.00, FIGHTER: 0.15, UAV: 0.88, SWARM: 0.85, CRUISE: 0.40, GLIDE_BOMB: 0.60, ROCKET: 0.80 };
    return table[normalizedType] ?? 0.5;
  }
  return undefined;
}

/**
 * Simplified Interception Probability
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
  systemName?: string;       // system name to look up capabilities
  missileName?: string;      // specific missile option
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
    systemName,
    missileName,
  } = params;

  // 1. Altitude match factor
  let altitudeFactor = 1.0;
  let adjustedTargetAltitude = targetAltitude;

  // For ballistic/hypersonic/tactical threats, check if the system or missile is ABM-capable.
  // If so, they are intercepted during terminal descent stage inside the system's operational envelope.
  const isABMCapable = (systemName && (
    systemName.includes('S-500') ||
    systemName.includes('S-400') ||
    systemName.includes('S-300PMU2') ||
    systemName.includes('THAAD') ||
    systemName.includes('Arrow 3') ||
    systemName.includes('SM-3') ||
    systemName.includes('SM-6') ||
    systemName.includes('L-SAM') ||
    systemName.includes('HQ-19') ||
    systemName.includes('HQ-9C') ||
    systemName.includes('Patriot PAC-3') ||
    systemName.includes('Cheongung-II') ||
    systemName.includes('IRIS-T SLM') ||
    systemName.includes('Barak-8') ||
    systemName.includes('Barak 8') ||
    systemName.includes('Akash-NG')
  )) || (missileName && (
    missileName.includes('40N6') ||
    missileName.includes('48N6') ||
    missileName.includes('48N6E2') ||
    missileName.includes('9M317M') ||
    missileName.includes('PAC-3 MSE') ||
    missileName.includes('sm-3') ||
    missileName.includes('sm-6') ||
    missileName.includes('arrow-3') ||
    missileName.includes('l-sam') ||
    missileName.includes('hq-19') ||
    missileName.includes('Barak-8') ||
    missileName.includes('Barak 8') ||
    missileName.includes('Akash-NG')
  ));

  const isAdvancedSystem = (systemName && (
    systemName.includes('S-500') ||
    systemName.includes('S-400') ||
    systemName.includes('S-300PMU2') ||
    systemName.includes('THAAD') ||
    systemName.includes('Arrow') ||
    systemName.includes('SM-3') ||
    systemName.includes('SM-6') ||
    systemName.includes('L-SAM') ||
    systemName.includes('HQ-19') ||
    systemName.includes('HQ-9C') ||
    systemName.includes('Buk-M3') ||
    systemName.includes('Patriot PAC-3') ||
    systemName.includes('NASAMS') ||
    systemName.includes('Sky Sabre') ||
    systemName.includes('IRIS-T SLM') ||
    systemName.includes('Cheongung') ||
    systemName.includes('Type-03') ||
    systemName.includes('SAMP/T') ||
    systemName.includes('MICA NG') ||
    systemName.includes('Barak') ||
    systemName.includes('Akash-NG') ||
    systemName.includes('SPYDER') ||
    systemName.includes('QRSAM')
  )) || (missileName && (
    missileName.includes('40N6') ||
    missileName.includes('48N6') ||
    missileName.includes('48N6E2') ||
    missileName.includes('9M317M') ||
    missileName.includes('9M96') ||
    missileName.includes('PAC-3 MSE') ||
    missileName.includes('AIM-120D') ||
    missileName.includes('CAMM') ||
    missileName.includes('IRIS-T SLM') ||
    missileName.includes('Cheongung') ||
    missileName.includes('sm-3') ||
    missileName.includes('sm-6') ||
    missileName.includes('arrow-3') ||
    missileName.includes('l-sam') ||
    missileName.includes('hq-19') ||
    missileName.includes('c-ram') ||
    missileName.includes('mantis') ||
    missileName.includes('Barak') ||
    missileName.includes('Akash-NG') ||
    missileName.includes('Derby') ||
    missileName.includes('Python') ||
    missileName.includes('QRSAM')
  ));

  if ((targetType === 'BALLISTIC_MISSILE' || targetType === 'HYPERSONIC' || targetType === 'TACTICAL_MISSILE') && targetAltitude > systemMaxAlt) {
    if (isABMCapable) {
      // Scale adjusted altitude to mid-envelope so it is not penalized for its mid-course apogee
      adjustedTargetAltitude = (systemMinAlt + systemMaxAlt) / 2;
    }
  }

  if (adjustedTargetAltitude < systemMinAlt || adjustedTargetAltitude > systemMaxAlt) {
    altitudeFactor = 0.05; // Nearly impossible outside envelope
  } else {
    // Advanced systems do not suffer midpoint deviation penalty inside their operational design envelope.
    if (isAdvancedSystem) {
      altitudeFactor = 1.0;
    } else {
      const altRange = systemMaxAlt - systemMinAlt;
      const mid = (systemMinAlt + systemMaxAlt) / 2;
      const deviation = Math.abs(adjustedTargetAltitude - mid) / (altRange / 2);
      altitudeFactor = 1.0 - deviation * 0.3;
    }
  }

  // 2. Speed factor: harder to intercept faster targets
  const speedRatio = interceptorSpeed > 0 ? targetSpeed / interceptorSpeed : 10;
  let speedFactor = 1.0;
  if (isAdvancedSystem) {
    // Advanced systems are designed to track and hit hypersonic / high-speed targets.
    speedFactor = speedRatio <= 1.5 ? 1.0
      : speedRatio <= 3.0 ? 0.95
      : speedRatio <= 6.0 ? 0.85
      : 0.70;
  } else {
    speedFactor = speedRatio <= 0.5 ? 1.0
      : speedRatio <= 1.0 ? 0.85
      : speedRatio <= 2.0 ? 0.6
      : speedRatio <= 5.0 ? 0.3
      : 0.1;
  }

  // 3. Range factor: accuracy drops at extreme range
  const rangeFactor = range <= systemMaxRange * 0.7 ? 1.0
    : range <= systemMaxRange * 0.9 ? 0.92
    : range <= systemMaxRange ? 0.85
    : 0.1;

  // 4. Target type difficulty factor / system-specific multiplier
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

  let targetFactor = typeDifficulty[targetType] ?? 0.5;
  let customMultiplier: number | undefined;

  // Try missile-specific multiplier first
  if (missileName) {
    customMultiplier = getMissileThreatMultiplier(missileName, targetType);
  }

  // Fallback to system-specific multiplier
  if (customMultiplier === undefined && systemName) {
    const systemKey = findSystemKey(systemName);
    if (systemKey && SYSTEM_THREAT_MULTIPLIERS[systemKey]) {
      customMultiplier = SYSTEM_THREAT_MULTIPLIERS[systemKey][targetType];
    }
  }

  if (customMultiplier !== undefined) {
    targetFactor = customMultiplier;
  }

  // 5. RCS factor: easier to hit larger targets
  let rcsFactor = 1.0;
  if (isAdvancedSystem) {
    // Advanced systems with active/AESA seekers are highly optimized for low-RCS threats.
    rcsFactor = targetRCS >= 0.1 ? 1.0
      : targetRCS >= 0.01 ? 0.90
      : 0.80;
  } else {
    rcsFactor = targetRCS >= 5 ? 1.0
      : targetRCS >= 1 ? 0.9
      : targetRCS >= 0.1 ? 0.75
      : targetRCS >= 0.01 ? 0.5
      : 0.3;
  }

  // 6. Weather & ECM
  const weatherFactor = WEATHER_FACTORS[weather as keyof typeof WEATHER_FACTORS] ?? 1.0;
  // Advanced guidance systems have advanced ECCM capabilities, making them highly jam-resistant.
  const ecmFactor = isAdvancedSystem ? (1 - ecmLevel * 0.15) : (1 - ecmLevel * 0.4);

  const probability = baseAccuracy * speedFactor * altitudeFactor * rangeFactor * targetFactor * rcsFactor * weatherFactor * ecmFactor;

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
