export interface Position {
  x: number;
  y: number;
}

export interface GameSettings {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number;
  maxSpeed: number;
  showGrid: boolean;
  colorScheme: ColorScheme;
  controls: ControlType;
}

export type ColorScheme = 'classic' | 'neon' | 'dark' | 'high-contrast';

export type ControlType = 'arrows' | 'wasd' | 'both';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameState = 'idle' | 'playing' | 'paused' | 'game-over';

export interface SnakeSegment extends Position {}

export interface GameData {
  snake: SnakeSegment[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  level: number;
  speed: number;
  state: GameState;
  settings: GameSettings;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  gridSize: 20,
  initialSpeed: 150,
  speedIncrement: 5,
  maxSpeed: 50,
  showGrid: true,
  colorScheme: 'classic',
  controls: 'both'
};

export const DIRECTIONS: Record<Direction, Position> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

export const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeColors> = {
  classic: {
    background: '#0d0d0d',
    grid: '#1a1a1a',
    snakeHead: '#4ade80',
    snakeBody: '#22c55e',
    snakeTail: '#16a34a',
    food: '#ef4444',
    foodGlow: '#f87171',
    text: '#e5e5e5',
    textSecondary: '#a3a3a3',
    overlay: 'rgba(13, 13, 13, 0.95)',
    button: '#22c55e',
    buttonHover: '#16a34a',
    buttonText: '#0d0d0d',
    danger: '#ef4444'
  },
  neon: {
    background: '#0a0a0f',
    grid: '#141420',
    snakeHead: '#00ff88',
    snakeBody: '#00cc6a',
    snakeTail: '#009950',
    food: '#ff0066',
    foodGlow: '#ff3385',
    text: '#00ff88',
    textSecondary: '#00cc6a',
    overlay: 'rgba(10, 10, 15, 0.95)',
    button: '#00ff88',
    buttonHover: '#00cc6a',
    buttonText: '#0a0a0f',
    danger: '#ff0066'
  },
  dark: {
    background: '#1e1e1e',
    grid: '#2a2a2a',
    snakeHead: '#60a5fa',
    snakeBody: '#3b82f6',
    snakeTail: '#2563eb',
    food: '#f87171',
    foodGlow: '#fca5a5',
    text: '#f3f4f6',
    textSecondary: '#9ca3af',
    overlay: 'rgba(30, 30, 30, 0.95)',
    button: '#3b82f6',
    buttonHover: '#2563eb',
    buttonText: '#ffffff',
    danger: '#ef4444'
  },
  'high-contrast': {
    background: '#000000',
    grid: '#1a1a1a',
    snakeHead: '#ffff00',
    snakeBody: '#cccc00',
    snakeTail: '#999900',
    food: '#ff0000',
    foodGlow: '#ff4444',
    text: '#ffffff',
    textSecondary: '#cccccc',
    overlay: 'rgba(0, 0, 0, 0.98)',
    button: '#ffff00',
    buttonHover: '#cccc00',
    buttonText: '#000000',
    danger: '#ff0000'
  }
};

export interface ColorSchemeColors {
  background: string;
  grid: string;
  snakeHead: string;
  snakeBody: string;
  snakeTail: string;
  food: string;
  foodGlow: string;
  text: string;
  textSecondary: string;
  overlay: string;
  button: string;
  buttonHover: string;
  buttonText: string;
  danger: string;
}