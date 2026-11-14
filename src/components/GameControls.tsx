import { useMemo } from 'react';
import type { Direction } from '../types/game';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  isPlaying: boolean;
  colors: {
    button: string;
    buttonHover: string;
    buttonText: string;
    background: string;
    text: string;
  };
}

const DIRECTION_BUTTONS = [
  { direction: 'up' as Direction, label: '↑', position: 'top' },
  { direction: 'left' as Direction, label: '←', position: 'left' },
  { direction: 'down' as Direction, label: '↓', position: 'bottom' },
  { direction: 'right' as Direction, label: '→', position: 'right' },
] as const;

const STYLES = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    gridTemplateAreas: `
      ". up ."
      "left . right"
      ". down ."
    `,
    gap: '8px',
    maxWidth: '200px',
    width: '100%',
    margin: '0 auto',
    padding: '16px',
  } as React.CSSProperties,
  button: (position: string, colors: GameControlsProps['colors']) => ({
    gridArea: position,
    minWidth: '56px',
    minHeight: '56px',
    width: '100%',
    height: '100%',
    aspectRatio: '1',
    border: 'none',
    borderRadius: '12px',
    background: colors.button,
    color: colors.buttonText,
    fontSize: '24px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
    transition: 'transform 0.05s ease, background 0.1s ease',
    boxShadow: `0 4px 0 ${colors.buttonHover}, 0 2px 8px rgba(0,0,0,0.3)`,
  } as React.CSSProperties),
  buttonActive: (colors: GameControlsProps['colors']) => ({
    transform: 'translateY(2px)',
    boxShadow: `0 2px 0 ${colors.buttonHover}, 0 1px 4px rgba(0,0,0,0.3)`,
  } as React.CSSProperties),
};

export function GameControls({ onDirectionChange, isPlaying, colors }: GameControlsProps) {
  const buttonStyle = useMemo(() => STYLES.button, [colors]);

  const handleMouseDown = (direction: Direction) => {
    if (!isPlaying) return;
    onDirectionChange(direction);
  };

  const handleTouchStart = (e: React.TouchEvent, direction: Direction) => {
    e.preventDefault();
    if (!isPlaying) return;
    onDirectionChange(direction);
  };

  if (!isPlaying) return null;

  return (
    <div className="game-controls" style={STYLES.container} role="group" aria-label="Game controls">
      {DIRECTION_BUTTONS.map(({ direction, label, position }) => (
        <button
          key={direction}
          style={{
            ...buttonStyle(position, colors),
            ...(position === 'top' && { gridArea: 'up' }),
            ...(position === 'bottom' && { gridArea: 'down' }),
            ...(position === 'left' && { gridArea: 'left' }),
            ...(position === 'right' && { gridArea: 'right' }),
          }}
          onMouseDown={() => handleMouseDown(direction)}
          onTouchStart={(e) => handleTouchStart(e, direction)}
          onMouseUp={() => {}}
          onMouseLeave={() => {}}
          onTouchEnd={() => {}}
          aria-label={`Move ${direction}`}
          disabled={!isPlaying}
        >
          {label}
        </button>
      ))}
    </div>
  );
}