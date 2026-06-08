import { BaseAICommander, AIAction, AIDifficulty } from './commander';
import { AirDefenceSystem, Threat } from '@iades/shared';

export class DefenderAI extends BaseAICommander {
  private budget = 100000000;
  private spent = 0;

  constructor(difficulty: AIDifficulty = 'MEDIUM', budget = 100000000) {
    super(difficulty);
    this.budget = budget;
  }

  public evaluateSituation(sensorData: { 
    placedSystems: any[]; 
    activeThreats: any[]; 
    strategicZones: any[];
    availableCatalog: AirDefenceSystem[];
  }, timestamp: number): void {
    
    // Check if we need to purchase or place systems
    const remainingBudget = this.budget - this.spent;
    if (remainingBudget <= 10000000) return; // budget depleted

    const targetZones = sensorData.strategicZones || [];
    if (targetZones.length === 0) return;

    // Pick system catalog categories
    const radars = sensorData.availableCatalog.filter(s => s.category === 'RADAR');
    const longRange = sensorData.availableCatalog.filter(s => s.category === 'LONG_RANGE');
    const mediumRange = sensorData.availableCatalog.filter(s => s.category === 'MEDIUM_RANGE');
    const shortRange = sensorData.availableCatalog.filter(s => s.category === 'SHORT_RANGE');
    const vshorad = sensorData.availableCatalog.filter(s => s.category === 'VERY_SHORT_RANGE');

    if (sensorData.placedSystems.length === 0) {
      // First placement logic: radar + main coverage
      this.deployFirstWave(radars, longRange, targetZones, timestamp);
      return;
    }

    // Ongoing placement logic based on threats in real-time
    const activeThreats = sensorData.activeThreats.filter(t => t.status === 'DETECTED' || t.status === 'ENGAGED');
    if (activeThreats.length > 0) {
      this.handleIncomingThreats(activeThreats, mediumRange, shortRange, vshorad, timestamp);
    }
  }

  private deployFirstWave(radars: AirDefenceSystem[], longRange: AirDefenceSystem[], zones: any[], timestamp: number) {
    // Easy AI places randomly
    if (this.difficulty === 'EASY') {
      const sys = longRange[0] || radars[0];
      if (sys) {
        this.spent += (sys.cost * 1000000) || 5000000;
        this.queueAction({
          type: 'PLACE_SYSTEM',
          timestamp,
          payload: { system: sys, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
        });
      }
      return;
    }

    // Advanced: Place radar near critical zone, S-400 to cover overlapping zones
    const criticalZones = zones.filter(z => z.importance === 'CRITICAL' || z.importance === 'HIGH');
    const focusZone = criticalZones[0] || zones[0];
    
    const activeRadar = radars[0];
    if (activeRadar) {
      this.spent += (activeRadar.cost * 1000000) || 3000000;
      this.queueAction({
        type: 'PLACE_SYSTEM',
        timestamp,
        payload: { system: activeRadar, x: focusZone.x, y: focusZone.y + 5 }
      });
    }

    const primaryDefence = longRange[0];
    if (primaryDefence) {
      this.spent += (primaryDefence.cost * 1000000) || 15000000;
      this.queueAction({
        type: 'PLACE_SYSTEM',
        timestamp,
        payload: { system: primaryDefence, x: focusZone.x - 2, y: focusZone.y - 2 }
      });
    }
  }

  private handleIncomingThreats(threats: any[], med: AirDefenceSystem[], sho: AirDefenceSystem[], vsh: AirDefenceSystem[], timestamp: number) {
    // Easy doesn't adapt to threats
    if (this.difficulty === 'EASY') return;

    // Evaluate threats heading towards defense HQ (assumed center 50,50)
    threats.forEach((threat) => {
      // Don't act if already engaged
      if (threat.status === 'ENGAGED') return;

      // Predict target path coordinates
      const threatX = threat.currentX;
      const threatY = threat.currentY;

      // If threat is very close, deploy SHORAD or VSHORAD terminal defence
      const distanceToCenter = Math.sqrt(Math.pow(50 - threatX, 2) + Math.pow(50 - threatY, 2));

      if (distanceToCenter < 20 && this.difficulty !== 'MEDIUM') {
        const terminalSys = vsh[0] || sho[0];
        if (terminalSys && (this.budget - this.spent) >= ((terminalSys.cost * 1000000) || 2000000)) {
          this.spent += (terminalSys.cost * 1000000) || 2000000;
          this.queueAction({
            type: 'PLACE_SYSTEM',
            timestamp,
            payload: { system: terminalSys, x: 48 + Math.random() * 4, y: 48 + Math.random() * 4 }
          });
        }
      } else if (distanceToCenter < 35) {
        // Place medium range interceptor Akash / MRSAM in the threat corridor
        const corridorSys = med[0];
        if (corridorSys && (this.budget - this.spent) >= ((corridorSys.cost * 1000000) || 5000000)) {
          this.spent += (corridorSys.cost * 1000000) || 5000000;
          // Place slightly ahead of the threat path
          const placeX = threatX + (50 - threatX) * 0.2;
          const placeY = threatY + (50 - threatY) * 0.2;
          this.queueAction({
            type: 'PLACE_SYSTEM',
            timestamp,
            payload: { system: corridorSys, x: placeX, y: placeY }
          });
        }
      }
    });
  }
}
