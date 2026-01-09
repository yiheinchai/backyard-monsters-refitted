import { ByteArray } from "openfl/utils/ByteArray";

/**
 * Hex - Hexadecimal encoding/decoding utility.
 */
export class Hex {
    constructor() { }

    public static fromString(str: string, colons: boolean = false): string {
        const ba = new ByteArray();
        ba.writeUTFBytes(str);
        return Hex.fromArray(ba, colons);
    }

    public static toString(hexStr: string): string {
        const ba = Hex.toArray(hexStr);
        return ba.readUTFBytes(ba.length);
    }

    public static toArray(hexStr: string): ByteArray {
        let cleaned = hexStr.replace(/\\s|:/gm, "");
        const ba = new ByteArray();
        if ((cleaned.length & 1) === 1) {
            cleaned = "0" + cleaned;
        }
        for (let i = 0; i < cleaned.length; i += 2) {
            (ba as any)[i / 2] = parseInt(cleaned.substr(i, 2), 16);
        }
        return ba;
    }

    public static fromArray(ba: ByteArray, colons: boolean = false): string {
        let result = "";
        for (let i = 0; i < ba.length; i++) {
            result += ("0" + (ba as any)[i].toString(16)).substr(-2, 2);
            if (colons && i < ba.length - 1) {
                result += ":";
            }
        }
        return result;
    }
}
