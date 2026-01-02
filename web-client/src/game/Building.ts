/**
 * Building - Building entity for rendering
 * Converted from ActionScript BFOUNDATION.as
 * 
 * Represents a single building on the map
 */

import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { BuildingData, BuildingProps } from '../types/game';
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT } from '../rendering/IsometricUtils';
import { SecNum } from '../utils/SecNum';
import { EventEmitter } from '../core/EventEmitter';
import { MAP } from '../rendering/Map';
import { GLOBAL } from '../core/Global';

// Building state constants
export const STATE_DESTROYED = 'destroyed';
export const STATE_DAMAGED = 'damaged';
export const STATE_DEFAULT = '';

export interface BuildingOptions {
  data: BuildingData;
  props?: BuildingProps;
  interactive?: boolean;
}

export class Building extends EventEmitter {
  // Data
  private _data: BuildingData;
  private _props: BuildingProps | null;

  // Position
  private _gridX: number = 0;
  private _gridY: number = 0;
  private _screenX: number = 0;
  private _screenY: number = 0;

  // Size (in grid units)
  private _size: number = 1;

  // State
  private _lvl: SecNum;
  private _health: SecNum;
  private _maxHealth: number = 100;
  private _countdownBuild: SecNum;
  private _countdownUpgrade: SecNum;
  private _stored: SecNum;
  private _state: string = STATE_DEFAULT;

  // Display
  private _container: Container;
  private _baseGraphics: Graphics;
  private _buildingSprite: Sprite | null = null;
  private _healthBar: Graphics | null = null;
  private _progressBar: Graphics | null = null;
  private _labelText: Text | null = null;

  // Interaction
  private _selected: boolean = false;
  private _moving: boolean = false;
  private _interactive: boolean = true;

  constructor(options: BuildingOptions) {
    super();

    this._data = options.data;
    this._props = options.props || null;
    this._interactive = options.interactive ?? true;

    // Initialize SecNum values
    this._lvl = new SecNum(options.data.level || 1);
    this._health = new SecNum(options.data.health || 100);
    this._countdownBuild = new SecNum(options.data.buildTime || 0);
    this._countdownUpgrade = new SecNum(options.data.upgradeTime || 0);
    this._stored = new SecNum(options.data.stored || 0);

    // Set position
    this._gridX = options.data.x;
    this._gridY = options.data.y;

    // Get size from props
    if (this._props) {
      this._size = this._props.size || 1;
      const levelIndex = Math.max(0, this._lvl.Get() - 1);
      this._maxHealth = this._props.hp?.[levelIndex] || 100;
    }

    // Create container
    this._container = new Container();
    this._baseGraphics = new Graphics();
    this._container.addChild(this._baseGraphics);

    // Update screen position
    this.updateScreenPosition();

    // Setup interaction
    if (this._interactive) {
      this.setupInteraction();
    }

    // Initial render
    this.render();
  }

  /**
   * Update screen position from grid position
   */
  private updateScreenPosition(): void {
    const pos = gridToScreen(this._gridX, this._gridY);
    this._screenX = pos.x;
    this._screenY = pos.y;
    this._container.x = this._screenX;
    this._container.y = this._screenY;
  }

  /**
   * Setup interactive events
   */
  private setupInteraction(): void {
    this._container.eventMode = 'static';
    this._container.cursor = 'pointer';

    this._container.on('pointerdown', (e) => {
      e.stopPropagation();
      this.emit('click', this);
    });

    this._container.on('pointerover', () => {
      this.emit('hover', this);
      this._baseGraphics.alpha = 0.8;
    });

    this._container.on('pointerout', () => {
      this.emit('hoverEnd', this);
      this._baseGraphics.alpha = 1;
    });
  }

  /**
   * Render the building
   */
  private render(): void {
    this._baseGraphics.clear();

    // Draw building footprint (isometric rectangle based on size)
    const halfWidth = (this._size * TILE_WIDTH) / 2;
    const halfHeight = (this._size * TILE_HEIGHT) / 2;

    // Draw shadow/footprint
    this._baseGraphics.poly([
      { x: 0, y: -halfHeight },
      { x: halfWidth, y: 0 },
      { x: 0, y: halfHeight },
      { x: -halfWidth, y: 0 },
    ]);

    // Color based on building type
    const color = this.getBuildingColor();
    this._baseGraphics.fill({ color, alpha: 0.9 });

    // Draw building body (simple 3D box)
    const buildingHeight = 20 + this._lvl.Get() * 5;
    
    // Top face
    this._baseGraphics.poly([
      { x: 0, y: -halfHeight - buildingHeight },
      { x: halfWidth, y: -buildingHeight },
      { x: 0, y: halfHeight - buildingHeight },
      { x: -halfWidth, y: -buildingHeight },
    ]);
    this._baseGraphics.fill({ color: this.lightenColor(color, 30), alpha: 1 });

    // Right face
    this._baseGraphics.poly([
      { x: halfWidth, y: -buildingHeight },
      { x: halfWidth, y: 0 },
      { x: 0, y: halfHeight },
      { x: 0, y: halfHeight - buildingHeight },
    ]);
    this._baseGraphics.fill({ color: this.darkenColor(color, 30), alpha: 1 });

    // Left face
    this._baseGraphics.poly([
      { x: -halfWidth, y: -buildingHeight },
      { x: 0, y: halfHeight - buildingHeight },
      { x: 0, y: halfHeight },
      { x: -halfWidth, y: 0 },
    ]);
    this._baseGraphics.fill({ color: this.darkenColor(color, 50), alpha: 1 });

    // Draw selection indicator if selected
    if (this._selected) {
      this._baseGraphics.poly([
        { x: 0, y: -halfHeight - 5 },
        { x: halfWidth + 5, y: 5 },
        { x: 0, y: halfHeight + 5 },
        { x: -halfWidth - 5, y: 5 },
      ]);
      this._baseGraphics.stroke({ color: 0xFFFF00, width: 3, alpha: 0.8 });
    }

    // Render health bar if damaged
    if (this._health.Get() < this._maxHealth) {
      this.renderHealthBar();
    }

    // Render progress bar if building/upgrading
    if (this._countdownBuild.Get() > 0 || this._countdownUpgrade.Get() > 0) {
      this.renderProgressBar();
    }

    // Render level indicator
    this.renderLevelIndicator();
  }

  /**
   * Get building color based on type
   */
  private getBuildingColor(): number {
    const type = this._data.type;

    // Color mapping for different building types
    const colorMap: Record<number, number> = {
      1: 0x8B4513,   // Town Hall - Brown
      2: 0x4169E1,   // Hatchery - Blue
      3: 0x228B22,   // Resource - Green
      4: 0x228B22,   // Resource - Green
      5: 0xB8860B,   // Flinger - Gold
      6: 0x6B8E23,   // Storage - Olive
      7: 0x6B8E23,   // Storage - Olive
      8: 0x4682B4,   // Map Room - Steel Blue
      9: 0x9932CC,   // Monster Juicer - Purple
      10: 0x8B0000,  // Cannon Tower - Dark Red
      11: 0x8B0000,  // Sniper Tower - Dark Red
      12: 0x8B0000,  // Laser Tower - Dark Red
      13: 0x8B0000,  // Tesla Tower - Dark Red
      14: 0xCD853F,  // Housing - Peru
      15: 0xCD853F,  // Housing - Peru
      16: 0x483D8B,  // CC Hatchery - Dark Slate Blue
      17: 0x8B0000,  // Guard Tower - Dark Red
      18: 0x8B0000,  // Tower - Dark Red
      19: 0x8B0000,  // Tower - Dark Red
      20: 0x8B0000,  // Tower - Dark Red
      25: 0x696969,  // Wall - Dim Gray
      26: 0x808080,  // Wall - Gray
      27: 0xA9A9A9,  // Wall - Dark Gray
    };

    return colorMap[type] || 0x888888; // Default gray
  }

  /**
   * Lighten a color
   */
  private lightenColor(color: number, amount: number): number {
    const r = Math.min(255, ((color >> 16) & 0xFF) + amount);
    const g = Math.min(255, ((color >> 8) & 0xFF) + amount);
    const b = Math.min(255, (color & 0xFF) + amount);
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Darken a color
   */
  private darkenColor(color: number, amount: number): number {
    const r = Math.max(0, ((color >> 16) & 0xFF) - amount);
    const g = Math.max(0, ((color >> 8) & 0xFF) - amount);
    const b = Math.max(0, (color & 0xFF) - amount);
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Render health bar
   */
  private renderHealthBar(): void {
    if (!this._healthBar) {
      this._healthBar = new Graphics();
      this._container.addChild(this._healthBar);
    }

    this._healthBar.clear();
    const width = this._size * TILE_WIDTH - 10;
    const height = 5;
    const y = -40 - this._lvl.Get() * 5;

    // Background
    this._healthBar.rect(-width / 2, y, width, height);
    this._healthBar.fill({ color: 0x333333, alpha: 0.8 });

    // Health fill
    const healthPercent = this._health.Get() / this._maxHealth;
    const fillColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this._healthBar.rect(-width / 2, y, width * healthPercent, height);
    this._healthBar.fill({ color: fillColor, alpha: 1 });
  }

  /**
   * Render progress bar for building/upgrading
   */
  private renderProgressBar(): void {
    if (!this._progressBar) {
      this._progressBar = new Graphics();
      this._container.addChild(this._progressBar);
    }

    this._progressBar.clear();
    const width = this._size * TILE_WIDTH - 10;
    const height = 5;
    const y = -50 - this._lvl.Get() * 5;

    // Background
    this._progressBar.rect(-width / 2, y, width, height);
    this._progressBar.fill({ color: 0x333333, alpha: 0.8 });

    // Progress fill (placeholder - would need total time to calculate)
    const progress = 0.5; // TODO: Calculate actual progress
    this._progressBar.rect(-width / 2, y, width * progress, height);
    this._progressBar.fill({ color: 0x4169E1, alpha: 1 });
  }

  /**
   * Render level indicator
   */
  private renderLevelIndicator(): void {
    if (!this._labelText) {
      const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bold',
        fill: 0xFFFFFF,
        stroke: { color: 0x000000, width: 2 },
      });
      this._labelText = new Text({ text: '', style });
      this._labelText.anchor.set(0.5, 0.5);
      this._container.addChild(this._labelText);
    }

    this._labelText.text = `L${this._lvl.Get()}`;
    this._labelText.y = -30 - this._lvl.Get() * 5;
  }

  /**
   * Update building state
   */
  update(data: Partial<BuildingData>): void {
    if (data.level !== undefined) this._lvl.Set(data.level);
    if (data.health !== undefined) this._health.Set(data.health);
    if (data.x !== undefined) this._gridX = data.x;
    if (data.y !== undefined) this._gridY = data.y;
    if (data.stored !== undefined) this._stored.Set(data.stored);
    if (data.buildTime !== undefined) this._countdownBuild.Set(data.buildTime);
    if (data.upgradeTime !== undefined) this._countdownUpgrade.Set(data.upgradeTime);

    this.updateScreenPosition();
    this.render();
  }

  /**
   * Tick - called once per game tick (second)
   */
  tick(ticks: number = 1): void {
    // Decrement build countdown
    if (this._countdownBuild.Get() > 0) {
      this._countdownBuild.Add(-ticks);
      if (this._countdownBuild.Get() <= 0) {
        this._countdownBuild.Set(0);
        this.emit('buildComplete', this);
      }
      this.render();
    }

    // Decrement upgrade countdown
    if (this._countdownUpgrade.Get() > 0) {
      this._countdownUpgrade.Add(-ticks);
      if (this._countdownUpgrade.Get() <= 0) {
        this._countdownUpgrade.Set(0);
        this.emit('upgradeComplete', this);
      }
      this.render();
    }
  }

  /**
   * Set selected state
   */
  setSelected(selected: boolean): void {
    if (this._selected !== selected) {
      this._selected = selected;
      this.render();
      this.emit('selectionChanged', { building: this, selected });
    }
  }

  /**
   * Add to map container
   */
  addToMap(): void {
    const container = MAP.BUILDINGBASES;
    if (container && !this._container.parent) {
      container.addChild(this._container);
    }
  }

  /**
   * Remove from map
   */
  removeFromMap(): void {
    if (this._container.parent) {
      this._container.parent.removeChild(this._container);
    }
  }

  /**
   * Destroy the building
   */
  destroy(): void {
    this.removeFromMap();
    this._container.destroy();
    this.removeAllListeners();
  }

  // Getters
  get data(): BuildingData { return this._data; }
  get container(): Container { return this._container; }
  get gridX(): number { return this._gridX; }
  get gridY(): number { return this._gridY; }
  get screenX(): number { return this._screenX; }
  get screenY(): number { return this._screenY; }
  get level(): number { return this._lvl.Get(); }
  get health(): number { return this._health.Get(); }
  get maxHealth(): number { return this._maxHealth; }
  get selected(): boolean { return this._selected; }
  get type(): number { return this._data.type; }
  get size(): number { return this._size; }
  get stored(): number { return this._stored.Get(); }
}
