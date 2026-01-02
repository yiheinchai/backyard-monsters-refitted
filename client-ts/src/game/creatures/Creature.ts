/**
 * Creature - Base class for all monsters/creatures in the game
 * Ported from ActionScript CREEP.as and MonsterBase.as
 */

import { Container, Graphics, Sprite } from 'pixi.js';
import { SecNum } from '../../utils/SecNum';
import { MONSTER_TYPES, MovementType } from '../../core/config';
import { game } from '../../core/Game';
import { assets } from '../../assets/AssetManager';

// Monster properties from game data
export interface MonsterProperties {
  id: number;
  name: string;
  health: number[];       // HP per level
  damage: number[];       // Damage per level
  speed: number;          // Movement speed
  range: number;          // Attack range
  attackSpeed: number;    // Attack cooldown
  housingSpace: number;   // Housing cost
  movementType: MovementType;
  preferredTargets?: number[];  // Building types it prefers
  specialAbility?: string;
}

// Creature state
export enum CreatureState {
  IDLE = 'idle',
  MOVING = 'moving',
  ATTACKING = 'attacking',
  DYING = 'dying',
  DEAD = 'dead',
}

export class Creature {
  // Identification
  public readonly id: number;
  public readonly type: number;
  public readonly level: number;
  
  // Position (in world coordinates)
  public x: number = 0;
  public y: number = 0;
  
  // Target position for movement
  public targetX: number = 0;
  public targetY: number = 0;
  
  // Stats
  public health: SecNum;
  public maxHealth: number;
  public damage: number;
  public speed: number;
  public range: number;
  public attackSpeed: number;
  
  // State
  public state: CreatureState = CreatureState.IDLE;
  public movementType: MovementType;
  
  // Combat
  public currentTarget: unknown = null;
  public attackCooldown: number = 0;
  public lastAttackTime: number = 0;
  
  // Display
  private container?: Container;
  private sprite?: Sprite | Graphics;
  private healthBar?: Graphics;
  private shadowGraphic?: Graphics;
  
  // Properties
  public properties?: MonsterProperties;
  
  // Flags
  public isEnemy: boolean = false;
  public isDefender: boolean = false;
  
  constructor(type: number, level: number = 1) {
    this.id = game.state.getNextCreepId();
    this.type = type;
    this.level = level;
    
    // Load properties
    this.properties = this.getMonsterProperties(type);
    
    // Set stats based on level
    this.maxHealth = this.properties?.health[level - 1] || 100;
    this.health = new SecNum(this.maxHealth);
    this.damage = this.properties?.damage[level - 1] || 10;
    this.speed = this.properties?.speed || 1;
    this.range = this.properties?.range || 1;
    this.attackSpeed = this.properties?.attackSpeed || 1;
    this.movementType = this.properties?.movementType || MovementType.GROUND;
  }
  
  /**
   * Get monster properties based on type
   */
  private getMonsterProperties(type: number): MonsterProperties {
    // Default properties - would be loaded from game data
    const monsterData: Record<number, MonsterProperties> = {
      [MONSTER_TYPES.POKEY]: {
        id: MONSTER_TYPES.POKEY,
        name: 'Pokey',
        health: [200, 250, 300, 360, 430, 520],
        damage: [35, 42, 50, 60, 72, 87],
        speed: 1.5,
        range: 0,
        attackSpeed: 0.8,
        housingSpace: 10,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.OCTO_OOZE]: {
        id: MONSTER_TYPES.OCTO_OOZE,
        name: 'Octo-ooze',
        health: [250, 310, 370, 450, 540, 650],
        damage: [30, 36, 43, 52, 62, 75],
        speed: 1.2,
        range: 0,
        attackSpeed: 0.7,
        housingSpace: 15,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.BOLT]: {
        id: MONSTER_TYPES.BOLT,
        name: 'Bolt',
        health: [180, 220, 270, 320, 390, 470],
        damage: [25, 30, 36, 43, 52, 62],
        speed: 2.5,
        range: 0,
        attackSpeed: 0.5,
        housingSpace: 10,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.FINK]: {
        id: MONSTER_TYPES.FINK,
        name: 'Fink',
        health: [300, 360, 440, 520, 630, 760],
        damage: [40, 48, 58, 70, 84, 100],
        speed: 1.0,
        range: 3,
        attackSpeed: 1.0,
        housingSpace: 20,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.EYE_RA]: {
        id: MONSTER_TYPES.EYE_RA,
        name: 'Eye-ra',
        health: [150, 185, 220, 270, 320, 390],
        damage: [150, 180, 220, 260, 320, 380],
        speed: 0.8,
        range: 0,
        attackSpeed: 0.5,
        housingSpace: 30,
        movementType: MovementType.GROUND,
        specialAbility: 'suicide_bomb',
      },
      [MONSTER_TYPES.ICHI]: {
        id: MONSTER_TYPES.ICHI,
        name: 'Ichi',
        health: [400, 480, 580, 700, 840, 1010],
        damage: [20, 24, 29, 35, 42, 50],
        speed: 0.8,
        range: 0,
        attackSpeed: 0.8,
        housingSpace: 25,
        movementType: MovementType.GROUND,
        specialAbility: 'splash_damage',
      },
      [MONSTER_TYPES.CRABATRON]: {
        id: MONSTER_TYPES.CRABATRON,
        name: 'Crabatron',
        health: [600, 720, 870, 1040, 1250, 1500],
        damage: [55, 66, 80, 96, 115, 138],
        speed: 0.5,
        range: 0,
        attackSpeed: 1.2,
        housingSpace: 45,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.PROJECT_X]: {
        id: MONSTER_TYPES.PROJECT_X,
        name: 'Project X',
        health: [350, 420, 510, 610, 730, 880],
        damage: [45, 54, 65, 78, 94, 112],
        speed: 1.8,
        range: 0,
        attackSpeed: 0.6,
        housingSpace: 30,
        movementType: MovementType.GROUND,
        preferredTargets: [14], // Town Hall
      },
      [MONSTER_TYPES.BRAIN]: {
        id: MONSTER_TYPES.BRAIN,
        name: 'Brain',
        health: [250, 300, 360, 440, 520, 630],
        damage: [35, 42, 50, 60, 72, 87],
        speed: 1.0,
        range: 5,
        attackSpeed: 1.0,
        housingSpace: 35,
        movementType: MovementType.GROUND,
      },
      [MONSTER_TYPES.TERATORN]: {
        id: MONSTER_TYPES.TERATORN,
        name: 'Teratorn',
        health: [280, 340, 410, 490, 590, 710],
        damage: [30, 36, 43, 52, 62, 75],
        speed: 1.5,
        range: 0,
        attackSpeed: 0.8,
        housingSpace: 40,
        movementType: MovementType.FLYING,
      },
      [MONSTER_TYPES.WORMZER]: {
        id: MONSTER_TYPES.WORMZER,
        name: 'Wormzer',
        health: [350, 420, 510, 610, 730, 880],
        damage: [40, 48, 58, 70, 84, 100],
        speed: 1.0,
        range: 0,
        attackSpeed: 0.9,
        housingSpace: 35,
        movementType: MovementType.UNDERGROUND,
      },
      [MONSTER_TYPES.D_A_V_E]: {
        id: MONSTER_TYPES.D_A_V_E,
        name: 'D.A.V.E.',
        health: [1200, 1440, 1730, 2080, 2500, 3000],
        damage: [80, 96, 115, 138, 166, 200],
        speed: 0.4,
        range: 0,
        attackSpeed: 1.5,
        housingSpace: 120,
        movementType: MovementType.GROUND,
        specialAbility: 'rockets',
      },
      [MONSTER_TYPES.ZAFREETI]: {
        id: MONSTER_TYPES.ZAFREETI,
        name: 'Zafreeti',
        health: [200, 240, 290, 350, 420, 500],
        damage: [0, 0, 0, 0, 0, 0], // Healer, no damage
        speed: 1.5,
        range: 4,
        attackSpeed: 0.5,
        housingSpace: 50,
        movementType: MovementType.FLYING,
        specialAbility: 'heal',
      },
    };
    
    return monsterData[type] || {
      id: type,
      name: `Monster ${type}`,
      health: [100, 120, 145, 175, 210, 250],
      damage: [10, 12, 15, 18, 22, 26],
      speed: 1.0,
      range: 0,
      attackSpeed: 1.0,
      housingSpace: 10,
      movementType: MovementType.GROUND,
    };
  }
  
  /**
   * Add creature to the map
   */
  addToMap(): void {
    this.container = new Container();
    this.container.label = `creature_${this.id}`;
    this.container.position.set(this.x, this.y);
    
    // Create shadow
    this.createShadow();
    
    // Create sprite
    this.createSprite();
    
    // Create health bar
    this.createHealthBar();
    
    // Add to creatures layer
    const creaturesLayer = game.mapRenderer?.getCreaturesLayer();
    if (creaturesLayer && this.container) {
      creaturesLayer.addChild(this.container);
    }
  }
  
  /**
   * Create shadow under creature
   */
  private createShadow(): void {
    if (!this.container) return;
    
    this.shadowGraphic = new Graphics();
    this.shadowGraphic.ellipse(0, 5, 15, 8);
    this.shadowGraphic.fill({ color: 0x000000, alpha: 0.3 });
    this.container.addChild(this.shadowGraphic);
  }
  
  /**
   * Create the creature sprite
   */
  private async createSprite(): Promise<void> {
    if (!this.container) return;
    
    // Try to load actual texture
    try {
      const texture = await assets.getMonsterSprite(this.type);
      if (texture) {
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 1);
        this.container.addChild(this.sprite);
        return;
      }
    } catch {
      // Fall back to placeholder
    }
    
    // Create placeholder graphic
    this.sprite = this.createPlaceholderGraphic();
    this.container.addChild(this.sprite);
  }
  
  /**
   * Create placeholder graphic for creature
   */
  private createPlaceholderGraphic(): Graphics {
    const graphic = new Graphics();
    const color = this.getCreatureColor();
    
    // Draw a simple creature shape
    const size = 15;
    
    // Body
    graphic.circle(0, -size, size);
    graphic.fill(color);
    
    // Eyes
    graphic.circle(-5, -size - 3, 4);
    graphic.circle(5, -size - 3, 4);
    graphic.fill(0xFFFFFF);
    
    graphic.circle(-5, -size - 3, 2);
    graphic.circle(5, -size - 3, 2);
    graphic.fill(0x000000);
    
    return graphic;
  }
  
  /**
   * Get color based on monster type
   */
  private getCreatureColor(): number {
    const colors: Record<number, number> = {
      [MONSTER_TYPES.POKEY]: 0x8B4513,      // Brown
      [MONSTER_TYPES.OCTO_OOZE]: 0x00FF00,  // Green
      [MONSTER_TYPES.BOLT]: 0xFFFF00,        // Yellow
      [MONSTER_TYPES.FINK]: 0xFF6B35,        // Orange
      [MONSTER_TYPES.EYE_RA]: 0xFF0000,      // Red
      [MONSTER_TYPES.ICHI]: 0xADD8E6,        // Light blue
      [MONSTER_TYPES.CRABATRON]: 0xFF4500,   // Orange red
      [MONSTER_TYPES.PROJECT_X]: 0x800080,   // Purple
      [MONSTER_TYPES.BRAIN]: 0xFF69B4,       // Pink
      [MONSTER_TYPES.TERATORN]: 0x4169E1,    // Royal blue
      [MONSTER_TYPES.WORMZER]: 0x8B0000,     // Dark red
      [MONSTER_TYPES.D_A_V_E]: 0x696969,     // Gray
      [MONSTER_TYPES.ZAFREETI]: 0x00CED1,    // Dark cyan
    };
    
    return colors[this.type] || 0x808080;
  }
  
  /**
   * Create health bar
   */
  private createHealthBar(): void {
    if (!this.container) return;
    
    this.healthBar = new Graphics();
    this.updateHealthBar();
    this.healthBar.position.set(0, -35);
    this.container.addChild(this.healthBar);
  }
  
  /**
   * Update health bar display
   */
  private updateHealthBar(): void {
    if (!this.healthBar) return;
    
    const width = 30;
    const height = 4;
    const healthPercent = this.health.Get() / this.maxHealth;
    
    this.healthBar.clear();
    
    // Background
    this.healthBar.rect(-width / 2, 0, width, height);
    this.healthBar.fill(0x333333);
    
    // Health fill
    const fillColor = healthPercent > 0.5 ? 0x00FF00 : healthPercent > 0.25 ? 0xFFFF00 : 0xFF0000;
    this.healthBar.rect(-width / 2 + 0.5, 0.5, (width - 1) * healthPercent, height - 1);
    this.healthBar.fill(fillColor);
    
    // Hide if full health
    this.healthBar.visible = healthPercent < 1;
  }
  
  /**
   * Remove creature from map
   */
  removeFromMap(): void {
    if (this.container) {
      this.container.destroy({ children: true });
      this.container = undefined;
    }
    this.sprite = undefined;
    this.healthBar = undefined;
    this.shadowGraphic = undefined;
  }
  
  /**
   * Set creature position
   */
  setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    
    if (this.container) {
      this.container.position.set(x, y);
    }
  }
  
  /**
   * Move towards target position
   */
  moveTowards(targetX: number, targetY: number): void {
    this.targetX = targetX;
    this.targetY = targetY;
    this.state = CreatureState.MOVING;
  }
  
  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    const newHealth = this.health.Get() - amount;
    this.health.Set(Math.max(0, newHealth));
    this.updateHealthBar();
    
    if (this.health.Get() <= 0) {
      this.die();
    }
  }
  
  /**
   * Heal the creature
   */
  heal(amount: number): void {
    const newHealth = Math.min(this.health.Get() + amount, this.maxHealth);
    this.health.Set(newHealth);
    this.updateHealthBar();
  }
  
  /**
   * Kill the creature
   */
  die(): void {
    this.state = CreatureState.DYING;
    
    // Death animation would go here
    // For now, just remove
    setTimeout(() => {
      this.state = CreatureState.DEAD;
      this.removeFromMap();
    }, 500);
  }
  
  /**
   * Attack current target
   */
  attack(): void {
    if (!this.currentTarget || this.attackCooldown > 0) {
      return;
    }
    
    this.state = CreatureState.ATTACKING;
    this.attackCooldown = this.attackSpeed;
    
    // Deal damage to target
    // This would be implemented based on target type
  }
  
  /**
   * Game tick update
   */
  tick(delta: number): void {
    // Update cooldowns
    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta / 60;
    }
    
    // Update based on state
    switch (this.state) {
      case CreatureState.MOVING:
        this.updateMovement(delta);
        break;
      case CreatureState.ATTACKING:
        // Attack logic
        if (this.attackCooldown <= 0) {
          this.state = CreatureState.IDLE;
        }
        break;
      case CreatureState.IDLE:
        // Look for targets
        break;
    }
    
    // Update position
    if (this.container) {
      this.container.position.set(this.x, this.y);
    }
  }
  
  /**
   * Update movement towards target
   */
  private updateMovement(delta: number): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 5) {
      // Reached target
      this.state = CreatureState.IDLE;
      return;
    }
    
    // Move towards target
    const moveAmount = this.speed * delta;
    const ratio = moveAmount / distance;
    
    this.x += dx * ratio;
    this.y += dy * ratio;
  }
  
  /**
   * Get creature name
   */
  getName(): string {
    return this.properties?.name || `Monster ${this.type}`;
  }
  
  /**
   * Get housing space requirement
   */
  getHousingSpace(): number {
    return this.properties?.housingSpace || 10;
  }
  
  /**
   * Check if creature is alive
   */
  isAlive(): boolean {
    return this.state !== CreatureState.DEAD && this.state !== CreatureState.DYING;
  }
}
