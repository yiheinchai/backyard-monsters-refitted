/**
 * Quad (quadratic) easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Quad {
    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number): number {
        t = t / d;
        return c * t * t + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        t = t / d;
        return -c * t * (t - 2) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        t = t / (d / 2);
        if (t < 1) {
            return c / 2 * t * t + b;
        }
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}
