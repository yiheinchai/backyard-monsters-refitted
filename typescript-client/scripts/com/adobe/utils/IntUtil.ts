/**
 * IntUtil - Integer utility functions for cryptographic operations.
 */
export class IntUtil {
    private static hexChars: string = "0123456789abcdef";

    constructor() { }

    public static rol(x: number, n: number): number {
        return x << n | x >>> 32 - n;
    }

    public static ror(x: number, n: number): number {
        const nn = 32 - n;
        return x << nn | x >>> 32 - nn;
    }

    public static toHex(n: number, bigEndian: boolean = false): string {
        let s = "";
        if (bigEndian) {
            for (let i = 0; i < 4; i++) {
                s += IntUtil.hexChars.charAt(n >> (3 - i) * 8 + 4 & 15) + IntUtil.hexChars.charAt(n >> (3 - i) * 8 & 15);
            }
        } else {
            for (let i = 0; i < 4; i++) {
                s += IntUtil.hexChars.charAt(n >> i * 8 + 4 & 15) + IntUtil.hexChars.charAt(n >> i * 8 & 15);
            }
        }
        return s;
    }
}
