// ============================================
// IADES Shared Types
// ============================================

// ---- User Types ----
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN',
  OBSERVER = 'OBSERVER',
}

export interface UserStats {
  simulationsRun: number;
  interceptionRate: number;
  totalCostSpent: number;
  campaignsCompleted: number;
  multiplayerWins: number;
  multiplayerLosses: number;
}

// ---- Air Defence System Types ----
export interface AirDefenceSystem {
  id: string;
  name: string;
  countryOfOrigin: string;
  category: SystemCategory;
  minRange: number;       // km
  maxRange: number;       // km
  minAltitude: number;    // meters
  maxAltitude: number;    // meters
  radarType: string;
  missileType: string;
  mobilityClass: MobilityClass;
  serviceEntryYear: number;
  cost: number;           // USD millions (educational estimate)
  operatingCostPerHour: number; // USD
  reloadTime: number;     // seconds
  maxSimultaneousTargets: number;
  accuracy: number;       // 0-1 base probability
  description: string;
  imageUrl?: string;
  isIndian: boolean;
}

export enum SystemCategory {
  LONG_RANGE = 'LONG_RANGE',
  MEDIUM_RANGE = 'MEDIUM_RANGE',
  SHORT_RANGE = 'SHORT_RANGE',
  VERY_SHORT_RANGE = 'VERY_SHORT_RANGE',
  ANTI_DRONE = 'ANTI_DRONE',
  RADAR = 'RADAR',
}

export enum MobilityClass {
  FIXED = 'FIXED',
  SEMI_MOBILE = 'SEMI_MOBILE',
  MOBILE = 'MOBILE',
  MAN_PORTABLE = 'MAN_PORTABLE',
}

// ---- Threat Types ----
export interface Threat {
  id: string;
  name: string;
  type: ThreatType;
  countryOfOrigin: string;
  speedClass: SpeedClass;
  maxSpeed: number;       // Mach
  altitudeClass: AltitudeClass;
  minAltitude: number;    // meters
  maxAltitude: number;    // meters
  radarVisibility: RadarVisibility;
  rcs: number;            // m² (radar cross section, educational estimate)
  threatScore: number;    // 1-100
  costEstimate: number;   // USD thousands
  range: number;          // km
  warheadWeight: number;  // kg
  description: string;
  imageUrl?: string;
}

export enum ThreatType {
  BALLISTIC_MISSILE = 'BALLISTIC_MISSILE',
  CRUISE_MISSILE = 'CRUISE_MISSILE',
  UAV = 'UAV',
  DRONE_SWARM = 'DRONE_SWARM',
  FIGHTER_AIRCRAFT = 'FIGHTER_AIRCRAFT',
  BOMBER_AIRCRAFT = 'BOMBER_AIRCRAFT',
  ATTACK_HELICOPTER = 'ATTACK_HELICOPTER',
  LOITERING_MUNITION = 'LOITERING_MUNITION',
  TACTICAL_MISSILE = 'TACTICAL_MISSILE',
  HYPERSONIC = 'HYPERSONIC',
}

export enum SpeedClass {
  SUBSONIC = 'SUBSONIC',
  TRANSONIC = 'TRANSONIC',
  SUPERSONIC = 'SUPERSONIC',
  HYPERSONIC = 'HYPERSONIC',
}

export enum AltitudeClass {
  SEA_SKIMMING = 'SEA_SKIMMING',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
  EXOATMOSPHERIC = 'EXOATMOSPHERIC',
}

export enum RadarVisibility {
  STEALTH = 'STEALTH',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

// ---- Simulation Types ----
export interface Simulation {
  id: string;
  name: string;
  scenarioId: string;
  userId: string;
  status: SimulationStatus;
  config: SimulationConfig;
  results?: SimulationResults;
  events: SimulationEvent[];
  duration: number;       // seconds
  createdAt: string;
  completedAt?: string;
}

export enum SimulationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface SimulationConfig {
  maxDuration: number;    // seconds
  timeScale: number;      // 1x, 2x, 5x, 10x
  weatherCondition: WeatherCondition;
  ecmLevel: number;       // 0-1
  defenderBudget: number; // USD millions
  attackerBudget: number; // USD millions
  autoResolve: boolean;
}

export enum WeatherCondition {
  CLEAR = 'CLEAR',
  CLOUDY = 'CLOUDY',
  RAIN = 'RAIN',
  HEAVY_RAIN = 'HEAVY_RAIN',
  FOG = 'FOG',
  STORM = 'STORM',
}

export interface SimulationEvent {
  id: string;
  simulationId: string;
  timestamp: number;      // simulation seconds
  type: SimEventType;
  data: Record<string, unknown>;
}

export enum SimEventType {
  THREAT_LAUNCHED = 'THREAT_LAUNCHED',
  THREAT_DETECTED = 'THREAT_DETECTED',
  THREAT_CLASSIFIED = 'THREAT_CLASSIFIED',
  INTERCEPTOR_ASSIGNED = 'INTERCEPTOR_ASSIGNED',
  INTERCEPTOR_LAUNCHED = 'INTERCEPTOR_LAUNCHED',
  TRACKING_UPDATE = 'TRACKING_UPDATE',
  INTERCEPTION_ATTEMPT = 'INTERCEPTION_ATTEMPT',
  INTERCEPTION_SUCCESS = 'INTERCEPTION_SUCCESS',
  INTERCEPTION_FAILURE = 'INTERCEPTION_FAILURE',
  THREAT_IMPACT = 'THREAT_IMPACT',
  SYSTEM_RELOADING = 'SYSTEM_RELOADING',
  BUDGET_UPDATE = 'BUDGET_UPDATE',
  ROUND_COMPLETE = 'ROUND_COMPLETE',
}

export interface SimulationResults {
  totalThreats: number;
  threatsDetected: number;
  threatsIntercepted: number;
  threatsMissed: number;
  threatsImpacted: number;
  interceptionRate: number;
  detectionRate: number;
  totalCost: number;
  costPerEngagement: number;
  costPerSuccessfulInterception: number;
  interceptorsUsed: number;
  radarOperatingCost: number;
  engagements: EngagementResult[];
}

export interface EngagementResult {
  id: string;
  threatId: string;
  threatName: string;
  systemId: string;
  systemName: string;
  detectionTime: number;
  launchTime: number;
  interceptTime: number;
  success: boolean;
  probability: number;
  cost: number;
  reason: string;
}

// ---- Scenario Types ----
export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  isPublic: boolean;
  mapConfig: MapConfig;
  defenderSetup: DefenderSetup;
  attackerSetup: AttackerSetup;
  createdAt: string;
  updatedAt: string;
}

export interface MapConfig {
  centerLat: number;
  centerLng: number;
  zoom: number;
  zones: StrategicZone[];
}

export interface StrategicZone {
  id: string;
  name: string;
  type: ZoneType;
  lat: number;
  lng: number;
  radius: number;         // km
  value: number;          // strategic value 1-100
}

export enum ZoneType {
  CITY = 'CITY',
  AIRBASE = 'AIRBASE',
  MILITARY_BASE = 'MILITARY_BASE',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  INDUSTRIAL = 'INDUSTRIAL',
  NUCLEAR_FACILITY = 'NUCLEAR_FACILITY',
}

export interface DefenderSetup {
  systems: PlacedSystem[];
  budget: number;
}

export interface PlacedSystem {
  id: string;
  systemId: string;
  lat: number;
  lng: number;
  active: boolean;
}

export interface AttackerSetup {
  waves: AttackWave[];
  budget: number;
}

export interface AttackWave {
  id: string;
  time: number;           // launch time in sim seconds
  threats: WaveThreat[];
}

export interface WaveThreat {
  threatId: string;
  count: number;
  targetZoneId: string;
  launchLat: number;
  launchLng: number;
}

// ---- Campaign Types ----
export interface Campaign {
  id: string;
  name: string;
  userId: string;
  currentDay: number;
  totalDays: number;
  budget: number;
  remainingBudget: number;
  status: CampaignStatus;
  difficulty: AIDifficulty;
  days: CampaignDay[];
  ownedSystems: string[];
  createdAt: string;
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  WON = 'WON',
  LOST = 'LOST',
  ABANDONED = 'ABANDONED',
}

export interface CampaignDay {
  day: number;
  threats: string[];
  budget: number;
  results?: SimulationResults;
  systemDamage: Record<string, number>;
  ammoUsed: Record<string, number>;
}

// ---- Multiplayer Types ----
export interface GameRoom {
  id: string;
  code: string;
  mode: GameMode;
  status: RoomStatus;
  maxPlayers: number;
  players: RoomPlayer[];
  scenarioId?: string;
  settings: GameSettings;
  createdAt: string;
}

export enum GameMode {
  ONE_V_ONE = '1v1',
  TWO_V_TWO = '2v2',
  FIVE_V_FIVE = '5v5',
  OBSERVER = 'OBSERVER',
  TOURNAMENT = 'TOURNAMENT',
}

export enum RoomStatus {
  WAITING = 'WAITING',
  STARTING = 'STARTING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface RoomPlayer {
  userId: string;
  name: string;
  team: TeamRole;
  ready: boolean;
  connected: boolean;
}

export enum TeamRole {
  DEFENDER = 'DEFENDER',
  ATTACKER = 'ATTACKER',
  OBSERVER = 'OBSERVER',
}

export interface GameSettings {
  budget: number;
  roundTime: number;      // seconds per round
  maxRounds: number;
  enableAI: boolean;
  aiDifficulty: AIDifficulty;
}

export enum AIDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

// ---- Procurement Types ----
export interface ProcurementItem {
  id: string;
  systemId: string;
  userId: string;
  purchaseCost: number;
  maintenanceCost: number;
  level: number;
  status: ProcurementStatus;
  purchasedAt: string;
}

export enum ProcurementStatus {
  ORDERED = 'ORDERED',
  DELIVERED = 'DELIVERED',
  OPERATIONAL = 'OPERATIONAL',
  UPGRADING = 'UPGRADING',
  DECOMMISSIONED = 'DECOMMISSIONED',
}

// ---- Analytics Types ----
export interface AnalyticsOverview {
  totalSimulations: number;
  totalUsers: number;
  totalSystems: number;
  totalThreats: number;
  totalInterceptions: number;
  avgInterceptionRate: number;
  totalCostSimulated: number;
  activeSimulations: number;
}

export interface SimulationAnalytics {
  interceptionRateOverTime: DataPoint[];
  costOverTime: DataPoint[];
  threatsByType: Record<string, number>;
  systemsByUsage: Record<string, number>;
  topPerformingSystems: { name: string; rate: number }[];
  mostDangerousThreats: { name: string; penetrationRate: number }[];
}

export interface DataPoint {
  label: string;
  value: number;
}

// ---- Replay Types ----
export interface ReplayData {
  id: string;
  simulationId: string;
  duration: number;
  events: SimulationEvent[];
  snapshot: {
    systems: PlacedSystem[];
    zones: StrategicZone[];
  };
}

// ---- API Response Types ----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---- Socket Event Types ----
export interface SocketEvents {
  // Lobby
  'lobby:create': (settings: GameSettings) => void;
  'lobby:join': (roomCode: string) => void;
  'lobby:leave': () => void;
  'lobby:ready': () => void;
  'lobby:update': (room: GameRoom) => void;
  'lobby:start': (simulationId: string) => void;

  // Game
  'game:place_system': (data: { systemId: string; lat: number; lng: number }) => void;
  'game:launch_threat': (data: { wave: AttackWave }) => void;
  'game:state_update': (state: Record<string, unknown>) => void;
  'game:engagement': (result: EngagementResult) => void;
  'game:round_end': (results: SimulationResults) => void;
  'game:match_end': (results: SimulationResults) => void;

  // Chat
  'chat:message': (data: { userId: string; message: string; timestamp: number }) => void;
}
