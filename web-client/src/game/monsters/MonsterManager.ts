/**
 * MonsterManager - Manages all monsters in the game
 * Converted from ActionScript monster management
 */

import { Container } from 'pixi.js';
import { Monster, MonsterData, MONSTER_TYPES, MONSTER_NAMES } from './Monster';
import { EventEmitter } from '../../core/EventEmitter';
import { MAP } from '../../rendering/Map';
import { BASE } from '../../core/Base';

class MonsterManagerClass extends EventEmitter {
  private _monsters: Map<number, Monster> = new Map();
  private _monstersContainer: Container | null = null;
  private _initialized: boolean = false;
  private _nextId: number = 1;

  /**
   * Initialize the monster manager
   */
  async init(): Promise<void> {
    if (this._initialized) return;

    console.log('[MonsterManager] Initializing...');

    // Get monsters container from MAP
    this._monstersContainer = MAP.getCreepsLayer();

    // Listen for base events
    BASE.on('loadComplete', (...args: unknown[]) => {
      const data = args[0] as { monsters?: MonsterData[] };
      if (data.monsters) {
        this.loadMonsters(data.monsters);
      }
    });

    this._initialized = true;
    console.log('[MonsterManager] Initialized');
  }

  /**
   * Load monsters from data
   */
  loadMonsters(monstersData: MonsterData[]): void {
    console.log(`[MonsterManager] Loading ${monstersData.length} monsters`);

    // Clear existing monsters
    this.clear();

    // Create monsters from data
    for (const data of monstersData) {
      this.createMonster(data);
    }

    this.emit('monstersLoaded', this._monsters.size);
  }

  /**
   * Create a monster from data
   */
  createMonster(data: MonsterData): Monster {
    // Assign ID if not provided
    if (!data.id) {
      data.id = this._nextId++;
    }

    // Create monster instance
    const monster = new Monster(data);

    // Add to container
    if (this._monstersContainer) {
      this._monstersContainer.addChild(monster.container);
    }

    // Store reference
    this._monsters.set(data.id, monster);

    // Listen for events using callback that matches EventCallback type
    monster.on('died', (...args: unknown[]) => {
      const m = args[0] as Monster;
      this.emit('monsterDied', m);
    });

    monster.on('damaged', (...args: unknown[]) => {
      const m = args[0] as Monster;
      const amount = args[1] as number;
      this.emit('monsterDamaged', m, amount);
    });

    console.log(`[MonsterManager] Created monster: ${monster.name} (ID: ${data.id})`);

    return monster;
  }

  /**
   * Remove a monster
   */
  removeMonster(id: number): void {
    const monster = this._monsters.get(id);
    if (monster) {
      monster.destroy();
      this._monsters.delete(id);
      console.log(`[MonsterManager] Removed monster ID: ${id}`);
    }
  }

  /**
   * Get a monster by ID
   */
  getMonster(id: number): Monster | undefined {
    return this._monsters.get(id);
  }

  /**
   * Get all monsters
   */
  getAllMonsters(): Monster[] {
    return Array.from(this._monsters.values());
  }

  /**
   * Get monsters by type
   */
  getMonstersByType(type: number): Monster[] {
    return this.getAllMonsters().filter(m => m.type === type);
  }

  /**
   * Get alive monsters
   */
  getAliveMonsters(): Monster[] {
    return this.getAllMonsters().filter(m => m.alive);
  }

  /**
   * Update all monsters
   */
  update(delta: number): void {
    for (const monster of this._monsters.values()) {
      monster.update(delta);
    }
  }

  /**
   * Clear all monsters
   */
  clear(): void {
    for (const monster of this._monsters.values()) {
      monster.destroy();
    }
    this._monsters.clear();
  }

  /**
   * Spawn a monster at position
   */
  spawnMonster(type: number, x: number, y: number, level: number = 1): Monster {
    return this.createMonster({
      id: this._nextId++,
      type,
      level,
      x,
      y,
      health: 100,
      maxHealth: 100,
    });
  }

  /**
   * Get monster count
   */
  get count(): number {
    return this._monsters.size;
  }

  /**
   * Get alive count
   */
  get aliveCount(): number {
    return this.getAliveMonsters().length;
  }
}

// Export singleton
export const MonsterManager = new MonsterManagerClass();

// Re-export types
export { MONSTER_TYPES, MONSTER_NAMES };
