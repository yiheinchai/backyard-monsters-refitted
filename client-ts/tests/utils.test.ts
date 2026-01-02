/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest';
import { SecNum, formatNumber, toTime, doubleDigit, clamp, quickDistance } from '../src/utils';

describe('SecNum', () => {
  it('should store and retrieve values correctly', () => {
    const num = new SecNum(100);
    expect(num.Get()).toBe(100);
  });

  it('should update values correctly', () => {
    const num = new SecNum(50);
    num.Set(200);
    expect(num.Get()).toBe(200);
  });

  it('should add values correctly', () => {
    const num = new SecNum(100);
    num.Add(50);
    expect(num.Get()).toBe(150);
  });

  it('should subtract values correctly', () => {
    const num = new SecNum(100);
    num.Subtract(30);
    expect(num.Get()).toBe(70);
  });

  it('should multiply values correctly', () => {
    const num = new SecNum(10);
    num.Multiply(5);
    expect(num.Get()).toBe(50);
  });
});

describe('formatNumber', () => {
  it('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(123)).toBe('123');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle decimals by flooring', () => {
    expect(formatNumber(1234.567)).toBe('1,234');
  });
});

describe('toTime', () => {
  it('should format seconds correctly', () => {
    const result = toTime(3661, true, true, true, true);
    expect(result).toContain('01h');
    expect(result).toContain('01m');
    expect(result).toContain('01s');
  });

  it('should handle zero seconds', () => {
    const result = toTime(0, true, true, true, true);
    expect(result).toContain('00');
  });
});

describe('doubleDigit', () => {
  it('should pad single digits', () => {
    expect(doubleDigit(5)).toBe('05');
    expect(doubleDigit(0)).toBe('00');
  });

  it('should not pad double digits', () => {
    expect(doubleDigit(10)).toBe('10');
    expect(doubleDigit(99)).toBe('99');
  });
});

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('quickDistance', () => {
  it('should calculate distance correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    expect(quickDistance(p1, p2)).toBe(5);
  });

  it('should return 0 for same point', () => {
    const p1 = { x: 5, y: 5 };
    expect(quickDistance(p1, p1)).toBe(0);
  });
});
