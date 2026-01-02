# Backyard Monsters TypeScript Client

A TypeScript port of the original ActionScript 3 Backyard Monsters client, designed to run completely in the browser.

## Overview

This client is a complete rewrite of the original Flash-based game client in modern TypeScript. It interfaces with the existing Backyard Monsters Refitted server and provides all the same functionality in a browser-native format.

## Features

- **Modern TypeScript**: Fully typed codebase with strict TypeScript configuration
- **Browser Native**: No Flash required, runs in any modern browser
- **Modular Architecture**: Clean separation of concerns with distinct modules for core, game, UI, network, and rendering
- **Server Compatible**: Works with the existing Backyard Monsters Refitted server API

## Project Structure

```
client-ts/
├── src/
│   ├── core/           # Core game systems (Global, Game, Login, Keys)
│   ├── game/           # Game logic (Base, Buildings, Creatures, etc.)
│   ├── ui/             # User interface components (Popups, PleaseWait)
│   ├── network/        # Network API layer
│   ├── rendering/      # Map and visual rendering
│   ├── audio/          # Sound system
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions and classes
│   └── main.ts         # Application entry point
├── index.html          # HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

```bash
# Navigate to the client directory
cd client-ts

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The development server runs on `http://localhost:3000` and proxies API requests to the backend server at `http://localhost:3001`.

## Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

The client connects to the server configured in `src/core/Global.ts`:

```typescript
static serverUrl: string = 'http://localhost:3001/';
static cdnUrl: string = 'http://localhost:3001/';
static apiVersionSuffix: string = 'v1.4.3-beta';
```

## Module Overview

### Core (`src/core/`)

- **Global.ts**: Global state management, constants, and utility functions
- **Game.ts**: Main game entry point and game loop
- **Login.ts**: Authentication and session management
- **Keys.ts**: Language/localization system

### Game (`src/game/`)

- **Base.ts**: Base loading, saving, and state management
- **Buildings.ts**: Building system with properties and instances
- **Creatures.ts**: Monster/creature system
- **Housing.ts**: Monster housing management
- **Hatchery.ts**: Monster breeding system
- **Attack.ts**: Combat system

### UI (`src/ui/`)

- **Popups.ts**: Modal popup system
- **PleaseWait.ts**: Loading indicator

### Network (`src/network/`)

- **API.ts**: HTTP API layer for server communication

### Rendering (`src/rendering/`)

- **Map.ts**: Isometric map rendering using Canvas 2D

### Audio (`src/audio/`)

- **Sounds.ts**: Sound and music playback system

## Comparison to ActionScript Client

| ActionScript | TypeScript | Status |
|--------------|------------|--------|
| GLOBAL.as | Global.ts | ✅ Complete |
| GAME.as | Game.ts | ✅ Complete |
| URLLoaderApi.as | API.ts | ✅ Complete |
| LOGIN.as | Login.ts | ✅ Complete |
| KEYS.as | Keys.ts | ✅ Complete |
| BASE.as | Base.ts | ✅ Complete |
| MAP.as | Map.ts | ✅ Basic |
| BUILDINGS.as | Buildings.ts | ✅ Basic |
| CREATURES.as | Creatures.ts | ✅ Basic |
| HOUSING.as | Housing.ts | ✅ Complete |
| HATCHERY.as | Hatchery.ts | ✅ Complete |
| ATTACK.as | Attack.ts | ✅ Basic |
| SOUNDS.as | Sounds.ts | ✅ Complete |
| POPUPS.as | Popups.ts | ✅ Complete |

## Screenshot

![Client Screenshot](https://github.com/user-attachments/assets/168a2320-6ad2-4774-9b88-c12ad311f122)

*The client showing the connection error screen when server is not running*

## License

This project is part of the Backyard Monsters Refitted project.
