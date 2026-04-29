# Word Rush

A fast-paced word unscrambling game built with React. Race against the clock to unscramble words across 4 increasingly difficult levels!

**[Play Now](https://unnati396.github.io/word-rush/)**

## How to Play

1. Scrambled letters appear on screen — click or type to form the correct word
2. Each correct word adds **+2 seconds** to your timer
3. Solve **5 words** to advance to the next level (longer words, bigger bonuses)
4. The game ends when the timer hits zero — try to beat your high score!

### Levels

| Level | Word Length | Time Bonus on Level Up |
|-------|-----------|----------------------|
| 1     | 4 letters | —                    |
| 2     | 5 letters | +10s                 |
| 3     | 6 letters | +20s                 |
| 4     | 7 letters | +30s                 |

## Features

- **Keyboard support** — type letters directly or click tiles
- **High score persistence** — best score saved locally
- **Animated timer bar** — color shifts from teal → orange → pulsing red as time runs low
- **Word progress tracker** — dots and counter show progress within each level
- **Smooth transitions** — animated word swaps, tile entries, and level-up overlays
- **Fully responsive** — works on phones, tablets, and desktop (including landscape)
- **PWA ready** — installable as an app, works offline after first load
- **Accessibility** — keyboard navigable, reduced motion support, ARIA labels

## Tech Stack

- React 16.8 (class components)
- CSS3 animations & transitions
- localStorage for high scores
- Service Worker for offline support
- Google Fonts (Orbitron + Inter)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## License

MIT
