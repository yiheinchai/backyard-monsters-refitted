/**
 * CREATURES - Creature/Monster system for the Backyard Monsters client
 * This is the TypeScript equivalent of CREATURES.as
 */

// import { GLOBAL } from '@/core/Global';
import { SecNum } from '@/utils';
import { Point } from '@/types';

// Monster type IDs
export const MonsterTypes = {
  // Basic monsters
  POKEY: 1,
  OCTO_OZE: 2,
  BOLT: 3,
  FINK: 4,
  EYE_RA: 5,
  ICH: 6,
  BANDITO: 7,
  FANG: 8,
  BRAIN: 9,
  CRABATRON: 10,
  PROJECT_X: 11,
  SLIMEATTIKUS: 12,
  WORMZER: 13,
  ZAFREETI: 14,
  TERATORN: 15,
  DAVE: 16,
  
  // Champion types
  DRULL: 100,
  GORGO: 101,
  FOMOR: 102,
  KORATH: 103
};

// Monster properties
export interface MonsterProps {
  id: number;
  name: string;
  type: string;
  description?: string;
  health: number[];
  damage: number[];
  speed: number[];
  housingSpace: number;
  hatchTime: number[];
  movement: 'ground' | 'flying' | 'underground';
  attackType: 'melee' | 'ranged';
  attackRange: number;
  preferredTarget?: string;
}

// Monster properties database
export const MONSTER_PROPS: Record<number, MonsterProps> = {
  [MonsterTypes.POKEY]: {
    id: MonsterTypes.POKEY,
    name: 'Pokey',
    type: 'basic',
    description: 'Basic melee monster',
    health: [100, 120, 145, 175, 210, 250],
    damage: [15, 18, 22, 26, 31, 37],
    speed: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    housingSpace: 10,
    hatchTime: [15, 15, 15, 15, 15, 15],
    movement: 'ground',
    attackType: 'melee',
    attackRange: 0
  },
  [MonsterTypes.OCTO_OZE]: {
    id: MonsterTypes.OCTO_OZE,
    name: 'Octo-Oze',
    type: 'basic',
    description: 'Ranged monster that attacks towers',
    health: [150, 180, 215, 260, 310, 370],
    damage: [25, 30, 36, 43, 52, 62],
    speed: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
    housingSpace: 15,
    hatchTime: [30, 30, 30, 30, 30, 30],
    movement: 'ground',
    attackType: 'ranged',
    attackRange: 200,
    preferredTarget: 'tower'
  },
  [MonsterTypes.BOLT]: {
    id: MonsterTypes.BOLT,
    name: 'Bolt',
    type: 'basic',
    description: 'Fast ground unit',
    health: [80, 95, 115, 138, 165, 198],
    damage: [12, 14, 17, 20, 24, 29],
    speed: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0],
    housingSpace: 8,
    hatchTime: [10, 10, 10, 10, 10, 10],
    movement: 'ground',
    attackType: 'melee',
    attackRange: 0
  },
  [MonsterTypes.FINK]: {
    id: MonsterTypes.FINK,
    name: 'Fink',
    type: 'basic',
    description: 'Flying monster',
    health: [60, 72, 86, 103, 124, 149],
    damage: [10, 12, 14, 17, 20, 24],
    speed: [2.0, 2.0, 2.0, 2.0, 2.0, 2.0],
    housingSpace: 5,
    hatchTime: [8, 8, 8, 8, 8, 8],
    movement: 'flying',
    attackType: 'melee',
    attackRange: 0
  },
  [MonsterTypes.EYE_RA]: {
    id: MonsterTypes.EYE_RA,
    name: 'Eye-ra',
    type: 'basic',
    description: 'Suicide bomber',
    health: [500, 600, 720, 864, 1037, 1244],
    damage: [1000, 1200, 1440, 1728, 2074, 2488],
    speed: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    housingSpace: 40,
    hatchTime: [120, 120, 120, 120, 120, 120],
    movement: 'ground',
    attackType: 'melee',
    attackRange: 0
  },
  [MonsterTypes.ICH]: {
    id: MonsterTypes.ICH,
    name: 'Ichi',
    type: 'basic',
    description: 'Underground unit',
    health: [200, 240, 288, 346, 415, 498],
    damage: [30, 36, 43, 52, 62, 74],
    speed: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
    housingSpace: 20,
    hatchTime: [60, 60, 60, 60, 60, 60],
    movement: 'underground',
    attackType: 'melee',
    attackRange: 0
  }
};

/**
 * Creature instance class
 */
export class Creature {
  // Identification
  id: number;
  type: number;
  
  // Stats
  level: SecNum;
  health: SecNum;
  maxHealth: SecNum;
  damage: SecNum;
  speed: number;
  
  // Position
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  
  // State
  state: 'idle' | 'moving' | 'attacking' | 'dead';
  target: unknown | null;
  
  // Movement
  movement: 'ground' | 'flying' | 'underground';
  
  // Visual
  angle: number;
  visible: boolean;

  constructor(type: number, level: number = 1, x: number = 0, y: number = 0) {
    this.id = CREATURES._creepCount++;
    this.type = type;
    this.level = new SecNum(level);
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.state = 'idle';
    this.target = null;
    this.angle = 0;
    this.visible = true;

    const props = MONSTER_PROPS[type];
    if (props) {
      const lvl = Math.max(0, Math.min(level - 1, props.health.length - 1));
      this.health = new SecNum(props.health[lvl]);
      this.maxHealth = new SecNum(props.health[lvl]);
      this.damage = new SecNum(props.damage[lvl]);
      this.speed = props.speed[lvl];
      this.movement = props.movement;
    } else {
      this.health = new SecNum(100);
      this.maxHealth = new SecNum(100);
      this.damage = new SecNum(10);
      this.speed = 1;
      this.movement = 'ground';
    }
  }

  /**
   * Get monster properties
   */
  get props(): MonsterProps | undefined {
    return MONSTER_PROPS[this.type];
  }

  /**
   * Get monster name
   */
  get name(): string {
    return this.props?.name || 'Unknown Monster';
  }

  /**
   * Tick update
   */
  tick(): boolean {
    if (this.state === 'dead') {
      return true; // Should be removed
    }

    // Update movement
    if (this.state === 'moving') {
      this.updateMovement();
    }

    // Update attack
    if (this.state === 'attacking') {
      this.updateAttack();
    }

    return false;
  }

  /**
   * Update movement
   */
  private updateMovement(): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.state = 'idle';
    } else {
      const moveX = (dx / dist) * this.speed;
      const moveY = (dy / dist) * this.speed;
      this.x += moveX;
      this.y += moveY;
      this.angle = Math.atan2(dy, dx);
    }
  }

  /**
   * Update attack
   */
  private updateAttack(): void {
    // Attack logic will be implemented with ATTACK system
  }

  /**
   * Move to position
   */
  moveTo(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
    this.state = 'moving';
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health.Subtract(amount);
    if (this.health.Get() <= 0) {
      this.health.Set(0);
      this.state = 'dead';
    }
  }

  /**
   * Heal
   */
  heal(amount: number): void {
    this.health.Add(amount);
    if (this.health.Get() > this.maxHealth.Get()) {
      this.health.Set(this.maxHealth.Get());
    }
  }

  /**
   * Check if alive
   */
  get isAlive(): boolean {
    return this.health.Get() > 0 && this.state !== 'dead';
  }

  /**
   * Get health percentage
   */
  get healthPercent(): number {
    return this.health.Get() / this.maxHealth.Get();
  }

  /**
   * Get position as Point
   */
  get position(): Point {
    return { x: this.x, y: this.y };
  }
}

/**
 * CREATURES class - manages all creatures/monsters
 */
export class CREATURES {
  // Active creatures
  private static creatures: Map<number, Creature> = new Map();
  
  // Guardian creature
  static _guardian: Creature | null = null;
  static _guardianList: Creature[] = [];
  
  // Creature count
  static _creepCount: number = 0;

  /**
   * Initialize creatures system
   */
  static Setup(): void {
    CREATURES.creatures.clear();
    CREATURES._guardian = null;
    CREATURES._guardianList = [];
    CREATURES._creepCount = 0;
  }

  /**
   * Add a creature
   */
  static Add(creature: Creature): void {
    CREATURES.creatures.set(creature.id, creature);
  }

  /**
   * Remove a creature
   */
  static Remove(id: number): void {
    CREATURES.creatures.delete(id);
  }

  /**
   * Get creature by ID
   */
  static Get(id: number): Creature | undefined {
    return CREATURES.creatures.get(id);
  }

  /**
   * Get all creatures
   */
  static GetAll(): Creature[] {
    return Array.from(CREATURES.creatures.values());
  }

  /**
   * Get creatures by type
   */
  static GetByType(type: number): Creature[] {
    return CREATURES.GetAll().filter(c => c.type === type);
  }

  /**
   * Spawn creature
   */
  static Spawn(type: number, level: number, x: number, y: number): Creature {
    const creature = new Creature(type, level, x, y);
    CREATURES.Add(creature);
    return creature;
  }

  /**
   * Tick all creatures
   */
  static Tick(): void {
    const toRemove: number[] = [];

    CREATURES.creatures.forEach((creature, id) => {
      if (creature.tick()) {
        toRemove.push(id);
      }
    });

    // Remove dead creatures
    toRemove.forEach(id => CREATURES.Remove(id));

    // Update guardian
    if (CREATURES._guardian && CREATURES._guardian.tick()) {
      CREATURES._guardian = null;
    }
  }

  /**
   * Get creature count
   */
  static get count(): number {
    return CREATURES.creatures.size;
  }

  /**
   * Clear all creatures
   */
  static Clear(): void {
    CREATURES.creatures.clear();
    CREATURES._guardian = null;
    CREATURES._guardianList = [];
  }

  /**
   * Get creatures in range
   */
  static GetInRange(x: number, y: number, range: number): Creature[] {
    const rangeSquared = range * range;
    return CREATURES.GetAll().filter(creature => {
      const dx = creature.x - x;
      const dy = creature.y - y;
      return (dx * dx + dy * dy) <= rangeSquared && creature.isAlive;
    });
  }

  /**
   * Get nearest creature
   */
  static GetNearest(x: number, y: number, filter?: (c: Creature) => boolean): Creature | null {
    let nearest: Creature | null = null;
    let nearestDist = Infinity;

    CREATURES.creatures.forEach(creature => {
      if (!creature.isAlive) return;
      if (filter && !filter(creature)) return;

      const dx = creature.x - x;
      const dy = creature.y - y;
      const dist = dx * dx + dy * dy;

      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = creature;
      }
    });

    return nearest;
  }

  /**
   * Get monster properties
   */
  static GetMonsterProps(type: number): MonsterProps | undefined {
    return MONSTER_PROPS[type];
  }
}

export default CREATURES;
