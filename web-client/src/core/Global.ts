/**
 * GLOBAL - Global game state management
 * Converted from ActionScript GLOBAL.as
 * 
 * This module manages all global game state and configuration
 */

import { 
  BaseMode, 
  YardType, 
  GameFlags, 
  BuildingProps,
  PlayerData,
  Rectangle,
  Point,
} from '../types/game';
import { SecNum } from '../utils/SecNum';
import { apiClient } from '../api/ApiClient';
import { EventEmitter } from './EventEmitter';

class GlobalState extends EventEmitter {
  // Server URLs
  serverUrl: string = '/';
  cdnUrl: string = '/';
  apiVersionSuffix: string = 'v1.4.3-beta';

  // Connection state
  connectionCounter: number = 0;
  connectionLost: boolean = false;

  // Local/save modes
  _local: boolean = true; // Browser is always "local" mode
  _save: boolean = true;

  // Loading states
  textContentLoaded: boolean = false;
  supportedLangsLoaded: boolean = false;

  // Version
  _version: SecNum = new SecNum(128);
  _softversion: number = 0;

  // AI/Debug mode
  _aiDesignMode: boolean = false;

  // Map/Mail versions
  _mapVersion: number = 0;
  _mailVersion: number = 0;
  _soundVersion: number = 0;
  _languageVersion: number = 0;

  // Halt flag
  _halt: boolean = false;

  // Frame count
  _frameNumber: number = 0;

  // Friend/session counts
  _friendCount: number = 0;
  _sessionCount: number = 0;
  _addTime: number = 0;

  // Screen dimensions
  _SCREENINIT: Rectangle = { x: 0, y: 0, width: 760, height: 670 };
  _SCREEN: Rectangle = { x: 0, y: 0, width: 760, height: 670 };
  _SCREENCENTER: Point = { x: 380, y: 335 };
  _SCREENHUD: Point = { x: 0, y: 0 };
  _SCREENHUDLEFT: Point = { x: 0, y: 0 };

  // Tick counter
  t: number = 0;

  // URLs
  _baseURL: string = '';
  _infBaseURL: string = '';
  _apiURL: string = '';
  _gameURL: string = '';
  _storageURL: string = '';
  languageUrl: string = '';
  _allianceURL: string = '';
  _soundPathURL: string = '';
  _mapURL: string = '';
  _statsURL: string = '';
  _countryCode: string = 'us';
  _appid: string = '';
  _tpid: string = '';
  _currencyURL: string = '';
  _monetized: number = 0;

  // Mode
  private _mode: BaseMode = BaseMode.BUILD;
  _loadmode: BaseMode = BaseMode.BUILD;

  // Map dimensions
  _mapWidth: number = 800;
  _mapHeight: number = 800;

  // Resource names
  _resourceNames: string[] = ['Twigs', 'Pebbles', 'Putty', 'Goo', 'Shiny', 'Time'];
  iresourceNames: string[] = ['Bones', 'Coal', 'Sulfur', 'Magma', 'Shiny', 'Time'];

  // Building properties
  _buildingProps: BuildingProps[] = [];

  // FPS tracking
  _fps: number = 40;
  _FPSframecount: number = 0;
  _FPStimestamp: number = 0;
  _FPSarray: Array<{ fps: number }> = [];

  // Loops
  _loops: number = 10;
  _maxLoops: number = 800;
  _loopsBanked: number = 0;
  lastTime: number = 0;

  // Zoom state
  _zoomed: boolean = false;
  _magnification: number = 1;

  // Time played
  _timePlayed: number = 0;

  // Game flags
  _flags: GameFlags = {};

  // Unread messages
  _unreadMessages: number = 0;

  // AFK timer
  _afktimer: SecNum = new SecNum(0);

  // Resources
  _resources: Record<string, SecNum> = {
    r1: new SecNum(0),
    r2: new SecNum(0),
    r3: new SecNum(0),
    r4: new SecNum(0),
  };

  _hpResources: Record<string, number> = {
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0,
  };

  // Credits
  _credits: SecNum = new SecNum(0);

  // Player
  private _player: PlayerData | null = null;
  private _attackingPlayer: PlayerData | null = null;

  // Home base ID
  _homeBaseID: number = 0;

  // Init error
  initError: string = '';
  versionMismatch: boolean = false;

  // Render flag
  _render: boolean = false;

  // Creep count
  _creepCount: number = 0;

  // Catch-up mode
  _catchup: boolean = false;

  constructor() {
    super();
  }

  /**
   * Initialize the game by loading server configuration
   */
  async init(): Promise<void> {
    try {
      const serverData = await apiClient.init(this.apiVersionSuffix);
      
      if (serverData.error) {
        this.initError = serverData.error;
        this.versionMismatch = !!serverData.versionMismatch;
        this.emit('initError');
        return;
      }

      if (serverData.debugMode) {
        this._aiDesignMode = serverData.debugMode;
        console.log('[DEBUG MODE ENABLED]');
      }

      this.emit('initSuccess');
    } catch (error) {
      this.initError = 'Failed to connect to the server.';
      this.emit('initError');
      console.error('Init error:', error);
    }
  }

  /**
   * Check network connection
   */
  async checkNetworkConnection(): Promise<void> {
    try {
      const connected = await apiClient.checkConnection();
      this.connectionLost = !connected;
      
      if (this.connectionLost) {
        this.emit('connectionLost');
      }
    } catch {
      this.connectionLost = true;
      this.emit('connectionLost');
    }
  }

  // Player accessors
  get player(): PlayerData | null {
    return this._player;
  }

  set player(value: PlayerData | null) {
    this._player = value;
  }

  get attackingPlayer(): PlayerData | null {
    return this._attackingPlayer;
  }

  set attackingPlayer(value: PlayerData | null) {
    this._attackingPlayer = value;
    if (this._attackingPlayer && this._attackingPlayer !== this._player) {
      this._attackingPlayer.isAttacking = true;
    }
  }

  // Mode accessors
  get mode(): BaseMode {
    return this._mode;
  }

  setMode(mode: BaseMode): void {
    this._mode = mode;
  }

  get isInAttackMode(): boolean {
    return (
      this._mode === BaseMode.WMATTACK ||
      this._mode === BaseMode.IWMATTACK ||
      this._mode === BaseMode.IATTACK ||
      this._mode === BaseMode.ATTACK
    );
  }

  /**
   * Check if in inferno mode
   */
  isInfernoMode(mode?: BaseMode): boolean {
    const checkMode = mode || this._loadmode;
    return (
      checkMode === BaseMode.IBUILD ||
      checkMode === BaseMode.IVIEW ||
      checkMode === BaseMode.IATTACK ||
      checkMode === BaseMode.IHELP ||
      checkMode === BaseMode.IWMVIEW ||
      checkMode === BaseMode.IWMATTACK
    );
  }

  /**
   * Check if mode is valid
   */
  isValidMode(mode: BaseMode): boolean {
    return Object.values(BaseMode).includes(mode);
  }

  /**
   * Convert inferno mode to default mode
   */
  infernoToDefaultMode(mode: BaseMode): BaseMode {
    const conversions: Partial<Record<BaseMode, BaseMode>> = {
      [BaseMode.IBUILD]: BaseMode.BUILD,
      [BaseMode.IVIEW]: BaseMode.VIEW,
      [BaseMode.IATTACK]: BaseMode.ATTACK,
      [BaseMode.IHELP]: BaseMode.HELP,
      [BaseMode.IWMVIEW]: BaseMode.WMVIEW,
      [BaseMode.IWMATTACK]: BaseMode.WMATTACK,
    };
    return conversions[mode] || mode;
  }

  /**
   * Setup global state for a new session
   */
  setup(baseMode: BaseMode = BaseMode.BUILD): void {
    this._loadmode = baseMode;
    this.connectionCounter = 0;

    if (this.isValidMode(baseMode)) {
      this.setMode(this.infernoToDefaultMode(baseMode));
    }

    this._fps = 40;
    this._FPSframecount = 0;
    this._FPSarray = [];
    this._FPStimestamp = 0;

    this._halt = false;
    this._mapWidth = 800;
    this._mapHeight = 800;
    this._zoomed = false;
    this._render = false;
    this._creepCount = 0;
    this._timePlayed = 0;

    if (this._loadmode === this._mode) {
      this._resourceNames = ['Twigs', 'Pebbles', 'Putty', 'Goo', 'Shiny', 'Time'];
    } else {
      this._resourceNames = this.iresourceNames;
    }

    this.emit('setupComplete');
  }

  /**
   * Clear all building references
   */
  clear(): void {
    // Clear building references
    this.emit('clear');
  }

  /**
   * Get resource frame name
   */
  getResourceFrame(resource: string, inferno: boolean = false): string {
    if (inferno) {
      const infernoFrames: Record<string, string> = {
        r1: 'bone',
        r2: 'coal',
        r3: 'sulfur',
        r4: 'magma',
        shiny: 'shiny2',
        time: 'time2',
      };
      return infernoFrames[resource] || 'unknown';
    } else {
      const normalFrames: Record<string, string> = {
        r1: 'twig',
        r2: 'pebble',
        r3: 'putty',
        r4: 'goo',
        shiny: 'shiny',
        time: 'time',
      };
      return normalFrames[resource] || 'unknown';
    }
  }

  /**
   * Get resource name
   */
  getResourceName(resource: string, inferno: boolean = false): string {
    const names = inferno ? this.iresourceNames : this._resourceNames;
    const indices: Record<string, number> = {
      r1: 0,
      r2: 1,
      r3: 2,
      r4: 3,
      shiny: 4,
      time: 5,
    };
    const index = indices[resource];
    return index !== undefined ? names[index] : '???';
  }

  /**
   * Format number with commas
   */
  formatNumber(num: number): string {
    return Math.floor(num).toLocaleString();
  }

  /**
   * Convert seconds to time string
   */
  toTime(
    totalSeconds: number,
    includeDays: boolean = false,
    includeHours: boolean = true,
    includeMinutes: boolean = true,
    includeSeconds: boolean = false
  ): string {
    if (totalSeconds < 0) totalSeconds = 0;

    const days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    
    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;
    
    const seconds = totalSeconds;

    let result = '';

    if (includeDays && days > 0) {
      result += `${days}d `;
    }
    if ((includeHours || days > 0 || includeSeconds) && (hours > 0 || days > 0)) {
      result += `${this.doubleDigit(hours)}h `;
    }
    if ((includeMinutes || hours > 0 || days > 0 || includeSeconds) && (minutes > 0 || hours > 0 || days > 0)) {
      result += `${this.doubleDigit(minutes)}m `;
    }
    if (includeHours || days + hours + minutes === 0 || includeSeconds) {
      result += `${this.doubleDigit(seconds)}s`;
    }

    return result.trim();
  }

  /**
   * Double digit formatting
   */
  doubleDigit(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  /**
   * Get timestamp
   */
  timestamp(): number {
    return this.t;
  }

  /**
   * Refresh screen dimensions
   */
  refreshScreen(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this._SCREEN = {
      x: -(width - this._SCREENINIT.width) / 2,
      y: -(height - this._SCREENINIT.height) / 2,
      width,
      height,
    };

    this._SCREENCENTER = {
      x: this._SCREEN.x + this._SCREEN.width / 2,
      y: this._SCREEN.y + this._SCREEN.height / 2,
    };

    this._SCREENHUD = {
      x: this._SCREEN.x,
      y: this._SCREEN.y + this._SCREEN.height - 208,
    };

    this._SCREENHUDLEFT = {
      x: this._SCREEN.x,
      y: this._SCREEN.y + this._SCREEN.height - 208,
    };

    this.emit('screenResize', this._SCREEN);
  }

  /**
   * Check if at home
   */
  isAtHome(): boolean {
    return this._mode === BaseMode.BUILD;
  }

  /**
   * Check if defending
   */
  isDefending(): boolean {
    return this._mode === BaseMode.BUILD || this._mode === BaseMode.IBUILD;
  }

  /**
   * Update AFK timer
   */
  updateAFKTimer(): void {
    this._afktimer.Set(this.timestamp());
  }

  /**
   * Set game flags
   */
  setFlags(flags: GameFlags): void {
    this._flags = flags;
    this._flags.showProgressBar = 0;
  }

  /**
   * Next creep ID
   */
  nextCreepID(): number {
    this._creepCount++;
    return this._creepCount;
  }
}

// Singleton export
export const GLOBAL = new GlobalState();
