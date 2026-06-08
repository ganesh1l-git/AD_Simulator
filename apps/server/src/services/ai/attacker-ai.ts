import { BaseAICommander, AIAction, AIDifficulty } from './commander';
import { Threat } from '@iades/shared';

export class AttackerAI extends BaseAICommander {
  private lastWaveTimestamp = 0;
  private waveInterval = 20000; // ms between attack waves

  constructor(difficulty: AIDifficulty = 'MEDIUM') {
    super(difficulty);
    this.setWaveInterval();
  }

  private setWaveInterval() {
    switch (this.difficulty) {
      case 'EASY':
        this.waveInterval = 30000;
        break;
      case 'MEDIUM':
        this.waveInterval = 20000;
        break;
      case 'HARD':
        this.waveInterval = 15000;
        break;
      case 'EXPERT':
        this.waveInterval = 10000;
        break;
    }
  }

  public evaluateSituation(sensorData: {
    placedSystems: any[];
    activeThreats: any[];
    availableThreatCatalog: Threat[];
  }, timestamp: number): void {
    
    // Attackers launch in waves
    const realTimeElapsed = timestamp * 1000;
    if (realTimeElapsed - this.lastWaveTimestamp < this.waveInterval) return;

    // Filter threats by category
    const catalog = sensorData.availableThreatCatalog || [];
    if (catalog.length === 0) return;

    const uavs = catalog.filter(t => t.type === 'UAV' || t.type === 'LOITERING_MUNITION');
    const ballistic = catalog.filter(t => t.type === 'BALLISTIC_MISSILE');
    const cruise = catalog.filter(t => t.type === 'CRUISE_MISSILE');
    const aircraft = catalog.filter(t => t.type === 'FIGHTER_AIRCRAFT' || t.type === 'BOMBER_AIRCRAFT');

    const defendersCount = sensorData.placedSystems.length;

    // Easy: unpredictable simple drone/aircraft launch
    if (this.difficulty === 'EASY') {
      const randomThreat = catalog[Math.floor(Math.random() * catalog.length)];
      this.queueWave(randomThreat, 1, timestamp);
      return;
    }

    // Medium: mixed waves
    if (this.difficulty === 'MEDIUM') {
      if (defendersCount > 2) {
        // Launch a mix of cruise missiles and uavs
        const t1 = cruise[0] || catalog[0];
        const t2 = uavs[0] || catalog[0];
        this.queueWave(t1, 1, timestamp);
        this.queueWave(t2, 2, timestamp);
      } else {
        const t = aircraft[0] || catalog[0];
        this.queueWave(t, 1, timestamp);
      }
      return;
    }

    // Hard / Expert: Coordinated Saturation Waves
    // Saturation target: overload radar target tracking limits
    if (this.difficulty === 'HARD' || this.difficulty === 'EXPERT') {
      const hasLongRangeDefence = sensorData.placedSystems.some(s => s.system.category === 'LONG_RANGE');
      
      if (hasLongRangeDefence) {
        // Saturation attack: swarm of cheap UAV decoys first, followed by hypersonic/ballistic missiles
        const decoy = uavs[0] || catalog[0];
        const heavy = ballistic[0] || cruise[0] || catalog[0];

        // Launch decoys
        this.queueWave(decoy, 5, timestamp);
        
        // Delay launcher action for heavy strike
        this.queueAction({
          type: 'LAUNCH_THREAT',
          timestamp: timestamp + 2,
          payload: { threat: heavy, count: 2 }
        });
      } else {
        // High altitude cruise missile raid
        const strike = cruise[0] || catalog[0];
        this.queueWave(strike, 3, timestamp);
      }
    }
  }

  private queueWave(threat: Threat, count: number, timestamp: number) {
    this.lastWaveTimestamp = timestamp * 1000;
    this.queueAction({
      type: 'LAUNCH_THREAT',
      timestamp,
      payload: { threat, count }
    });
  }
}
