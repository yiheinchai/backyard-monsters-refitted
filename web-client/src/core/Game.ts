/**
 * GAME - Main game controller
 * Converted from ActionScript GAME.as
 * 
 * Handles game initialization, game loop, and coordination between systems
 */

import { GLOBAL } from './Global';
import { LOGIN } from './Login';
import { BASE } from './Base';
import { gameRenderer } from '../rendering/GameRenderer';
import { MAP } from '../rendering/Map';
import { BuildingManager } from '../game/BuildingManager';
import { EventEmitter } from './EventEmitter';
import { BaseMode } from '../types/game';

class GameManager extends EventEmitter {
  private static _instance: GameManager;
  
  private _isSmallSize: boolean = true;
  private _firstLoadComplete: boolean = false;
  private _gameLoopActive: boolean = false;
  private _lastTickTime: number = 0;
  private _tickInterval: number = 1000 / 40; // 40 FPS
  private _tickAccumulator: number = 0;

  // DOM elements
  private loadingScreen: HTMLElement | null = null;
  private loginScreen: HTMLElement | null = null;
  private loadingBar: HTMLElement | null = null;
  private loadingText: HTMLElement | null = null;
  private errorMessage: HTMLElement | null = null;

  private constructor() {
    super();
    GameManager._instance = this;
  }

  static get instance(): GameManager {
    if (!GameManager._instance) {
      new GameManager();
    }
    return GameManager._instance;
  }

  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    console.log('[GAME] Initializing...');
    
    // Get DOM elements
    this.loadingScreen = document.getElementById('loading-screen');
    this.loginScreen = document.getElementById('login-screen');
    this.loadingBar = document.getElementById('loading-bar');
    this.loadingText = document.getElementById('loading-text');
    this.errorMessage = document.getElementById('error-message');

    // Setup URLs
    this.setupUrls();

    // Setup event listeners
    this.setupEventListeners();

    // Update loading progress
    this.setLoadingProgress(10, 'Connecting to server...');

    // Initialize GLOBAL
    GLOBAL.on('initError', () => this.handleInitError());
    GLOBAL.on('initSuccess', () => this.handleInitSuccess());

    try {
      await GLOBAL.init();
    } catch (error) {
      console.error('Init error:', error);
      this.handleInitError();
    }
  }

  private setupUrls(): void {
    // Setup server URLs - using proxy configuration from Vite
    const serverUrl = '';
    const apiVersionSuffix = GLOBAL.apiVersionSuffix + '/';
    const cdnUrl = '';

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
  }

  private setupEventListeners(): void {
    // Login events
    LOGIN.on('showLoading', (...args: unknown[]) => {
      const message = args[0] as string;
      this.setLoadingProgress(50, message);
    });

    LOGIN.on('showLoginForm', () => {
      this.showLoginScreen();
    });

    LOGIN.on('loginSuccess', async (...args: unknown[]) => {
      const data = args[0] as { playerId: number; playerName: string };
      console.log('[GAME] Login successful:', data);
      this.setLoadingProgress(70, 'Loading game data...');
      await this.startGame();
    });

    LOGIN.on('loginError', (...args: unknown[]) => {
      const error = args[0] as string;
      this.showError(String(error));
      this.showLoginScreen();
    });

    LOGIN.on('registerError', (...args: unknown[]) => {
      const error = args[0] as string;
      this.showError(String(error));
      this.showLoginScreen();
    });

    // Base events
    BASE.on('loadStart', () => {
      this.setLoadingProgress(80, 'Loading base...');
    });

    BASE.on('loadComplete', () => {
      this.setLoadingProgress(100, 'Welcome!');
      setTimeout(() => {
        this.hideLoadingScreen();
        this._firstLoadComplete = true;
        this.emit('gameReady');
      }, 500);
    });

    BASE.on('loadError', (...args: unknown[]) => {
      const error = args[0] as string;
      this.showError('Failed to load base: ' + error);
    });

    // Setup login form buttons
    this.setupLoginForm();

    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  private setupLoginForm(): void {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        const email = emailInput?.value || '';
        const password = passwordInput?.value || '';
        
        if (!email || !password) {
          this.showError('Please enter email and password');
          return;
        }

        this.hideError();
        this.showLoadingScreen();
        LOGIN.loginWithCredentials(email, password);
      });
    }

    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        const email = emailInput?.value || '';
        const password = passwordInput?.value || '';
        
        if (!email || !password) {
          this.showError('Please enter email and password');
          return;
        }

        // For registration, extract username from email
        const username = email.split('@')[0].substring(0, 12);
        this.hideError();
        this.showLoadingScreen();
        LOGIN.register(username, email, password);
      });
    }

    // Enter key handler
    if (passwordInput) {
      passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          loginBtn?.click();
        }
      });
    }
  }

  private handleInitError(): void {
    console.error('[GAME] Init error:', GLOBAL.initError);
    this.showError(GLOBAL.initError || 'Failed to connect to server');
    this.showLoginScreen();
  }

  private async handleInitSuccess(): Promise<void> {
    console.log('[GAME] Init success');
    this.setLoadingProgress(30, 'Loading...');
    
    // Try to login
    await LOGIN.login();
  }

  private async startGame(): Promise<void> {
    console.log('[GAME] Starting game...');

    // Initialize renderer
    const container = document.getElementById('game-container');
    if (!container) {
      console.error('Game container not found');
      return;
    }

    await gameRenderer.init(container);

    // Initialize map
    await MAP.init('grass');

    // Initialize building manager
    await BuildingManager.init();

    // Setup GLOBAL
    GLOBAL.setup(BaseMode.BUILD);

    // Load base
    BASE.setup();
    await BASE.load();

    // Start game loop
    this.startGameLoop();
  }

  private startGameLoop(): void {
    if (this._gameLoopActive) return;
    
    this._gameLoopActive = true;
    this._lastTickTime = performance.now();

    // Use renderer's ticker for the fast loop
    gameRenderer.addTicker((ticker) => this.tickFast(ticker.deltaTime));

    // Separate slow tick timer (once per second)
    setInterval(() => this.tick(), 1000);

    console.log('[GAME] Game loop started');
  }

  /**
   * Fast tick - called every frame
   */
  private tickFast(deltaTime: number): void {
    if (GLOBAL._halt) return;

    // Update frame counter
    GLOBAL._frameNumber++;

    // Calculate FPS
    if (GLOBAL._frameNumber % 40 === 0) {
      GLOBAL._fps = Math.round(gameRenderer.fps);
      GLOBAL._FPStimestamp = performance.now();
    }

    // Emit tick event for game systems
    this.emit('tickFast', deltaTime);
  }

  /**
   * Slow tick - called once per second
   */
  private tick(): void {
    if (GLOBAL._halt || GLOBAL._catchup) return;

    GLOBAL.t++;
    GLOBAL._timePlayed++;

    // Update buildings
    BuildingManager.tick(1);

    // Check network connection periodically
    GLOBAL.connectionCounter++;
    if (GLOBAL.connectionCounter % 5 === 0) {
      GLOBAL.checkNetworkConnection();
    }

    // Emit tick event
    this.emit('tick', GLOBAL.t);
  }

  // UI Helper methods
  private showLoadingScreen(): void {
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove('hidden');
    }
    if (this.loginScreen) {
      this.loginScreen.classList.remove('visible');
    }
  }

  private hideLoadingScreen(): void {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
    }
  }

  private showLoginScreen(): void {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
    }
    if (this.loginScreen) {
      this.loginScreen.classList.add('visible');
    }
  }

  private setLoadingProgress(percent: number, text: string): void {
    if (this.loadingBar) {
      this.loadingBar.style.width = `${percent}%`;
    }
    if (this.loadingText) {
      this.loadingText.textContent = text;
    }
  }

  private showError(message: string): void {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.classList.add('visible');
    }
  }

  private hideError(): void {
    if (this.errorMessage) {
      this.errorMessage.classList.remove('visible');
    }
  }

  private handleResize(): void {
    GLOBAL.refreshScreen();
    this.emit('resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  /**
   * Check if game has loaded
   */
  get firstLoadComplete(): boolean {
    return this._firstLoadComplete;
  }
}

export const GAME = GameManager.instance;
