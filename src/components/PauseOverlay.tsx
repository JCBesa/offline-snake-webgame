import type { ColorSchemeColors } from '../types/game';

interface PauseOverlayProps {
  isVisible: boolean;
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
  colors: ColorSchemeColors;
}

export function PauseOverlay({ isVisible, onResume, onRestart, onSettings, onQuit, colors }: PauseOverlayProps) {
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
    color: colors.text,
    fontSize: '28px',
    fontWeight: 700,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '0 0 32px',
    color: colors.textSecondary,
    fontSize: '16px',
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

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: colors.danger,
    color: '#fff',
  };

  return (
    <div className="pause-overlay" style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="pause-title">
      <div className="pause-panel" style={panelStyle}>
        <h2 id="pause-title" style={titleStyle}>Paused</h2>
        <p style={subtitleStyle}>Game is paused. What would you like to do?</p>
        
        <button
          style={primaryButtonStyle}
          onClick={onResume}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          autoFocus
        >
          Resume Game
        </button>
        
        <button
          style={secondaryButtonStyle}
          onClick={onRestart}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Restart
        </button>
        
        <button
          style={secondaryButtonStyle}
          onClick={onSettings}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Settings
        </button>
        
        <button
          style={dangerButtonStyle}
          onClick={onQuit}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Quit to Menu
        </button>
      </div>
    </div>
  );
}