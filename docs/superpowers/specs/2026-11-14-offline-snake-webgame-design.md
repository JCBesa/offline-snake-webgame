# Offline Snake Web Game - Design Document

## Intent & Why
Build a fully-featured, installable Progressive Web App (PWA) snake game that works completely offline. Uses React + Vite for modern tooling, HTML Canvas for performant rendering, and service workers for offline support.

## Goals
- Classic snake gameplay with smooth 60fps canvas rendering
- Progressive difficulty (speed increases with score)
- High score persistence via localStorage
- Pause/resume/restart functionality
- Mobile touch controls (swipe/d-pad)
- Settings panel (grid size, speed, colors)
- Full PWA: installable, works offline, service worker caching
- Responsive design (desktop + mobile)

## Non-Goals
- Multiplayer or online features
- Backend/server integration
- Complex animations beyond core gameplay
- Account system or cloud sync

## Anti-Goals
- No dependency on external CDNs (must work fully offline)
- No heavy frameworks that bloat bundle size
- No build-time internet requirements

## Constraints
- Must work 100% offline after first load
- Bundle size < 500KB gzipped
- 60fps on 5+ year old devices
- Touch-friendly on mobile (min 44px touch targets)

## Approaches Considered

### Rendering
| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **HTML Canvas** | 60fps, direct pixel control, game standard | Manual rendering | ✅ Chosen |
| CSS Grid/DOM | CSS styling, accessible | Reflow thrashing, slower | Rejected |
| SVG | Scalable | DOM overhead, slow updates | Rejected |

### Game Loop
| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **requestAnimationFrame + useRef** | Smooth, standard, React-compatible | Manual cleanup | ✅ Chosen |
| setInterval | Simple | Drift, not frame-aligned | Rejected |
| React state + useEffect | Declarative | Re-render thrashing | Rejected |

### PWA Strategy
| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **vite-plugin-pwa (Workbox)** | Auto-generates SW, precaching, updates | Learning curve | ✅ Chosen |
| Manual SW | Full control | Error-prone, maintenance | Rejected |

## Technical Decisions
- **Stack**: React 18 + Vite 5 + TypeScript
- **PWA**: vite-plugin-pwa with Workbox (GenerateSW strategy)
- **State**: useReducer for game state, useRef for canvas/game loop
- **Styling**: CSS Modules (scoped, no runtime)
- **Storage**: localStorage for high scores + settings
- **Input**: Keyboard (arrows/WASD) + Touch (swipe + on-screen D-pad)
- **Build**: Vite production build with code splitting

## Project Structure
```
offline-snake-webgame/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # PWA icons (multiple sizes)
├── src/
│   ├── components/
│   │   ├── GameCanvas.tsx     # Canvas rendering + game loop
│   │   ├── GameControls.tsx   # On-screen D-pad (mobile)
│   │   ├── ScoreBoard.tsx     # Current score + high score
│   │   ├── SettingsPanel.tsx  # Modal with game settings
│   │   └── PauseOverlay.tsx   # Pause menu
│   ├── hooks/
│   │   ├── useGameLoop.ts     # requestAnimationFrame loop
│   │   ├── useGameState.ts    # Game logic (snake, food, collision)
│   │   ├── useLocalStorage.ts # Persistent settings/scores
│   │   └── useTouchControls.ts# Swipe/D-pad handling
│   ├── types/
│   │   └── game.ts            # TypeScript interfaces
│   ├── utils/
│   │   └── constants.ts       # Game constants
│   ├── styles/
│   │   ├── globals.css        # Global styles + CSS variables
│   │   └── variables.css      # Design tokens
│   ├── App.tsx                # Main app composition
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Vite types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts             # Vite + PWA config
└── README.md
```

## What's Left to Builder
- Exact color scheme / visual design (use CSS variables for easy theming)
- Specific difficulty curve (speed increase per level)
- Touch control layout details (D-pad vs swipe-only)
- Icon design for PWA (can use placeholder initially)