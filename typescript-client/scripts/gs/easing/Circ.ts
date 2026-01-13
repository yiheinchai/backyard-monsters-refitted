/**
 * Circ (circular) easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Circ {
    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number): number {
        t = t / d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        t = t / d - 1;
        return c * Math.sqrt(1 - t * t) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        t = t / (d / 2);
        if (t < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        t = t - 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    }
}
