/**
 * ATTACK - Combat system for the Backyard Monsters client
 * This is the TypeScript equivalent of ATTACK.as
 */

import { GLOBAL, e_BASE_MODE } from '@/core/Global';
import { SecNum } from '@/utils';
import { CREATURES, Creature } from './Creatures';
import { BUILDINGS, BuildingInstance } from './Buildings';

export interface AttackResult {
  victory: boolean;
  damage: number;
  monstersLost: number;
  resourcesLooted: {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
  };
  buildingsDestroyed: number;
  timeElapsed: number;
}

/**
 * ATTACK class - manages combat
 */
export class ATTACK {
  // Attack state
  static _attacking: boolean = false;
  static _countdown: number = 60 * 5; // 5 minutes
  static _started: boolean = false;
  static _ended: boolean = false;
  
  // Attack results
  static _damage: SecNum = new SecNum(0);
  static _monstersDeployed: number = 0;
  static _monstersLost: number = 0;
  static _buildingsDestroyed: number = 0;
  
  // Resources looted
  static _loot: {
    r1: SecNum;
    r2: SecNum;
    r3: SecNum;
    r4: SecNum;
  } = {
    r1: new SecNum(0),
    r2: new SecNum(0),
    r3: new SecNum(0),
    r4: new SecNum(0)
  };
  
  // Deployed monsters
  private static deployedMonsters: Creature[] = [];

  /**
   * Initialize attack system
   */
  static Setup(): void {
    ATTACK._attacking = false;
    ATTACK._countdown = 60 * 5;
    ATTACK._started = false;
    ATTACK._ended = false;
    ATTACK._damage = new SecNum(0);
    ATTACK._monstersDeployed = 0;
    ATTACK._monstersLost = 0;
    ATTACK._buildingsDestroyed = 0;
    ATTACK._loot = {
      r1: new SecNum(0),
      r2: new SecNum(0),
      r3: new SecNum(0),
      r4: new SecNum(0)
    };
    ATTACK.deployedMonsters = [];
  }

  /**
   * Start an attack
   */
  static Start(): void {
    ATTACK.Setup();
    ATTACK._attacking = true;
    ATTACK._started = true;
  }

  /**
   * Deploy a monster
   */
  static DeployMonster(type: number, level: number, x: number, y: number): Creature | null {
    if (!ATTACK._attacking || ATTACK._ended) {
      return null;
    }

    const creature = CREATURES.Spawn(type, level, x, y);
    ATTACK.deployedMonsters.push(creature);
    ATTACK._monstersDeployed++;
    
    // Find nearest target
    ATTACK.assignTarget(creature);
    
    return creature;
  }

  /**
   * Assign target to creature
   */
  private static assignTarget(creature: Creature): void {
    const buildings = BUILDINGS.GetAllBuildings().filter(b => !b.destroyed);
    
    if (buildings.length === 0) return;

    // Find nearest building
    let nearestBuilding: BuildingInstance | null = null;
    let nearestDist = Infinity;

    for (const building of buildings) {
      const dx = building.x - creature.x;
      const dy = building.y - creature.y;
      const dist = dx * dx + dy * dy;

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestBuilding = building;
      }
    }

    if (nearestBuilding) {
      creature.target = nearestBuilding;
      creature.moveTo(nearestBuilding.x, nearestBuilding.y);
    }
  }

  /**
   * Tick function
   */
  static Tick(): void {
    if (!ATTACK._attacking || ATTACK._ended) return;

    // Update countdown
    ATTACK._countdown--;
    
    if (ATTACK._countdown <= 0) {
      ATTACK.End();
      return;
    }

    // Check victory/defeat conditions
    const allMonstersDeployed = ATTACK._monstersDeployed > 0;
    const allMonstersDead = ATTACK.deployedMonsters.filter(m => m.isAlive).length === 0;
    const allBuildingsDestroyed = BUILDINGS.GetAllBuildings().filter(b => !b.destroyed).length === 0;

    if (allBuildingsDestroyed) {
      // Victory!
      ATTACK.End(true);
    } else if (allMonstersDeployed && allMonstersDead) {
      // Defeat!
      ATTACK.End(false);
    }
  }

  /**
   * End the attack
   */
  static End(victory: boolean = false): void {
    ATTACK._attacking = false;
    ATTACK._ended = true;

    // Calculate lost monsters
    ATTACK._monstersLost = ATTACK.deployedMonsters.filter(m => !m.isAlive).length;

    // Calculate destroyed buildings
    ATTACK._buildingsDestroyed = BUILDINGS.GetAllBuildings().filter(b => b.destroyed).length;

    // Show results
    ATTACK.showResults(victory);
  }

  /**
   * Show attack results
   */
  private static showResults(victory: boolean): void {
    console.log('[ATTACK] Attack ended', {
      victory,
      damage: ATTACK._damage.Get(),
      monstersLost: ATTACK._monstersLost,
      buildingsDestroyed: ATTACK._buildingsDestroyed,
      loot: {
        r1: ATTACK._loot.r1.Get(),
        r2: ATTACK._loot.r2.Get(),
        r3: ATTACK._loot.r3.Get(),
        r4: ATTACK._loot.r4.Get()
      }
    });

    // UI will show popup with results
    import('@/ui/Popups').then(({ POPUPS }) => {
      const message = victory 
        ? `Victory! You destroyed ${ATTACK._buildingsDestroyed} buildings and looted resources!`
        : `Attack ended. You destroyed ${ATTACK._buildingsDestroyed} buildings.`;
      POPUPS.Info(message, 'Attack Results');
    });
  }

  /**
   * Get attack results
   */
  static GetResults(): AttackResult {
    return {
      victory: ATTACK._ended && BUILDINGS.GetAllBuildings().filter(b => !b.destroyed).length === 0,
      damage: ATTACK._damage.Get(),
      monstersLost: ATTACK._monstersLost,
      resourcesLooted: {
        r1: ATTACK._loot.r1.Get(),
        r2: ATTACK._loot.r2.Get(),
        r3: ATTACK._loot.r3.Get(),
        r4: ATTACK._loot.r4.Get()
      },
      buildingsDestroyed: ATTACK._buildingsDestroyed,
      timeElapsed: (60 * 5) - ATTACK._countdown
    };
  }

  /**
   * Add loot
   */
  static AddLoot(resource: 'r1' | 'r2' | 'r3' | 'r4', amount: number): void {
    ATTACK._loot[resource].Add(amount);
  }

  /**
   * Add damage
   */
  static AddDamage(amount: number): void {
    ATTACK._damage.Add(amount);
  }

  /**
   * Get remaining time
   */
  static GetRemainingTime(): number {
    return ATTACK._countdown;
  }

  /**
   * Get deployed monster count
   */
  static GetDeployedCount(): number {
    return ATTACK._monstersDeployed;
  }

  /**
   * Get alive monster count
   */
  static GetAliveCount(): number {
    return ATTACK.deployedMonsters.filter(m => m.isAlive).length;
  }

  /**
   * Retreat all monsters
   */
  static Retreat(): void {
    for (const creature of ATTACK.deployedMonsters) {
      if (creature.isAlive) {
        creature.state = 'moving';
        // Move off map
        creature.moveTo(-100, -100);
      }
    }
    
    ATTACK.End();
  }

  /**
   * Check if in attack mode
   */
  static get isInAttackMode(): boolean {
    return GLOBAL.mode === e_BASE_MODE.ATTACK || 
           GLOBAL.mode === e_BASE_MODE.WMATTACK;
  }
}

export default ATTACK;
