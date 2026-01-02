/**
 * HOUSING - Monster housing system for the Backyard Monsters client
 * This is the TypeScript equivalent of HOUSING.as
 */

import { GLOBAL } from '@/core/Global';
import { SecNum } from '@/utils';
import { BUILDINGS } from './Buildings';
import { MONSTER_PROPS } from './Creatures';

interface HousedMonster {
  type: number;
  level: number;
  count: SecNum;
}

/**
 * HOUSING class - manages monster housing
 */
export class HOUSING {
  // Housed monsters (type -> HousedMonster)
  private static monsters: Map<number, HousedMonster> = new Map();
  
  // Total capacity used
  private static _used: SecNum = new SecNum(0);

  /**
   * Initialize housing system
   */
  static Setup(): void {
    HOUSING.monsters.clear();
    HOUSING._used = new SecNum(0);
  }

  /**
   * Load monsters from save data
   */
  static Load(data: Record<string, { type: number; level: number; count: number }>): void {
    HOUSING.monsters.clear();
    
    for (const key in data) {
      const monsterData = data[key];
      HOUSING.monsters.set(monsterData.type, {
        type: monsterData.type,
        level: monsterData.level,
        count: new SecNum(monsterData.count)
      });
    }
    
    HOUSING.updateUsed();
  }

  /**
   * Add monsters to housing
   */
  static Add(type: number, level: number, count: number): boolean {
    const props = MONSTER_PROPS[type];
    if (!props) return false;

    const spaceNeeded = props.housingSpace * count;
    const available = HOUSING.GetAvailable();
    
    if (spaceNeeded > available) {
      return false;
    }

    let monster = HOUSING.monsters.get(type);
    
    if (!monster) {
      monster = {
        type,
        level,
        count: new SecNum(0)
      };
      HOUSING.monsters.set(type, monster);
    }

    monster.count.Add(count);
    HOUSING.updateUsed();
    
    return true;
  }

  /**
   * Remove monsters from housing
   */
  static Remove(type: number, count: number): boolean {
    const monster = HOUSING.monsters.get(type);
    if (!monster) return false;

    const currentCount = monster.count.Get();
    if (count > currentCount) {
      return false;
    }

    monster.count.Subtract(count);
    
    if (monster.count.Get() <= 0) {
      HOUSING.monsters.delete(type);
    }
    
    HOUSING.updateUsed();
    return true;
  }

  /**
   * Get monster count by type
   */
  static GetCount(type: number): number {
    const monster = HOUSING.monsters.get(type);
    return monster ? monster.count.Get() : 0;
  }

  /**
   * Get total capacity
   */
  static GetCapacity(): number {
    return BUILDINGS.GetTotalHousingCapacity() + 
           GLOBAL._extraHousingPower.Get();
  }

  /**
   * Get used capacity
   */
  static GetUsed(): number {
    return HOUSING._used.Get();
  }

  /**
   * Get available capacity
   */
  static GetAvailable(): number {
    return HOUSING.GetCapacity() - HOUSING.GetUsed();
  }

  /**
   * Update used capacity
   */
  private static updateUsed(): void {
    let total = 0;
    
    HOUSING.monsters.forEach(monster => {
      const props = MONSTER_PROPS[monster.type];
      if (props) {
        total += props.housingSpace * monster.count.Get();
      }
    });
    
    HOUSING._used.Set(total);
  }

  /**
   * Get all housed monsters
   */
  static GetAll(): HousedMonster[] {
    return Array.from(HOUSING.monsters.values());
  }

  /**
   * Get total monster count
   */
  static GetTotalCount(): number {
    let total = 0;
    HOUSING.monsters.forEach(monster => {
      total += monster.count.Get();
    });
    return total;
  }

  /**
   * Check if can house monster
   */
  static CanHouse(type: number, count: number = 1): boolean {
    const props = MONSTER_PROPS[type];
    if (!props) return false;
    
    const spaceNeeded = props.housingSpace * count;
    return HOUSING.GetAvailable() >= spaceNeeded;
  }

  /**
   * Cull housing (called when changing modes)
   */
  static Cull(): void {
    // Store current housing state for attacker
  }

  /**
   * Update housing (called each tick)
   */
  static Update(): void {
    // Any per-tick updates
  }

  /**
   * Catchup tick (for time processing)
   */
  static catchupTick(_ticks: number): void {
    // Process any time-based housing updates
  }

  /**
   * Serialize to save data
   */
  static toSaveData(): Record<string, { type: number; level: number; count: number }> {
    const data: Record<string, { type: number; level: number; count: number }> = {};
    
    HOUSING.monsters.forEach((monster, type) => {
      data[type.toString()] = {
        type: monster.type,
        level: monster.level,
        count: monster.count.Get()
      };
    });
    
    return data;
  }
}

export default HOUSING;
