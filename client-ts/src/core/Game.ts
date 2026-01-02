/**
 * GAME - Main game entry point for the Backyard Monsters client
 * This is the TypeScript equivalent of GAME.as
 */

import { GLOBAL } from '@/core/Global';
import { LOGIN } from '@/core/Login';
import { KEYS } from '@/core/Keys';
import { Storage } from '@/utils';

/**
 * GAME class - the main entry point and controller for the game
 */
export class GAME {
  // Singleton instance
  private static _instance: GAME | null = null;

  // Game state
  static _isSmallSize: boolean = true;
  static _firstLoadComplete: boolean = false;

  // Shared object (localStorage equivalent)
  static sharedObj: {
    data: {
      token?: string;
      language?: string;
    };
  } = {
    data: {}
  };

  // Token from launcher
  static token: string = '';

  // Language setting
  static language: string = '';

  // Canvas element
  private canvas: HTMLCanvasElement | null = null;

  // Animation frame ID
  private animationFrameId: number = 0;

  // Game loop timestamp
  private lastTickTime: number = 0;
  private tickInterval: number = 1000; // 1 second tick

  /**
   * Private constructor for singleton
   */
  private constructor() {
    GAME._instance = this;
  }

  /**
   * Get singleton instance
   */
  static get instance(): GAME {
    if (!GAME._instance) {
      GAME._instance = new GAME();
    }
    return GAME._instance;
  }

  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    console.log('[GAME] Initializing...');

    // Load saved data from localStorage
    this.loadSharedData();

    // Setup canvas
    this.setupCanvas();

    // Setup URLs
    this.setupURLs();

    // Setup event listeners before init so we catch errors
    this.setupEventListeners();

    // Initialize global settings
    await GLOBAL.init();

    // Check for init errors
    if (GLOBAL.initError) {
      this.showInitError(GLOBAL.initError);
      return;
    }

    // Update loading progress
    this.updateLoadingProgress(30);

    // Start login process
    await LOGIN.Login();
  }

  /**
   * Load shared data from localStorage
   */
  private loadSharedData(): void {
    GAME.sharedObj.data.token = Storage.get<string>('bymr_token') || '';
    GAME.sharedObj.data.language = Storage.get<string>('bymr_language') || 'english';
    GAME.token = GAME.sharedObj.data.token || '';
    GAME.language = GAME.sharedObj.data.language || 'english';
  }

  /**
   * Set launcher variables
   */
  setLauncherVars(params: { token?: string; language?: string }): void {
    try {
      if (params?.language) {
        GAME.language = params.language;
        GAME.sharedObj.data.language = params.language;
        Storage.set('bymr_language', params.language);
      }

      if (params?.token) {
        GAME.token = params.token;
        GAME.sharedObj.data.token = params.token;
        Storage.set('bymr_token', params.token);
      }
    } catch (e) {
      console.error('[GAME] Error setting launcher vars:', e);
    }
  }

  /**
   * Setup game canvas
   */
  private setupCanvas(): void {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    
    if (this.canvas) {
      // Set canvas size
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      // Handle resize
      window.addEventListener('resize', () => {
        if (this.canvas) {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
          GLOBAL.RefreshScreen();
        }
      });
    }
  }

  /**
   * Setup game URLs based on server configuration
   */
  private setupURLs(): void {
    const serverUrl = GLOBAL.serverUrl;
    const apiVersionSuffix = GLOBAL.apiVersionSuffix + '/';
    const cdnUrl = GLOBAL.cdnUrl;

    GLOBAL._baseURL = serverUrl + 'base/';
    GLOBAL._apiURL = serverUrl + 'api/' + apiVersionSuffix;
    GLOBAL._infBaseURL = GLOBAL._apiURL + 'bm/base/';
    GLOBAL._statsURL = serverUrl + 'recordstats.php';
    GLOBAL._mapURL = serverUrl + 'worldmapv2/';
    GLOBAL._allianceURL = serverUrl + 'alliance/';
    GLOBAL.languageUrl = cdnUrl + 'gamestage/assets/';
    GLOBAL._storageURL = cdnUrl + 'assets/';
    GLOBAL._soundPathURL = cdnUrl + 'assets/sounds/';
    GLOBAL._gameURL = serverUrl;
    GLOBAL._countryCode = 'us';
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle window focus for mouse wheel
    window.addEventListener('mouseenter', () => this.disableWindowScroll());
    window.addEventListener('mouseleave', () => this.enableWindowScroll());

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('[GAME] Uncaught error:', event.error);
      this.handleUncaughtError(event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[GAME] Unhandled rejection:', event.reason);
    });

    // Listen for init errors
    GLOBAL.eventDispatcher.addEventListener('initError', () => {
      this.showInitError(GLOBAL.initError);
    });

    // Listen for language loaded
    GLOBAL.eventDispatcher.addEventListener(KEYS.LANGUAGE_FILE_LOADED, () => {
      this.updateLoadingProgress(50);
    });
  }

  /**
   * Disable window scroll (when mouse is over game)
   */
  private disableWindowScroll(): void {
    document.body.style.overflow = 'hidden';
  }

  /**
   * Enable window scroll
   */
  private enableWindowScroll(): void {
    document.body.style.overflow = '';
  }

  /**
   * Handle uncaught errors
   */
  private handleUncaughtError(error: Error): void {
    const message = error?.message || 'Unknown error';
    console.error('[GAME] UncaughtError:', message, error?.stack);
  }

  /**
   * Update loading progress bar
   */
  updateLoadingProgress(percent: number): void {
    const loadingBar = document.getElementById('loading-bar');
    if (loadingBar) {
      loadingBar.style.width = `${percent}%`;
    }
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
    GAME._firstLoadComplete = true;
  }

  /**
   * Show init error
   */
  private showInitError(message: string): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="error-container" style="text-align: center; color: white; font-family: Arial, sans-serif;">
          <h2 style="color: #ff5252;">Error</h2>
          <p style="margin: 20px 0;">${message}</p>
          ${GLOBAL.versionMismatch ? '<p>Please refresh the page to get the latest version.</p>' : ''}
          <button onclick="window.location.reload()" style="
            padding: 10px 20px;
            background-color: #4CAF50;
            border: none;
            border-radius: 5px;
            color: white;
            cursor: pointer;
            font-size: 16px;
          ">Retry</button>
        </div>
      `;
    }
  }

  /**
   * Start the game loop
   */
  startGameLoop(): void {
    console.log('[GAME] Starting game loop');
    this.lastTickTime = performance.now();
    this.gameLoop(this.lastTickTime);
  }

  /**
   * Main game loop
   */
  private gameLoop(timestamp: number): void {
    // Calculate delta time
    const deltaTime = timestamp - this.lastTickTime;

    // Tick every second
    if (deltaTime >= this.tickInterval) {
      this.lastTickTime = timestamp;
      GLOBAL.t++;
      
      // Call tick function
      this.tick();
    }

    // Call fast tick every frame
    this.tickFast();

    // Request next frame
    this.animationFrameId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  /**
   * Tick function (called every second)
   */
  private tick(): void {
    if (GLOBAL._halt) return;

    // Check network connection periodically
    GLOBAL.connectionCounter++;
    if (GLOBAL.connectionCounter % 5 === 0) {
      GLOBAL.checkNetworkConnection();
    }

    // Update game state
    // This will be extended as more systems are implemented
  }

  /**
   * Fast tick function (called every frame)
   */
  private tickFast(): void {
    if (GLOBAL._halt) return;

    // Update FPS counter
    GLOBAL._FPSframecount++;
    
    // Calculate FPS every 40 frames
    if (GLOBAL._FPSframecount % 40 === 0) {
      const now = performance.now();
      if (GLOBAL._FPStimestamp > 0) {
        GLOBAL._fps = Math.round(1000 / ((now - GLOBAL._FPStimestamp) / 40));
      }
      GLOBAL._FPStimestamp = now;
    }
  }

  /**
   * Stop the game loop
   */
  stopGameLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  /**
   * Get canvas context
   */
  getContext(): CanvasRenderingContext2D | null {
    return this.canvas?.getContext('2d') || null;
  }

  /**
   * Get canvas element
   */
  getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Cleanup and destroy
   */
  destroy(): void {
    this.stopGameLoop();
    GAME._instance = null;
  }
}

export default GAME;
