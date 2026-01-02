/**
 * Projectile - Represents a projectile in combat
 * Ported from ActionScript PROJECTILE.as
 */

import { Container, Graphics } from 'pixi.js';

export class Projectile {
  public x: number;
  public y: number;
  public targetX: number;
  public targetY: number;
  public damage: number;
  public speed: number;
  public color: number;
  
  private graphic?: Graphics;
  private hasReached: boolean = false;
  
  constructor(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    damage: number,
    speed: number = 10,
    color: number = 0xFFFF00
  ) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.damage = damage;
    this.speed = speed;
    this.color = color;
  }
  
  /**
   * Add to display layer
   */
  addToLayer(layer: Container): void {
    this.graphic = new Graphics();
    this.graphic.circle(0, 0, 5);
    this.graphic.fill(this.color);
    this.graphic.position.set(this.x, this.y);
    layer.addChild(this.graphic);
  }
  
  /**
   * Update projectile position
   */
  tick(delta: number): void {
    if (this.hasReached) return;
    
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.speed * delta) {
      // Reached target
      this.x = this.targetX;
      this.y = this.targetY;
      this.hasReached = true;
    } else {
      // Move towards target
      const ratio = (this.speed * delta) / distance;
      this.x += dx * ratio;
      this.y += dy * ratio;
    }
    
    // Update graphic position
    if (this.graphic) {
      this.graphic.position.set(this.x, this.y);
    }
  }
  
  /**
   * Check if projectile has reached target
   */
  hasReachedTarget(): boolean {
    return this.hasReached;
  }
  
  /**
   * Destroy projectile
   */
  destroy(): void {
    if (this.graphic) {
      this.graphic.destroy();
      this.graphic = undefined;
    }
  }
}
