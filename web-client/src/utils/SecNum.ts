/**
 * SecNum - Secure Number class
 * Converted from ActionScript com.cc.utils.SecNum
 * 
 * This class provides a simple wrapper around numbers
 * Originally used for some basic obfuscation/security in the Flash client
 */

export class SecNum {
  private _value: number;

  constructor(initialValue: number = 0) {
    this._value = initialValue;
  }

  Get(): number {
    return this._value;
  }

  Set(val: number): void {
    this._value = val;
  }

  Add(val: number): void {
    this._value += val;
  }

  Subtract(val: number): void {
    this._value -= val;
  }

  Multiply(val: number): void {
    this._value *= val;
  }

  Divide(val: number): void {
    if (val !== 0) {
      this._value /= val;
    }
  }

  toNumber(): number {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  clone(): SecNum {
    return new SecNum(this._value);
  }
}

/**
 * Create a SecNum from a plain number
 */
export function createSecNum(value: number): SecNum {
  return new SecNum(value);
}

/**
 * Convert a resources object with plain numbers to SecNum
 */
export function resourcesFromPlain(resources: Record<string, number>): Record<string, SecNum> {
  const result: Record<string, SecNum> = {};
  for (const key in resources) {
    result[key] = new SecNum(resources[key]);
  }
  return result;
}

/**
 * Convert SecNum resources back to plain numbers
 */
export function resourcesToPlain(resources: Record<string, SecNum>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const key in resources) {
    result[key] = resources[key].Get();
  }
  return result;
}
