import { useRef, useEffect, useCallback } from 'react';
import type { GameData, ColorSchemeColors, Position, SnakeSegment } from '../types/game';

interface GameCanvasProps {
  gameData: GameData;
  colors: ColorSchemeColors;
}

export function GameCanvas({ gameData, colors }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, gridSize: number, cellSize: number) => {
    if (!gameData.settings.showGrid) return;
    
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i <= gridSize; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvasRef.current!.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvasRef.current!.width, pos);
      ctx.stroke();
    }
  }, [gameData.settings.showGrid, colors.grid]);

  const drawFood = useCallback((ctx: CanvasRenderingContext2D, food: Position, cellSize: number) => {
    const centerX = food.x * cellSize + cellSize / 2;
    const centerY = food.y * cellSize + cellSize / 2;
    const radius = cellSize * 0.35;

    // Glow effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
    gradient.addColorStop(0, colors.foodGlow);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Food body
    ctx.fillStyle = colors.food;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }, [colors.food, colors.foodGlow]);

  const drawSnake = useCallback((ctx: CanvasRenderingContext2D, snake: SnakeSegment[], cellSize: number) => {
    const padding = Math.max(1, cellSize * 0.08);
    const radius = cellSize * 0.15;

    snake.forEach((segment, index) => {
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const size = cellSize - padding * 2;

      // Color gradient from head to tail
      const progress = index / Math.max(1, snake.length - 1);
      let segmentColor: string;
      
      if (index === 0) {
        segmentColor = colors.snakeHead;
      } else if (progress < 0.3) {
        segmentColor = colors.snakeBody;
      } else {
        segmentColor = colors.snakeTail;
      }

      ctx.fillStyle = segmentColor;
      
      // Rounded rectangle for snake segments
      ctx.beginPath();
      const r = Math.min(radius, size / 2);
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + size - r, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + r);
      ctx.lineTo(x + size, y + size - r);
      ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
      ctx.lineTo(x + r, y + size);
      ctx.quadraticCurveTo(x, y + size, x, y + size - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // Head details
      if (index === 0) {
        // Eyes
        const eyeSize = Math.max(2, cellSize * 0.08);
        const eyeOffset = size * 0.25;
        const eyeY = y + size * 0.3;
        
        ctx.fillStyle = '#000';
        const [dx, dy] = getDirectionOffset(gameData.direction);
        
        ctx.beginPath();
        ctx.arc(x + size/2 + dx * eyeOffset, eyeY + dy * eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x + size/2 - dx * eyeOffset, eyeY - dy * eyeOffset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [colors.snakeHead, colors.snakeBody, colors.snakeTail, gameData.direction]);

  const getDirectionOffset = (direction: string): [number, number] => {
    switch (direction) {
      case 'up': return [0, -1];
      case 'down': return [0, 1];
      case 'left': return [-1, 0];
      case 'right': return [1, 0];
      default: return [1, 0];
    }
  };

  const render = useCallback((_timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { gridSize } = gameData.settings;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const size = Math.min(displayWidth, displayHeight);
    
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cellSize = size / gridSize;

    // Clear
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, size, size);

    // Draw grid
    drawGrid(ctx, gridSize, cellSize);

    // Draw food
    drawFood(ctx, gameData.food, cellSize);

    // Draw snake
    drawSnake(ctx, gameData.snake, cellSize);

    animationFrameRef.current = requestAnimationFrame(render);
  }, [gameData, colors, drawGrid, drawFood, drawSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      // Trigger re-render on resize
    };
    
    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(render);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      aria-label="Snake game board"
      role="img"
      aria-live="polite"
    />
  );
}