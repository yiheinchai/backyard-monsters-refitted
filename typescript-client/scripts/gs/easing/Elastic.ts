/**
 * Elastic easing functions for GreenSock tweening.
 * @param t Current time
 * @param b Beginning value
 * @param c Change in value
 * @param d Duration
 * @param a Amplitude (optional)
 * @param p Period (optional)
 */
export class Elastic {
    private static readonly _2PI: number = Math.PI * 2;

    constructor() {}

    public static easeIn(t: number, b: number, c: number, d: number, a: number = 0, p: number = 0): number {
        let s: number;
        if (t === 0) {
            return b;
        }
        t = t / d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / Elastic._2PI * Math.asin(c / a);
        }
        t = t - 1;
        return -(a * Math.pow(2, 10 * t) * Math.sin((t * d - s) * Elastic._2PI / p)) + b;
    }

    public static easeOut(t: number, b: number, c: number, d: number, a: number = 0, p: number = 0): number {
        let s: number;
        if (t === 0) {
            return b;
        }
        t = t / d;
        if (t === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / Elastic._2PI * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * Elastic._2PI / p) + c + b;
    }

    public static easeInOut(t: number, b: number, c: number, d: number, a: number = 0, p: number = 0): number {
        let s: number;
        if (t === 0) {
            return b;
        }
        t = t / (d / 2);
        if (t === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / Elastic._2PI * Math.asin(c / a);
        }
        if (t < 1) {
            t = t - 1;
            return -0.5 * (a * Math.pow(2, 10 * t) * Math.sin((t * d - s) * Elastic._2PI / p)) + b;
        }
        t = t - 1;
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * Elastic._2PI / p) * 0.5 + c + b;
    }
}
