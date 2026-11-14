import { useCallback, useRef, useEffect } from 'react';
import type { Direction, TouchPoint } from '../types/game';
import { GAME_CONSTANTS } from '../utils/constants';

interface UseTouchControlsOptions {
  onDirectionChange: (direction: Direction) => void;
  enabled?: boolean;
}

export function useTouchControls({ onDirectionChange, enabled = true }: UseTouchControlsOptions) {
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const lastDirectionRef = useRef<Direction | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    touchEndRef.current = null;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !touchStartRef.current) return;
    const touch = e.touches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }, [enabled]);

  const handleTouchEnd = useCallback(() => {
    if (!enabled || !touchStartRef.current || !touchEndRef.current) {
      touchStartRef.current = null;
      touchEndRef.current = null;
      return;
    }

    const dx = touchEndRef.current.x - touchStartRef.current.x;
    const dy = touchEndRef.current.y - touchStartRef.current.y;
    const dt = touchEndRef.current.timestamp - touchStartRef.current.timestamp;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const isSwipe = distance >= GAME_CONSTANTS.SWIPE_THRESHOLD && dt <= GAME_CONSTANTS.SWIPE_TIME_MAX;

    if (isSwipe) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      let direction: Direction | null = null;
      if (absDx > absDy) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }

      if (direction && direction !== lastDirectionRef.current) {
        lastDirectionRef.current = direction;
        onDirectionChange(direction);
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [enabled, onDirectionChange]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}

export function useDPadControls(onDirectionChange: (direction: Direction) => void) {
  const handleDirection = useCallback((direction: Direction) => {
    onDirectionChange(direction);
  }, [onDirectionChange]);

  return { handleDirection };
}