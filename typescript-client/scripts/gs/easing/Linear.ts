/**
 * Linear easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Linear {
    constructor() {}

    public static easeNone(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public static easeIn(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }
}
