/**
 * Expo (exponential) easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 */
export class Expo {
    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number): number {
        return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number): number {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        t = t / (d / 2);
        if (t < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    }
}
