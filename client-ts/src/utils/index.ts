/**
 * SecNum - Secure Number class
 * This class provides a way to store numbers with basic obfuscation
 * to prevent simple memory editing/cheating (similar to the ActionScript version)
 */
export class SecNum {
  private _value: number;
  private _offset: number;

  constructor(value: number = 0) {
    this._offset = Math.floor(Math.random() * 10000);
    this._value = value + this._offset;
  }

  /**
   * Get the actual value
   */
  Get(): number {
    return this._value - this._offset;
  }

  /**
   * Set a new value
   */
  Set(value: number): void {
    this._offset = Math.floor(Math.random() * 10000);
    this._value = value + this._offset;
  }

  /**
   * Add to the current value
   */
  Add(amount: number): void {
    this.Set(this.Get() + amount);
  }

  /**
   * Subtract from the current value
   */
  Subtract(amount: number): void {
    this.Set(this.Get() - amount);
  }

  /**
   * Multiply the current value
   */
  Multiply(factor: number): void {
    this.Set(this.Get() * factor);
  }

  /**
   * Get the value as a string
   */
  toString(): string {
    return this.Get().toString();
  }

  /**
   * Get the value (alias for Get())
   */
  valueOf(): number {
    return this.Get();
  }
}

/**
 * Simple EventDispatcher implementation
 * Similar to Flash's EventDispatcher
 */
export class EventDispatcher {
  private listeners: Map<string, Set<Function>> = new Map();

  addEventListener(type: string, listener: Function): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
  }

  removeEventListener(type: string, listener: Function): void {
    if (this.listeners.has(type)) {
      this.listeners.get(type)!.delete(listener);
    }
  }

  dispatchEvent(event: { type: string; [key: string]: unknown }): void {
    if (this.listeners.has(event.type)) {
      this.listeners.get(event.type)!.forEach(listener => {
        listener(event);
      });
    }
  }

  hasEventListener(type: string): boolean {
    return this.listeners.has(type) && this.listeners.get(type)!.size > 0;
  }
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(num: number): string {
  return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format seconds to a time string
 */
export function toTime(
  totalSeconds: number,
  includeDays: boolean = false,
  includeHours: boolean = true,
  _includeMinutes: boolean = true,
  includeSeconds: boolean = false
): string {
  if (totalSeconds < 0) totalSeconds = 0;

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (totalSeconds >= 86400) {
    days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
  }
  if (totalSeconds >= 3600) {
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
  }
  if (totalSeconds >= 60) {
    minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;
  }
  seconds = totalSeconds;

  let result = '';

  if (includeDays) {
    if (days) result += `${days}d `;
    if (hours || days || includeSeconds) result += `${doubleDigit(hours)}h `;
    if (minutes || hours || days || includeSeconds) result += `${doubleDigit(minutes)}m `;
    if (includeHours || days + hours + minutes === 0 || includeSeconds) {
      result += `${doubleDigit(seconds)}s`;
    }
  } else {
    if (days) result += `${days} ${days > 1 ? 'days' : 'day'} `;
    if (hours || days || includeSeconds) result += `${hours} ${hours > 1 ? 'hours' : 'hour'} `;
    if (minutes || hours || days || includeSeconds) result += `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} `;
    if (minutes > 0 || hours > 0 || days === 0 || includeSeconds) {
      if (seconds > 0 && (includeHours || days + hours + minutes === 0)) {
        result += `${doubleDigit(seconds)}s`;
      }
    }
  }

  return result.trim();
}

/**
 * Format a number as double digit
 */
export function doubleDigit(num: number): string {
  return num < 10 ? '0' + num : num.toString();
}

/**
 * Calculate distance between two points
 */
export function quickDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate squared distance between two points (faster, no sqrt)
 */
export function quickDistanceSquared(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Degrees to radians
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Radians to degrees
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Simple debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Storage wrapper for localStorage with JSON support
 */
export const Storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }
};
