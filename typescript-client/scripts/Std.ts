import { Boot } from './flash/Boot';

export class Std {
    constructor() {
    }

    // Note: The obfuscated "is" function was excluded

    public static string(param1: any): string {
        return Boot.__string_rec(param1, "");
    }

    public static _int(param1: number): number {
        return Math.floor(param1);
    }

    public static parseInt(param1: string): number | null {
        const _loc2_ = parseInt(param1);
        if (isNaN(_loc2_)) {
            return null;
        }
        return _loc2_;
    }

    public static parseFloat(param1: string): number {
        return parseFloat(param1);
    }

    public static random(param1: number): number {
        return Math.floor(Math.random() * param1);
    }
}
