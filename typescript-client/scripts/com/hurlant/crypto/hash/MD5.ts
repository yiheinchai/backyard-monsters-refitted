import ByteArray from "openfl/utils/ByteArray";
import Endian from "openfl/utils/Endian";
import { IHash } from "./IHash";

/**
 * MD5 - Hurlant's MD5 hash implementation (implements IHash interface).
 */
export class MD5 implements IHash {
    public static readonly HASH_SIZE: number = 16;

    constructor() { }

    public getHashSize(): number { return MD5.HASH_SIZE; }
    public getInputSize(): number { return 64; }
    public toString(): string { return "md5"; }

    public hash(bytes: ByteArray): ByteArray {
        const len = bytes.length * 8;
        const originalEndian = bytes.endian;
        while (bytes.length % 4 !== 0) bytes[bytes.length] = 0;
        bytes.position = 0;
        const blocks: Array<number> = [];
        bytes.endian = Endian.LITTLE_ENDIAN;
        for (let i = 0; i < bytes.length; i += 4) blocks.push(bytes.readUnsignedInt());
        const result = this.core_md5(blocks, len);
        const output = new ByteArray();
        output.endian = Endian.LITTLE_ENDIAN;
        for (let i = 0; i < 4; i++) output.writeUnsignedInt(result[i]);
        bytes.length = len / 8;
        bytes.endian = originalEndian;
        return output;
    }

    private ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return this.cmn(b & c | ~b & d, a, b, x, s, t); }
    private gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return this.cmn(b & d | c & ~d, a, b, x, s, t); }
    private hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return this.cmn(b ^ c ^ d, a, b, x, s, t); }
    private ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return this.cmn(c ^ (b | ~d), a, b, x, s, t); }
    private cmn(q: number, a: number, b: number, x: number, s: number, t: number): number { return this.rol(a + q + x + t, s) + b; }
    private rol(n: number, cnt: number): number { return n << cnt | n >>> 32 - cnt; }

    private core_md5(x: Array<number>, len: number): Array<number> {
        x[len >> 5] |= 128 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        let a = 1732584193, b = 4023233417, c = 2562383102, d = 271733878;
        for (let i = 0; i < x.length; i += 16) {
            for (let j = 0; j < 16; j++) x[i + j] = x[i + j] || 0;
            const olda = a, oldb = b, oldc = c, oldd = d;
            a = this.ff(a, b, c, d, x[i + 0], 7, 3614090360);
            d = this.ff(d, a, b, c, x[i + 1], 12, 3905402710);
            c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.ff(b, c, d, a, x[i + 3], 22, 3250441966);
            a = this.ff(a, b, c, d, x[i + 4], 7, 4118548399);
            d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.ff(c, d, a, b, x[i + 6], 17, 2821735955);
            b = this.ff(b, c, d, a, x[i + 7], 22, 4249261313);
            a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.ff(d, a, b, c, x[i + 9], 12, 2336552879);
            c = this.ff(c, d, a, b, x[i + 10], 17, 4294925233);
            b = this.ff(b, c, d, a, x[i + 11], 22, 2304563134);
            a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.ff(d, a, b, c, x[i + 13], 12, 4254626195);
            c = this.ff(c, d, a, b, x[i + 14], 17, 2792965006);
            b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.gg(a, b, c, d, x[i + 1], 5, 4129170786);
            d = this.gg(d, a, b, c, x[i + 6], 9, 3225465664);
            c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.gg(b, c, d, a, x[i + 0], 20, 3921069994);
            a = this.gg(a, b, c, d, x[i + 5], 5, 3593408605);
            d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.gg(c, d, a, b, x[i + 15], 14, 3634488961);
            b = this.gg(b, c, d, a, x[i + 4], 20, 3889429448);
            a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.gg(d, a, b, c, x[i + 14], 9, 3275163606);
            c = this.gg(c, d, a, b, x[i + 3], 14, 4107603335);
            b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.gg(a, b, c, d, x[i + 13], 5, 2850285829);
            d = this.gg(d, a, b, c, x[i + 2], 9, 4243563512);
            c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.gg(b, c, d, a, x[i + 12], 20, 2368359562);
            a = this.hh(a, b, c, d, x[i + 5], 4, 4294588738);
            d = this.hh(d, a, b, c, x[i + 8], 11, 2272392833);
            c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.hh(b, c, d, a, x[i + 14], 23, 4259657740);
            a = this.hh(a, b, c, d, x[i + 1], 4, 2763975236);
            d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.hh(c, d, a, b, x[i + 7], 16, 4139469664);
            b = this.hh(b, c, d, a, x[i + 10], 23, 3200236656);
            a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.hh(d, a, b, c, x[i + 0], 11, 3936430074);
            c = this.hh(c, d, a, b, x[i + 3], 16, 3572445317);
            b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.hh(a, b, c, d, x[i + 9], 4, 3654602809);
            d = this.hh(d, a, b, c, x[i + 12], 11, 3873151461);
            c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.hh(b, c, d, a, x[i + 2], 23, 3299628645);
            a = this.ii(a, b, c, d, x[i + 0], 6, 4096336452);
            d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.ii(c, d, a, b, x[i + 14], 15, 2878612391);
            b = this.ii(b, c, d, a, x[i + 5], 21, 4237533241);
            a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.ii(d, a, b, c, x[i + 3], 10, 2399980690);
            c = this.ii(c, d, a, b, x[i + 10], 15, 4293915773);
            b = this.ii(b, c, d, a, x[i + 1], 21, 2240044497);
            a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.ii(d, a, b, c, x[i + 15], 10, 4264355552);
            c = this.ii(c, d, a, b, x[i + 6], 15, 2734768916);
            b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.ii(a, b, c, d, x[i + 4], 6, 4149444226);
            d = this.ii(d, a, b, c, x[i + 11], 10, 3174756917);
            c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.ii(b, c, d, a, x[i + 9], 21, 3951481745);
            a += olda; b += oldb; c += oldc; d += oldd;
        }
        return [a, b, c, d];
    }
}
