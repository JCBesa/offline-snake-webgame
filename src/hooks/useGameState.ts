import { useReducer, useCallback, useRef, useEffect } from 'react';
import type { GameData, GameSettings, Direction, Position, SnakeSegment } from '../types/game';
import { DEFAULT_SETTINGS, DIRECTIONS, OPPOSITE_DIRECTION, COLOR_SCHEMES } from '../types/game';
import { GAME_CONSTANTS, getHighScore, saveHighScore } from '../utils/constants';

type Action =
  | { type: 'INIT' }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART' }
  | { type: 'RESET' }
  | { type: 'SET_DIRECTION'; direction: Direction }
  | { type: 'TICK' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'LOAD_SETTINGS'; settings: GameSettings };

interface GameReducerState extends GameData {}

const createInitialSnake = (gridSize: number): SnakeSegment[] => {
  const center = Math.floor(gridSize / 2);
  const snake: SnakeSegment[] = [];
  for (let i = 0; i < GAME_CONSTANTS.INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: center - i, y: center });
  }
  return snake;
};

const generateFood = (snake: SnakeSegment[], gridSize: number): Position => {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`));
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
  } while (occupied.has(`${food.x},${food.y}`));
  return food;
};

const initialState: GameReducerState = {
  snake: [],
  food: { x: 0, y: 0 },
  direction: 'right',
  nextDirection: 'right',
  score: 0,
  highScore: 0,
  level: 1,
  speed: DEFAULT_SETTINGS.initialSpeed,
  state: 'idle',
  settings: DEFAULT_SETTINGS
};

function gameReducer(state: GameReducerState, action: Action): GameReducerState {
  switch (action.type) {
    case 'INIT': {
      const settings = state.settings;
      const snake = createInitialSnake(settings.gridSize);
      const food = generateFood(snake, settings.gridSize);
      return {
        ...state,
        snake,
        food,
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: settings.initialSpeed,
        state: 'idle',
        highScore: getHighScore()
      };
    }

    case 'LOAD_SETTINGS': {
      const newSettings = action.settings;
      const snake = createInitialSnake(newSettings.gridSize);
      const food = generateFood(snake, newSettings.gridSize);
      return {
        ...state,
        settings: newSettings,
        snake,
        food,
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: newSettings.initialSpeed,
        state: 'idle'
      };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings };
      const snake = createInitialSnake(newSettings.gridSize);
      const food = generateFood(snake, newSettings.gridSize);
      return {
        ...state,
        settings: newSettings,
        snake,
        food,
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: newSettings.initialSpeed,
        state: 'idle'
      };
    }

    case 'START': {
      if (state.state !== 'idle' && state.state !== 'game-over') return state;
      return {
        ...state,
        state: 'playing',
        snake: createInitialSnake(state.settings.gridSize),
        food: generateFood(createInitialSnake(state.settings.gridSize), state.settings.gridSize),
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: state.settings.initialSpeed
      };
    }

    case 'PAUSE': {
      if (state.state !== 'playing') return state;
      return { ...state, state: 'paused' };
    }

    case 'RESUME': {
      if (state.state !== 'paused') return state;
      return { ...state, state: 'playing' };
    }

    case 'SET_DIRECTION': {
      if (state.state !== 'playing') return state;
      const newDirection = action.direction;
      if (OPPOSITE_DIRECTION[state.direction] === newDirection) return state;
      return { ...state, nextDirection: newDirection };
    }

    case 'TICK': {
      if (state.state !== 'playing') return state;

      const newDirection = state.nextDirection;
      const delta = DIRECTIONS[newDirection];
      const head = state.snake[0];
      const gridSize = state.settings.gridSize;

      const newHead: Position = {
        x: (head.x + delta.x + gridSize) % gridSize,
        y: (head.y + delta.y + gridSize) % gridSize
      };

      // Check self collision
      const willCollide = state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);
      if (willCollide) {
        const finalScore = state.score;
        if (finalScore > state.highScore) {
          saveHighScore(finalScore);
        }
        return {
          ...state,
          state: 'game-over',
          highScore: Math.max(state.highScore, finalScore)
        };
      }

      const newSnake = [newHead, ...state.snake];
      let newFood = state.food;
      let newScore = state.score;
      let newLevel = state.level;
      let newSpeed = state.speed;

      // Check food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        newScore += GAME_CONSTANTS.POINTS_PER_FOOD;
        newFood = generateFood(newSnake, gridSize);

        // Level up
        const newLevelCalc = Math.floor(newScore / GAME_CONSTANTS.LEVEL_UP_SCORE) + 1;
        if (newLevelCalc > newLevel) {
          newLevel = newLevelCalc;
          newSpeed = Math.max(
            state.settings.maxSpeed,
            state.settings.initialSpeed - (newLevel - 1) * state.settings.speedIncrement
          );
        }
      } else {
        newSnake.pop();
      }

      return {
        ...state,
        snake: newSnake,
        food: newFood,
        direction: newDirection,
        score: newScore,
        level: newLevel,
        speed: newSpeed
      };
    }

    case 'GAME_OVER': {
      const finalScore = state.score;
      if (finalScore > state.highScore) {
        saveHighScore(finalScore);
      }
      return {
        ...state,
        state: 'game-over',
        highScore: Math.max(state.highScore, finalScore)
      };
    }

    case 'RESTART': {
      const settings = state.settings;
      const snake = createInitialSnake(settings.gridSize);
      const food = generateFood(snake, settings.gridSize);
      return {
        ...state,
        snake,
        food,
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: settings.initialSpeed,
        state: 'playing'
      };
    }

    case 'RESET': {
      const settings = state.settings;
      const snake = createInitialSnake(settings.gridSize);
      const food = generateFood(snake, settings.gridSize);
      return {
        ...state,
        snake,
        food,
        direction: 'right',
        nextDirection: 'right',
        score: 0,
        level: 1,
        speed: settings.initialSpeed,
        state: 'idle'
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  const init = useCallback(() => dispatch({ type: 'INIT' }), []);
  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setDirection = useCallback((direction: Direction) => dispatch({ type: 'SET_DIRECTION', direction }), []);
  const updateSettings = useCallback((settings: Partial<GameSettings>) => dispatch({ type: 'UPDATE_SETTINGS', settings }), []);
  const loadSettings = useCallback((settings: GameSettings) => dispatch({ type: 'LOAD_SETTINGS', settings }), []);

  const tick = useCallback((timestamp: number) => {
    if (state.state === 'playing') {
      const elapsed = timestamp - lastTickRef.current;
      if (elapsed >= state.speed) {
        lastTickRef.current = timestamp;
        dispatch({ type: 'TICK' });
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [state.state, state.speed]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [tick]);

  useEffect(() => {
    init();
  }, [init]);

  const colors = COLOR_SCHEMES[state.settings.colorScheme];

  return {
    ...state,
    colors,
    init,
    start,
    pause,
    resume,
    restart,
    reset,
    setDirection,
    updateSettings,
    loadSettings,
    isPlaying: state.state === 'playing',
    isPaused: state.state === 'paused',
    isGameOver: state.state === 'game-over',
    isIdle: state.state === 'idle'
  };
}