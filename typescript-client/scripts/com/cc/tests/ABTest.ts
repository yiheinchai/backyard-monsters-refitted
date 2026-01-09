import { MD5 } from "../../adobe/crypto/MD5";

declare var LOGIN: any;

/**
 * ABTest - A/B testing utility class.
 */
export class ABTest {
    constructor() { }

    public static isInTestGroup(prefix: string, threshold: number): boolean {
        return ABTest.lastTwoDigits(ABTest.UserMD5(prefix)) < threshold;
    }

    public static lastDigit(hash: string): number {
        const lastChar = hash.substr(-1, 1);
        return parseInt("0x" + lastChar);
    }

    public static lastTwoDigits(hash: string): number {
        const lastTwoChars = hash.substr(-2, 2);
        return parseInt("0x" + lastTwoChars);
    }

    public static UserMD5(prefix: string = "", playerId: number = 0): string {
        let str: string;
        if (playerId !== 0) {
            str = playerId.toString();
        } else {
            str = LOGIN._playerID.toString();
        }
        str = prefix + str;
        return MD5.hash(str);
    }
}
