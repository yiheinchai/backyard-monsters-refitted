/**
 * Back easing functions for GreenSock tweening.
 * Overshoots then returns.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 * @param s Overshoot amount (default 1.70158)
 */
export class Back {
    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number, s: number = 1.70158): number {
        t = t / d;
        return c * t * t * ((s + 1) * t - s) + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number, s: number = 1.70158): number {
        t = t / d - 1;
        return c * (t * t * ((s + 1) * t + s) + 1) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number, s: number = 1.70158): number {
        t = t / (d / 2);
        if (t < 1) {
            s = s * 1.525;
            return c / 2 * (t * t * ((s + 1) * t - s)) + b;
        }
        t = t - 2;
        s = s * 1.525;
        return c / 2 * (t * t * ((s + 1) * t + s) + 2) + b;
    }
}
