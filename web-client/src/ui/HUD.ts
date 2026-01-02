/**
 * HUD - Heads Up Display for game UI
 * Shows resources, player info, and action buttons
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { GLOBAL } from '../core/Global';
import { BASE } from '../core/Base';
import { LOGIN } from '../core/Login';
import { EventEmitter } from '../core/EventEmitter';

export class HUD extends EventEmitter {
  private container: Container;
  private topBar: Container;
  private bottomBar: Container;
  
  // Resource displays
  private r1Text: Text | null = null;
  private r2Text: Text | null = null;
  private r3Text: Text | null = null;
  private r4Text: Text | null = null;
  private creditsText: Text | null = null;
  
  // Player info
  private playerNameText: Text | null = null;
  
  private initialized = false;

  constructor() {
    super();
    this.container = new Container();
    this.topBar = new Container();
    this.bottomBar = new Container();
  }

  /**
   * Initialize the HUD
   */
  init(stage: Container): void {
    if (this.initialized) return;

    // Add main container to stage
    stage.addChild(this.container);

    // Create top bar (resources)
    this.createTopBar();

    // Create bottom bar (action buttons)
    this.createBottomBar();

    // Position HUD elements
    this.resize();

    // Listen for resource changes
    BASE.on('resourceChanged', () => this.updateResources());

    this.initialized = true;
    console.log('[HUD] Initialized');
  }

  /**
   * Create the top resource bar
   */
  private createTopBar(): void {
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 600, 50);
    bg.fill({ color: 0x1a1a2e, alpha: 0.9 });
    bg.stroke({ color: 0x4a90a4, width: 2 });
    this.topBar.addChild(bg);

    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });

    const labelStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0x8b8b9e,
    });

    // Player name
    this.playerNameText = new Text({
      text: LOGIN._playerName || 'Player',
      style: textStyle,
    });
    this.playerNameText.x = 15;
    this.playerNameText.y = 8;
    this.topBar.addChild(this.playerNameText);

    // Resources - positioned horizontally
    const resourceX = 150;
    const spacing = 100;

    // Twigs (r1)
    const r1Label = new Text({ text: '🌿 Twigs', style: labelStyle });
    r1Label.x = resourceX;
    r1Label.y = 5;
    this.topBar.addChild(r1Label);

    this.r1Text = new Text({ text: '0', style: textStyle });
    this.r1Text.x = resourceX;
    this.r1Text.y = 20;
    this.topBar.addChild(this.r1Text);

    // Pebbles (r2)
    const r2Label = new Text({ text: '🪨 Pebbles', style: labelStyle });
    r2Label.x = resourceX + spacing;
    r2Label.y = 5;
    this.topBar.addChild(r2Label);

    this.r2Text = new Text({ text: '0', style: textStyle });
    this.r2Text.x = resourceX + spacing;
    this.r2Text.y = 20;
    this.topBar.addChild(this.r2Text);

    // Putty (r3)
    const r3Label = new Text({ text: '🟤 Putty', style: labelStyle });
    r3Label.x = resourceX + spacing * 2;
    r3Label.y = 5;
    this.topBar.addChild(r3Label);

    this.r3Text = new Text({ text: '0', style: textStyle });
    this.r3Text.x = resourceX + spacing * 2;
    this.r3Text.y = 20;
    this.topBar.addChild(this.r3Text);

    // Goo (r4)
    const r4Label = new Text({ text: '🟢 Goo', style: labelStyle });
    r4Label.x = resourceX + spacing * 3;
    r4Label.y = 5;
    this.topBar.addChild(r4Label);

    this.r4Text = new Text({ text: '0', style: textStyle });
    this.r4Text.x = resourceX + spacing * 3;
    this.r4Text.y = 20;
    this.topBar.addChild(this.r4Text);

    // Credits/Shiny
    const creditsLabel = new Text({ text: '💎 Shiny', style: labelStyle });
    creditsLabel.x = resourceX + spacing * 4;
    creditsLabel.y = 5;
    this.topBar.addChild(creditsLabel);

    this.creditsText = new Text({ text: '0', style: textStyle });
    this.creditsText.x = resourceX + spacing * 4;
    this.creditsText.y = 20;
    this.topBar.addChild(this.creditsText);

    this.container.addChild(this.topBar);
    
    // Update initial values
    this.updateResources();
  }

  /**
   * Create the bottom action bar
   */
  private createBottomBar(): void {
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 300, 60);
    bg.fill({ color: 0x1a1a2e, alpha: 0.9 });
    bg.stroke({ color: 0x4a90a4, width: 2 });
    this.bottomBar.addChild(bg);

    // Build button
    const buildButton = this.createButton('🏗️ Build', 10, 10, () => {
      this.emit('buildMenuOpen');
    });
    this.bottomBar.addChild(buildButton);

    // Map button
    const mapButton = this.createButton('🗺️ Map', 110, 10, () => {
      this.emit('mapOpen');
    });
    this.bottomBar.addChild(mapButton);

    // Settings button
    const settingsButton = this.createButton('⚙️', 210, 10, () => {
      this.emit('settingsOpen');
    }, 70);
    this.bottomBar.addChild(settingsButton);

    this.container.addChild(this.bottomBar);
  }

  /**
   * Create a button
   */
  private createButton(
    label: string,
    x: number,
    y: number,
    onClick: () => void,
    width: number = 90
  ): Container {
    const button = new Container();
    button.x = x;
    button.y = y;

    const bg = new Graphics();
    bg.roundRect(0, 0, width, 40, 5);
    bg.fill({ color: 0x2a4a6a });
    bg.stroke({ color: 0x4a90a4, width: 1 });
    button.addChild(bg);

    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xFFFFFF,
    });

    const text = new Text({ text: label, style: textStyle });
    text.anchor.set(0.5, 0.5);
    text.x = width / 2;
    text.y = 20;
    button.addChild(text);

    // Make interactive
    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerover', () => {
      bg.clear();
      bg.roundRect(0, 0, width, 40, 5);
      bg.fill({ color: 0x3a5a8a });
      bg.stroke({ color: 0x6dd5ed, width: 2 });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.roundRect(0, 0, width, 40, 5);
      bg.fill({ color: 0x2a4a6a });
      bg.stroke({ color: 0x4a90a4, width: 1 });
    });

    button.on('pointerdown', onClick);

    return button;
  }

  /**
   * Update resource display
   */
  updateResources(): void {
    if (this.r1Text) {
      this.r1Text.text = GLOBAL.formatNumber(BASE.getResource('r1'));
    }
    if (this.r2Text) {
      this.r2Text.text = GLOBAL.formatNumber(BASE.getResource('r2'));
    }
    if (this.r3Text) {
      this.r3Text.text = GLOBAL.formatNumber(BASE.getResource('r3'));
    }
    if (this.r4Text) {
      this.r4Text.text = GLOBAL.formatNumber(BASE.getResource('r4'));
    }
    if (this.creditsText) {
      this.creditsText.text = GLOBAL.formatNumber(BASE._credits.Get());
    }
  }

  /**
   * Update player info display
   */
  updatePlayerInfo(): void {
    if (this.playerNameText) {
      this.playerNameText.text = LOGIN._playerName || 'Player';
    }
  }

  /**
   * Handle window resize
   */
  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Position top bar centered at top
    this.topBar.x = (width - 600) / 2;
    this.topBar.y = 10;

    // Position bottom bar centered at bottom
    this.bottomBar.x = (width - 300) / 2;
    this.bottomBar.y = height - 70;
  }

  /**
   * Show the HUD
   */
  show(): void {
    this.container.visible = true;
  }

  /**
   * Hide the HUD
   */
  hide(): void {
    this.container.visible = false;
  }

  /**
   * Get the container
   */
  getContainer(): Container {
    return this.container;
  }
}

// Singleton instance
export const hud = new HUD();
