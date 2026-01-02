/**
 * Main Game Application
 * Ported from ActionScript GAME.as
 * This is the entry point and main controller for the game
 */

import { Application, Container } from 'pixi.js';
import { CONFIG, GAME_EVENTS, BaseMode, YardType } from './config';
import { globalEvents } from '../utils/EventEmitter';
import { network, LoginResponse } from '../network/NetworkManager';
import { assets } from '../assets/AssetManager';
import { localization } from './Localization';
import { GameState } from './GameState';
import { MapRenderer } from '../game/map/MapRenderer';
import { UIManager } from '../ui/UIManager';
import { SoundManager } from '../audio/SoundManager';
import { Base } from '../game/base/Base';

export class Game {
  private static instance: Game;
  
  // PixiJS Application
  public app: Application;
  
  // Layer containers (matching original Flash layers)
  public layerMap!: Container;
  public layerUI!: Container;
  public layerWindows!: Container;
  public layerMessages!: Container;
  public layerTop!: Container;
  
  // Game state
  public state: GameState;
  
  // Managers
  public mapRenderer!: MapRenderer;
  public uiManager!: UIManager;
  public soundManager: SoundManager;
  public base!: Base;
  
  // Flags
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private tickCount: number = 0;
  private connectionCheckCounter: number = 0;
  
  private constructor() {
    this.app = new Application();
    this.state = new GameState();
    this.soundManager = SoundManager.getInstance();
  }
  
  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
  
  /**
   * Initialize the game
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    this.updateLoadingStatus('Initializing game engine...', 5);
    
    try {
      // Initialize PixiJS Application
      await this.app.init({
        width: CONFIG.SCREEN_WIDTH,
        height: CONFIG.SCREEN_HEIGHT,
        backgroundColor: 0x1D232A,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
      });
      
      // Add canvas to the DOM
      const container = document.getElementById('game-container');
      if (container) {
        container.appendChild(this.app.canvas);
      }
      
      this.updateLoadingStatus('Setting up layers...', 10);
      
      // Create layer hierarchy (matching Flash layers)
      this.setupLayers();
      
      this.updateLoadingStatus('Connecting to server...', 15);
      
      // Initialize connection to server
      const initResponse = await network.init();
      if (initResponse.error) {
        throw new Error(String(initResponse.error));
      }
      
      // Store debug mode flag if present
      if (initResponse.debugMode) {
        this.state.debugMode = true;
      }
      
      this.updateLoadingStatus('Loading language files...', 25);
      
      // Setup localization
      await localization.loadSupportedLanguages();
      await localization.setup();
      
      this.updateLoadingStatus('Loading assets...', 35);
      
      // Initialize and load assets
      await assets.init();
      await assets.loadEssentialAssets((progress) => {
        const loadProgress = 35 + progress * 40;
        this.updateLoadingStatus(`Loading assets... ${Math.floor(progress * 100)}%`, loadProgress);
      });
      
      this.updateLoadingStatus('Setting up game systems...', 80);
      
      // Initialize game systems
      this.setupGameSystems();
      
      // Setup resize handler
      this.setupResizeHandler();
      
      // Setup keyboard handlers
      this.setupInputHandlers();
      
      this.isInitialized = true;
      
      this.updateLoadingStatus('Ready!', 100);
      
      // Check for stored token
      const token = network.getToken();
      if (token) {
        this.updateLoadingStatus('Logging in...', 100);
        await this.attemptAutoLogin();
      } else {
        this.showLoginScreen();
      }
      
      globalEvents.emit(GAME_EVENTS.INIT_COMPLETE);
      
    } catch (error) {
      console.error('Game initialization failed:', error);
      globalEvents.emit(GAME_EVENTS.INIT_ERROR, error);
      this.showError(`Failed to initialize: ${error}`);
    }
  }
  
  /**
   * Setup the layer hierarchy
   */
  private setupLayers(): void {
    // Create layers in order (background to foreground)
    this.layerMap = new Container();
    this.layerMap.label = 'layerMap';
    this.layerMap.eventMode = 'none';
    
    this.layerUI = new Container();
    this.layerUI.label = 'layerUI';
    this.layerUI.eventMode = 'none';
    
    this.layerWindows = new Container();
    this.layerWindows.label = 'layerWindows';
    this.layerWindows.eventMode = 'none';
    
    this.layerMessages = new Container();
    this.layerMessages.label = 'layerMessages';
    this.layerMessages.eventMode = 'none';
    
    this.layerTop = new Container();
    this.layerTop.label = 'layerTop';
    this.layerTop.eventMode = 'none';
    
    // Add layers to stage
    this.app.stage.addChild(this.layerMap);
    this.app.stage.addChild(this.layerUI);
    this.app.stage.addChild(this.layerWindows);
    this.app.stage.addChild(this.layerMessages);
    this.app.stage.addChild(this.layerTop);
  }
  
  /**
   * Setup game systems (map, UI, etc.)
   */
  private setupGameSystems(): void {
    // Initialize map renderer
    this.mapRenderer = new MapRenderer(this.layerMap);
    
    // Initialize UI manager
    this.uiManager = new UIManager(this.layerUI, this.layerWindows);
    
    // Initialize base manager
    this.base = new Base();
  }
  
  /**
   * Setup window resize handler
   */
  private setupResizeHandler(): void {
    const resize = () => {
      const container = document.getElementById('game-container');
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Resize the renderer
      this.app.renderer.resize(width, height);
      
      // Update screen state
      this.state.screenWidth = width;
      this.state.screenHeight = height;
      
      // Notify systems of resize
      this.mapRenderer?.onResize(width, height);
      this.uiManager?.onResize(width, height);
    };
    
    window.addEventListener('resize', resize);
    resize(); // Initial resize
  }
  
  /**
   * Setup input handlers
   */
  private setupInputHandlers(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    
    // Prevent context menu on game canvas
    this.app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  
  private onKeyDown(e: KeyboardEvent): void {
    // Handle keyboard shortcuts
    switch (e.key) {
      case 'Escape':
        this.uiManager?.closeTopPopup();
        break;
      case 'm':
      case 'M':
        if (this.state.mode === BaseMode.BUILD) {
          this.openMapRoom();
        }
        break;
    }
  }
  
  private onKeyUp(_e: KeyboardEvent): void {
    // Handle key up events
  }
  
  /**
   * Attempt auto-login with stored token
   */
  private async attemptAutoLogin(): Promise<void> {
    try {
      // Get new map info first
      await network.getNewMap();
      
      // Then login
      const loginResponse = await network.login('', '');
      
      if (loginResponse.error === 0 && loginResponse.userid) {
        await this.onLoginSuccess(loginResponse);
      } else {
        // Token invalid, show login screen
        network.clearToken();
        this.showLoginScreen();
      }
    } catch {
      network.clearToken();
      this.showLoginScreen();
    }
  }
  
  /**
   * Show the login screen
   */
  showLoginScreen(): void {
    this.hideLoadingScreen();
    
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.classList.add('visible');
    }
    
    this.setupLoginHandlers();
  }
  
  /**
   * Setup login form handlers
   */
  private setupLoginHandlers(): void {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const registerForm = document.getElementById('register-form') as HTMLFormElement;
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        await this.handleLogin(loginForm);
      };
    }
    
    if (registerForm) {
      registerForm.onsubmit = async (e) => {
        e.preventDefault();
        await this.handleRegister(registerForm);
      };
    }
    
    if (showRegister) {
      showRegister.onclick = () => {
        loginForm!.style.display = 'none';
        registerForm!.style.display = 'block';
      };
    }
    
    if (showLogin) {
      showLogin.onclick = () => {
        registerForm!.style.display = 'none';
        loginForm!.style.display = 'block';
      };
    }
  }
  
  /**
   * Handle login form submission
   */
  private async handleLogin(form: HTMLFormElement): Promise<void> {
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const errorEl = document.getElementById('login-error');
    
    try {
      // Get new map info
      await network.getNewMap();
      
      // Login
      const response = await network.login(email, password);
      
      if (response.error === 0 && response.userid) {
        if (response.token) {
          network.setToken(response.token);
        }
        await this.onLoginSuccess(response);
      } else {
        if (errorEl) {
          errorEl.textContent = String(response.error) || 'Login failed';
        }
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = 'Connection failed. Please try again.';
      }
    }
  }
  
  /**
   * Handle register form submission
   */
  private async handleRegister(form: HTMLFormElement): Promise<void> {
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const errorEl = document.getElementById('register-error');
    
    try {
      const response = await network.register(username, email, password);
      
      if (response.error === 0 && response.userid) {
        if (response.token) {
          network.setToken(response.token);
        }
        await this.onLoginSuccess(response);
      } else {
        if (errorEl) {
          errorEl.textContent = String(response.error) || 'Registration failed';
        }
      }
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = 'Connection failed. Please try again.';
      }
    }
  }
  
  /**
   * Handle successful login
   */
  private async onLoginSuccess(response: LoginResponse): Promise<void> {
    // Hide login screen
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.classList.remove('visible');
    }
    
    // Store player data
    this.state.playerId = response.userid;
    this.state.playerName = response.username;
    this.state.credits = response.credits || 0;
    this.state.sessionCount = response.sessioncount;
    
    // Set flags from server
    if (response.stats?.inferno) {
      this.state.hasInferno = response.stats.inferno > 0;
    }
    
    globalEvents.emit(GAME_EVENTS.LOGIN_SUCCESS, response);
    
    // Start the game
    await this.startGame();
  }
  
  /**
   * Start the game after login
   */
  async startGame(): Promise<void> {
    this.showLoadingScreen();
    this.updateLoadingStatus('Loading your base...', 0);
    
    try {
      // Load the player's base
      await this.loadBase();
      
      // Start game loop
      this.startGameLoop();
      
      this.hideLoadingScreen();
      
      globalEvents.emit(GAME_EVENTS.BASE_LOADED);
      
    } catch (error) {
      console.error('Failed to start game:', error);
      this.showError(`Failed to load base: ${error}`);
    }
  }
  
  /**
   * Load the player's base
   */
  private async loadBase(): Promise<void> {
    this.updateLoadingStatus('Loading base data...', 20);
    
    const baseData = await network.loadBase();
    
    if (baseData.error) {
      throw new Error(String(baseData.error));
    }
    
    this.updateLoadingStatus('Building base...', 60);
    
    // Initialize base with data
    await this.base.loadFromData(baseData);
    
    // Setup map renderer with base
    this.updateLoadingStatus('Rendering map...', 80);
    await this.mapRenderer.setup(this.base);
    
    // Initialize UI
    this.updateLoadingStatus('Setting up UI...', 90);
    this.uiManager.setup(this.base);
    
    // Set game mode
    this.state.mode = BaseMode.BUILD;
    this.state.yardType = baseData.type as YardType || YardType.MAIN_YARD;
    
    this.updateLoadingStatus('Ready!', 100);
  }
  
  /**
   * Start the main game loop
   */
  private startGameLoop(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // Use PixiJS ticker for game loop
    this.app.ticker.add(() => this.tick());
    this.app.ticker.maxFPS = CONFIG.TARGET_FPS;
  }
  
  /**
   * Stop the game loop
   */
  stopGameLoop(): void {
    this.isRunning = false;
    this.app.ticker.stop();
  }
  
  /**
   * Main game tick (called every frame)
   */
  private tick(): void {
    if (!this.isRunning || this.state.halted) {
      return;
    }
    
    const delta = this.app.ticker.deltaTime;
    
    // Update game time
    this.tickCount++;
    this.state.frameNumber++;
    
    // Connection check (every 5 ticks like original)
    this.connectionCheckCounter++;
    if (this.connectionCheckCounter >= CONFIG.CONNECTION_CHECK_INTERVAL) {
      this.connectionCheckCounter = 0;
      this.checkConnection();
    }
    
    // Update game systems
    this.base?.tick(delta);
    this.mapRenderer?.tick(delta);
    this.uiManager?.tick(delta);
    
    // Check for AFK
    this.checkAFK();
  }
  
  /**
   * Check server connection
   */
  private async checkConnection(): Promise<void> {
    const isConnected = await network.checkConnection();
    if (!isConnected && this.isRunning) {
      this.state.connectionLost = true;
      this.uiManager?.showConnectionLostPopup();
    } else {
      this.state.connectionLost = false;
    }
  }
  
  /**
   * Check for AFK timeout
   */
  private checkAFK(): void {
    const timeSinceActivity = this.state.frameNumber - this.state.lastActivityFrame;
    
    if (timeSinceActivity >= CONFIG.AFK_TIMEOUT * CONFIG.TARGET_FPS) {
      this.uiManager?.showTimeoutPopup();
    } else if (timeSinceActivity >= CONFIG.AFK_WARNING_TIME * CONFIG.TARGET_FPS) {
      this.uiManager?.showAFKWarning();
    }
  }
  
  /**
   * Update activity timer (call on user interaction)
   */
  updateActivity(): void {
    this.state.lastActivityFrame = this.state.frameNumber;
  }
  
  /**
   * Open the map room
   */
  openMapRoom(): void {
    // TODO: Implement map room
    console.log('Opening map room...');
  }
  
  // === UI Helper Methods ===
  
  private showLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }
  
  private hideLoadingScreen(): void {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }
  
  private updateLoadingStatus(message: string, progress: number): void {
    const statusEl = document.getElementById('loading-status');
    const barEl = document.getElementById('loading-bar');
    
    if (statusEl) {
      statusEl.textContent = message;
    }
    if (barEl) {
      barEl.style.width = `${progress}%`;
    }
  }
  
  private showError(message: string): void {
    this.hideLoadingScreen();
    
    const loginScreen = document.getElementById('login-screen');
    if (loginScreen) {
      loginScreen.classList.add('visible');
    }
    
    const errorEl = document.getElementById('login-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }
}

// Export singleton
export const game = Game.getInstance();
