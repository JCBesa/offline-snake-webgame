import type { ColorSchemeColors } from '../types/game';

interface GameOverOverlayProps {
  isVisible: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
  colors: ColorSchemeColors;
}

export function GameOverOverlay({ isVisible, score, highScore, isNewHighScore, onRestart, onMenu, colors }: GameOverOverlayProps) {
  if (!isVisible) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: colors.overlay,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
    animation: 'fadeIn 0.2s ease',
  };

  const panelStyle: React.CSSProperties = {
    background: colors.background,
    border: `1px solid ${colors.grid}`,
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '320px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    animation: 'slideUp 0.3s ease',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0 0 8px',
    color: colors.danger,
    fontSize: '28px',
    fontWeight: 700,
  };

  const newRecordStyle: React.CSSProperties = {
    margin: '0 0 24px',
    color: colors.snakeHead,
    fontSize: '18px',
    fontWeight: 600,
    animation: 'pulse 1.5s ease-in-out infinite',
  };

  const scoreContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    marginBottom: '32px',
    padding: '16px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
  };

  const scoreItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const scoreLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: colors.textSecondary,
    marginBottom: '4px',
  };

  const scoreValueStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: colors.text,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  };

  const highScoreValueStyle: React.CSSProperties = {
    ...scoreValueStyle,
    color: colors.snakeHead,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
    touchAction: 'manipulation',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: colors.button,
    color: colors.buttonText,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: colors.grid,
    color: colors.text,
  };

  return (
    <div className="game-over-overlay" style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="game-over-panel" style={panelStyle}>
        <h2 id="game-over-title" style={titleStyle}>Game Over</h2>
        
        {isNewHighScore && (
          <p style={newRecordStyle}>🎉 New High Score! 🎉</p>
        )}
        
        <div style={scoreContainerStyle}>
          <div style={scoreItemStyle}>
            <span style={scoreLabelStyle}>Your Score</span>
            <span style={scoreValueStyle}>{score.toLocaleString()}</span>
          </div>
          <div style={scoreItemStyle}>
            <span style={scoreLabelStyle}>Best Score</span>
            <span style={highScoreValueStyle}>{highScore.toLocaleString()}</span>
          </div>
        </div>
        
        <button
          style={primaryButtonStyle}
          onClick={onRestart}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          autoFocus
        >
          Play Again
        </button>
        
        <button
          style={secondaryButtonStyle}
          onClick={onMenu}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
}