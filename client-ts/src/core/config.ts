/**
 * Game configuration constants
 * Ported from ActionScript GLOBAL.as and related files
 */

export const CONFIG = {
  // Server configuration
  SERVER_URL: 'http://localhost:3001/',
  CDN_URL: 'http://localhost:3001/',
  API_VERSION: 'v1.4.3-beta',
  
  // Game version (matches original Flash version)
  VERSION: 128,
  
  // Screen dimensions (original Flash size)
  SCREEN_WIDTH: 760,
  SCREEN_HEIGHT: 670,
  
  // Map dimensions
  MAP_WIDTH: 800,
  MAP_HEIGHT: 800,
  MAP_TILE_SIZE: 10,
  
  // Rendering
  TARGET_FPS: 40,
  TILE_WIDTH: 40,
  TILE_HEIGHT: 20,
  
  // Attack countdown
  ATTACK_COUNTDOWN: 60 * 5, // 5 minutes
  
  // Resources
  RESOURCE_NAMES: ['Twigs', 'Pebbles', 'Putty', 'Goo', 'Shiny', 'Time'],
  INFERNO_RESOURCE_NAMES: ['Bone', 'Coal', 'Sulfur', 'Magma', 'Shiny', 'Time'],
  
  // Zoom bounds
  MIN_ZOOM: 0.6,
  MAX_ZOOM: 2.75,
  DEFAULT_ZOOM: 1,
  
  // AFK timeouts
  AFK_WARNING_TIME: 60 * 6, // 6 minutes
  AFK_TIMEOUT: 60 * 10, // 10 minutes
  
  // Connection check interval
  CONNECTION_CHECK_INTERVAL: 5,
  
  // Max outposts
  MAX_OUTPOSTS: 3500,
} as const;

// Base modes (from EnumBaseMode)
export enum BaseMode {
  BUILD = 'build',
  ATTACK = 'attack',
  VIEW = 'view',
  HELP = 'help',
  WMATTACK = 'wmattack',
  WMVIEW = 'wmview',
  // Inferno modes
  IBUILD = 'ibuild',
  IATTACK = 'iattack',
  IVIEW = 'iview',
  IHELP = 'ihelp',
  IWMATTACK = 'iwmattack',
  IWMVIEW = 'iwmview',
}

// Yard types (from EnumYardType)
export enum YardType {
  MAIN_YARD = 0,
  OUTPOST = 1,
  INFERNO_YARD = 2,
  INFERNO_OUTPOST = 3,
  PLAYER = 4,
  WMI = 5,
}

// Building groups
export enum BuildingGroup {
  RESOURCES = 1,
  HOUSING = 2,
  DEFENSE = 3,
  DECORATION = 4,
  TRAPS = 5,
  WALLS = 6,
  SPECIAL = 7,
}

// Monster movement types
export enum MovementType {
  GROUND = 'ground',
  FLYING = 'flying',
  UNDERGROUND = 'underground',
}

// Champion status
export enum ChampionStatus {
  NORMAL = 'normal',
  INJURED = 'injured',
  DEAD = 'dead',
  HEALING = 'healing',
}

// Map tile types
export enum MapTileType {
  GRASS = 0,
  ROCK = 1,
  SAND = 2,
  CRATER = 3,
  LAVA = 4,
}

// Layer depth constants
export const LAYERS = {
  BACKGROUND: 0,
  GROUND: 1,
  EFFECTS_BOTTOM: 2,
  BUILDING_BASES: 3,
  FOOTPRINTS: 4,
  WALLS: 5,
  CREATURES: 6,
  BUILDING_TOPS: 7,
  PROJECTILES: 8,
  EFFECTS_TOP: 9,
  UI: 10,
  WINDOWS: 11,
  MESSAGES: 12,
  TOP: 13,
} as const;

// Event names for the game event system
export const GAME_EVENTS = {
  // Core events
  INIT_COMPLETE: 'initComplete',
  INIT_ERROR: 'initError',
  LOGIN_SUCCESS: 'loginSuccess',
  LOGIN_ERROR: 'loginError',
  
  // Base events
  BASE_LOADED: 'baseLoaded',
  BASE_SAVED: 'baseSaved',
  BASE_ERROR: 'baseError',
  
  // Building events
  BUILDING_PLACED: 'buildingPlaced',
  BUILDING_SELECTED: 'buildingSelected',
  BUILDING_DESELECTED: 'buildingDeselected',
  BUILDING_UPGRADED: 'buildingUpgraded',
  BUILDING_DESTROYED: 'buildingDestroyed',
  
  // Combat events
  ATTACK_STARTED: 'attackStarted',
  ATTACK_ENDED: 'attackEnded',
  CREATURE_SPAWNED: 'creatureSpawned',
  CREATURE_DIED: 'creatureDied',
  
  // Resource events
  RESOURCES_CHANGED: 'resourcesChanged',
  
  // UI events
  POPUP_OPENED: 'popupOpened',
  POPUP_CLOSED: 'popupClosed',
  
  // Map events
  MAP_ROOM_OPENED: 'mapRoomOpened',
  MAP_ROOM_CLOSED: 'mapRoomClosed',
  
  // World Map events
  WORLDMAP_OPENED: 'worldmapOpened',
  WORLDMAP_CLOSED: 'worldmapClosed',
  
  // Language events
  LANGUAGE_LOADED: 'languageLoaded',
  LANGUAGES_LOADED: 'languagesLoaded',
} as const;

// Building type IDs (from the original game data)
export const BUILDING_TYPES = {
  TOWN_HALL: 14,
  HATCHERY: 4,
  HOUSING: 15,
  SILO: 11,
  RESOURCE_HARVESTER_TWIG: 1,
  RESOURCE_HARVESTER_PEBBLE: 2,
  RESOURCE_HARVESTER_PUTTY: 3,
  RESOURCE_HARVESTER_GOO: 18,
  FLINGER: 5,
  MAP_ROOM: 8,
  MONSTER_LOCKER: 16,
  ACADEMY: 17,
  MONSTER_LAB: 10,
  CATAPULT: 27,
  MONSTER_BUNKER: 20,
  MONSTER_BAITER: 26,
  YARD_PLANNER: 19,
  CHAMPION_CAGE: 9,
  CHAMPION_CHAMBER: 7,
  // Towers
  SNIPER_TOWER: 12,
  CANNON_TOWER: 13,
  TESLA_TOWER: 21,
  LASER_TOWER: 22,
  QUAKE_TOWER: 23,
  ADT: 24,
  RAILGUN: 25,
  // Walls
  WALL: 6,
  // Traps
  BOOBY_TRAP: 50,
  HEAVY_TRAP: 51,
} as const;

// Monster type IDs
export const MONSTER_TYPES = {
  POKEY: 1,
  OCTO_OOZE: 2,
  BOLT: 3,
  FINK: 4,
  EYE_RA: 5,
  ICHI: 6,
  CRABATRON: 7,
  PROJECT_X: 8,
  BRAIN: 9,
  TERATORN: 10,
  WORMZER: 11,
  D_A_V_E: 12,
  ZAFREETI: 13,
  KORATH: 14,
  VORG: 15,
  FOMOR: 16,
  DRULL: 17,
  GORGO: 18,
} as const;
