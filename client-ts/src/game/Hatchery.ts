/**
 * HATCHERY - Monster hatching system for the Backyard Monsters client
 * This is the TypeScript equivalent of HATCHERY.as
 */

import { GLOBAL } from '@/core/Global';
import { SecNum } from '@/utils';
import { HOUSING } from './Housing';
import { MONSTER_PROPS } from './Creatures';

interface QueueItem {
  type: number;
  level: number;
  timeRemaining: SecNum;
  totalTime: number;
}

/**
 * HATCHERY class - manages monster hatching
 */
export class HATCHERY {
  // Hatchery queue
  private static queue: QueueItem[] = [];
  
  // Max queue size
  private static maxQueueSize: number = 10;
  
  // Is hatching
  private static _hatching: boolean = false;

  /**
   * Initialize hatchery system
   */
  static Setup(): void {
    HATCHERY.queue = [];
    HATCHERY._hatching = false;
  }

  /**
   * Load queue from save data
   */
  static Load(data: Array<{ t: number; l: number; time: number; totalTime: number }>): void {
    HATCHERY.queue = [];
    
    for (const item of data) {
      HATCHERY.queue.push({
        type: item.t,
        level: item.l,
        timeRemaining: new SecNum(item.time),
        totalTime: item.totalTime
      });
    }
    
    HATCHERY._hatching = HATCHERY.queue.length > 0;
  }

  /**
   * Add monster to queue
   */
  static AddToQueue(type: number, level: number = 1): boolean {
    if (HATCHERY.queue.length >= HATCHERY.maxQueueSize) {
      return false;
    }

    const props = MONSTER_PROPS[type];
    if (!props) return false;

    const lvl = Math.max(0, Math.min(level - 1, props.hatchTime.length - 1));
    let hatchTime = props.hatchTime[lvl];
    
    // Apply overdrive
    if (GLOBAL._hatcheryOverdrive > 0) {
      hatchTime = Math.floor(hatchTime * (1 - GLOBAL._hatcheryOverdrivePower.Get() / 100));
    }

    HATCHERY.queue.push({
      type,
      level,
      timeRemaining: new SecNum(hatchTime),
      totalTime: hatchTime
    });

    HATCHERY._hatching = true;
    return true;
  }

  /**
   * Remove item from queue
   */
  static RemoveFromQueue(index: number): boolean {
    if (index < 0 || index >= HATCHERY.queue.length) {
      return false;
    }

    HATCHERY.queue.splice(index, 1);
    HATCHERY._hatching = HATCHERY.queue.length > 0;
    return true;
  }

  /**
   * Cancel current hatch
   */
  static CancelCurrent(): boolean {
    return HATCHERY.RemoveFromQueue(0);
  }

  /**
   * Tick function
   */
  static Tick(): void {
    if (!HATCHERY._hatching || HATCHERY.queue.length === 0) {
      return;
    }

    const current = HATCHERY.queue[0];
    current.timeRemaining.Subtract(1);

    if (current.timeRemaining.Get() <= 0) {
      // Hatching complete
      HATCHERY.onHatchComplete(current);
    }
  }

  /**
   * Called when hatching is complete
   */
  private static onHatchComplete(item: QueueItem): void {
    // Try to add to housing
    if (HOUSING.Add(item.type, item.level, 1)) {
      // Success - remove from queue
      HATCHERY.queue.shift();
      HATCHERY._hatching = HATCHERY.queue.length > 0;
    } else {
      // Housing full - pause hatching
      item.timeRemaining.Set(0);
    }
  }

  /**
   * Get current queue
   */
  static GetQueue(): QueueItem[] {
    return [...HATCHERY.queue];
  }

  /**
   * Get queue length
   */
  static GetQueueLength(): number {
    return HATCHERY.queue.length;
  }

  /**
   * Get max queue size
   */
  static GetMaxQueueSize(): number {
    return HATCHERY.maxQueueSize;
  }

  /**
   * Set max queue size (based on hatchery level)
   */
  static SetMaxQueueSize(size: number): void {
    HATCHERY.maxQueueSize = size;
  }

  /**
   * Get current item
   */
  static GetCurrent(): QueueItem | null {
    return HATCHERY.queue.length > 0 ? HATCHERY.queue[0] : null;
  }

  /**
   * Get progress of current item (0-1)
   */
  static GetProgress(): number {
    const current = HATCHERY.GetCurrent();
    if (!current) return 0;
    
    return 1 - (current.timeRemaining.Get() / current.totalTime);
  }

  /**
   * Get time remaining for current item
   */
  static GetTimeRemaining(): number {
    const current = HATCHERY.GetCurrent();
    return current ? current.timeRemaining.Get() : 0;
  }

  /**
   * Check if hatching
   */
  static get isHatching(): boolean {
    return HATCHERY._hatching;
  }

  /**
   * Check if queue is full
   */
  static get isFull(): boolean {
    return HATCHERY.queue.length >= HATCHERY.maxQueueSize;
  }

  /**
   * Speed up current hatch (with shiny)
   */
  static SpeedUp(seconds: number): void {
    const current = HATCHERY.GetCurrent();
    if (current) {
      current.timeRemaining.Subtract(seconds);
      if (current.timeRemaining.Get() < 0) {
        current.timeRemaining.Set(0);
      }
    }
  }

  /**
   * Instant complete current hatch
   */
  static InstantComplete(): void {
    const current = HATCHERY.GetCurrent();
    if (current) {
      current.timeRemaining.Set(0);
      HATCHERY.onHatchComplete(current);
    }
  }

  /**
   * Get cost to instant complete
   */
  static GetInstantCost(): number {
    const timeRemaining = HATCHERY.GetTimeRemaining();
    return GLOBAL.getShinyCostFromResourceAmt(timeRemaining * 10);
  }

  /**
   * Serialize to save data
   */
  static toSaveData(): Array<{ t: number; l: number; time: number; totalTime: number }> {
    return HATCHERY.queue.map(item => ({
      t: item.type,
      l: item.level,
      time: item.timeRemaining.Get(),
      totalTime: item.totalTime
    }));
  }
}

/**
 * HATCHERYCC class - Champion Chamber hatching
 * This is the TypeScript equivalent of HATCHERYCC.as
 */
export class HATCHERYCC {
  // Similar to HATCHERY but for champions
  // Will be implemented fully when champion system is added

  static Setup(): void {
    // Initialize champion hatchery
  }

  static Tick(): void {
    // Champion hatching logic
  }
}

export default HATCHERY;
