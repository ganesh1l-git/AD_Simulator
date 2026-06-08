// ============================================
// IADES Shared Constants
// ============================================

// ---- Educational Disclaimer ----
export const EDUCATIONAL_DISCLAIMER = `
This platform is for educational and analytical purposes only.
It is NOT a military planning tool.
All data used is from publicly available and declassified sources.
Where precise values are unavailable, documented public estimates or configurable approximation values are used.
`;

// ---- System Category Labels ----
export const SYSTEM_CATEGORY_LABELS: Record<string, string> = {
  LONG_RANGE: 'Long Range Air Defence (LRAD)',
  MEDIUM_RANGE: 'Medium Range Air Defence (MRAD)',
  SHORT_RANGE: 'Short Range Air Defence (SRAD)',
  VERY_SHORT_RANGE: 'Very Short Range Air Defence (VSHORAD)',
  ANTI_DRONE: 'Anti-Drone System',
  RADAR: 'Radar System',
};

// ---- Threat Type Labels ----
export const THREAT_TYPE_LABELS: Record<string, string> = {
  BALLISTIC_MISSILE: 'Ballistic Missile',
  CRUISE_MISSILE: 'Cruise Missile',
  UAV: 'Unmanned Aerial Vehicle',
  DRONE_SWARM: 'Drone Swarm',
  FIGHTER_AIRCRAFT: 'Fighter Aircraft',
  BOMBER_AIRCRAFT: 'Bomber Aircraft',
  ATTACK_HELICOPTER: 'Attack Helicopter',
  LOITERING_MUNITION: 'Loitering Munition',
  TACTICAL_MISSILE: 'Tactical Missile',
  HYPERSONIC: 'Hypersonic Threat',
};

// ---- Speed Class Ranges (Mach) ----
export const SPEED_CLASS_RANGES = {
  SUBSONIC: { min: 0, max: 0.9, label: 'Subsonic (< Mach 0.9)' },
  TRANSONIC: { min: 0.9, max: 1.2, label: 'Transonic (Mach 0.9-1.2)' },
  SUPERSONIC: { min: 1.2, max: 5.0, label: 'Supersonic (Mach 1.2-5.0)' },
  HYPERSONIC: { min: 5.0, max: 25.0, label: 'Hypersonic (> Mach 5.0)' },
};

// ---- Altitude Class Ranges (meters) ----
export const ALTITUDE_CLASS_RANGES = {
  SEA_SKIMMING: { min: 0, max: 30, label: 'Sea Skimming (0-30m)' },
  LOW: { min: 30, max: 3000, label: 'Low (30-3,000m)' },
  MEDIUM: { min: 3000, max: 10000, label: 'Medium (3,000-10,000m)' },
  HIGH: { min: 10000, max: 25000, label: 'High (10,000-25,000m)' },
  VERY_HIGH: { min: 25000, max: 50000, label: 'Very High (25,000-50,000m)' },
  EXOATMOSPHERIC: { min: 50000, max: 200000, label: 'Exoatmospheric (>50km)' },
};

// ---- Radar Visibility (RCS m²) ----
export const RADAR_VISIBILITY_RCS = {
  STEALTH: { min: 0.0001, max: 0.01, label: 'Stealth' },
  LOW: { min: 0.01, max: 0.1, label: 'Low Observable' },
  MEDIUM: { min: 0.1, max: 1.0, label: 'Medium' },
  HIGH: { min: 1.0, max: 10.0, label: 'High' },
  VERY_HIGH: { min: 10.0, max: 100.0, label: 'Very High' },
};

// ---- Weather Impact Factors ----
export const WEATHER_FACTORS = {
  CLEAR: 1.0,
  CLOUDY: 0.95,
  RAIN: 0.85,
  HEAVY_RAIN: 0.7,
  FOG: 0.6,
  STORM: 0.5,
};

// ---- Default Simulation Config ----
export const DEFAULT_SIMULATION_CONFIG = {
  maxDuration: 300,       // 5 minutes simulation time
  timeScale: 1,
  weatherCondition: 'CLEAR',
  ecmLevel: 0,
  defenderBudget: 500,    // USD millions
  attackerBudget: 200,    // USD millions
  autoResolve: false,
};

// ---- Map Constants ----
export const INDIA_CENTER = {
  lat: 22.5937,
  lng: 78.9629,
};

export const INDIA_BOUNDS = {
  north: 35.5,
  south: 6.5,
  east: 97.5,
  west: 68.0,
};

// ---- Color Scheme ----
export const COLORS = {
  background: '#0a0e17',
  surface: '#111827',
  surfaceLight: '#1f2937',
  surfaceLighter: '#374151',
  primary: '#00ff88',
  primaryDim: '#00cc6a',
  secondary: '#00b4d8',
  secondaryDim: '#0096b7',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#e5e7eb',
  textMuted: '#6b7280',
  textDim: '#4b5563',
  radarGreen: '#00ff88',
  radarBlue: '#00b4d8',
  radarRed: '#ff4444',
  radarYellow: '#ffaa00',
};

// ---- System Category Colors ----
export const CATEGORY_COLORS: Record<string, string> = {
  LONG_RANGE: '#ef4444',
  MEDIUM_RANGE: '#f59e0b',
  SHORT_RANGE: '#00ff88',
  VERY_SHORT_RANGE: '#00b4d8',
  ANTI_DRONE: '#a855f7',
  RADAR: '#6366f1',
};

// ---- Threat Type Colors ----
export const THREAT_COLORS: Record<string, string> = {
  BALLISTIC_MISSILE: '#ef4444',
  CRUISE_MISSILE: '#f97316',
  UAV: '#eab308',
  DRONE_SWARM: '#a3e635',
  FIGHTER_AIRCRAFT: '#22d3ee',
  BOMBER_AIRCRAFT: '#818cf8',
  ATTACK_HELICOPTER: '#c084fc',
  LOITERING_MUNITION: '#f472b6',
  TACTICAL_MISSILE: '#fb923c',
  HYPERSONIC: '#ff0055',
};

// ---- Engagement Timeline Steps ----
export const ENGAGEMENT_STEPS = [
  'THREAT_DETECTED',
  'THREAT_CLASSIFIED',
  'INTERCEPTOR_ASSIGNED',
  'INTERCEPTOR_LAUNCHED',
  'TRACKING_ACTIVE',
  'INTERCEPTION_ATTEMPT',
  'OUTCOME_RESOLVED',
] as const;
