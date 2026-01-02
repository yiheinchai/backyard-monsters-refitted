/**
 * MapRenderer - Handles rendering the isometric game map
 * Ported from ActionScript MAP.as
 */

import { Container, Graphics, TilingSprite, FederatedPointerEvent, Point } from 'pixi.js';
import { CONFIG, MapTileType } from '../../core/config';
import { assets } from '../../assets/AssetManager';
import { game } from '../../core/Game';
import { Base } from '../base/Base';

export class MapRenderer {
  // Container references
  private container: Container;
  private groundLayer!: Container;
  private backgroundLayer!: Container;
  private effectsBottomLayer!: Container;
  private buildingBasesLayer!: Container;
  private footprintsLayer!: Container;
  private wallsLayer!: Container;
  private creaturesLayer!: Container;
  private buildingTopsLayer!: Container;
  private projectilesLayer!: Container;
  private effectsTopLayer!: Container;
  
  // Background
  private backgroundTiles?: TilingSprite;
  
  // Map state
  private mapWidth: number = CONFIG.MAP_WIDTH * CONFIG.TILE_WIDTH;
  private mapHeight: number = CONFIG.MAP_HEIGHT * CONFIG.TILE_HEIGHT;
  private mapType: MapTileType = MapTileType.GRASS;
  
  // Dragging state
  private isDragging: boolean = false;
  private hasDragged: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private dragDistance: number = 0;
  
  // Camera
  private targetX: number = 0;
  private targetY: number = 0;
  private following: boolean = false;
  private canScroll: boolean = true;
  
  // Grid
  private gridGraphics?: Graphics;
  private showGrid: boolean = false;
  
  // Reference to base (stored for future use)
  // private base?: Base;
  
  constructor(parentContainer: Container) {
    this.container = parentContainer;
    this.setupLayers();
    this.setupInteraction();
  }
  
  /**
   * Setup rendering layers
   */
  private setupLayers(): void {
    // Main ground container (will be scaled/moved for zooming/panning)
    this.groundLayer = new Container();
    this.groundLayer.label = 'ground';
    this.groundLayer.eventMode = 'static';
    this.container.addChild(this.groundLayer);
    
    // Background tiles layer
    this.backgroundLayer = new Container();
    this.backgroundLayer.label = 'background';
    this.groundLayer.addChild(this.backgroundLayer);
    
    // Effects (bottom)
    this.effectsBottomLayer = new Container();
    this.effectsBottomLayer.label = 'effectsBottom';
    this.effectsBottomLayer.eventMode = 'none';
    this.groundLayer.addChild(this.effectsBottomLayer);
    
    // Building bases (foundations)
    this.buildingBasesLayer = new Container();
    this.buildingBasesLayer.label = 'buildingBases';
    this.groundLayer.addChild(this.buildingBasesLayer);
    
    // Footprints (for building placement)
    this.footprintsLayer = new Container();
    this.footprintsLayer.label = 'footprints';
    this.footprintsLayer.eventMode = 'none';
    this.groundLayer.addChild(this.footprintsLayer);
    
    // Walls
    this.wallsLayer = new Container();
    this.wallsLayer.label = 'walls';
    this.groundLayer.addChild(this.wallsLayer);
    
    // Creatures/monsters
    this.creaturesLayer = new Container();
    this.creaturesLayer.label = 'creatures';
    this.creaturesLayer.eventMode = 'none';
    this.groundLayer.addChild(this.creaturesLayer);
    
    // Building tops
    this.buildingTopsLayer = new Container();
    this.buildingTopsLayer.label = 'buildingTops';
    this.groundLayer.addChild(this.buildingTopsLayer);
    
    // Projectiles
    this.projectilesLayer = new Container();
    this.projectilesLayer.label = 'projectiles';
    this.projectilesLayer.eventMode = 'none';
    this.groundLayer.addChild(this.projectilesLayer);
    
    // Effects (top)
    this.effectsTopLayer = new Container();
    this.effectsTopLayer.label = 'effectsTop';
    this.effectsTopLayer.eventMode = 'none';
    this.groundLayer.addChild(this.effectsTopLayer);
    
    // Position ground at center initially
    this.groundLayer.position.set(CONFIG.SCREEN_WIDTH / 2, CONFIG.SCREEN_HEIGHT / 2);
  }
  
  /**
   * Setup mouse/touch interaction for panning
   */
  private setupInteraction(): void {
    this.groundLayer.eventMode = 'static';
    this.groundLayer.cursor = 'grab';
    
    // Mouse/touch events for panning
    this.groundLayer.on('pointerdown', this.onDragStart.bind(this));
    this.groundLayer.on('pointerup', this.onDragEnd.bind(this));
    this.groundLayer.on('pointerupoutside', this.onDragEnd.bind(this));
    this.groundLayer.on('pointermove', this.onDragMove.bind(this));
    
    // Mouse wheel for zooming
    this.container.eventMode = 'static';
  }
  
  /**
   * Setup the map with base data
   */
  async setup(_base: Base): Promise<void> {
    // Determine map type based on yard type
    if (game.state.isInfernoMode()) {
      this.mapType = MapTileType.LAVA;
    } else {
      this.mapType = MapTileType.GRASS;
    }
    
    // Setup background
    await this.setupBackground();
    
    // Setup grid (optional, for debugging)
    if (game.state.debugMode) {
      this.setupGrid();
    }
    
    // Center camera
    this.centerCamera();
  }
  
  /**
   * Setup background tiles
   */
  private async setupBackground(): Promise<void> {
    // Clear existing background
    this.backgroundLayer.removeChildren();
    
    // Get appropriate texture based on map type
    const textureName = this.getBackgroundTextureName();
    
    try {
      // Create a tiled background
      const texture = await assets.loadTexture(`yardbg/${textureName}`);
      
      // Create tiling sprite
      this.backgroundTiles = new TilingSprite({
        texture,
        width: this.mapWidth,
        height: this.mapHeight,
      });
      
      this.backgroundTiles.position.set(-this.mapWidth / 2, -this.mapHeight / 2);
      this.backgroundLayer.addChild(this.backgroundTiles);
    } catch {
      // Fallback to solid color
      const bg = new Graphics();
      bg.rect(-this.mapWidth / 2, -this.mapHeight / 2, this.mapWidth, this.mapHeight);
      bg.fill(this.getBackgroundColor());
      this.backgroundLayer.addChild(bg);
    }
  }
  
  /**
   * Get background texture name based on map type
   */
  private getBackgroundTextureName(): string {
    switch (this.mapType) {
      case MapTileType.GRASS:
        return 'isograss1.jpg';
      case MapTileType.SAND:
        return 'isosand1.jpg';
      case MapTileType.ROCK:
        return 'isorock1.jpg';
      case MapTileType.LAVA:
        return 'inferno_lava1.jpg';
      default:
        return 'isograss1.jpg';
    }
  }
  
  /**
   * Get background color fallback
   */
  private getBackgroundColor(): number {
    switch (this.mapType) {
      case MapTileType.GRASS:
        return 0x4a7c23;
      case MapTileType.SAND:
        return 0xc2b280;
      case MapTileType.ROCK:
        return 0x6b6b6b;
      case MapTileType.LAVA:
        return 0x8b0000;
      default:
        return 0x4a7c23;
    }
  }
  
  /**
   * Setup debug grid
   */
  private setupGrid(): void {
    if (this.gridGraphics) {
      this.gridGraphics.destroy();
    }
    
    this.gridGraphics = new Graphics();
    const gridSize = CONFIG.TILE_WIDTH;
    const halfWidth = this.mapWidth / 2;
    const halfHeight = this.mapHeight / 2;
    
    // Draw isometric grid
    this.gridGraphics.stroke({ width: 1, color: 0x333333, alpha: 0.3 });
    
    for (let x = -halfWidth; x <= halfWidth; x += gridSize) {
      this.gridGraphics.moveTo(x, -halfHeight);
      this.gridGraphics.lineTo(x, halfHeight);
    }
    
    for (let y = -halfHeight; y <= halfHeight; y += gridSize / 2) {
      this.gridGraphics.moveTo(-halfWidth, y);
      this.gridGraphics.lineTo(halfWidth, y);
    }
    
    this.backgroundLayer.addChild(this.gridGraphics);
    this.gridGraphics.visible = this.showGrid;
  }
  
  /**
   * Toggle grid visibility
   */
  toggleGrid(): void {
    this.showGrid = !this.showGrid;
    if (this.gridGraphics) {
      this.gridGraphics.visible = this.showGrid;
    }
  }
  
  // === Camera/Navigation ===
  
  /**
   * Center the camera on the map
   */
  centerCamera(): void {
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    
    this.groundLayer.position.set(screenWidth / 2, screenHeight / 2);
  }
  
  /**
   * Focus camera on a specific world position
   */
  focusTo(x: number, y: number, duration: number = 0): void {
    this.targetX = x;
    this.targetY = y;
    
    if (duration <= 0) {
      this.groundLayer.position.set(
        game.state.screenWidth / 2 - x,
        game.state.screenHeight / 2 - y
      );
    } else {
      // Animated focus (would need a tween system)
      this.following = true;
    }
  }
  
  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX: number, screenY: number): Point {
    // Adjust for ground layer position and scale
    const groundPos = this.groundLayer.position;
    const scale = this.groundLayer.scale.x;
    
    return new Point(
      (screenX - groundPos.x) / scale,
      (screenY - groundPos.y) / scale
    );
  }
  
  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX: number, worldY: number): Point {
    const groundPos = this.groundLayer.position;
    const scale = this.groundLayer.scale.x;
    
    return new Point(
      worldX * scale + groundPos.x,
      worldY * scale + groundPos.y
    );
  }
  
  /**
   * Convert world coordinates to isometric grid coordinates
   */
  worldToGrid(worldX: number, worldY: number): Point {
    // Isometric conversion
    const tileWidth = CONFIG.TILE_WIDTH;
    const tileHeight = CONFIG.TILE_HEIGHT;
    
    const gridX = Math.floor((worldX / tileWidth + worldY / tileHeight) / 2);
    const gridY = Math.floor((worldY / tileHeight - worldX / tileWidth) / 2);
    
    return new Point(gridX, gridY);
  }
  
  /**
   * Convert grid coordinates to world coordinates
   */
  gridToWorld(gridX: number, gridY: number): Point {
    const tileWidth = CONFIG.TILE_WIDTH;
    const tileHeight = CONFIG.TILE_HEIGHT;
    
    const worldX = (gridX - gridY) * tileWidth;
    const worldY = (gridX + gridY) * tileHeight / 2;
    
    return new Point(worldX, worldY);
  }
  
  // === Drag Handling ===
  
  private onDragStart(event: FederatedPointerEvent): void {
    if (!this.canScroll) return;
    
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = event.globalX - this.groundLayer.x;
    this.dragStartY = event.globalY - this.groundLayer.y;
    this.dragDistance = 0;
    
    this.groundLayer.cursor = 'grabbing';
    
    game.updateActivity();
  }
  
  private onDragMove(event: FederatedPointerEvent): void {
    if (!this.isDragging) return;
    
    const newX = event.globalX - this.dragStartX;
    const newY = event.globalY - this.dragStartY;
    
    const dx = newX - this.groundLayer.x;
    const dy = newY - this.groundLayer.y;
    this.dragDistance += Math.sqrt(dx * dx + dy * dy);
    
    if (this.dragDistance > 5) {
      this.hasDragged = true;
    }
    
    this.groundLayer.position.set(newX, newY);
    
    // Clamp to bounds
    this.clampCamera();
  }
  
  private onDragEnd(_event: FederatedPointerEvent): void {
    this.isDragging = false;
    this.groundLayer.cursor = 'grab';
  }
  
  /**
   * Clamp camera to map bounds
   */
  private clampCamera(): void {
    const scale = this.groundLayer.scale.x;
    const halfMapWidth = (this.mapWidth * scale) / 2;
    const halfMapHeight = (this.mapHeight * scale) / 2;
    const screenWidth = game.state.screenWidth;
    const screenHeight = game.state.screenHeight;
    
    // Allow some overflow but not too much
    const margin = 100;
    
    this.groundLayer.x = Math.max(
      Math.min(this.groundLayer.x, halfMapWidth + margin),
      screenWidth - halfMapWidth - margin
    );
    
    this.groundLayer.y = Math.max(
      Math.min(this.groundLayer.y, halfMapHeight + margin),
      screenHeight - halfMapHeight - margin
    );
  }
  
  // === Zoom ===
  
  /**
   * Set zoom level
   */
  setZoom(scale: number): void {
    scale = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, scale));
    
    this.groundLayer.scale.set(scale, scale);
    game.state.magnification = scale;
    
    this.clampCamera();
  }
  
  /**
   * Zoom in/out relative to current zoom
   */
  zoom(delta: number): void {
    const newScale = this.groundLayer.scale.x + delta;
    this.setZoom(newScale);
  }
  
  /**
   * Toggle between normal and zoomed out view
   */
  toggleZoom(): void {
    if (game.state.zoomed) {
      this.setZoom(1);
      game.state.zoomed = false;
    } else {
      this.setZoom(0.5);
      game.state.zoomed = true;
    }
  }
  
  // === Layer Access ===
  
  getBuildingBasesLayer(): Container {
    return this.buildingBasesLayer;
  }
  
  getBuildingTopsLayer(): Container {
    return this.buildingTopsLayer;
  }
  
  getWallsLayer(): Container {
    return this.wallsLayer;
  }
  
  getCreaturesLayer(): Container {
    return this.creaturesLayer;
  }
  
  getProjectilesLayer(): Container {
    return this.projectilesLayer;
  }
  
  getEffectsBottomLayer(): Container {
    return this.effectsBottomLayer;
  }
  
  getEffectsTopLayer(): Container {
    return this.effectsTopLayer;
  }
  
  getFootprintsLayer(): Container {
    return this.footprintsLayer;
  }
  
  // === Update Methods ===
  
  /**
   * Game tick update
   */
  tick(_delta: number): void {
    // Update camera following if active
    if (this.following) {
      const screenWidth = game.state.screenWidth;
      const screenHeight = game.state.screenHeight;
      const targetScreenX = screenWidth / 2 - this.targetX;
      const targetScreenY = screenHeight / 2 - this.targetY;
      
      const dx = targetScreenX - this.groundLayer.x;
      const dy = targetScreenY - this.groundLayer.y;
      
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        this.groundLayer.position.set(targetScreenX, targetScreenY);
        this.following = false;
      } else {
        this.groundLayer.x += dx * 0.1;
        this.groundLayer.y += dy * 0.1;
      }
    }
    
    // Sort building depth
    this.sortBuildingDepth();
  }
  
  /**
   * Sort buildings by depth (y position)
   */
  private sortBuildingDepth(): void {
    // Sort building tops by y position for correct overlap
    this.buildingTopsLayer.children.sort((a, b) => a.y - b.y);
  }
  
  /**
   * Handle window resize
   */
  onResize(_width: number, _height: number): void {
    // Adjust camera position to maintain center point
    this.clampCamera();
  }
  
  /**
   * Check if a click was a drag or a tap
   */
  wasDragged(): boolean {
    return this.hasDragged;
  }
  
  /**
   * Swap background texture
   */
  async swapBackground(mapType: MapTileType): Promise<void> {
    this.mapType = mapType;
    await this.setupBackground();
  }
}
