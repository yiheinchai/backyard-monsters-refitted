import ByteArray from "openfl/utils/ByteArray";

/**
 * Base64 - Base64 encoding and decoding utility.
 */
export class Base64 {
    public static readonly version: string = "1.0.0";
    private static readonly BASE64_CHARS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    private constructor() {
        throw new Error("Base64 class is static container only");
    }

    public static encode(str: string): string {
        const ba = new ByteArray();
        ba.writeUTFBytes(str);
        return Base64.encodeByteArray(ba);
    }

    public static encodeByteArray(data: ByteArray): string {
        let result = "";
        const chars = new Array(4);
        data.position = 0;
        
        while (data.bytesAvailable > 0) {
            const bytes: Array<number> = [];
            let i = 0;
            while (i < 3 && data.bytesAvailable > 0) {
                bytes[i] = data.readUnsignedByte();
                i++;
            }
            
            chars[0] = (bytes[0] & 252) >> 2;
            chars[1] = ((bytes[0] & 3) << 4) | ((bytes[1] || 0) >> 4);
            chars[2] = ((bytes[1] & 15) << 2) | ((bytes[2] || 0) >> 6);
            chars[3] = (bytes[2] || 0) & 63;
            
            let j = bytes.length;
            while (j < 3) {
                chars[j + 1] = 64;
                j++;
            }
            
            for (let k = 0; k < chars.length; k++) {
                result += Base64.BASE64_CHARS.charAt(chars[k]);
            }
        }
        return result;
    }

    public static decode(str: string): string {
        const ba = Base64.decodeToByteArray(str);
        return ba.readUTFBytes(ba.length);
    }

    public static decodeToByteArray(str: string): ByteArray {
        const result = new ByteArray();
        const chars = new Array(4);
        const bytes = new Array(3);
        
        for (let i = 0; i < str.length; i += 4) {
            for (let j = 0; j < 4 && i + j < str.length; j++) {
                chars[j] = Base64.BASE64_CHARS.indexOf(str.charAt(i + j));
            }
            
            bytes[0] = (chars[0] << 2) + ((chars[1] & 48) >> 4);
            bytes[1] = ((chars[1] & 15) << 4) + ((chars[2] & 60) >> 2);
            bytes[2] = ((chars[2] & 3) << 6) + chars[3];
            
            for (let k = 0; k < bytes.length; k++) {
                if (chars[k + 1] === 64) {
                    break;
                }
                result.writeByte(bytes[k]);
            }
        }
        result.position = 0;
        return result;
    }
}
