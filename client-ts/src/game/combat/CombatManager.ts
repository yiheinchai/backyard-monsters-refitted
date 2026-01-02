/**
 * CombatManager - Handles combat/attack logic
 * Ported from ActionScript ATTACK.as and related combat classes
 */

import { Container } from 'pixi.js';
import { game } from '../../core/Game';
import { globalEvents } from '../../utils/EventEmitter';
import { GAME_EVENTS, BaseMode } from '../../core/config';
import { Creature } from '../creatures/Creature';
import { creatures } from '../creatures/CreatureManager';
import { Building } from '../buildings/Building';
import { Projectile } from './Projectile';

export interface AttackResult {
  success: boolean;
  damageDealt: number;
  resourcesLooted: {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
  };
  buildingsDestroyed: number;
  monstersLost: number;
}

export interface DefenseTarget {
  building: Building;
  priority: number;
  distance: number;
}

export class CombatManager {
  private static instance: CombatManager;
  
  // Active projectiles
  private projectiles: Projectile[] = [];
  
  // Combat state
  private isInCombat: boolean = false;
  private attackDuration: number = 180; // 3 minutes in seconds
  private attackTimeRemaining: number = 0;
  
  // Targeting
  private enemyBuildings: Building[] = [];
  
  // Combat stats
  private totalDamageDealt: number = 0;
  private resourcesLooted: { r1: number; r2: number; r3: number; r4: number } = { r1: 0, r2: 0, r3: 0, r4: 0 };
  private buildingsDestroyed: number = 0;
  private monstersLost: number = 0;
  
  // Display layer
  private projectilesLayer?: Container;
  
  private constructor() {}
  
  static getInstance(): CombatManager {
    if (!CombatManager.instance) {
      CombatManager.instance = new CombatManager();
    }
    return CombatManager.instance;
  }
  
  /**
   * Start an attack on a base
   */
  startAttack(targetBuildings: Building[]): void {
    if (this.isInCombat) {
      console.warn('Already in combat');
      return;
    }
    
    this.isInCombat = true;
    this.attackTimeRemaining = this.attackDuration;
    
    // Store enemy buildings
    this.enemyBuildings = targetBuildings;
    
    // Reset stats
    this.totalDamageDealt = 0;
    this.resourcesLooted = { r1: 0, r2: 0, r3: 0, r4: 0 };
    this.buildingsDestroyed = 0;
    this.monstersLost = 0;
    
    // Get projectiles layer
    this.projectilesLayer = game.mapRenderer?.getProjectilesLayer();
    
    // Set game mode
    game.state.mode = BaseMode.ATTACK;
    
    globalEvents.emit(GAME_EVENTS.ATTACK_STARTED);
    
    console.log('Attack started!');
  }
  
  /**
   * End the current attack
   */
  endAttack(): AttackResult {
    this.isInCombat = false;
    
    // Clear all active creatures
    creatures.clearActive();
    
    // Clear projectiles
    this.clearProjectiles();
    
    // Set game mode back
    game.state.mode = BaseMode.BUILD;
    
    const result: AttackResult = {
      success: this.buildingsDestroyed > 0,
      damageDealt: this.totalDamageDealt,
      resourcesLooted: { ...this.resourcesLooted },
      buildingsDestroyed: this.buildingsDestroyed,
      monstersLost: this.monstersLost,
    };
    
    globalEvents.emit(GAME_EVENTS.ATTACK_ENDED, result);
    
    console.log('Attack ended:', result);
    
    return result;
  }
  
  /**
   * Fling a monster onto the battlefield
   */
  flingMonster(type: number, level: number, x: number, y: number): Creature | null {
    if (!this.isInCombat) {
      console.warn('Not in combat');
      return null;
    }
    
    // Spawn the creature
    const creature = creatures.spawnCreature(type, level, x, y, false);
    
    if (creature) {
      // Find nearest target
      const target = this.findNearestTarget(creature);
      if (target) {
        creature.moveTowards(target.x, target.y);
      }
    }
    
    return creature;
  }
  
  /**
   * Find nearest target for a creature
   */
  private findNearestTarget(creature: Creature): { x: number; y: number } | null {
    let nearestBuilding: Building | null = null;
    let nearestDistance = Infinity;
    
    for (const building of this.enemyBuildings) {
      if (building.health.Get() <= 0) continue;
      
      const worldPos = building.getWorldPosition();
      const dx = worldPos.x - creature.x;
      const dy = worldPos.y - creature.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestBuilding = building;
      }
    }
    
    if (nearestBuilding) {
      return nearestBuilding.getWorldPosition();
    }
    
    return null;
  }
  
  /**
   * Create a projectile
   */
  createProjectile(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    damage: number,
    speed: number = 10,
    color: number = 0xFFFF00
  ): Projectile {
    const projectile = new Projectile(startX, startY, targetX, targetY, damage, speed, color);
    
    if (this.projectilesLayer) {
      projectile.addToLayer(this.projectilesLayer);
    }
    
    this.projectiles.push(projectile);
    return projectile;
  }
  
  /**
   * Tower fires at a target
   */
  towerFire(tower: Building, target: Creature): void {
    const towerPos = tower.getWorldPosition();
    
    // Create projectile
    const damage = tower.getDamage?.() || 50;
    this.createProjectile(
      towerPos.x,
      towerPos.y - 30, // Adjust for tower height
      target.x,
      target.y,
      damage,
      15,
      0xFF0000
    );
  }
  
  /**
   * Apply damage to a target
   */
  applyDamage(target: Creature | Building, amount: number): void {
    if (target instanceof Creature) {
      target.takeDamage(amount);
      
      if (!target.isAlive()) {
        this.monstersLost++;
      }
    } else {
      target.takeDamage(amount);
      this.totalDamageDealt += amount;
      
      if (target.health.Get() <= 0) {
        this.buildingsDestroyed++;
        this.onBuildingDestroyed(target);
      }
    }
  }
  
  /**
   * Handle building destruction
   */
  private onBuildingDestroyed(building: Building): void {
    // Loot resources from building
    const storedResources = building.stored?.Get() || 0;
    
    // Determine which resource based on building type
    // This is simplified - actual logic would check building type
    if (storedResources > 0) {
      this.resourcesLooted.r1 += Math.floor(storedResources / 4);
      this.resourcesLooted.r2 += Math.floor(storedResources / 4);
      this.resourcesLooted.r3 += Math.floor(storedResources / 4);
      this.resourcesLooted.r4 += Math.floor(storedResources / 4);
    }
  }
  
  /**
   * Clear all projectiles
   */
  private clearProjectiles(): void {
    for (const projectile of this.projectiles) {
      projectile.destroy();
    }
    this.projectiles = [];
  }
  
  /**
   * Get time remaining in attack
   */
  getTimeRemaining(): number {
    return this.attackTimeRemaining;
  }
  
  /**
   * Check if in combat
   */
  isAttacking(): boolean {
    return this.isInCombat;
  }
  
  /**
   * Get current combat stats
   */
  getCombatStats(): {
    damageDealt: number;
    resourcesLooted: { r1: number; r2: number; r3: number; r4: number };
    buildingsDestroyed: number;
    monstersLost: number;
  } {
    return {
      damageDealt: this.totalDamageDealt,
      resourcesLooted: { ...this.resourcesLooted },
      buildingsDestroyed: this.buildingsDestroyed,
      monstersLost: this.monstersLost,
    };
  }
  
  /**
   * Game tick update
   */
  tick(delta: number): void {
    if (!this.isInCombat) return;
    
    // Update attack timer
    this.attackTimeRemaining -= delta / 60; // Convert to seconds
    
    if (this.attackTimeRemaining <= 0) {
      this.endAttack();
      return;
    }
    
    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.tick(delta);
      
      if (projectile.hasReachedTarget()) {
        // Apply damage at target location
        // Find creatures at target
        const targetCreatures = creatures.getActiveCreatures().filter(c => {
          const dx = c.x - projectile.targetX;
          const dy = c.y - projectile.targetY;
          return Math.sqrt(dx * dx + dy * dy) < 20;
        });
        
        for (const creature of targetCreatures) {
          this.applyDamage(creature, projectile.damage);
        }
        
        projectile.destroy();
        this.projectiles.splice(i, 1);
      }
    }
    
    // Update creature targeting and attacks
    this.updateCreatureCombat(delta);
    
    // Update tower targeting
    this.updateTowerCombat(delta);
    
    // Check win/lose conditions
    this.checkCombatEnd();
  }
  
  /**
   * Update creature combat AI
   */
  private updateCreatureCombat(_delta: number): void {
    const attackerCreatures = creatures.getCreaturesByTeam(false);
    
    for (const creature of attackerCreatures) {
      if (!creature.isAlive()) continue;
      
      // If creature has no target, find one
      if (!creature.currentTarget) {
        const target = this.findNearestTarget(creature);
        if (target) {
          creature.moveTowards(target.x, target.y);
        }
      }
      
      // Check if in attack range of any building
      for (const building of this.enemyBuildings) {
        if (building.health.Get() <= 0) continue;
        
        const buildingPos = building.getWorldPosition();
        const dx = buildingPos.x - creature.x;
        const dy = buildingPos.y - creature.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If in range, attack
        if (distance < 50 + creature.range * 10) {
          if (creature.attackCooldown <= 0) {
            this.applyDamage(building, creature.damage);
            creature.attackCooldown = creature.attackSpeed;
            creature.attack();
          }
        }
      }
    }
  }
  
  /**
   * Update tower combat AI
   */
  private updateTowerCombat(_delta: number): void {
    // Get defender towers
    const towers = this.enemyBuildings.filter(b => b.isDefense);
    const attackerCreatures = creatures.getCreaturesByTeam(false);
    
    for (const tower of towers) {
      if (tower.health.Get() <= 0) continue;
      
      // Find nearest attacker creature
      const towerPos = tower.getWorldPosition();
      let nearestCreature: Creature | null = null;
      let nearestDistance = Infinity;
      
      for (const creature of attackerCreatures) {
        if (!creature.isAlive()) continue;
        
        const dx = creature.x - towerPos.x;
        const dy = creature.y - towerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const range = tower.getRange?.() || 200;
        if (distance < range && distance < nearestDistance) {
          nearestDistance = distance;
          nearestCreature = creature;
        }
      }
      
      // Fire at target if cooldown is ready
      if (nearestCreature && tower.attackCooldown <= 0) {
        this.towerFire(tower, nearestCreature);
        tower.attackCooldown = tower.getAttackSpeed?.() || 1.5;
      }
    }
  }
  
  /**
   * Check if combat should end
   */
  private checkCombatEnd(): void {
    // Check if all attackers are dead
    const attackerCreatures = creatures.getCreaturesByTeam(false);
    const aliveAttackers = attackerCreatures.filter(c => c.isAlive());
    
    if (aliveAttackers.length === 0 && creatures.getTotalMonsterCount() === 0) {
      // No more monsters to fling
      console.log('All attackers defeated');
      this.endAttack();
      return;
    }
    
    // Check if all buildings are destroyed
    const aliveBuildings = this.enemyBuildings.filter(b => b.health.Get() > 0);
    if (aliveBuildings.length === 0) {
      console.log('All buildings destroyed!');
      this.endAttack();
      return;
    }
  }
}

// Export singleton
export const combat = CombatManager.getInstance();
