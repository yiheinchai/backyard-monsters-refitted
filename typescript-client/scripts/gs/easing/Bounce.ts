/**
 * Bounce easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Bounce {
    constructor() {}

    public static easeOut(t: number, b: number, c: number, d: number): number {
        t = t / d;
        if (t < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        }
        if (t < 2 / 2.75) {
            t = t - 1.5 / 2.75;
            return c * (7.5625 * t * t + 0.75) + b;
        }
        if (t < 2.5 / 2.75) {
            t = t - 2.25 / 2.75;
            return c * (7.5625 * t * t + 0.9375) + b;
        }
        t = t - 2.625 / 2.75;
        return c * (7.5625 * t * t + 0.984375) + b;
    }

    public static easeIn(t: number, b: number, c: number, d: number): number {
        return c - Bounce.easeOut(d - t, 0, c, d) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        if (t < d / 2) {
            return Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
        }
        return Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}
