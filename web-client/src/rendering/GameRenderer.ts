/**
 * PixiJS Application wrapper for the game
 * Handles rendering, layers, and game loop
 */

import { Application, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { GLOBAL } from '../core/Global';

export interface GameLayers {
  map: Container;
  ground: Container;
  buildings: Container;
  buildingTops: Container;
  creatures: Container;
  effects: Container;
  projectiles: Container;
  ui: Container;
  windows: Container;
  messages: Container;
  top: Container;
}

export class GameRenderer {
  private app: Application;
  private layers: GameLayers | null = null;
  private initialized: boolean = false;

  constructor() {
    this.app = new Application();
  }

  async init(container: HTMLElement): Promise<void> {
    if (this.initialized) return;

    await this.app.init({
      background: '#1a1a2e',
      resizeTo: container,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    container.appendChild(this.app.canvas);

    // Create layer hierarchy
    this.layers = this.createLayers();

    // Add resize handler
    window.addEventListener('resize', () => this.handleResize());

    this.initialized = true;
    console.log('[GameRenderer] Initialized');
  }

  private createLayers(): GameLayers {
    const layers: GameLayers = {
      map: new Container(),
      ground: new Container(),
      buildings: new Container(),
      buildingTops: new Container(),
      creatures: new Container(),
      effects: new Container(),
      projectiles: new Container(),
      ui: new Container(),
      windows: new Container(),
      messages: new Container(),
      top: new Container(),
    };

    // Add layers in order (bottom to top)
    this.app.stage.addChild(layers.map);
    layers.map.addChild(layers.ground);
    layers.map.addChild(layers.buildings);
    layers.map.addChild(layers.buildingTops);
    layers.map.addChild(layers.creatures);
    layers.map.addChild(layers.effects);
    layers.map.addChild(layers.projectiles);
    this.app.stage.addChild(layers.ui);
    this.app.stage.addChild(layers.windows);
    this.app.stage.addChild(layers.messages);
    this.app.stage.addChild(layers.top);

    // Disable interactivity for layers that don't need it
    layers.effects.interactiveChildren = false;
    layers.projectiles.interactiveChildren = false;

    return layers;
  }

  private handleResize(): void {
    GLOBAL.refreshScreen();
  }

  get stage(): Container {
    return this.app.stage;
  }

  get width(): number {
    return this.app.screen.width;
  }

  get height(): number {
    return this.app.screen.height;
  }

  getLayer(name: keyof GameLayers): Container | null {
    return this.layers?.[name] || null;
  }

  /**
   * Add a ticker callback (game loop)
   */
  addTicker(callback: (ticker: import('pixi.js').Ticker) => void): void {
    this.app.ticker.add(callback);
  }

  /**
   * Remove a ticker callback
   */
  removeTicker(callback: (ticker: import('pixi.js').Ticker) => void): void {
    this.app.ticker.remove(callback);
  }

  /**
   * Get the ticker's FPS
   */
  get fps(): number {
    return this.app.ticker.FPS;
  }

  /**
   * Create a simple colored rectangle
   */
  createRect(width: number, height: number, color: number, alpha: number = 1): Graphics {
    const rect = new Graphics();
    rect.rect(0, 0, width, height);
    rect.fill({ color, alpha });
    return rect;
  }

  /**
   * Create a sprite from a texture URL
   */
  async createSprite(url: string): Promise<Sprite> {
    const texture = await Texture.from(url);
    return new Sprite(texture);
  }

  /**
   * Clear a specific layer
   */
  clearLayer(name: keyof GameLayers): void {
    const layer = this.getLayer(name);
    if (layer) {
      layer.removeChildren();
    }
  }

  /**
   * Clear all layers
   */
  clearAllLayers(): void {
    if (this.layers) {
      Object.keys(this.layers).forEach(key => {
        this.clearLayer(key as keyof GameLayers);
      });
    }
  }

  /**
   * Get screen center
   */
  getCenter(): { x: number; y: number } {
    return {
      x: this.width / 2,
      y: this.height / 2,
    };
  }

  /**
   * Destroy the renderer
   */
  destroy(): void {
    window.removeEventListener('resize', () => this.handleResize());
    this.app.destroy(true);
    this.initialized = false;
  }
}

// Singleton instance
export const gameRenderer = new GameRenderer();
