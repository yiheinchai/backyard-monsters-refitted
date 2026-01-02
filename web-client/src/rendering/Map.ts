/**
 * MAP - Map rendering and management
 * Converted from ActionScript MAP.as
 * 
 * Handles ground tiles, scrolling, and coordinate management
 */

import { Container, Graphics, Sprite, Texture, TilingSprite } from 'pixi.js';
import { GLOBAL } from '../core/Global';
import { gameRenderer, GameLayers } from './GameRenderer';
import { gridToScreen, screenToGrid, TILE_WIDTH, TILE_HEIGHT } from './IsometricUtils';
import { EventEmitter } from '../core/EventEmitter';

// Map constants (from original)
export const MAP_WIDTH = 3994;
export const MAP_HEIGHT = 1994;
export const GRID_SIZE = 100; // 100x100 grid

// Map tile types
export enum MapType {
  GRASS = 0,
  ROCK = 1,
  SAND = 2,
  CRATER = 3,
  LAVA = 4,
}

interface ViewRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

class MapManager extends EventEmitter {
  // Positioning
  private _dragX: number = 0;
  private _dragY: number = 0;
  private _tx: number = 0;
  private _ty: number = 0;
  private _targX: number = 0;
  private _targY: number = 0;

  // Dragging state
  private _dragging: boolean = false;
  private _dragged: boolean = false;
  private _dragDistance: number = 0;
  private _startX: number = 0;
  private _startY: number = 0;
  private _autoScroll: boolean = false;

  // View rectangle
  private _viewRect: ViewRect = { x: 0, y: 0, width: 0, height: 0 };

  // Map layers
  private _GROUND: Container | null = null;
  private _BGTILES: Container | null = null;
  private _BUILDINGBASES: Container | null = null;
  private _WALLS: Container | null = null;
  private _CREEPS: Container | null = null;
  private _BUILDINGTOPS: Container | null = null;
  private _EFFECTS: Container | null = null;
  private _PROJECTILES: Container | null = null;

  // Scroll settings
  private _canScroll: boolean = true;
  private _following: boolean = false;
  private _inited: boolean = false;

  // Ground texture
  private _groundTiles: TilingSprite | null = null;
  private _groundTexture: string = 'grass';

  constructor() {
    super();
  }

  /**
   * Initialize the map
   */
  async init(texture: string = 'grass'): Promise<void> {
    if (this._inited) return;

    console.log('[MAP] Initializing...');
    this._groundTexture = texture;

    // Get map layer from renderer
    this._GROUND = gameRenderer.getLayer('map');
    if (!this._GROUND) {
      console.error('Map layer not found');
      return;
    }

    // Initialize position
    this._tx = GLOBAL._SCREENINIT.width / 2;
    this._ty = GLOBAL._SCREENINIT.height / 2;

    // Update view rect
    this.resizeViewRect();

    // Create sub-layers
    this._BGTILES = new Container();
    this._BUILDINGBASES = new Container();
    this._WALLS = new Container();
    this._CREEPS = new Container();
    this._BUILDINGTOPS = new Container();
    this._EFFECTS = new Container();
    this._PROJECTILES = new Container();

    this._GROUND.addChild(this._BGTILES);
    this._GROUND.addChild(this._BUILDINGBASES);
    this._GROUND.addChild(this._WALLS);
    this._GROUND.addChild(this._CREEPS);
    this._GROUND.addChild(this._BUILDINGTOPS);
    this._GROUND.addChild(this._EFFECTS);
    this._GROUND.addChild(this._PROJECTILES);

    // Create ground tiles
    await this.createGroundTiles();

    // Setup input handlers
    this.setupInputHandlers();

    // Center map
    this.focus(0, 0);

    this._inited = true;
    console.log('[MAP] Initialized');
  }

  /**
   * Create the ground tile rendering
   */
  private async createGroundTiles(): Promise<void> {
    if (!this._BGTILES) return;

    // Create isometric ground pattern
    const groundGraphics = new Graphics();
    
    // Draw isometric tile grid
    const tilesWide = Math.ceil(GRID_SIZE * 1.5);
    const tilesHigh = Math.ceil(GRID_SIZE * 1.5);

    for (let gy = -10; gy < tilesHigh; gy++) {
      for (let gx = -10; gx < tilesWide; gx++) {
        const pos = gridToScreen(gx, gy);
        this.drawIsometricTile(groundGraphics, pos.x, pos.y, this.getTileColor(gx, gy));
      }
    }

    this._BGTILES.addChild(groundGraphics);
  }

  /**
   * Draw a single isometric tile
   */
  private drawIsometricTile(graphics: Graphics, x: number, y: number, color: number): void {
    // Draw filled tile
    graphics.beginPath();
    graphics.moveTo(x, y - TILE_HEIGHT / 2);
    graphics.lineTo(x + TILE_WIDTH / 2, y);
    graphics.lineTo(x, y + TILE_HEIGHT / 2);
    graphics.lineTo(x - TILE_WIDTH / 2, y);
    graphics.closePath();
    graphics.fill(color);
    
    // Add subtle grid lines
    graphics.stroke({ color: 0x2a5a2a, width: 0.5, alpha: 0.3 });
  }

  /**
   * Get tile color based on position
   */
  private getTileColor(gx: number, gy: number): number {
    // Create some variation in grass colors
    const seed = (gx * 31 + gy * 17) % 100;
    
    if (this._groundTexture === 'lava') {
      // Lava colors
      const lavaColors = [0x4a1a1a, 0x5a2a2a, 0x6a3a3a, 0x7a4a4a];
      return lavaColors[seed % lavaColors.length];
    }
    
    // Grass colors
    const baseColors = [0x3a8a3a, 0x4a9a4a, 0x3a7a3a, 0x4a8a4a, 0x5a9a5a];
    return baseColors[seed % baseColors.length];
  }

  /**
   * Setup mouse/touch input handlers
   */
  private setupInputHandlers(): void {
    if (!this._GROUND) return;

    this._GROUND.eventMode = 'static';
    this._GROUND.cursor = 'grab';

    // Mouse/touch events on document for better drag handling
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));

    // Wheel for zoom
    document.addEventListener('wheel', (e) => this.onWheel(e));
  }

  private onMouseDown(e: MouseEvent): void {
    if (!this._canScroll) return;
    if (!(e.target as HTMLElement)?.closest('#game-container')) return;

    this._dragging = true;
    this._dragged = false;
    this._dragDistance = 0;
    this._startX = e.clientX;
    this._startY = e.clientY;
    this._dragX = this._tx;
    this._dragY = this._ty;

    if (this._GROUND) {
      this._GROUND.cursor = 'grabbing';
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this._dragging) return;

    const dx = e.clientX - this._startX;
    const dy = e.clientY - this._startY;
    this._dragDistance = Math.sqrt(dx * dx + dy * dy);

    if (this._dragDistance > 5) {
      this._dragged = true;
      this._tx = this._dragX + dx;
      this._ty = this._dragY + dy;
      this.updatePosition();
    }
  }

  private onMouseUp(_e: MouseEvent): void {
    this._dragging = false;
    if (this._GROUND) {
      this._GROUND.cursor = 'grab';
    }
  }

  private onWheel(e: WheelEvent): void {
    if (!(e.target as HTMLElement)?.closest('#game-container')) return;
    
    e.preventDefault();
    
    // Zoom in/out
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    const newMagnification = Math.max(0.5, Math.min(2, GLOBAL._magnification + zoomDelta));
    
    if (newMagnification !== GLOBAL._magnification) {
      GLOBAL._magnification = newMagnification;
      if (this._GROUND) {
        this._GROUND.scale.set(GLOBAL._magnification);
      }
      this.updatePosition();
    }
  }

  /**
   * Update map position
   */
  private updatePosition(): void {
    if (!this._GROUND) return;

    // Clamp position to map bounds
    const halfWidth = gameRenderer.width / 2;
    const halfHeight = gameRenderer.height / 2;
    const maxX = MAP_WIDTH / 2;
    const maxY = MAP_HEIGHT / 2;

    this._tx = Math.max(-maxX + halfWidth, Math.min(maxX - halfWidth, this._tx));
    this._ty = Math.max(-maxY + halfHeight, Math.min(maxY - halfHeight, this._ty));

    // Update ground position
    this._GROUND.x = this._tx + gameRenderer.width / 2;
    this._GROUND.y = this._ty + gameRenderer.height / 2;

    this.emit('positionChanged', { x: this._tx, y: this._ty });
  }

  /**
   * Focus on a grid position
   */
  focus(gridX: number, gridY: number, duration: number = 0): void {
    const screenPos = gridToScreen(gridX, gridY);
    this._targX = -screenPos.x;
    this._targY = -screenPos.y;

    if (duration > 0) {
      // Animate to position
      const startX = this._tx;
      const startY = this._ty;
      const startTime = performance.now();

      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = this.easeInOut(progress);

        this._tx = startX + (this._targX - startX) * eased;
        this._ty = startY + (this._targY - startY) * eased;
        this.updatePosition();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else {
      this._tx = this._targX;
      this._ty = this._targY;
      this.updatePosition();
    }
  }

  /**
   * Focus to a point with animation
   */
  focusTo(gridX: number, gridY: number, duration: number = 0.4): void {
    this.focus(gridX, gridY, duration);
  }

  /**
   * Ease in-out function
   */
  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Resize the view rectangle
   */
  resizeViewRect(): void {
    this._viewRect = {
      x: GLOBAL._SCREEN.x + MAP_WIDTH / 2,
      y: GLOBAL._SCREEN.y + MAP_HEIGHT / 2,
      width: GLOBAL._SCREEN.width,
      height: GLOBAL._SCREEN.height,
    };

    this.updatePosition();
  }

  /**
   * Convert screen coordinates to grid coordinates
   */
  screenToGrid(screenX: number, screenY: number): { x: number; y: number } {
    // Adjust for map position
    const mapX = screenX - this._tx - gameRenderer.width / 2;
    const mapY = screenY - this._ty - gameRenderer.height / 2;
    return screenToGrid(mapX, mapY);
  }

  /**
   * Convert grid coordinates to screen coordinates
   */
  gridToScreen(gridX: number, gridY: number): { x: number; y: number } {
    const pos = gridToScreen(gridX, gridY);
    return {
      x: pos.x + this._tx + gameRenderer.width / 2,
      y: pos.y + this._ty + gameRenderer.height / 2,
    };
  }

  /**
   * Sort depth of display objects
   */
  sortDepth(): void {
    // Sort building containers by y position for proper layering
    if (this._BUILDINGBASES) {
      this._BUILDINGBASES.children.sort((a, b) => a.y - b.y);
    }
    if (this._BUILDINGTOPS) {
      this._BUILDINGTOPS.children.sort((a, b) => a.y - b.y);
    }
  }

  /**
   * Clear the map
   */
  clear(): void {
    if (this._BUILDINGBASES) this._BUILDINGBASES.removeChildren();
    if (this._WALLS) this._WALLS.removeChildren();
    if (this._CREEPS) this._CREEPS.removeChildren();
    if (this._BUILDINGTOPS) this._BUILDINGTOPS.removeChildren();
    if (this._EFFECTS) this._EFFECTS.removeChildren();
    if (this._PROJECTILES) this._PROJECTILES.removeChildren();
  }

  // Getters for containers
  get GROUND(): Container | null { return this._GROUND; }
  get BGTILES(): Container | null { return this._BGTILES; }
  get BUILDINGBASES(): Container | null { return this._BUILDINGBASES; }
  get WALLS(): Container | null { return this._WALLS; }
  get CREEPS(): Container | null { return this._CREEPS; }
  get BUILDINGTOPS(): Container | null { return this._BUILDINGTOPS; }
  get EFFECTS(): Container | null { return this._EFFECTS; }
  get PROJECTILES(): Container | null { return this._PROJECTILES; }

  get tx(): number { return this._tx; }
  get ty(): number { return this._ty; }
  get dragging(): boolean { return this._dragging; }
  get dragged(): boolean { return this._dragged; }

  set canScroll(value: boolean) { this._canScroll = value; }
  get canScroll(): boolean { return this._canScroll; }
}

export const MAP = new MapManager();
