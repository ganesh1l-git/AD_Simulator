import { AirDefenceSystem, Threat } from '@iades/shared';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface AIAction {
  type: 'PLACE_SYSTEM' | 'LAUNCH_THREAT' | 'UPGRADE_SYSTEM' | 'REALLOCATE_RESOURCES';
  timestamp: number;
  payload: any;
}

export abstract class BaseAICommander {
  protected difficulty: AIDifficulty;
  protected actionQueue: AIAction[] = [];
  protected decisionInterval = 2000; // ms between decisions

  constructor(difficulty: AIDifficulty = 'MEDIUM') {
    this.difficulty = difficulty;
    this.setDecisionInterval();
  }

  private setDecisionInterval() {
    switch (this.difficulty) {
      case 'EASY':
        this.decisionInterval = 4000;
        break;
      case 'MEDIUM':
        this.decisionInterval = 2000;
        break;
      case 'HARD':
        this.decisionInterval = 1000;
        break;
      case 'EXPERT':
        this.decisionInterval = 500;
        break;
    }
  }

  public getDifficulty(): AIDifficulty {
    return this.difficulty;
  }

  public queueAction(action: AIAction) {
    this.actionQueue.push(action);
  }

  public getNextAction(): AIAction | undefined {
    return this.actionQueue.shift();
  }

  public clearQueue() {
    this.actionQueue = [];
  }

  /**
   * Main decision cycle of the AI. Override in subclass.
   * @param sensorData Current status of the tactical board
   * @param timestamp Current simulation time in seconds
   */
  public abstract evaluateSituation(sensorData: any, timestamp: number): void;
}
