import { useEffect, useCallback, useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { useTouchControls } from './hooks/useTouchControls';
import { GameCanvas } from './components/GameCanvas';
import { GameControls } from './components/GameControls';
import { ScoreBoard } from './components/ScoreBoard';
import { SettingsPanel } from './components/SettingsPanel';
import { PauseOverlay } from './components/PauseOverlay';
import { GameOverOverlay } from './components/GameOverOverlay';
import { DEFAULT_SETTINGS } from './types/game';
import './styles/globals.css';

function App() {
  const {
    snake,
    food,
    direction,
    nextDirection,
    score,
    highScore,
    level,
    speed,
    state,
    settings,
    colors,
    start,
    pause,
    resume,
    restart,
    setDirection,
    updateSettings,
    loadSettings,
    isPlaying,
    isPaused,
    isGameOver,
    isIdle,
  } = useGameState();

  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useTouchControls({
    onDirectionChange: setDirection,
    enabled: isPlaying,
  });

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('snake-game-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        loadSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        // Ignore
      }
    }
    setHasHydrated(true);
  }, [loadSettings]);

  // Show welcome on first visit
  useEffect(() => {
    if (hasHydrated) {
      const seen = localStorage.getItem('snake-has-seen-welcome') === 'true';
      if (!seen) {
        setShowWelcome(true);
        localStorage.setItem('snake-has-seen-welcome', 'true');
      }
    }
  }, [hasHydrated]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyS: 'down',
      KeyA: 'left',
      KeyD: 'right',
    };

    const dir = keyMap[e.code];
    if (dir) {
      e.preventDefault();
      if (settings.controls === 'arrows' || settings.controls === 'both') {
        if (e.code.startsWith('Arrow')) setDirection(dir);
      }
      if (settings.controls === 'wasd' || settings.controls === 'both') {
        if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) setDirection(dir);
      }
    }

    if (e.code === 'Space' || e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      if (isPlaying) pause();
      else if (isPaused) resume();
    }

    if (e.code === 'KeyR' && (isGameOver || isPaused)) {
      e.preventDefault();
      restart();
    }
  }, [isPlaying, isPaused, isGameOver, pause, resume, restart, setDirection, settings.controls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStart = useCallback(() => {
    if (isIdle) start();
    else if (isPaused) resume();
  }, [isIdle, isPaused, start, resume]);

  // const handlePause = useCallback(() => {
  //   if (isPlaying) pause();
  // }, [isPlaying, pause]);

  const handleResume = useCallback(() => {
    if (isPaused) resume();
  }, [isPaused, resume]);

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  const handleQuit = useCallback(() => {
    if (isPlaying || isPaused) pause();
    setShowSettings(false);
  }, [isPlaying, isPaused, pause]);

  const gameData = {
    snake,
    food,
    direction,
    nextDirection,
    score,
    highScore,
    level,
    speed,
    state,
    settings,
  };

  if (!hasHydrated) {
    return (
      <div className="app loading" style={{ background: colors.background, minHeight: '100vh' }}>
        <div className="loading-screen" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          color: colors.text,
          padding: '20px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐍</div>
          <h1 style={{ margin: '0 0 8px', fontSize: '32px', fontWeight: 700 }}>Snake</h1>
          <p style={{ margin: 0, color: colors.textSecondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app" style={{ background: colors.background, minHeight: '100vh', color: colors.text }}>
      <header className="app-header" style={{ padding: '16px 20px' }}>
        <ScoreBoard score={score} highScore={highScore} level={level} colors={colors} />
      </header>

      <main className="app-main" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        padding: '20px',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <div className="game-container" style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '600px',
          aspectRatio: '1',
        }}>
          <GameCanvas gameData={gameData} colors={colors} />
          
          {isIdle && !showWelcome && (
            <div className="start-overlay" style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(13, 13, 13, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              zIndex: 50,
              padding: '20px',
              textAlign: 'center',
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '28px', fontWeight: 700, color: colors.text }}>Snake</h2>
              <p style={{ margin: '0 0 24px', color: colors.textSecondary, maxWidth: '300px' }}>
                Eat the food, grow longer, avoid hitting yourself. 
                Use arrow keys or WASD to control.
              </p>
              <button
                onClick={handleStart}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '10px',
                  background: colors.button,
                  color: colors.buttonText,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                Start Game
              </button>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  marginTop: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                }}
              >
                Settings
              </button>
            </div>
          )}

          {showWelcome && (
            <div className="welcome-overlay" style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(13, 13, 13, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              zIndex: 60,
              padding: '20px',
              textAlign: 'center',
              maxWidth: '400px',
              margin: 'auto',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🐍</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 700, color: colors.text }}>Welcome to Snake!</h2>
              <p style={{ margin: '0 0 24px', color: colors.textSecondary, lineHeight: 1.6 }}>
                Classic snake game built for the web. Works completely offline once loaded.
              </p>
              <div style={{ 
                textAlign: 'left', 
                color: colors.textSecondary, 
                fontSize: '14px', 
                lineHeight: 2,
                marginBottom: '24px',
                width: '100%',
                maxWidth: '300px',
              }}>
                <div>↑/W / ←/A / ↓/S / →/D - Move</div>
                <div>Space / Esc / P - Pause</div>
                <div>R - Restart</div>
                <div>Swipe or use on-screen buttons (mobile)</div>
              </div>
              <button
                onClick={() => { setShowWelcome(false); handleStart(); }}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '10px',
                  background: colors.button,
                  color: colors.buttonText,
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                Start Playing
              </button>
            </div>
          )}

          <PauseOverlay
            isVisible={isPaused}
            onResume={handleResume}
            onRestart={handleRestart}
            onSettings={() => setShowSettings(true)}
            onQuit={handleQuit}
            colors={colors}
          />

          <GameOverOverlay
            isVisible={isGameOver}
            score={score}
            highScore={highScore}
            isNewHighScore={score > 0 && score >= highScore}
            onRestart={handleRestart}
            onMenu={handleQuit}
            colors={colors}
          />
        </div>

        <GameControls
          onDirectionChange={setDirection}
          isPlaying={isPlaying}
          colors={{
            button: colors.button,
            buttonHover: colors.buttonHover,
            buttonText: colors.buttonText,
            background: colors.background,
            text: colors.text,
          }}
        />
      </main>

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentSettings={settings}
        onSettingsChange={updateSettings}
        colors={colors}
      />

      {typeof navigator !== 'undefined' && 'serviceWorker' in navigator && (
        <SWUpdateNotification colors={colors} />
      )}
    </div>
  );
}

function SWUpdateNotification({ colors }: { colors: ReturnType<typeof import('./hooks/useGameState').useGameState>['colors'] }) {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleUpdate = () => setShowUpdate(true);
    
    navigator.serviceWorker.addEventListener('controllerchange', handleUpdate);
    
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdate(true);
            }
          });
        }
      });
    });

    return () => navigator.serviceWorker.removeEventListener('controllerchange', handleUpdate);
  }, []);

  if (!showUpdate) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '400px',
      margin: '0 auto',
      background: colors.background,
      border: `1px solid ${colors.grid}`,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
      zIndex: 1000,
      animation: 'slideUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ color: colors.text, fontSize: '14px' }}>A new version is available!</span>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            background: colors.button,
            color: colors.buttonText,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Refresh
        </button>
        <button
          onClick={() => setShowUpdate(false)}
          style={{
            padding: '8px',
            border: 'none',
            background: 'transparent',
            color: colors.textSecondary,
            cursor: 'pointer',
            fontSize: '18px',
            lineHeight: 1,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default App;