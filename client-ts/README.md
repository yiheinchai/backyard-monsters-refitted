# Backyard Monsters Refitted - TypeScript Client

A complete TypeScript/PixiJS port of the original ActionScript Flash client for Backyard Monsters.

## Features

- **PixiJS 8.x Rendering**: Modern WebGL-based rendering for smooth 60fps gameplay
- **Isometric Map System**: Full isometric map with panning, zooming, and tile-based building placement
- **Building System**: Complete building management including construction, upgrades, and resource production
- **Creature/Monster System**: Full monster hatching, housing, and combat AI
- **Combat System**: Attack other players' bases with monsters and projectiles
- **World Map**: Navigate the world map to find and attack other players
- **UI Components**: Login screen, building store, monster info, and more
- **Sound System**: Howler.js based audio management
- **Network Layer**: REST API integration with the Backyard Monsters Refitted server

## Architecture

The client follows a modular architecture:

```
src/
├── assets/         # Asset loading and management
├── audio/          # Sound and music management
├── core/           # Core game systems (Game, GameState, Config)
├── game/           # Game logic
│   ├── base/       # Base management
│   ├── buildings/  # Building classes and properties
│   ├── combat/     # Combat system
│   ├── creatures/  # Monster/creature system
│   ├── map/        # Map rendering
│   └── worldmap/   # World map system
├── network/        # API communication
├── ui/             # UI components and popups
└── utils/          # Utilities (EventEmitter, SecNum)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd client-ts
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite development server at http://localhost:3000

### Building

```bash
npm run build
```

Creates a production build in the `dist/` folder.

### Type Checking

```bash
npm run typecheck
```

## Key Classes

### Core
- **Game** - Main game orchestrator, handles initialization and game loop
- **GameState** - Central state management (ported from GLOBAL.as)
- **Localization** - Multi-language support

### Game Systems
- **Base** - Manages a player's base, buildings, and resources
- **Building** - Individual building with health, level, production
- **Creature** - Monster unit with stats, AI, and combat abilities
- **MapRenderer** - Isometric map rendering with layers
- **CombatManager** - Handles attacks, projectiles, and damage
- **WorldMap** - World map for PvP

### Network
- **NetworkManager** - Handles all API communication with the server

### UI
- **UIManager** - Main UI orchestration
- **BuildingStorePopup** - Building purchase interface
- **MonsterInfoPopup** - Monster housing display

## Configuration

The client connects to the server API specified in `src/core/config.ts`:

```typescript
export const CONFIG = {
  API_URL: 'http://localhost:3001/',
  CDN_URL: 'http://localhost:3001/',
  // ...
};
```

## License

GPL-3.0-only - Same as the main project
