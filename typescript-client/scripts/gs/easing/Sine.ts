/**
 * Sine easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Sine {
    private static readonly _HALF_PI: number = Math.PI / 2;

    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number): number {
        return -c * Math.cos(t / d * Sine._HALF_PI) + c + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        return c * Math.sin(t / d * Sine._HALF_PI) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
}
