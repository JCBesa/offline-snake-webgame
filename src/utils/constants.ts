import { GameSettings, DEFAULT_SETTINGS } from '../types/game';

export { DEFAULT_SETTINGS };

export const STORAGE_KEYS = {
  SETTINGS: 'snake-game-settings',
  HIGH_SCORE: 'snake-high-score',
  HAS_SEEN_WELCOME: 'snake-has-seen-welcome'
} as const;

export const GAME_CONSTANTS = {
  MIN_GRID_SIZE: 10,
  MAX_GRID_SIZE: 40,
  MIN_SPEED: 30,
  MAX_SPEED: 300,
  MIN_SPEED_INCREMENT: 1,
  MAX_SPEED_INCREMENT: 20,
  INITIAL_SNAKE_LENGTH: 3,
  POINTS_PER_FOOD: 10,
  LEVEL_UP_SCORE: 50,
  TOUCH_THRESHOLD: 30,
  SWIPE_THRESHOLD: 50,
  SWIPE_TIME_MAX: 300
} as const;

export const KEY_MAP: Record<string, 'up' | 'down' | 'left' | 'right'> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyK: 'up',
  KeyJ: 'down',
  KeyH: 'left',
  KeyL: 'right'
};

export function getStoredSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore quota errors
  }
}

export function getHighScore(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
  } catch {
    // Ignore quota errors
  }
}

export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_WELCOME) === 'true';
  } catch {
    return false;
  }
}

export function setHasSeenWelcome(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_WELCOME, 'true');
  } catch {
    // Ignore
  }
}