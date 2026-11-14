# Offline Snake Game 🐍

A fully-featured, installable Progressive Web App (PWA) Snake game that works completely offline. Built with React, Vite, TypeScript, and HTML Canvas.

## Features

- **Classic Snake Gameplay** - Eat food, grow longer, avoid walls and yourself
- **Progressive Difficulty** - Speed increases as you level up
- **High Score Persistence** - Scores saved locally via localStorage
- **Pause/Resume/Restart** - Full game control
- **Mobile Touch Controls** - Swipe gestures + on-screen D-pad
- **Settings Panel** - Grid size, speed, color schemes, controls
- **Multiple Color Themes** - Classic, Neon, Dark, High Contrast
- **Full PWA Support** - Installable, works offline, auto-updates
- **Responsive Design** - Works on desktop and mobile
- **Keyboard Support** - Arrow keys / WASD / Vim keys
- **Accessibility** - Reduced motion support, semantic HTML, ARIA labels

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **TypeScript** - Type safety
- **HTML Canvas** - High-performance rendering
- **Workbox (vite-plugin-pwa)** - Service worker and PWA manifest
- **CSS Modules / CSS Variables** - Styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## PWA Features

The game is a fully installable Progressive Web App:

- **Offline First** - Works completely offline after first load
- **Installable** - Add to home screen on mobile/desktop
- **Auto Updates** - Checks for updates in background
- **Fast Loading** - Cached via service worker

### Installation

1. Open the game in a supported browser (Chrome, Edge, Firefox, Safari)
2. Look for the "Install" prompt or use browser menu → "Install App"
3. Play offline anytime!

## Controls

| Action | Keyboard | Touch |
|--------|----------|-------|
| Move Up | ↑ / W / K | Swipe Up / D-Pad ↑ |
| Move Down | ↓ / S / J | Swipe Down / D-Pad ↓ |
| Move Left | ← / A / H | Swipe Left / D-Pad ← |
| Move Right | → / D / L | Swipe Right / D-Pad → |
| Pause/Resume | Space / Esc / P | - |
| Restart | R (when paused/game over) | - |

## Settings

Access settings from the main menu or pause screen:

- **Grid Size** (10-40) - Board dimensions
- **Initial Speed** (30-300ms) - Starting game speed
- **Speed Increase** (1-20ms) - How much faster per level
- **Color Scheme** - Classic, Neon, Dark, High Contrast
- **Controls** - Arrow keys, WASD, or both
- **Show Grid** - Toggle grid lines

## Project Structure

```
offline-snake-webgame/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── icons/                 # PWA icons (multiple sizes)
├── src/
│   ├── components/
│   │   ├── GameCanvas.tsx     # Canvas rendering + game loop
│   │   ├── GameControls.tsx   # On-screen D-pad (mobile)
│   │   ├── ScoreBoard.tsx     # Current score + high score
│   │   ├── SettingsPanel.tsx  # Modal with game settings
│   │   ├── PauseOverlay.tsx   # Pause menu
│   │   └── GameOverOverlay.tsx # Game over screen
│   ├── hooks/
│   │   ├── useGameLoop.ts     # requestAnimationFrame loop
│   │   ├── useGameState.ts    # Game logic (snake, food, collision)
│   │   ├── useLocalStorage.ts # Persistent settings/scores
│   │   └── useTouchControls.ts # Swipe/D-pad handling
│   ├── types/
│   │   └── game.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── constants.ts       # Game constants & storage helpers
│   ├── styles/
│   │   ├── globals.css        # Global styles
│   │   └── variables.css      # CSS custom properties
│   ├── App.tsx                # Main app composition
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Vite types
├── scripts/
│   └── generate-icons.mjs     # PWA icon generator
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Performance

- **60 FPS** rendering via `requestAnimationFrame`
- **< 500KB** gzipped bundle size
- **No external dependencies** at runtime (fully offline)
- **Optimized for low-end devices** (5+ years old)

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Focus management
- Reduced motion support
- High contrast color scheme
- Keyboard navigable
- Screen reader friendly

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Built with ❤️ using React, Vite, and the web platform.