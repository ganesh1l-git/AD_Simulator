import { create } from 'zustand';
import { AirDefenceSystem, Threat, SimulationEvent, SimEventType } from '@iades/shared';

interface PlacedSystem {
  id: string;
  system: AirDefenceSystem;
  x: number; // percentage coordinate 0-100 on map
  y: number; // percentage coordinate 0-100 on map
  ammo: number;
  status: 'ACTIVE' | 'ENGAGED' | 'OUT_OF_AMMO' | 'DESTROYED';
}

interface ActiveThreat {
  id: string;
  threat: Threat;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  altitude: number; // meters
  speed: number; // Mach
  status: 'UNDETECTED' | 'DETECTED' | 'ENGAGED' | 'INTERCEPTED' | 'HIT_TARGET';
}

interface SimulationState {
  isSimulating: boolean;
  isPaused: boolean;
  timeElapsed: number; // seconds
  playbackSpeed: number; // 1, 2, 5
  placedSystems: PlacedSystem[];
  activeThreats: ActiveThreat[];
  events: SimulationEvent[];
  budget: number;
  spent: number;
  
  // Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  setPlaybackSpeed: (speed: number) => void;
  placeSystem: (system: AirDefenceSystem, x: number, y: number) => void;
  removeSystem: (id: string) => void;
  spawnThreatWave: (threat: Threat, count: number) => void;
  tickSimulation: () => void;
  addEvent: (event: Omit<SimulationEvent, 'id' | 'simulationId'>) => void;
  adjustBudget: (amount: number) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isSimulating: false,
  isPaused: false,
  timeElapsed: 0,
  playbackSpeed: 1,
  placedSystems: [],
  activeThreats: [],
  events: [],
  budget: 100000000, // $100M educational budget
  spent: 0,

  startSimulation: () => set({ isSimulating: true, isPaused: false }),
  pauseSimulation: () => set({ isPaused: true }),
  stopSimulation: () => set({ isSimulating: false, isPaused: false }),
  
  resetSimulation: () => set({
    isSimulating: false,
    isPaused: false,
    timeElapsed: 0,
    activeThreats: [],
    events: [],
    spent: 0,
    placedSystems: get().placedSystems.map(sys => ({
      ...sys,
      ammo: sys.system.maxSimultaneousTargets ?? 8,
      status: 'ACTIVE'
    }))
  }),

  setPlaybackSpeed: (speed: number) => set({ playbackSpeed: speed }),

  placeSystem: (system, x, y) => {
    const cost = system.cost * 1000000;
    if (get().budget - get().spent < cost) {
      get().addEvent({
        timestamp: get().timeElapsed,
        type: SimEventType.BUDGET_UPDATE,
        data: { message: `Cannot procure ${system.name}: Budget exceeded.` }
      });
      return;
    }

    const newSystem: PlacedSystem = {
      id: `sys-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      system,
      x,
      y,
      ammo: system.maxSimultaneousTargets ?? 8,
      status: 'ACTIVE'
    };

    set((state) => ({
      placedSystems: [...state.placedSystems, newSystem],
      spent: state.spent + cost
    }));

    get().addEvent({
      timestamp: get().timeElapsed,
      type: SimEventType.INTERCEPTOR_ASSIGNED,
      data: { message: `Deployed ${system.name} battery at strategic sector (${Math.round(x)}, ${Math.round(y)})` }
    });
  },

  removeSystem: (id) => {
    const systemToRemove = get().placedSystems.find(s => s.id === id);
    if (!systemToRemove) return;

    set((state) => ({
      placedSystems: state.placedSystems.filter(s => s.id !== id),
      spent: Math.max(0, state.spent - (systemToRemove.system.cost * 1000000))
    }));
  },

  spawnThreatWave: (threat, count) => {
    const newThreats: ActiveThreat[] = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const startX = 50 + Math.cos(angle) * 45;
      const startY = 50 + Math.sin(angle) * 45;
      
      return {
        id: `threat-${Date.now()}-${i}`,
        threat,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        altitude: threat.altitudeClass === 'HIGH' ? 12000 : threat.altitudeClass === 'MEDIUM' ? 5000 : 200,
        speed: threat.speedClass === 'HYPERSONIC' ? 6.0 : threat.speedClass === 'SUPERSONIC' ? 2.2 : 0.8,
        status: 'UNDETECTED'
      };
    });

    set((state) => ({
      activeThreats: [...state.activeThreats, ...newThreats]
    }));

    get().addEvent({
      timestamp: get().timeElapsed,
      type: SimEventType.THREAT_LAUNCHED,
      data: { message: `Intrusion Wave Warning: ${count}x ${threat.name} incoming trajectory locks detected.` }
    });
  },

  tickSimulation: () => {
    if (!get().isSimulating || get().isPaused) return;

    const currentTime = get().timeElapsed + 1;
    const { activeThreats, placedSystems } = get();

    // Check if simulation complete
    if (activeThreats.length > 0 && activeThreats.every(t => t.status === 'INTERCEPTED' || t.status === 'HIT_TARGET')) {
      set({ isSimulating: false });
      get().addEvent({
        timestamp: currentTime,
        type: SimEventType.ROUND_COMPLETE,
        data: { message: 'Defensive Exercise Terminated. All trajectory threats resolved.' }
      });
      return;
    }

    // Move threats towards center (50, 50) - simplified defense HQ vector
    const updatedThreats = activeThreats.map((threat) => {
      if (threat.status === 'INTERCEPTED' || threat.status === 'HIT_TARGET') return threat;

      const targetX = 50;
      const targetY = 50;
      
      const dx = targetX - threat.currentX;
      const dy = targetY - threat.currentY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2) {
        get().addEvent({
          timestamp: currentTime,
          type: SimEventType.THREAT_IMPACT,
          data: { message: `🔴 BREACH: ${threat.threat.name} penetrated coverage and impacted core target.` }
        });
        return { ...threat, currentX: targetX, currentY: targetY, status: 'HIT_TARGET' as const };
      }

      // Speed conversion to map delta
      const stepSize = (threat.speed * 0.4) / (get().playbackSpeed || 1);
      const moveX = (dx / distance) * stepSize;
      const moveY = (dy / distance) * stepSize;

      let nextStatus = threat.status;
      // Radar detection scan check
      if (threat.status === 'UNDETECTED') {
        const isDetectedByRadar = placedSystems.some(sys => {
          const radarRange = sys.system.maxRange || 50;
          const distToSys = Math.sqrt(Math.pow(sys.x - threat.currentX, 2) + Math.pow(sys.y - threat.currentY, 2));
          return distToSys <= radarRange * 0.25; // Visual map scaling
        });

        if (isDetectedByRadar) {
          nextStatus = 'DETECTED';
          get().addEvent({
            timestamp: currentTime,
            type: SimEventType.THREAT_DETECTED,
            data: { message: `📡 CONTACT: ${threat.threat.name} detected by active radar grid scan.` }
          });
        }
      }

      return {
        ...threat,
        currentX: threat.currentX + moveX,
        currentY: threat.currentY + moveY,
        status: nextStatus
      };
    });

    // SAM engagement cycle
    const updatedSystems = placedSystems.map((sys) => {
      if (sys.status === 'OUT_OF_AMMO' || sys.status === 'DESTROYED' || sys.system.category === 'RADAR') return sys;

      // Find nearest detected and non-engaged/non-intercepted threat in range
      let targetThreat: ActiveThreat | null = null;
      let minDistance = sys.system.maxRange || 100;

      updatedThreats.forEach((t) => {
        if (t.status !== 'DETECTED' && t.status !== 'ENGAGED') return;
        
        const dist = Math.sqrt(Math.pow(sys.x - t.currentX, 2) + Math.pow(sys.y - t.currentY, 2));
        if (dist < minDistance) {
          minDistance = dist;
          targetThreat = t;
        }
      });

      if (targetThreat && sys.ammo > 0) {
        // Launch interceptor
        const threatToUpdate = updatedThreats.find(t => t.id === (targetThreat as any).id);
        if (threatToUpdate) {
          threatToUpdate.status = 'ENGAGED';
        }

        const nextAmmo = sys.ammo - 1;
        
        get().addEvent({
          timestamp: currentTime,
          type: SimEventType.INTERCEPTOR_LAUNCHED,
          data: { message: `🚀 LAUNCH: ${sys.system.name} launched interceptor targeting incoming projectile.` }
        });

        // Simple probability resolution after 2 ticks (approx fly time)
        const sysCopy = { ...sys };
        setTimeout(() => {
          const checkState = get();
          const targetStillActive = checkState.activeThreats.find(t => t.id === (targetThreat as any).id);
          if (targetStillActive && targetStillActive.status === 'ENGAGED') {
            const hitChance = Math.random() < (sysCopy.system.accuracy || 0.8);
            if (hitChance) {
              set(state => ({
                activeThreats: state.activeThreats.map(t => t.id === targetStillActive.id ? { ...t, status: 'INTERCEPTED' } : t)
              }));
              get().addEvent({
                timestamp: get().timeElapsed,
                type: SimEventType.INTERCEPTION_SUCCESS,
                data: { message: `⚡ INTERCEPT: ${sysCopy.system.name} successfully neutralized target.` }
              });
            } else {
              set(state => ({
                activeThreats: state.activeThreats.map(t => t.id === targetStillActive.id ? { ...t, status: 'DETECTED' } : t)
              }));
              get().addEvent({
                timestamp: get().timeElapsed,
                type: SimEventType.INTERCEPTION_FAILURE,
                data: { message: `💨 MISS: Interceptor missed target. Recalculating vector.` }
              });
            }
          }
        }, 1500 / get().playbackSpeed);

        return {
          ...sys,
          ammo: nextAmmo,
          status: nextAmmo === 0 ? 'OUT_OF_AMMO' as const : 'ENGAGED' as const
        };
      }

      return {
        ...sys,
        status: sys.ammo === 0 ? 'OUT_OF_AMMO' as const : 'ACTIVE' as const
      };
    });

    set({
      timeElapsed: currentTime,
      activeThreats: updatedThreats,
      placedSystems: updatedSystems
    });
  },

  addEvent: (event) => set((state) => ({
    events: [
      ...state.events,
      {
        ...event,
        id: `evt-${Date.now()}-${Math.random()}`,
        simulationId: 'active-sim'
      }
    ]
  })),

  adjustBudget: (amount) => set((state) => ({ budget: state.budget + amount }))
}));
