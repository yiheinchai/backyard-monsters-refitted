/**
 * Monster - Monster entity for the game
 * Converted from ActionScript monster classes
 * 
 * Represents a single monster/creature
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { EventEmitter } from '../../core/EventEmitter';
import { gridToScreen, TILE_WIDTH, TILE_HEIGHT } from '../../rendering/IsometricUtils';

// Movement constants
/** Scale factor to convert delta time to grid movement units */
const MOVEMENT_DELTA_SCALE = 0.01;
/** Minimum distance to target before snapping to exact position */
const MOVEMENT_SNAP_THRESHOLD = 0.1;

// Monster type IDs (from original game)
export const MONSTER_TYPES = {
  POKEY: 1,
  OCTO_OOZ: 2,
  BOLT: 3,
  FINK: 4,
  EYE_RA: 5,
  ICHI: 6,
  BANDITO: 7,
  FANG: 8,
  BRAIN: 9,
  CRABATRON: 10,
  PROJECT_X: 11,
  WORMZER: 12,
  TERATORN: 13,
  ZAFREETI: 14,
  VORG: 15,
  D_A_V_E: 16,
  SABNOX: 17,
  BALTHAZAR: 18,
  GROKUS: 19,
  SPURTZ: 20,
  ZAGNOID: 21,
  VALGOS: 22,
  MALPHUS: 23,
  KING_WORMZER: 24,
  DRULL: 25,
  GORGO: 26,
  FOMOR: 27,
  KORATH: 28,
  KRALLEN: 29,
  DIAMOND_SPURTZ: 30,
  REZGHUL: 31,
  SLIMEATTIKUS: 32,
  CHAMPION: 33,
};

// Monster names
export const MONSTER_NAMES: Record<number, string> = {
  [MONSTER_TYPES.POKEY]: 'Pokey',
  [MONSTER_TYPES.OCTO_OOZ]: 'Octo-ooze',
  [MONSTER_TYPES.BOLT]: 'Bolt',
  [MONSTER_TYPES.FINK]: 'Fink',
  [MONSTER_TYPES.EYE_RA]: 'Eye-ra',
  [MONSTER_TYPES.ICHI]: 'Ichi',
  [MONSTER_TYPES.BANDITO]: 'Bandito',
  [MONSTER_TYPES.FANG]: 'Fang',
  [MONSTER_TYPES.BRAIN]: 'Brain',
  [MONSTER_TYPES.CRABATRON]: 'Crabatron',
  [MONSTER_TYPES.PROJECT_X]: 'Project X',
  [MONSTER_TYPES.WORMZER]: 'Wormzer',
  [MONSTER_TYPES.TERATORN]: 'Teratorn',
  [MONSTER_TYPES.ZAFREETI]: 'Zafreeti',
  [MONSTER_TYPES.VORG]: 'Vorg',
  [MONSTER_TYPES.D_A_V_E]: 'D.A.V.E.',
  [MONSTER_TYPES.SABNOX]: 'Sabnox',
  [MONSTER_TYPES.BALTHAZAR]: 'Balthazar',
  [MONSTER_TYPES.GROKUS]: 'Grokus',
  [MONSTER_TYPES.SPURTZ]: 'Spurtz',
  [MONSTER_TYPES.ZAGNOID]: 'Zagnoid',
  [MONSTER_TYPES.VALGOS]: 'Valgos',
  [MONSTER_TYPES.MALPHUS]: 'Malphus',
  [MONSTER_TYPES.KING_WORMZER]: 'King Wormzer',
  [MONSTER_TYPES.DRULL]: 'Drull',
  [MONSTER_TYPES.GORGO]: 'Gorgo',
  [MONSTER_TYPES.FOMOR]: 'Fomor',
  [MONSTER_TYPES.KORATH]: 'Korath',
  [MONSTER_TYPES.KRALLEN]: 'Krallen',
  [MONSTER_TYPES.DIAMOND_SPURTZ]: 'Diamond Spurtz',
  [MONSTER_TYPES.REZGHUL]: 'Rezghul',
  [MONSTER_TYPES.SLIMEATTIKUS]: 'Slimeattikus',
  [MONSTER_TYPES.CHAMPION]: 'Champion',
};

// Monster colors for visual representation
export const MONSTER_COLORS: Record<number, number> = {
  [MONSTER_TYPES.POKEY]: 0x8B4513,
  [MONSTER_TYPES.OCTO_OOZ]: 0x9932CC,
  [MONSTER_TYPES.BOLT]: 0xFFD700,
  [MONSTER_TYPES.FINK]: 0x228B22,
  [MONSTER_TYPES.EYE_RA]: 0xFF4500,
  [MONSTER_TYPES.ICHI]: 0x4169E1,
  [MONSTER_TYPES.BANDITO]: 0x8B0000,
  [MONSTER_TYPES.FANG]: 0x2F4F4F,
  [MONSTER_TYPES.BRAIN]: 0xFF69B4,
  [MONSTER_TYPES.CRABATRON]: 0xB22222,
  [MONSTER_TYPES.PROJECT_X]: 0x00FF00,
  [MONSTER_TYPES.WORMZER]: 0xD2691E,
  [MONSTER_TYPES.TERATORN]: 0x8B008B,
  [MONSTER_TYPES.ZAFREETI]: 0x00CED1,
  [MONSTER_TYPES.VORG]: 0x556B2F,
  [MONSTER_TYPES.D_A_V_E]: 0x4682B4,
  [MONSTER_TYPES.SABNOX]: 0x800080,
  [MONSTER_TYPES.BALTHAZAR]: 0xDC143C,
  [MONSTER_TYPES.GROKUS]: 0x6B8E23,
  [MONSTER_TYPES.SPURTZ]: 0xADFF2F,
  [MONSTER_TYPES.ZAGNOID]: 0x7B68EE,
  [MONSTER_TYPES.VALGOS]: 0xCD5C5C,
  [MONSTER_TYPES.MALPHUS]: 0x191970,
  [MONSTER_TYPES.KING_WORMZER]: 0xFF8C00,
  [MONSTER_TYPES.DRULL]: 0x8B4513,
  [MONSTER_TYPES.GORGO]: 0x2E8B57,
  [MONSTER_TYPES.FOMOR]: 0x483D8B,
  [MONSTER_TYPES.KORATH]: 0xB8860B,
  [MONSTER_TYPES.KRALLEN]: 0x708090,
  [MONSTER_TYPES.DIAMOND_SPURTZ]: 0x00FFFF,
  [MONSTER_TYPES.REZGHUL]: 0x800000,
  [MONSTER_TYPES.SLIMEATTIKUS]: 0x32CD32,
  [MONSTER_TYPES.CHAMPION]: 0xFFD700,
};

export interface MonsterData {
  id: number;
  type: number;
  level: number;
  x: number;
  y: number;
  health?: number;
  maxHealth?: number;
  targetX?: number;
  targetY?: number;
}

export class Monster extends EventEmitter {
  private _data: MonsterData;
  private _container: Container;
  private _graphics: Graphics;
  private _healthBar: Graphics | null = null;
  private _labelText: Text | null = null;
  
  // Position
  private _gridX: number = 0;
  private _gridY: number = 0;
  private _screenX: number = 0;
  private _screenY: number = 0;
  
  // Movement
  private _targetX: number = 0;
  private _targetY: number = 0;
  private _moving: boolean = false;
  private _speed: number = 2;
  
  // State
  private _health: number = 100;
  private _maxHealth: number = 100;
  private _level: number = 1;
  private _alive: boolean = true;

  constructor(data: MonsterData) {
    super();
    
    this._data = data;
    this._gridX = data.x;
    this._gridY = data.y;
    this._targetX = data.targetX ?? data.x;
    this._targetY = data.targetY ?? data.y;
    this._level = data.level;
    this._health = data.health ?? 100;
    this._maxHealth = data.maxHealth ?? 100;
    
    // Create container
    this._container = new Container();
    this._graphics = new Graphics();
    this._container.addChild(this._graphics);
    
    // Update position
    this.updateScreenPosition();
    
    // Render
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
   * Render the monster
   */
  private render(): void {
    this._graphics.clear();
    
    const color = MONSTER_COLORS[this._data.type] || 0x888888;
    const size = 16;
    
    // Draw monster body (simple circle for now)
    this._graphics.circle(0, -size/2, size/2);
    this._graphics.fill({ color });
    this._graphics.stroke({ color: 0x000000, width: 2 });
    
    // Draw health bar
    this.renderHealthBar();
    
    // Draw level indicator
    this.renderLevelIndicator();
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
    
    const width = 20;
    const height = 4;
    const healthPercent = this._health / this._maxHealth;
    
    // Background
    this._healthBar.rect(-width/2, -24, width, height);
    this._healthBar.fill({ color: 0x333333 });
    
    // Health fill
    const healthColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this._healthBar.rect(-width/2, -24, width * healthPercent, height);
    this._healthBar.fill({ color: healthColor });
    
    // Border
    this._healthBar.rect(-width/2, -24, width, height);
    this._healthBar.stroke({ color: 0x000000, width: 1 });
  }

  /**
   * Render level indicator
   */
  private renderLevelIndicator(): void {
    if (!this._labelText) {
      const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 10,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
      });
      this._labelText = new Text({ text: '', style });
      this._labelText.anchor.set(0.5, 0.5);
      this._container.addChild(this._labelText);
    }
    
    this._labelText.text = `L${this._level}`;
    this._labelText.y = -8;
  }

  /**
   * Update monster (called each frame)
   */
  update(delta: number): void {
    if (!this._alive) return;
    
    // Handle movement
    if (this._moving) {
      this.updateMovement(delta);
    }
  }

  /**
   * Update movement towards target
   */
  private updateMovement(delta: number): void {
    const dx = this._targetX - this._gridX;
    const dy = this._targetY - this._gridY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < MOVEMENT_SNAP_THRESHOLD) {
      this._gridX = this._targetX;
      this._gridY = this._targetY;
      this._moving = false;
      this.emit('reachedTarget', this);
      return;
    }
    
    const moveX = (dx / distance) * this._speed * delta * MOVEMENT_DELTA_SCALE;
    const moveY = (dy / distance) * this._speed * delta * MOVEMENT_DELTA_SCALE;
    
    this._gridX += moveX;
    this._gridY += moveY;
    
    this.updateScreenPosition();
  }

  /**
   * Move to target position
   */
  moveTo(x: number, y: number): void {
    this._targetX = x;
    this._targetY = y;
    this._moving = true;
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this._health = Math.max(0, this._health - amount);
    this.renderHealthBar();
    
    if (this._health <= 0) {
      this.die();
    }
    
    this.emit('damaged', this, amount);
  }

  /**
   * Heal
   */
  heal(amount: number): void {
    this._health = Math.min(this._maxHealth, this._health + amount);
    this.renderHealthBar();
    this.emit('healed', this, amount);
  }

  /**
   * Die
   */
  die(): void {
    this._alive = false;
    this._container.alpha = 0.5;
    this.emit('died', this);
  }

  // Getters
  get id(): number { return this._data.id; }
  get type(): number { return this._data.type; }
  get name(): string { return MONSTER_NAMES[this._data.type] || 'Unknown'; }
  get level(): number { return this._level; }
  get health(): number { return this._health; }
  get maxHealth(): number { return this._maxHealth; }
  get gridX(): number { return this._gridX; }
  get gridY(): number { return this._gridY; }
  get alive(): boolean { return this._alive; }
  get container(): Container { return this._container; }
  get data(): MonsterData { return this._data; }

  /**
   * Destroy the monster
   */
  destroy(): void {
    this._container.destroy({ children: true });
  }
}
