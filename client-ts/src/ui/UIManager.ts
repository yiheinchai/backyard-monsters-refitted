/**
 * UIManager - Manages game UI elements
 * Ported from ActionScript UI2.as and related classes
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { CONFIG, GAME_EVENTS } from '../core/config';
import { game } from '../core/Game';
import { globalEvents } from '../utils/EventEmitter';
import { t } from '../core/Localization';
import { Base } from '../game/base/Base';

export class UIManager {
  // Layer references
  private uiLayer: Container;
  private windowsLayer: Container;
  
  // UI Containers
  private topBar!: Container;
  private bottomBar!: Container;
  private resourceBar!: Container;
  
  // Popups stack
  private popups: Container[] = [];
  
  // Reference to base (unused for now)
  // private base?: Base;
  
  // UI State
  private isInitialized: boolean = false;
  
  constructor(uiLayer: Container, windowsLayer: Container) {
    this.uiLayer = uiLayer;
    this.windowsLayer = windowsLayer;
  }
  
  /**
   * Setup UI with base reference
   */
  setup(_base: Base): void {
    // Create main UI elements
    this.createTopBar();
    this.createResourceBar();
    this.createBottomBar();
    
    // Listen for events
    this.setupEventListeners();
    
    this.isInitialized = true;
  }
  
  /**
   * Create the top bar (zoom, fullscreen, etc.)
   */
  private createTopBar(): void {
    this.topBar = new Container();
    this.topBar.label = 'topBar';
    
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, screenWidth, 40);
    bg.fill({ color: 0x222222, alpha: 0.8 });
    this.topBar.addChild(bg);
    
    // Player name
    const nameStyle = new TextStyle({
      fontSize: 16,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });
    const playerName = new Text({
      text: game.state.playerName || 'Player',
      style: nameStyle,
    });
    playerName.position.set(10, 10);
    this.topBar.addChild(playerName);
    
    // Zoom buttons
    this.createZoomButtons();
    
    this.uiLayer.addChild(this.topBar);
  }
  
  /**
   * Create zoom control buttons
   */
  private createZoomButtons(): void {
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    
    // Zoom in button
    const zoomIn = this.createButton('+', () => game.mapRenderer?.zoom(0.1));
    zoomIn.position.set(screenWidth - 80, 5);
    this.topBar.addChild(zoomIn);
    
    // Zoom out button
    const zoomOut = this.createButton('-', () => game.mapRenderer?.zoom(-0.1));
    zoomOut.position.set(screenWidth - 45, 5);
    this.topBar.addChild(zoomOut);
  }
  
  /**
   * Create the resource bar
   */
  private createResourceBar(): void {
    this.resourceBar = new Container();
    this.resourceBar.label = 'resourceBar';
    
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, screenWidth, 35);
    bg.fill({ color: 0x1a1a1a, alpha: 0.9 });
    this.resourceBar.position.set(0, 40);
    this.resourceBar.addChild(bg);
    
    // Resource displays
    const resources = ['r1', 'r2', 'r3', 'r4'];
    const colors = [0x8B4513, 0x808080, 0xDDA0DD, 0x00FF00];
    // Resource names for display (unused for now, shown as icons)
    // const names = [t('r_twigs'), t('r_pebbles'), t('r_putty'), t('r_goo')];
    
    let xPos = 10;
    resources.forEach((res, i) => {
      // Icon
      const icon = new Graphics();
      icon.circle(0, 0, 10);
      icon.fill(colors[i]);
      icon.position.set(xPos, 17);
      this.resourceBar.addChild(icon);
      
      // Value text
      const valueStyle = new TextStyle({
        fontSize: 14,
        fill: 0xFFFFFF,
      });
      const value = new Text({
        text: '0',
        style: valueStyle,
      });
      value.label = `resource_${res}`;
      value.position.set(xPos + 15, 10);
      this.resourceBar.addChild(value);
      
      xPos += 150;
    });
    
    // Shiny (premium currency)
    const shinyIcon = new Graphics();
    shinyIcon.circle(0, 0, 10);
    shinyIcon.fill(0xFFD700);
    shinyIcon.position.set(xPos, 17);
    this.resourceBar.addChild(shinyIcon);
    
    const shinyValue = new Text({
      text: String(game.state.credits || 0),
      style: new TextStyle({ fontSize: 14, fill: 0xFFD700 }),
    });
    shinyValue.label = 'resource_shiny';
    shinyValue.position.set(xPos + 15, 10);
    this.resourceBar.addChild(shinyValue);
    
    this.uiLayer.addChild(this.resourceBar);
    
    // Initial update
    this.updateResourceDisplay();
  }
  
  /**
   * Create the bottom bar (building menu, etc.)
   */
  private createBottomBar(): void {
    this.bottomBar = new Container();
    this.bottomBar.label = 'bottomBar';
    
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, screenWidth, 120);
    bg.fill({ color: 0x222222, alpha: 0.9 });
    this.bottomBar.position.set(0, screenHeight - 120);
    this.bottomBar.addChild(bg);
    
    // Building categories
    const categories = ['Resources', 'Housing', 'Defense', 'Decorations'];
    let xPos = 20;
    
    categories.forEach((cat) => {
      const btn = this.createButton(cat, () => this.showBuildingCategory(cat));
      btn.position.set(xPos, 10);
      this.bottomBar.addChild(btn);
      xPos += 120;
    });
    
    this.uiLayer.addChild(this.bottomBar);
  }
  
  /**
   * Create a simple button
   */
  private createButton(label: string, onClick: () => void): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    // Background
    const bg = new Graphics();
    bg.roundRect(0, 0, 100, 30, 5);
    bg.fill(0x444444);
    bg.stroke({ width: 1, color: 0x666666 });
    container.addChild(bg);
    
    // Label
    const text = new Text({
      text: label,
      style: new TextStyle({
        fontSize: 12,
        fill: 0xFFFFFF,
      }),
    });
    text.anchor.set(0.5, 0.5);
    text.position.set(50, 15);
    container.addChild(text);
    
    // Hover effect
    container.on('pointerover', () => {
      bg.tint = 0xCCCCCC;
    });
    container.on('pointerout', () => {
      bg.tint = 0xFFFFFF;
    });
    
    container.on('pointerdown', () => {
      onClick();
      game.updateActivity();
    });
    
    return container;
  }
  
  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    globalEvents.on(GAME_EVENTS.RESOURCES_CHANGED, () => {
      this.updateResourceDisplay();
    });
    
    globalEvents.on(GAME_EVENTS.BUILDING_SELECTED, (building) => {
      this.showBuildingInfo(building);
    });
    
    globalEvents.on(GAME_EVENTS.BUILDING_DESELECTED, () => {
      this.hideBuildingInfo();
    });
  }
  
  /**
   * Update resource display
   */
  private updateResourceDisplay(): void {
    if (!this.resourceBar) return;
    
    const resources = ['r1', 'r2', 'r3', 'r4'];
    resources.forEach((res) => {
      const textEl = this.resourceBar.getChildByLabel(`resource_${res}`) as Text;
      if (textEl && game.state.resources[res as keyof typeof game.state.resources]) {
        const value = game.state.resources[res as keyof typeof game.state.resources].Get();
        textEl.text = this.formatNumber(value);
      }
    });
    
    // Update shiny
    const shinyEl = this.resourceBar.getChildByLabel('resource_shiny') as Text;
    if (shinyEl) {
      shinyEl.text = this.formatNumber(game.state.credits);
    }
  }
  
  /**
   * Format number with commas
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Show building category menu
   */
  private showBuildingCategory(category: string): void {
    console.log(`Show building category: ${category}`);
    // TODO: Implement building category popup
  }
  
  /**
   * Show building info panel
   */
  private showBuildingInfo(building: unknown): void {
    console.log('Show building info:', building);
    // TODO: Implement building info popup
  }
  
  /**
   * Hide building info panel
   */
  private hideBuildingInfo(): void {
    // TODO: Hide building info popup
  }
  
  /**
   * Show a popup
   */
  showPopup(popup: Container): void {
    this.popups.push(popup);
    this.windowsLayer.addChild(popup);
    globalEvents.emit(GAME_EVENTS.POPUP_OPENED, popup);
  }
  
  /**
   * Close the top popup
   */
  closeTopPopup(): void {
    const popup = this.popups.pop();
    if (popup) {
      popup.destroy({ children: true });
      globalEvents.emit(GAME_EVENTS.POPUP_CLOSED, popup);
    }
  }
  
  /**
   * Close all popups
   */
  closeAllPopups(): void {
    while (this.popups.length > 0) {
      this.closeTopPopup();
    }
  }
  
  /**
   * Show connection lost popup
   */
  showConnectionLostPopup(): void {
    const popup = this.createMessagePopup(
      t('error_connection'),
      'Connection Lost',
      () => this.closeTopPopup()
    );
    this.showPopup(popup);
  }
  
  /**
   * Show AFK warning
   */
  showAFKWarning(): void {
    // Only show once
    const existing = this.popups.find(p => p.label === 'afkWarning');
    if (existing) return;
    
    const popup = this.createMessagePopup(
      'Are you still there? Move your mouse to continue playing.',
      'AFK Warning',
      () => this.closeTopPopup()
    );
    popup.label = 'afkWarning';
    this.showPopup(popup);
  }
  
  /**
   * Show timeout popup
   */
  showTimeoutPopup(): void {
    const popup = this.createMessagePopup(
      'You have been logged out due to inactivity.',
      'Session Timeout',
      () => window.location.reload()
    );
    this.showPopup(popup);
  }
  
  /**
   * Create a simple message popup
   */
  private createMessagePopup(message: string, title: string, onClose: () => void): Container {
    const popup = new Container();
    popup.label = 'messagePopup';
    
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    
    // Blocker background
    const blocker = new Graphics();
    blocker.rect(0, 0, screenWidth, screenHeight);
    blocker.fill({ color: 0x000000, alpha: 0.5 });
    blocker.eventMode = 'static';
    popup.addChild(blocker);
    
    // Popup background
    const bg = new Graphics();
    const popupWidth = 400;
    const popupHeight = 200;
    bg.roundRect(0, 0, popupWidth, popupHeight, 10);
    bg.fill(0x2a2a2a);
    bg.stroke({ width: 2, color: 0xff6b35 });
    bg.position.set((screenWidth - popupWidth) / 2, (screenHeight - popupHeight) / 2);
    popup.addChild(bg);
    
    // Title
    const titleText = new Text({
      text: title,
      style: new TextStyle({
        fontSize: 20,
        fill: 0xff6b35,
        fontWeight: 'bold',
      }),
    });
    titleText.anchor.set(0.5, 0);
    titleText.position.set(screenWidth / 2, (screenHeight - popupHeight) / 2 + 20);
    popup.addChild(titleText);
    
    // Message
    const messageText = new Text({
      text: message,
      style: new TextStyle({
        fontSize: 14,
        fill: 0xFFFFFF,
        wordWrap: true,
        wordWrapWidth: popupWidth - 40,
        align: 'center',
      }),
    });
    messageText.anchor.set(0.5, 0);
    messageText.position.set(screenWidth / 2, (screenHeight - popupHeight) / 2 + 60);
    popup.addChild(messageText);
    
    // Close button
    const closeBtn = this.createButton('OK', onClose);
    closeBtn.position.set((screenWidth - 100) / 2, (screenHeight + popupHeight) / 2 - 50);
    popup.addChild(closeBtn);
    
    return popup;
  }
  
  /**
   * Game tick update
   */
  tick(_delta: number): void {
    // Update resource display if needed
    // (Could throttle this for performance)
  }
  
  /**
   * Handle window resize
   */
  onResize(width: number, height: number): void {
    if (!this.isInitialized) return;
    
    // Reposition top bar
    if (this.topBar) {
      const bg = this.topBar.getChildAt(0) as Graphics;
      if (bg) {
        bg.clear();
        bg.rect(0, 0, width, 40);
        bg.fill({ color: 0x222222, alpha: 0.8 });
      }
    }
    
    // Reposition resource bar
    if (this.resourceBar) {
      const bg = this.resourceBar.getChildAt(0) as Graphics;
      if (bg) {
        bg.clear();
        bg.rect(0, 0, width, 35);
        bg.fill({ color: 0x1a1a1a, alpha: 0.9 });
      }
    }
    
    // Reposition bottom bar
    if (this.bottomBar) {
      this.bottomBar.position.set(0, height - 120);
      const bg = this.bottomBar.getChildAt(0) as Graphics;
      if (bg) {
        bg.clear();
        bg.rect(0, 0, width, 120);
        bg.fill({ color: 0x222222, alpha: 0.9 });
      }
    }
  }
}
