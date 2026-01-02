/**
 * Building - Represents a building on the map
 * Ported from ActionScript BFOUNDATION.as and related classes
 */

import { Container, Graphics, Sprite, Text, TextStyle, FederatedPointerEvent } from 'pixi.js';
import { SecNum } from '../../utils/SecNum';
import { globalEvents } from '../../utils/EventEmitter';
import { GAME_EVENTS, CONFIG, BUILDING_TYPES } from '../../core/config';
import { game } from '../../core/Game';
import { assets } from '../../assets/AssetManager';
import { MapRenderer } from '../map/MapRenderer';

// Building data structure from server
export interface BuildingData {
  t: number;    // type
  l: number;    // level
  x: number;    // grid x
  y: number;    // grid y
  s: number;    // state/status
  h: number;    // health
  d: number;    // direction/facing
  fb: number;   // flip build
  bu: number;   // building up
  fr: number;   // fortify level
  [key: string]: unknown;
}

// Building properties from game data
export interface BuildingProperties {
  id: number;
  name: string;
  type: string;
  size: number;
  group: number;
  hp: number[];
  costs: BuildingCost[];
  capacity?: number[];
  produce?: number[];
  cycleTime?: number[];
  attackRange?: number[];
  attackDamage?: number[];
}

export interface BuildingCost {
  r1: SecNum;
  r2: SecNum;
  r3: SecNum;
  r4: SecNum;
  time: SecNum;
  re?: number[][]; // Requirements
}

export class Building {
  // Identification
  public readonly id: string;
  public readonly type: number;
  
  // Position
  public gridX: number;
  public gridY: number;
  
  // State
  public level: SecNum;
  public health: SecNum;
  public maxHealth: number = 1000;
  public state: number = 0;
  public direction: number = 0;
  public fortifyLevel: number = 0;
  
  // Production (for resource buildings)
  public stored: SecNum = new SecNum(0);
  public countdownProduce: SecNum = new SecNum(0);
  
  // Building state
  public isBuilding: boolean = false;
  public isUpgrading: boolean = false;
  public buildTime: SecNum = new SecNum(0);
  
  // Display
  private container?: Container;
  private baseSprite?: Sprite | Graphics;
  private topSprite?: Sprite | Graphics;
  private healthBar?: Graphics;
  private levelText?: Text;
  // Selected state (used in select/deselect methods)
  public selected: boolean = false;
  
  // Properties (for future building data lookup)
  public properties?: BuildingProperties;
  
  constructor(id: string, data: BuildingData) {
    this.id = id;
    this.type = data.t;
    this.level = new SecNum(data.l || 1);
    this.gridX = data.x;
    this.gridY = data.y;
    this.state = data.s || 0;
    this.health = new SecNum(data.h || 0);
    this.direction = data.d || 0;
    this.fortifyLevel = data.fr || 0;
    
    // Check if building is under construction
    if (data.bu && data.bu > 0) {
      this.isBuilding = true;
      this.buildTime.Set(data.bu);
    }
    
    // Load building properties
    this.loadProperties();
  }
  
  /**
   * Load building properties from game data
   */
  private loadProperties(): void {
    // TODO: Load from YARD_PROPS equivalent
    // For now, set basic defaults based on type
    this.maxHealth = this.getDefaultHealth();
    if (this.health.Get() <= 0) {
      this.health.Set(this.maxHealth);
    }
  }
  
  /**
   * Get default health based on type and level
   */
  private getDefaultHealth(): number {
    const level = this.level.Get();
    switch (this.type) {
      case BUILDING_TYPES.TOWN_HALL:
        return 5000 * level;
      case BUILDING_TYPES.HATCHERY:
        return 4000 * level;
      case BUILDING_TYPES.HOUSING:
        return 3000 * level;
      case BUILDING_TYPES.SILO:
        return 2000 * level;
      case BUILDING_TYPES.SNIPER_TOWER:
      case BUILDING_TYPES.CANNON_TOWER:
        return 4000 * level;
      case BUILDING_TYPES.WALL:
        return 1000 * level;
      default:
        return 1000 * level;
    }
  }
  
  /**
   * Add building to the map renderer
   */
  async addToMap(mapRenderer: MapRenderer): Promise<void> {
    // Create container
    this.container = new Container();
    this.container.label = `building_${this.id}`;
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    
    // Calculate world position from grid position
    const worldPos = this.getWorldPosition();
    this.container.position.set(worldPos.x, worldPos.y);
    
    // Create base (foundation) sprite
    await this.createBaseSprite();
    
    // Create top sprite
    await this.createTopSprite();
    
    // Add to appropriate layers
    const basesLayer = mapRenderer.getBuildingBasesLayer();
    const topsLayer = mapRenderer.getBuildingTopsLayer();
    
    if (this.baseSprite) {
      basesLayer.addChild(this.baseSprite);
    }
    
    if (this.container) {
      topsLayer.addChild(this.container);
    }
    
    // Setup interaction
    this.setupInteraction();
  }
  
  /**
   * Create the base/foundation sprite
   */
  private async createBaseSprite(): Promise<void> {
    // Create a simple foundation graphic
    const size = this.getSize();
    const tileWidth = CONFIG.TILE_WIDTH;
    const tileHeight = CONFIG.TILE_HEIGHT;
    
    this.baseSprite = new Graphics();
    const worldPos = this.getWorldPosition();
    
    // Draw isometric foundation
    const halfWidth = (size * tileWidth) / 2;
    const halfHeight = (size * tileHeight) / 2;
    
    this.baseSprite.moveTo(worldPos.x, worldPos.y - halfHeight);
    this.baseSprite.lineTo(worldPos.x + halfWidth, worldPos.y);
    this.baseSprite.lineTo(worldPos.x, worldPos.y + halfHeight);
    this.baseSprite.lineTo(worldPos.x - halfWidth, worldPos.y);
    this.baseSprite.closePath();
    this.baseSprite.fill({ color: 0x444444, alpha: 0.5 });
  }
  
  /**
   * Create the top/main building sprite
   */
  private async createTopSprite(): Promise<void> {
    if (!this.container) return;
    
    // Try to load actual building texture
    try {
      const texture = await assets.getBuildingSprite(this.type, this.level.Get());
      if (texture) {
        this.topSprite = new Sprite(texture);
        this.topSprite.anchor.set(0.5, 1); // Anchor at bottom center
        this.container.addChild(this.topSprite);
        return;
      }
    } catch {
      // Fall back to placeholder
    }
    
    // Create placeholder graphic
    this.topSprite = this.createPlaceholderGraphic();
    this.container.addChild(this.topSprite);
    
    // Add level text
    this.createLevelText();
    
    // Add health bar
    this.createHealthBar();
  }
  
  /**
   * Create a placeholder graphic for the building
   */
  private createPlaceholderGraphic(): Graphics {
    const graphic = new Graphics();
    const size = this.getSize() * 20;
    const color = this.getBuildingColor();
    
    // Draw a simple isometric box
    const halfWidth = size;
    const halfHeight = size / 2;
    const height = size * 0.8;
    
    // Top face
    graphic.moveTo(0, -height - halfHeight);
    graphic.lineTo(halfWidth, -height);
    graphic.lineTo(0, -height + halfHeight);
    graphic.lineTo(-halfWidth, -height);
    graphic.closePath();
    graphic.fill(this.lightenColor(color, 0.3));
    
    // Right face
    graphic.moveTo(halfWidth, -height);
    graphic.lineTo(halfWidth, 0);
    graphic.lineTo(0, halfHeight);
    graphic.lineTo(0, -height + halfHeight);
    graphic.closePath();
    graphic.fill(this.darkenColor(color, 0.2));
    
    // Left face
    graphic.moveTo(-halfWidth, -height);
    graphic.lineTo(-halfWidth, 0);
    graphic.lineTo(0, halfHeight);
    graphic.lineTo(0, -height + halfHeight);
    graphic.closePath();
    graphic.fill(color);
    
    return graphic;
  }
  
  /**
   * Get color based on building type
   */
  private getBuildingColor(): number {
    switch (this.type) {
      case BUILDING_TYPES.TOWN_HALL:
        return 0xCD853F; // Brown
      case BUILDING_TYPES.HATCHERY:
        return 0x9370DB; // Purple
      case BUILDING_TYPES.HOUSING:
        return 0x32CD32; // Green
      case BUILDING_TYPES.SILO:
        return 0xFFD700; // Gold
      case BUILDING_TYPES.FLINGER:
        return 0x8B4513; // Saddle brown
      case BUILDING_TYPES.MAP_ROOM:
        return 0x4169E1; // Royal blue
      case BUILDING_TYPES.MONSTER_LOCKER:
        return 0x708090; // Slate gray
      case BUILDING_TYPES.ACADEMY:
        return 0x20B2AA; // Light sea green
      case BUILDING_TYPES.SNIPER_TOWER:
      case BUILDING_TYPES.CANNON_TOWER:
      case BUILDING_TYPES.TESLA_TOWER:
        return 0xDC143C; // Crimson (defense)
      case BUILDING_TYPES.WALL:
        return 0x696969; // Dim gray
      default:
        // Resource buildings
        if (this.type >= 1 && this.type <= 3) {
          return 0x228B22; // Forest green
        }
        return 0x808080; // Gray
    }
  }
  
  /**
   * Create level text display
   */
  private createLevelText(): void {
    if (!this.container) return;
    
    const style = new TextStyle({
      fontSize: 12,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
      stroke: { color: 0x000000, width: 2 },
    });
    
    this.levelText = new Text({
      text: `Lv.${this.level.Get()}`,
      style,
    });
    this.levelText.anchor.set(0.5, 0.5);
    this.levelText.position.set(0, -this.getSize() * 25);
    
    this.container.addChild(this.levelText);
  }
  
  /**
   * Create health bar
   */
  private createHealthBar(): void {
    if (!this.container) return;
    
    this.healthBar = new Graphics();
    this.updateHealthBar();
    this.healthBar.position.set(0, -this.getSize() * 30);
    this.healthBar.visible = false; // Only show when damaged
    
    this.container.addChild(this.healthBar);
  }
  
  /**
   * Update health bar display
   */
  private updateHealthBar(): void {
    if (!this.healthBar) return;
    
    const width = 40;
    const height = 6;
    const healthPercent = this.health.Get() / this.maxHealth;
    
    this.healthBar.clear();
    
    // Background
    this.healthBar.rect(-width / 2, 0, width, height);
    this.healthBar.fill(0x333333);
    
    // Health fill
    const fillColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this.healthBar.rect(-width / 2 + 1, 1, (width - 2) * healthPercent, height - 2);
    this.healthBar.fill(fillColor);
    
    // Show only if damaged
    this.healthBar.visible = healthPercent < 1;
  }
  
  /**
   * Setup interaction handlers
   */
  private setupInteraction(): void {
    if (!this.container) return;
    
    this.container.on('pointerdown', this.onClick.bind(this));
    this.container.on('pointerover', this.onHover.bind(this));
    this.container.on('pointerout', this.onHoverEnd.bind(this));
  }
  
  private onClick(_event: FederatedPointerEvent): void {
    // Don't select if we were dragging the map
    if (game.mapRenderer?.wasDragged()) return;
    
    this.select();
    game.updateActivity();
  }
  
  private onHover(_event: FederatedPointerEvent): void {
    if (this.topSprite instanceof Sprite) {
      this.topSprite.tint = 0xCCCCFF;
    }
  }
  
  private onHoverEnd(_event: FederatedPointerEvent): void {
    if (this.topSprite instanceof Sprite) {
      this.topSprite.tint = 0xFFFFFF;
    }
  }
  
  /**
   * Select this building
   */
  select(): void {
    this.selected = true;
    game.state.selectedBuildingId = this.id;
    
    // Visual feedback
    if (this.container) {
      this.container.scale.set(1.05);
    }
    
    globalEvents.emit(GAME_EVENTS.BUILDING_SELECTED, this);
  }
  
  /**
   * Deselect this building
   */
  deselect(): void {
    this.selected = false;
    if (game.state.selectedBuildingId === this.id) {
      game.state.selectedBuildingId = null;
    }
    
    // Reset visual
    if (this.container) {
      this.container.scale.set(1);
    }
    
    globalEvents.emit(GAME_EVENTS.BUILDING_DESELECTED, this);
  }
  
  /**
   * Remove building from map
   */
  removeFromMap(): void {
    if (this.baseSprite) {
      this.baseSprite.destroy();
      this.baseSprite = undefined;
    }
    
    if (this.container) {
      this.container.destroy({ children: true });
      this.container = undefined;
    }
    
    this.topSprite = undefined;
    this.healthBar = undefined;
    this.levelText = undefined;
  }
  
  /**
   * Update building position
   */
  setPosition(gridX: number, gridY: number): void {
    this.gridX = gridX;
    this.gridY = gridY;
    
    const worldPos = this.getWorldPosition();
    
    if (this.container) {
      this.container.position.set(worldPos.x, worldPos.y);
    }
    
    // Update base sprite position
    if (this.baseSprite instanceof Graphics) {
      // Redraw at new position
      this.baseSprite.clear();
      const size = this.getSize();
      const tileWidth = CONFIG.TILE_WIDTH;
      const tileHeight = CONFIG.TILE_HEIGHT;
      const halfWidth = (size * tileWidth) / 2;
      const halfHeight = (size * tileHeight) / 2;
      
      this.baseSprite.moveTo(worldPos.x, worldPos.y - halfHeight);
      this.baseSprite.lineTo(worldPos.x + halfWidth, worldPos.y);
      this.baseSprite.lineTo(worldPos.x, worldPos.y + halfHeight);
      this.baseSprite.lineTo(worldPos.x - halfWidth, worldPos.y);
      this.baseSprite.closePath();
      this.baseSprite.fill({ color: 0x444444, alpha: 0.5 });
    }
  }
  
  /**
   * Get world position from grid position
   */
  getWorldPosition(): { x: number; y: number } {
    // Convert from grid to isometric world coordinates
    const tileWidth = CONFIG.TILE_WIDTH;
    const tileHeight = CONFIG.TILE_HEIGHT;
    
    const worldX = (this.gridX - this.gridY) * (tileWidth / 2);
    const worldY = (this.gridX + this.gridY) * (tileHeight / 2);
    
    return { x: worldX, y: worldY };
  }
  
  /**
   * Get building size (in grid tiles)
   */
  getSize(): number {
    switch (this.type) {
      case BUILDING_TYPES.TOWN_HALL:
        return 4;
      case BUILDING_TYPES.HATCHERY:
        return 3;
      case BUILDING_TYPES.HOUSING:
      case BUILDING_TYPES.SILO:
        return 2;
      case BUILDING_TYPES.WALL:
        return 1;
      default:
        return 2;
    }
  }
  
  /**
   * Get building capacity (for storage buildings)
   */
  getCapacity(): number {
    const level = this.level.Get();
    switch (this.type) {
      case BUILDING_TYPES.SILO:
        return 100000 * level;
      case BUILDING_TYPES.HOUSING:
        return 50 * level;
      default:
        return 0;
    }
  }
  
  /**
   * Set health value
   */
  setHealth(health: number): void {
    this.health.Set(Math.max(0, Math.min(health, this.maxHealth)));
    this.updateHealthBar();
  }
  
  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    const newHealth = this.health.Get() - amount;
    this.setHealth(newHealth);
    
    if (newHealth <= 0) {
      this.onDestroyed();
    }
  }
  
  /**
   * Handle building destruction
   */
  private onDestroyed(): void {
    globalEvents.emit(GAME_EVENTS.BUILDING_DESTROYED, this);
  }
  
  /**
   * Set resource data (for harvesters)
   */
  setResourceData(data: unknown): void {
    if (typeof data === 'object' && data !== null) {
      const resourceData = data as { stored?: number; countdown?: number };
      if (resourceData.stored !== undefined) {
        this.stored.Set(resourceData.stored);
      }
      if (resourceData.countdown !== undefined) {
        this.countdownProduce.Set(resourceData.countdown);
      }
    }
  }
  
  /**
   * Game tick update
   */
  tick(delta: number): void {
    // Update building if under construction
    if (this.isBuilding && this.buildTime.Get() > 0) {
      this.buildTime.Subtract(delta / 60); // Convert frames to seconds
      if (this.buildTime.Get() <= 0) {
        this.isBuilding = false;
        this.buildTime.Set(0);
      }
    }
    
    // Update production for resource buildings
    if (this.isResourceProducer()) {
      this.updateProduction(delta);
    }
  }
  
  /**
   * Check if this is a resource producing building
   */
  isResourceProducer(): boolean {
    return this.type >= 1 && this.type <= 3;
  }
  
  /**
   * Update resource production
   */
  private updateProduction(delta: number): void {
    if (!game.state.isDefending()) return;
    
    // Countdown to next production
    if (this.countdownProduce.Get() > 0) {
      this.countdownProduce.Subtract(delta / 60);
      
      if (this.countdownProduce.Get() <= 0) {
        // Produce resources
        const produced = this.getProductionAmount();
        this.stored.Add(produced);
        
        // Reset countdown
        this.countdownProduce.Set(this.getProductionCycleTime());
        
        // Cap at capacity
        const capacity = this.getCapacity();
        if (this.stored.Get() > capacity) {
          this.stored.Set(capacity);
        }
      }
    }
  }
  
  /**
   * Get production amount per cycle
   */
  getProductionAmount(): number {
    const level = this.level.Get();
    return 10 * level; // Simplified
  }
  
  /**
   * Get production cycle time in seconds
   */
  getProductionCycleTime(): number {
    return 60; // 1 minute per cycle
  }
  
  /**
   * Collect stored resources
   */
  collect(): number {
    const amount = this.stored.Get();
    this.stored.Set(0);
    return amount;
  }
  
  /**
   * Upgrade building to next level
   */
  upgrade(): boolean {
    // TODO: Check requirements and resources
    this.level.Add(1);
    this.maxHealth = this.getDefaultHealth();
    this.health.Set(this.maxHealth);
    
    // Update level text
    if (this.levelText) {
      this.levelText.text = `Lv.${this.level.Get()}`;
    }
    
    globalEvents.emit(GAME_EVENTS.BUILDING_UPGRADED, this);
    return true;
  }
  
  // === Color utilities ===
  
  private lightenColor(color: number, amount: number): number {
    const r = Math.min(255, ((color >> 16) & 0xFF) + 255 * amount);
    const g = Math.min(255, ((color >> 8) & 0xFF) + 255 * amount);
    const b = Math.min(255, (color & 0xFF) + 255 * amount);
    return (r << 16) | (g << 8) | b;
  }
  
  private darkenColor(color: number, amount: number): number {
    const r = Math.max(0, ((color >> 16) & 0xFF) * (1 - amount));
    const g = Math.max(0, ((color >> 8) & 0xFF) * (1 - amount));
    const b = Math.max(0, (color & 0xFF) * (1 - amount));
    return (r << 16) | (g << 8) | b;
  }
}
