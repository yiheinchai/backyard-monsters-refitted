/**
 * SecNum - Secure Number wrapper
 * Ported from ActionScript com.cc.utils.SecNum
 * Used to prevent simple memory editing cheats
 */
export class SecNum {
  private _value: number;
  private _check: number;
  private readonly _key: number;

  constructor(initialValue: number = 0) {
    this._key = Math.floor(Math.random() * 1000000);
    this._value = 0;
    this._check = 0;
    this.Set(initialValue);
  }

  /**
   * Get the current value
   */
  Get(): number {
    if (this._value - this._key !== this._check) {
      console.warn('SecNum: Value tampering detected!');
      return 0;
    }
    return this._value - this._key;
  }

  /**
   * Set a new value
   */
  Set(value: number): void {
    this._value = value + this._key;
    this._check = value;
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
   * Check if value is greater than another
   */
  GreaterThan(other: number): boolean {
    return this.Get() > other;
  }

  /**
   * Check if value is less than another
   */
  LessThan(other: number): boolean {
    return this.Get() < other;
  }

  /**
   * Check if value equals another
   */
  Equals(other: number): boolean {
    return this.Get() === other;
  }

  /**
   * Get value as string
   */
  toString(): string {
    return this.Get().toString();
  }
}
