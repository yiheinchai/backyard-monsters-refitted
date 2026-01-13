/**
 * Cubic easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Cubic {
    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number): number {
        t = t / d;
        return c * t * t * t + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        t = t / d - 1;
        return c * (t * t * t + 1) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        t = t / (d / 2);
        if (t < 1) {
            return c / 2 * t * t * t + b;
        }
        t = t - 2;
        return c / 2 * (t * t * t + 2) + b;
    }
}
