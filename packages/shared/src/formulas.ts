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
    BALLISTIC_MISSILE: 0.80, // ER variant has active booster and enhanced ABM tracking
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
  }
};

export function findSystemKey(systemName: string): string | undefined {
  const name = systemName.toLowerCase();
  if (name.includes('s-400') || name.includes('s400')) return 'S-400';
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
  if (name.includes('rbs')) return 'RBS-70';
  if (name.includes('anti-drone') || name.includes('smash')) return 'Anti-Drone';
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
  else if (type.startsWith('UAV')) normalizedType = 'UAV';
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
    const table: Record<string, number> = { BALLISTIC: 0.80, HYPERSONIC: 0.15, FIGHTER: 0.95, UAV: 0.92, SWARM: 0.65, CRUISE: 0.90, GLIDE_BOMB: 0.85, ROCKET: 0.85 };
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
    systemName.includes('S-400') ||
    systemName.includes('Barak-8') ||
    systemName.includes('Barak 8') ||
    systemName.includes('Akash-NG')
  )) || (missileName && (
    missileName.includes('40N6') ||
    missileName.includes('48N6') ||
    missileName.includes('Barak-8') ||
    missileName.includes('Barak 8') ||
    missileName.includes('Akash-NG')
  ));

  const isAdvancedSystem = (systemName && (
    systemName.includes('S-400') ||
    systemName.includes('Barak') ||
    systemName.includes('Akash-NG') ||
    systemName.includes('SPYDER') ||
    systemName.includes('QRSAM')
  )) || (missileName && (
    missileName.includes('40N6') ||
    missileName.includes('48N6') ||
    missileName.includes('9M96') ||
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
