/**
 * CreatureManager - Manages all creatures on the map
 * Ported from ActionScript CREATURES.as
 */

import { Creature, CreatureState } from './Creature';
import { globalEvents } from '../../utils/EventEmitter';
import { GAME_EVENTS, MONSTER_TYPES } from '../../core/config';

export interface HatchingQueue {
  type: number;
  level: number;
  timeRemaining: number;
}

export class CreatureManager {
  private static instance: CreatureManager;
  
  // Active creatures on the map
  private creatures: Map<number, Creature> = new Map();
  
  // Creature counts by type (in housing)
  private creatureCounts: Map<number, number> = new Map();
  
  // Hatching queue
  private hatchingQueue: HatchingQueue[] = [];
  
  // Housing capacity
  private housingCapacity: number = 0;
  private currentHousing: number = 0;
  
  private constructor() {
    // Initialize creature counts
    Object.values(MONSTER_TYPES).forEach(type => {
      if (typeof type === 'number') {
        this.creatureCounts.set(type, 0);
      }
    });
  }
  
  static getInstance(): CreatureManager {
    if (!CreatureManager.instance) {
      CreatureManager.instance = new CreatureManager();
    }
    return CreatureManager.instance;
  }
  
  /**
   * Initialize from base data
   */
  loadFromData(monsterData: Record<string, unknown>): void {
    // Clear existing
    this.clear();
    
    // Parse monster data
    if (monsterData) {
      // The monster data format: { type: count }
      for (const [typeStr, count] of Object.entries(monsterData)) {
        const type = parseInt(typeStr);
        if (!isNaN(type) && typeof count === 'number') {
          this.creatureCounts.set(type, count);
        }
      }
    }
    
    this.updateCurrentHousing();
  }
  
  /**
   * Get monster data for saving
   */
  getMonsterData(): Record<string, number> {
    const data: Record<string, number> = {};
    this.creatureCounts.forEach((count, type) => {
      if (count > 0) {
        data[type.toString()] = count;
      }
    });
    return data;
  }
  
  /**
   * Set housing capacity (from housing buildings)
   */
  setHousingCapacity(capacity: number): void {
    this.housingCapacity = capacity;
  }
  
  /**
   * Get current housing capacity
   */
  getHousingCapacity(): number {
    return this.housingCapacity;
  }
  
  /**
   * Get current housing used
   */
  getCurrentHousing(): number {
    return this.currentHousing;
  }
  
  /**
   * Update current housing used
   */
  private updateCurrentHousing(): void {
    let total = 0;
    this.creatureCounts.forEach((count, type) => {
      const creature = new Creature(type);
      total += creature.getHousingSpace() * count;
    });
    this.currentHousing = total;
  }
  
  /**
   * Get available housing space
   */
  getAvailableHousing(): number {
    return this.housingCapacity - this.currentHousing;
  }
  
  /**
   * Get count of a monster type
   */
  getMonsterCount(type: number): number {
    return this.creatureCounts.get(type) || 0;
  }
  
  /**
   * Add monsters to housing
   */
  addMonsters(type: number, count: number): boolean {
    const creature = new Creature(type);
    const spaceNeeded = creature.getHousingSpace() * count;
    
    if (spaceNeeded > this.getAvailableHousing()) {
      return false;
    }
    
    const currentCount = this.creatureCounts.get(type) || 0;
    this.creatureCounts.set(type, currentCount + count);
    this.currentHousing += spaceNeeded;
    
    return true;
  }
  
  /**
   * Remove monsters from housing
   */
  removeMonsters(type: number, count: number): boolean {
    const currentCount = this.creatureCounts.get(type) || 0;
    if (count > currentCount) {
      return false;
    }
    
    const creature = new Creature(type);
    const spaceFreed = creature.getHousingSpace() * count;
    
    this.creatureCounts.set(type, currentCount - count);
    this.currentHousing -= spaceFreed;
    
    return true;
  }
  
  /**
   * Spawn a creature on the map
   */
  spawnCreature(type: number, level: number, x: number, y: number, isEnemy: boolean = false): Creature | null {
    // Check if we have the monster in housing (if not enemy)
    if (!isEnemy) {
      const available = this.getMonsterCount(type);
      if (available <= 0) {
        return null;
      }
      
      // Remove from housing
      this.removeMonsters(type, 1);
    }
    
    // Create creature
    const creature = new Creature(type, level);
    creature.setPosition(x, y);
    creature.isEnemy = isEnemy;
    creature.addToMap();
    
    // Add to active creatures
    this.creatures.set(creature.id, creature);
    
    globalEvents.emit(GAME_EVENTS.CREATURE_SPAWNED, creature);
    
    return creature;
  }
  
  /**
   * Remove a creature from the map
   */
  removeCreature(id: number): void {
    const creature = this.creatures.get(id);
    if (creature) {
      creature.removeFromMap();
      this.creatures.delete(id);
    }
  }
  
  /**
   * Kill a creature
   */
  killCreature(id: number): void {
    const creature = this.creatures.get(id);
    if (creature) {
      creature.die();
      
      // Death event will trigger removal
      globalEvents.emit(GAME_EVENTS.CREATURE_DIED, creature);
    }
  }
  
  /**
   * Get all active creatures
   */
  getActiveCreatures(): Creature[] {
    return Array.from(this.creatures.values());
  }
  
  /**
   * Get active creatures by team
   */
  getCreaturesByTeam(isEnemy: boolean): Creature[] {
    return this.getActiveCreatures().filter(c => c.isEnemy === isEnemy);
  }
  
  /**
   * Queue a creature for hatching
   */
  queueHatching(type: number, level: number, time: number): void {
    this.hatchingQueue.push({
      type,
      level,
      timeRemaining: time,
    });
  }
  
  /**
   * Get hatching queue
   */
  getHatchingQueue(): HatchingQueue[] {
    return [...this.hatchingQueue];
  }
  
  /**
   * Cancel hatching at index
   */
  cancelHatching(index: number): boolean {
    if (index < 0 || index >= this.hatchingQueue.length) {
      return false;
    }
    
    this.hatchingQueue.splice(index, 1);
    return true;
  }
  
  /**
   * Clear all creatures
   */
  clear(): void {
    // Remove all active creatures
    this.creatures.forEach(creature => {
      creature.removeFromMap();
    });
    this.creatures.clear();
    
    // Clear counts
    this.creatureCounts.forEach((_, type) => {
      this.creatureCounts.set(type, 0);
    });
    
    this.currentHousing = 0;
    this.hatchingQueue = [];
  }
  
  /**
   * Clear only active creatures (for battle end)
   */
  clearActive(): void {
    this.creatures.forEach(creature => {
      creature.removeFromMap();
    });
    this.creatures.clear();
  }
  
  /**
   * Game tick update
   */
  tick(delta: number): void {
    // Update all active creatures
    this.creatures.forEach((creature, id) => {
      creature.tick(delta);
      
      // Remove dead creatures
      if (creature.state === CreatureState.DEAD) {
        this.creatures.delete(id);
      }
    });
    
    // Update hatching queue
    if (this.hatchingQueue.length > 0) {
      const hatching = this.hatchingQueue[0];
      hatching.timeRemaining -= delta / 60; // Convert to seconds
      
      if (hatching.timeRemaining <= 0) {
        // Hatching complete
        this.addMonsters(hatching.type, 1);
        this.hatchingQueue.shift();
      }
    }
  }
  
  /**
   * Get total monster count
   */
  getTotalMonsterCount(): number {
    let total = 0;
    this.creatureCounts.forEach(count => {
      total += count;
    });
    return total;
  }
  
  /**
   * Check if a monster type is unlocked
   */
  isMonsterUnlocked(type: number): boolean {
    // This would check lab research level
    // For now, return true for basic monsters
    return type <= MONSTER_TYPES.FINK;
  }
}

// Export singleton
export const creatures = CreatureManager.getInstance();
