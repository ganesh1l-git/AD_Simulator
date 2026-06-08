import { AIDifficulty } from './commander';

export interface DifficultySettings {
  radarAccuracyMultiplier: number;
  interceptionProbabilityModifier: number;
  attackerWaveIntervalSec: number;
  defenderBudget: number;
  maxActiveThreats: number;
}

export const DIFFICULTY_SETTINGS: Record<AIDifficulty, DifficultySettings> = {
  EASY: {
    radarAccuracyMultiplier: 1.2, // 20% easier to detect
    interceptionProbabilityModifier: 0.1, // +10% intercept chance
    attackerWaveIntervalSec: 30,
    defenderBudget: 150000000, // $150M budget
    maxActiveThreats: 4
  },
  MEDIUM: {
    radarAccuracyMultiplier: 1.0,
    interceptionProbabilityModifier: 0.0,
    attackerWaveIntervalSec: 20,
    defenderBudget: 100000000, // $100M budget
    maxActiveThreats: 8
  },
  HARD: {
    radarAccuracyMultiplier: 0.85, // 15% harder to detect
    interceptionProbabilityModifier: -0.08, // -8% intercept chance
    attackerWaveIntervalSec: 15,
    defenderBudget: 80000000, // $80M budget
    maxActiveThreats: 12
  },
  EXPERT: {
    radarAccuracyMultiplier: 0.7, // 30% harder to detect
    interceptionProbabilityModifier: -0.15, // -15% intercept chance (EW countermeasures)
    attackerWaveIntervalSec: 10,
    defenderBudget: 60000000, // $60M budget
    maxActiveThreats: 18
  }
};

/**
 * Returns scaling factors based on player campaign progression and AI difficulty level.
 */
export function getDifficultySettings(difficulty: AIDifficulty): DifficultySettings {
  return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.MEDIUM;
}

/**
 * Calculates XP reward points based on difficulty cleared and wave count
 */
export function calculateXPReward(difficulty: AIDifficulty, waveCount: number, successRate: number): number {
  const baseDifficultyXP: Record<AIDifficulty, number> = {
    EASY: 100,
    MEDIUM: 250,
    HARD: 500,
    EXPERT: 1000
  };

  const difficultyFactor = baseDifficultyXP[difficulty] || 250;
  const performanceFactor = successRate / 100;
  
  return Math.round(difficultyFactor * (1 + waveCount * 0.15) * performanceFactor);
}
