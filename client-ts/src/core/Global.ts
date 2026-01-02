/**
 * GLOBAL - Global state management for the Backyard Monsters client
 * This is the TypeScript equivalent of GLOBAL.as
 */

import { SecNum, EventDispatcher, formatNumber, toTime, doubleDigit, quickDistance, quickDistanceSquared } from '@/utils';
import { API } from '@/network/API';
import { KEYS } from '@/core/Keys';
import { Rectangle, Point, Flags } from '@/types';

/**
 * Base mode enumeration
 */
export const e_BASE_MODE = {
  BUILD: 'build',
  ATTACK: 'attack',
  VIEW: 'view',
  HELP: 'help',
  WMATTACK: 'wmattack',
  WMVIEW: 'wmview',
  IBUILD: 'ibuild',
  IATTACK: 'iattack',
  IVIEW: 'iview',
  IHELP: 'ihelp',
  IWMATTACK: 'iwmattack',
  IWMVIEW: 'iwmview'
} as const;

export type BaseModeType = typeof e_BASE_MODE[keyof typeof e_BASE_MODE];

/**
 * Global state class - contains all global game state and settings
 */
export class GLOBAL {
  // Server configuration
  static serverUrl: string = 'http://localhost:3001/';
  static cdnUrl: string = 'http://localhost:3001/';
  static apiVersionSuffix: string = 'v1.4.3-beta';

  // Connection state
  static connectionCounter: number = 0;
  static connectionLost: boolean = false;

  // Local mode flags
  static _local: boolean = true;  // Running locally (not in browser)
  static _save: boolean = true;

  // Language state
  static textContentLoaded: boolean = false;
  static supportedLangsLoaded: boolean = false;

  // Version info
  static _version: SecNum = new SecNum(128);
  static _softversion: number = 0;
  static _mapVersion: number = 0;
  static _mailVersion: number = 0;
  static _soundVersion: number = 0;
  static _languageVersion: number = 0;

  // Game state
  static _halt: boolean = false;
  static _frameNumber: number = 0;
  static _friendCount: number = 0;
  static _sessionCount: number = 0;
  static _addTime: number = 0;
  static t: number = 0;

  // URLs
  static _baseURL: string = '';
  static _infBaseURL: string = '';
  static _apiURL: string = '';
  static _gameURL: string = '';
  static _storageURL: string = '';
  static languageUrl: string = '';
  static _allianceURL: string = '';
  static _soundPathURL: string = '';
  static _mapURL: string = '';
  static _statsURL: string = '';
  static _countryCode: string = 'us';
  static _appid: string = '';
  static _tpid: string = '';
  static _currencyURL: string = '';
  static _monetized: number = 0;

  // Screen dimensions
  static _SCREENINIT: Rectangle = { x: 0, y: 0, width: 760, height: 670 };
  static _SCREEN: Rectangle = { x: 0, y: 0, width: 760, height: 670 };
  static _SCREENCENTER: Point = { x: 380, y: 335 };
  static _SCREENHUD: Point = { x: 0, y: 462 };
  static _SCREENHUDLEFT: Point = { x: 0, y: 462 };
  static _fluidWidthEnabled: boolean = true;

  // Game mode
  private static _mode: string = e_BASE_MODE.BUILD;
  static _loadmode: string = e_BASE_MODE.BUILD;

  // Map dimensions
  static _mapWidth: number = 800;
  static _mapHeight: number = 800;

  // Resources
  static _resources: { [key: string]: SecNum } = {};
  static _hpResources: { [key: string]: number } = {};
  static _yardResources: { [key: string]: unknown } = {};
  static _resourceNames: string[] = ['Twigs', 'Pebbles', 'Putty', 'Goo', 'Shiny', 'Time'];
  static iresourceNames: string[] = ['Bone', 'Coal', 'Sulfur', 'Magma', 'Shiny', 'Time'];

  // Player data
  static _flags: Flags = {};
  static _fbdata: Record<string, unknown> = {};
  static _openBase: Record<string, unknown> | null = null;
  static _credits: SecNum = new SecNum(0);

  // Timing
  static _fps: number = 40;
  static _FPSframecount: number = 0;
  static _FPStimestamp: number = 0;
  static _FPSarray: { fps: number }[] = [];
  static lastTime: number = 0;
  static _loops: number = 10;
  static _maxLoops: number = 800;
  static _loopsBanked: number = 0;
  static _timePlayed: number = 0;

  // Overdrive states
  static _researchTime: number = 0;
  static _buildTime: number = 0;
  static _upgradePacking: number = 0;
  static _hatcheryOverdrive: number = 0;
  static _hatcheryOverdrivePower: SecNum = new SecNum(0);
  static _harvesterOverdrive: number = 0;
  static _harvesterOverdrivePower: SecNum = new SecNum(0);
  static _extraHousing: number = 0;
  static _extraHousingPower: SecNum = new SecNum(0);
  static _lockerOverdrive: number = 0;
  static _towerOverdrive: SecNum = new SecNum(0);
  static _monsterOverdrive: SecNum = new SecNum(0);

  // Attack state
  static _attackersResources: Record<string, SecNum> = {};
  static _hpAttackersResources: Record<string, number> = {};
  static _attackersCredits: SecNum = new SecNum(0);
  static _attackersFlinger: number = 0;
  static _attackersCatapult: number = 0;
  static _attackersDeltaResources: Record<string, unknown> = { dirty: false };
  static _savedAttackersDeltaResources: Record<string, SecNum> = {};

  // Map state
  static _homeBaseID: number = 0;
  static _mapHome: Point | null = null;
  static _mapOutpost: unknown[] = [];
  static _mapOutpostIDs: number[] = [];

  // UI state
  static _zoomed: boolean = false;
  static _magnification: number = 1;
  static _render: boolean = false;
  static _newThings: boolean = false;
  static _unreadMessages: number = 0;

  // AFK state
  static _afktimer: SecNum = new SecNum(0);
  static _oldMousePoint: Point = { x: 0, y: 0 };

  // Other stats
  static _otherStats: Record<string, number | string> = {};
  static _baseLoads: number = 0;
  static _averageAltitude: SecNum = new SecNum(125);
  static _outpostCapacity: SecNum = new SecNum(2000000);

  // Error handling
  static readonly ERROR_OOPS_ONLY: number = 0;
  static readonly ERROR_OOPS_AND_ORANGE_BOX: number = 1;
  static readonly ERROR_ORANGE_BOX_ONLY: number = 2;

  // Constants
  static readonly DEG_TO_RAD: number = 0.0174532925;
  static readonly RAD_TO_DEG: number = 57.2957795;
  static readonly TIME_ELAPSED_THRESHOLD: number = 300000;
  static readonly k_STAGE_FPS: number = 24;

  // Event dispatcher for global events
  static eventDispatcher: EventDispatcher = new EventDispatcher();

  // Init state
  static initError: string = '';
  static versionMismatch: boolean = false;

  // Design mode
  static _aiDesignMode: boolean = false;

  /**
   * Initialize the game by loading server configuration data
   */
  static async init(): Promise<void> {
    try {
      const response = await API.load<{ debugMode?: boolean; error?: string; versionMismatch?: boolean }>(
        GLOBAL.serverUrl + 'init',
        [['apiVersion', GLOBAL.apiVersionSuffix]]
      );

      if (!response) {
        GLOBAL.initError = 'Failed to connect to the server.';
        GLOBAL.eventDispatcher.dispatchEvent({ type: 'initError' });
        return;
      }

      if (response.error) {
        GLOBAL.initError = response.error;
        GLOBAL.versionMismatch = !!response.versionMismatch;
        GLOBAL.eventDispatcher.dispatchEvent({ type: 'initError' });
        return;
      }

      // Initialize language system
      GLOBAL.LanguageSetup();

      if (response.debugMode) {
        GLOBAL._aiDesignMode = true;
        console.log('[DEBUG MODE] Enabled');
      }
    } catch (error) {
      GLOBAL.initError = 'Failed to connect to the server.';
      GLOBAL.eventDispatcher.dispatchEvent({ type: 'initError' });
    }
  }

  /**
   * Check network connection
   */
  static async checkNetworkConnection(): Promise<void> {
    const connected = await API.checkConnection();
    
    if (!connected) {
      GLOBAL.connectionLost = true;
      // Import POPUPS dynamically to avoid circular dependency
      const { POPUPS } = await import('@/ui/Popups');
      POPUPS.NoConnection();
    } else {
      GLOBAL.connectionLost = false;
    }
  }

  /**
   * Configure language settings
   */
  static LanguageSetup(): void {
    const token = localStorage.getItem('bymr_token');
    const language = localStorage.getItem('bymr_language') || 'english';
    
    KEYS._storageURL = GLOBAL.languageUrl;
    KEYS.GetSupportedLanguages();

    if (token) {
      KEYS.Setup(language);
    } else {
      KEYS.Setup('english');
    }
  }

  /**
   * Get current game mode
   */
  static get mode(): string {
    return GLOBAL._mode;
  }

  /**
   * Set game mode
   */
  static setMode(mode: string): void {
    GLOBAL._mode = mode;
  }

  /**
   * Check if currently in attack mode
   */
  static get isInAttackMode(): boolean {
    return (
      GLOBAL.mode === e_BASE_MODE.WMATTACK ||
      GLOBAL.mode === e_BASE_MODE.IWMATTACK ||
      GLOBAL.mode === e_BASE_MODE.IATTACK ||
      GLOBAL.mode === e_BASE_MODE.ATTACK
    );
  }

  /**
   * Check if mode is inferno mode
   */
  static isInfernoMode(mode?: string): boolean {
    const checkMode = mode || GLOBAL._loadmode;
    return (
      checkMode === e_BASE_MODE.IBUILD ||
      checkMode === e_BASE_MODE.IVIEW ||
      checkMode === e_BASE_MODE.IATTACK ||
      checkMode === e_BASE_MODE.IHELP ||
      checkMode === e_BASE_MODE.IWMVIEW ||
      checkMode === e_BASE_MODE.IWMATTACK
    );
  }

  /**
   * Check if mode is valid
   */
  static isValidMode(mode: string): boolean {
    return Object.values(e_BASE_MODE).includes(mode as BaseModeType);
  }

  /**
   * Convert inferno mode to default mode
   */
  static infernoToDefaultMode(mode: string): string {
    switch (mode) {
      case e_BASE_MODE.IBUILD:
        return e_BASE_MODE.BUILD;
      case e_BASE_MODE.IVIEW:
        return e_BASE_MODE.VIEW;
      case e_BASE_MODE.IATTACK:
        return e_BASE_MODE.ATTACK;
      case e_BASE_MODE.IHELP:
        return e_BASE_MODE.HELP;
      case e_BASE_MODE.IWMVIEW:
        return e_BASE_MODE.WMVIEW;
      case e_BASE_MODE.IWMATTACK:
        return e_BASE_MODE.WMATTACK;
      default:
        return mode;
    }
  }

  /**
   * Game setup
   */
  static Setup(baseMode: string = e_BASE_MODE.BUILD): void {
    GLOBAL._loadmode = baseMode;
    GLOBAL.connectionCounter = 0;
    
    if (GLOBAL.isValidMode(baseMode)) {
      GLOBAL.setMode(GLOBAL.infernoToDefaultMode(baseMode));
    }

    GLOBAL._fps = 40;
    GLOBAL._FPSframecount = 0;
    GLOBAL._FPSarray = [];
    GLOBAL._FPStimestamp = 0;

    GLOBAL._halt = false;
    GLOBAL._mapWidth = 800;
    GLOBAL._mapHeight = 800;
    GLOBAL._zoomed = false;
    GLOBAL._averageAltitude = new SecNum(125);
    GLOBAL._outpostCapacity = new SecNum(2000000);

    GLOBAL._attackersCatapult = 0;
    GLOBAL._attackersFlinger = 0;
    GLOBAL._savedAttackersDeltaResources = {
      r1: new SecNum(0),
      r2: new SecNum(0),
      r3: new SecNum(0),
      r4: new SecNum(0)
    };
    GLOBAL._attackersDeltaResources = { dirty: false };

    GLOBAL._render = false;
    GLOBAL._timePlayed = 0;

    // Set resource names based on mode
    if (GLOBAL._loadmode === GLOBAL._mode) {
      GLOBAL._resourceNames = ['Twigs', 'Pebbles', 'Putty', 'Goo', 'Shiny', 'Time'];
    } else {
      GLOBAL._resourceNames = GLOBAL.iresourceNames;
    }
  }

  /**
   * Get resource frame name
   */
  static getResourceFrame(resource: string, isInferno: boolean = false): string {
    if (isInferno) {
      switch (resource) {
        case 'r1': return 'bone';
        case 'r2': return 'coal';
        case 'r3': return 'sulfur';
        case 'r4': return 'magma';
        case 'shiny': return 'shiny2';
        case 'time': return 'time2';
      }
    } else {
      switch (resource) {
        case 'r1': return 'twig';
        case 'r2': return 'pebble';
        case 'r3': return 'putty';
        case 'r4': return 'goo';
        case 'shiny': return 'shiny';
        case 'time': return 'time';
      }
    }
    return 'unknown';
  }

  /**
   * Get resource name
   */
  static getResourceName(resource: string, isInferno: boolean = false): string {
    const names = isInferno ? GLOBAL.iresourceNames : GLOBAL._resourceNames;
    switch (resource) {
      case 'r1': return KEYS.Get(names[0]) || names[0];
      case 'r2': return KEYS.Get(names[1]) || names[1];
      case 'r3': return KEYS.Get(names[2]) || names[2];
      case 'r4': return KEYS.Get(names[3]) || names[3];
      case 'shiny': return KEYS.Get(names[4]) || names[4];
      case 'time': return KEYS.Get(names[5]) || names[5];
      default: return '???';
    }
  }

  /**
   * Clear all building references
   */
  static Clear(): void {
    // Clear all building references when changing bases
    // This will be extended as we add building classes
  }

  /**
   * Show wait indicator
   */
  static WaitShow(message: string = ''): void {
    // Import PLEASEWAIT dynamically to avoid circular dependency
    import('@/ui/PleaseWait').then(({ PLEASEWAIT }) => {
      PLEASEWAIT.Show(KEYS.Get('wait_processing') || message);
    });
  }

  /**
   * Hide wait indicator
   */
  static WaitHide(): void {
    import('@/ui/PleaseWait').then(({ PLEASEWAIT }) => {
      PLEASEWAIT.Hide();
    });
  }

  /**
   * Show error message
   */
  static errorMessage(message: string = '', _errorType: number = 0): void {
    console.error('[ERROR]', message);
    
    // Create error message UI element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #ff5252;
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message || 'An error occurred';
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Show generic message
   */
  static Message(
    text: string,
    button1Text?: string,
    button1Callback?: () => void,
    button2Text?: string,
    button2Callback?: () => void
  ): void {
    // Create a simple message popup
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
      background-color: #2a3642;
      padding: 30px;
      border-radius: 10px;
      color: white;
      font-family: Arial, sans-serif;
      max-width: 400px;
      text-align: center;
    `;

    popup.innerHTML = `<p style="margin-bottom: 20px;">${text}</p>`;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';

    if (button1Text) {
      const btn1 = document.createElement('button');
      btn1.textContent = button1Text;
      btn1.style.cssText = `
        padding: 10px 20px;
        background-color: #4CAF50;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
      `;
      btn1.onclick = () => {
        overlay.remove();
        if (button1Callback) button1Callback();
      };
      buttonContainer.appendChild(btn1);
    }

    if (button2Text) {
      const btn2 = document.createElement('button');
      btn2.textContent = button2Text;
      btn2.style.cssText = `
        padding: 10px 20px;
        background-color: #666;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
      `;
      btn2.onclick = () => {
        overlay.remove();
        if (button2Callback) button2Callback();
      };
      buttonContainer.appendChild(btn2);
    }

    if (!button1Text && !button2Text) {
      const okBtn = document.createElement('button');
      okBtn.textContent = 'OK';
      okBtn.style.cssText = `
        padding: 10px 20px;
        background-color: #4CAF50;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
      `;
      okBtn.onclick = () => overlay.remove();
      buttonContainer.appendChild(okBtn);
    }

    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  /**
   * Format number with commas
   */
  static FormatNumber(num: number): string {
    return formatNumber(num);
  }

  /**
   * Convert seconds to time string
   */
  static ToTime(
    totalSeconds: number,
    includeDays: boolean = false,
    includeHours: boolean = true,
    includeMinutes: boolean = true,
    includeSeconds: boolean = false
  ): string {
    return toTime(totalSeconds, includeDays, includeHours, includeMinutes, includeSeconds);
  }

  /**
   * Double digit format
   */
  static dd(num: number): string {
    return doubleDigit(num);
  }

  /**
   * Get timestamp
   */
  static Timestamp(): number {
    return GLOBAL.t;
  }

  /**
   * Quick distance calculation
   */
  static QuickDistance(p1: Point, p2: Point): number {
    return quickDistance(p1, p2);
  }

  /**
   * Quick distance squared
   */
  static QuickDistanceSquared(p1: Point, p2: Point): number {
    return quickDistanceSquared(p1, p2);
  }

  /**
   * Get stat value
   */
  static StatGet(key: string): number {
    return typeof GLOBAL._otherStats[key] === 'number' ? GLOBAL._otherStats[key] as number : 0;
  }

  /**
   * Set stat value
   */
  static StatSet(key: string, value: number, save: boolean = true): void {
    GLOBAL._otherStats[key] = value;
    if (save) {
      // BASE.Save() will be called when implemented
    }
  }

  /**
   * Update AFK timer
   */
  static UpdateAFKTimer(): void {
    GLOBAL._afktimer.Set(GLOBAL.Timestamp());
  }

  /**
   * Set flags from server
   */
  static SetFlags(serverFlags: Flags): void {
    GLOBAL._flags = serverFlags;
  }

  /**
   * Refresh screen dimensions
   */
  static RefreshScreen(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    GLOBAL._SCREEN = {
      x: 0 - (width - GLOBAL._SCREENINIT.width) / 2,
      y: 0 - (height - GLOBAL._SCREENINIT.height) / 2,
      width: width,
      height: height
    };

    GLOBAL._SCREENCENTER = {
      x: GLOBAL._SCREEN.x + GLOBAL._SCREEN.width / 2,
      y: GLOBAL._SCREEN.y + GLOBAL._SCREEN.height / 2
    };

    GLOBAL._SCREENHUD = {
      x: GLOBAL._SCREEN.x,
      y: GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - 208
    };

    GLOBAL._SCREENHUDLEFT = {
      x: GLOBAL._SCREEN.x,
      y: GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - 208
    };
  }

  /**
   * Check if at home base
   */
  static isAtHome(): boolean {
    return GLOBAL.mode === e_BASE_MODE.BUILD;
  }

  /**
   * Check if at home or in outpost
   */
  static isAtHomeOrInOutpost(): boolean {
    return GLOBAL.mode === e_BASE_MODE.BUILD;
  }

  /**
   * Check if defending
   */
  static isDefending(): boolean {
    return GLOBAL.mode === e_BASE_MODE.BUILD || GLOBAL.mode === e_BASE_MODE.IBUILD;
  }

  /**
   * Get shiny cost from resource amount
   */
  static getShinyCostFromResourceAmt(amount: number): number {
    return Math.ceil(Math.pow(Math.sqrt(amount / 2), 0.75));
  }

  /**
   * Get game height
   */
  static GetGameHeight(): number {
    return window.innerHeight;
  }

  /**
   * Get stage width
   */
  static get StageWidth(): number {
    return window.innerWidth;
  }

  /**
   * Get stage height
   */
  static get StageHeight(): number {
    return window.innerHeight;
  }
}

// Re-export e_BASE_MODE for convenience
export { e_BASE_MODE as BaseMode };
