import type { ColorSchemeColors } from '../types/game';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  colors: ColorSchemeColors;
}

export function ScoreBoard({ score, highScore, level, colors }: ScoreBoardProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(8px)',
    border: `1px solid ${colors.grid}`,
    gap: '16px',
    flexWrap: 'wrap',
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '70px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: colors.textSecondary,
    marginBottom: '4px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.text,
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
  };

  const highScoreValueStyle: React.CSSProperties = {
    ...valueStyle,
    color: colors.snakeHead,
  };

  return (
    <div className="score-board" style={containerStyle} role="region" aria-label="Game score">
      <div style={itemStyle}>
        <span style={labelStyle}>Score</span>
        <span style={valueStyle}>{score.toLocaleString()}</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>Best</span>
        <span style={highScoreValueStyle}>{highScore.toLocaleString()}</span>
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>Level</span>
        <span style={valueStyle}>{level}</span>
      </div>
    </div>
  );
}