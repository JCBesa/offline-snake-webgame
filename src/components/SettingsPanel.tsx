import { useState, useEffect } from 'react';
import type { GameSettings, ColorScheme } from '../types/game';
import { GAME_CONSTANTS, DEFAULT_SETTINGS } from '../utils/constants';
import { COLOR_SCHEMES } from '../types/game';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  colors: {
    background: string;
    overlay: string;
    text: string;
    textSecondary: string;
    button: string;
    buttonHover: string;
    buttonText: string;
    grid: string;
    snakeHead: string;
    snakeBody: string;
    snakeTail: string;
    food: string;
  };
}

const COLOR_SCHEME_OPTIONS: { value: ColorScheme; label: string }[] = [
  { value: 'classic', label: 'Classic Green' },
  { value: 'neon', label: 'Neon' },
  { value: 'dark', label: 'Dark Blue' },
  { value: 'high-contrast', label: 'High Contrast' },
];

const CONTROL_OPTIONS = [
  { value: 'arrows', label: 'Arrow Keys' },
  { value: 'wasd', label: 'WASD Keys' },
  { value: 'both', label: 'Both' },
];

export function SettingsPanel({
  isOpen,
  onClose,
  currentSettings,
  onSettingsChange,
  colors,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<GameSettings>(currentSettings);

  useEffect(() => {
    setLocalSettings(currentSettings);
  }, [currentSettings]);

  const handleChange = (key: keyof GameSettings, value: GameSettings[keyof GameSettings]) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleNumberChange = (key: keyof GameSettings, value: number, min: number, max: number) => {
    const clamped = Math.max(min, Math.min(max, value));
    handleChange(key, clamped);
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: colors.overlay,
    display: isOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease',
  };

  const panelStyle: React.CSSProperties = {
    background: colors.background,
    border: `1px solid ${colors.grid}`,
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    animation: 'slideUp 0.3s ease',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: colors.textSecondary,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.grid}`,
    background: colors.background,
    color: colors.text,
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${colors.textSecondary.replace('#', '%23')}' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '40px',
  };

  const checkboxLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    color: colors.text,
  };

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    accentColor: colors.snakeHead,
    cursor: 'pointer',
    flexShrink: 0,
  };

  const colorPreviewStyle: (scheme: ColorScheme) => React.CSSProperties = (scheme) => ({
    width: '100%',
    height: '60px',
    borderRadius: '8px',
    border: `2px solid ${localSettings.colorScheme === scheme ? colors.snakeHead : colors.grid}`,
    background: `linear-gradient(135deg, ${COLOR_SCHEMES[scheme].background}, ${COLOR_SCHEMES[scheme].grid})`,
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px',
    boxSizing: 'border-box',
  });

  const colorOptionLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    color: colors.text,
  };

  const colorOptionDescStyle: React.CSSProperties = {
    fontSize: '10px',
    color: colors.textSecondary,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.grid}`,
  };

  const buttonStyle: React.CSSProperties = {
    flex: 1,
    padding: '14px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: colors.grid,
    color: colors.text,
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="settings-panel" style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <h2 id="settings-title" style={{ margin: '0 0 24px', color: colors.text, fontSize: '24px', fontWeight: 700 }}>
          Settings
        </h2>

        <div style={sectionStyle}>
          <label style={labelStyle}>Grid Size</label>
          <input
            type="range"
            min={GAME_CONSTANTS.MIN_GRID_SIZE}
            max={GAME_CONSTANTS.MAX_GRID_SIZE}
            value={localSettings.gridSize}
            onChange={(e) => handleNumberChange('gridSize', parseInt(e.target.value), GAME_CONSTANTS.MIN_GRID_SIZE, GAME_CONSTANTS.MAX_GRID_SIZE)}
            style={{ ...inputStyle, height: '8px', padding: 0 }}
            aria-label="Grid size"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: colors.textSecondary, fontSize: '14px' }}>
            <span>{GAME_CONSTANTS.MIN_GRID_SIZE}</span>
            <span><strong>{localSettings.gridSize}</strong></span>
            <span>{GAME_CONSTANTS.MAX_GRID_SIZE}</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Initial Speed</label>
          <input
            type="range"
            min={GAME_CONSTANTS.MIN_SPEED}
            max={GAME_CONSTANTS.MAX_SPEED}
            value={localSettings.initialSpeed}
            onChange={(e) => handleNumberChange('initialSpeed', parseInt(e.target.value), GAME_CONSTANTS.MIN_SPEED, GAME_CONSTANTS.MAX_SPEED)}
            style={{ ...inputStyle, height: '8px', padding: 0 }}
            aria-label="Initial speed"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: colors.textSecondary, fontSize: '14px' }}>
            <span>Slow ({GAME_CONSTANTS.MAX_SPEED}ms)</span>
            <span><strong>{localSettings.initialSpeed}ms</strong></span>
            <span>Fast ({GAME_CONSTANTS.MIN_SPEED}ms)</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Speed Increase per Level</label>
          <input
            type="range"
            min={GAME_CONSTANTS.MIN_SPEED_INCREMENT}
            max={GAME_CONSTANTS.MAX_SPEED_INCREMENT}
            value={localSettings.speedIncrement}
            onChange={(e) => handleNumberChange('speedIncrement', parseInt(e.target.value), GAME_CONSTANTS.MIN_SPEED_INCREMENT, GAME_CONSTANTS.MAX_SPEED_INCREMENT)}
            style={{ ...inputStyle, height: '8px', padding: 0 }}
            aria-label="Speed increment"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: colors.textSecondary, fontSize: '14px' }}>
            <span>Gradual (+{GAME_CONSTANTS.MIN_SPEED_INCREMENT})</span>
            <span><strong>+{localSettings.speedIncrement}</strong></span>
            <span>Steep (+{GAME_CONSTANTS.MAX_SPEED_INCREMENT})</span>
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Color Scheme</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {COLOR_SCHEME_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                style={colorPreviewStyle(value)}
                onClick={() => handleChange('colorScheme', value)}
                aria-pressed={localSettings.colorScheme === value}
              >
                <span style={colorOptionLabelStyle}>{label}</span>
                <span style={colorOptionDescStyle}>
                  {value === 'classic' && 'Original green theme'}
                  {value === 'neon' && 'Bright cyberpunk colors'}
                  {value === 'dark' && 'Easy on the eyes'}
                  {value === 'high-contrast' && 'Maximum visibility'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <label style={labelStyle}>Controls</label>
          <select
            value={localSettings.controls}
            onChange={(e) => handleChange('controls', e.target.value as GameSettings['controls'])}
            style={selectStyle}
            aria-label="Control scheme"
          >
            {CONTROL_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={sectionStyle}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={localSettings.showGrid}
              onChange={(e) => handleChange('showGrid', e.target.checked)}
              style={checkboxStyle}
            />
            Show Grid Lines
          </label>
        </div>

        <div style={buttonGroupStyle}>
          <button
            onClick={onClose}
            style={secondaryButtonStyle}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Close
          </button>
          <button
            onClick={() => {
              onSettingsChange(DEFAULT_SETTINGS);
              setLocalSettings(DEFAULT_SETTINGS);
            }}
            style={{ ...secondaryButtonStyle, background: colors.food, color: '#fff' }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}