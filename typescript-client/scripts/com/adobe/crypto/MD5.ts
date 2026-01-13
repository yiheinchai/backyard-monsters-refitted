import ByteArray from "openfl/utils/ByteArray";
import { IntUtil } from "../utils/IntUtil";

/**
 * MD5 - Adobe's MD5 hash implementation.
 */
export class MD5 {
    public static digest: ByteArray;

    constructor() { }

    public static hash(str: string): string {
        const bytes = new ByteArray();
        bytes.writeUTFBytes(str);
        return MD5.hashBinary(bytes);
    }

    public static hashBytes(bytes: ByteArray): string { return MD5.hashBinary(bytes); }

    public static hashBinary(bytes: ByteArray): string {
        let aa = 1732584193;
        let bb = -271733879;
        let cc = -1732584194;
        let dd = 271733878;
        const blocks = MD5.createBlocks(bytes);
        const len = blocks.length;
        let i = 0;
        while (i < len) {
            const a = aa, b = bb, c = cc, d = dd;
            aa = MD5.ff(aa, bb, cc, dd, blocks[i + 0], 7, -680876936);
            dd = MD5.ff(dd, aa, bb, cc, blocks[i + 1], 12, -389564586);
            cc = MD5.ff(cc, dd, aa, bb, blocks[i + 2], 17, 606105819);
            bb = MD5.ff(bb, cc, dd, aa, blocks[i + 3], 22, -1044525330);
            aa = MD5.ff(aa, bb, cc, dd, blocks[i + 4], 7, -176418897);
            dd = MD5.ff(dd, aa, bb, cc, blocks[i + 5], 12, 1200080426);
            cc = MD5.ff(cc, dd, aa, bb, blocks[i + 6], 17, -1473231341);
            bb = MD5.ff(bb, cc, dd, aa, blocks[i + 7], 22, -45705983);
            aa = MD5.ff(aa, bb, cc, dd, blocks[i + 8], 7, 1770035416);
            dd = MD5.ff(dd, aa, bb, cc, blocks[i + 9], 12, -1958414417);
            cc = MD5.ff(cc, dd, aa, bb, blocks[i + 10], 17, -42063);
            bb = MD5.ff(bb, cc, dd, aa, blocks[i + 11], 22, -1990404162);
            aa = MD5.ff(aa, bb, cc, dd, blocks[i + 12], 7, 1804603682);
            dd = MD5.ff(dd, aa, bb, cc, blocks[i + 13], 12, -40341101);
            cc = MD5.ff(cc, dd, aa, bb, blocks[i + 14], 17, -1502002290);
            bb = MD5.ff(bb, cc, dd, aa, blocks[i + 15], 22, 1236535329);
            aa = MD5.gg(aa, bb, cc, dd, blocks[i + 1], 5, -165796510);
            dd = MD5.gg(dd, aa, bb, cc, blocks[i + 6], 9, -1069501632);
            cc = MD5.gg(cc, dd, aa, bb, blocks[i + 11], 14, 643717713);
            bb = MD5.gg(bb, cc, dd, aa, blocks[i + 0], 20, -373897302);
            aa = MD5.gg(aa, bb, cc, dd, blocks[i + 5], 5, -701558691);
            dd = MD5.gg(dd, aa, bb, cc, blocks[i + 10], 9, 38016083);
            cc = MD5.gg(cc, dd, aa, bb, blocks[i + 15], 14, -660478335);
            bb = MD5.gg(bb, cc, dd, aa, blocks[i + 4], 20, -405537848);
            aa = MD5.gg(aa, bb, cc, dd, blocks[i + 9], 5, 568446438);
            dd = MD5.gg(dd, aa, bb, cc, blocks[i + 14], 9, -1019803690);
            cc = MD5.gg(cc, dd, aa, bb, blocks[i + 3], 14, -187363961);
            bb = MD5.gg(bb, cc, dd, aa, blocks[i + 8], 20, 1163531501);
            aa = MD5.gg(aa, bb, cc, dd, blocks[i + 13], 5, -1444681467);
            dd = MD5.gg(dd, aa, bb, cc, blocks[i + 2], 9, -51403784);
            cc = MD5.gg(cc, dd, aa, bb, blocks[i + 7], 14, 1735328473);
            bb = MD5.gg(bb, cc, dd, aa, blocks[i + 12], 20, -1926607734);
            aa = MD5.hh(aa, bb, cc, dd, blocks[i + 5], 4, -378558);
            dd = MD5.hh(dd, aa, bb, cc, blocks[i + 8], 11, -2022574463);
            cc = MD5.hh(cc, dd, aa, bb, blocks[i + 11], 16, 1839030562);
            bb = MD5.hh(bb, cc, dd, aa, blocks[i + 14], 23, -35309556);
            aa = MD5.hh(aa, bb, cc, dd, blocks[i + 1], 4, -1530992060);
            dd = MD5.hh(dd, aa, bb, cc, blocks[i + 4], 11, 1272893353);
            cc = MD5.hh(cc, dd, aa, bb, blocks[i + 7], 16, -155497632);
            bb = MD5.hh(bb, cc, dd, aa, blocks[i + 10], 23, -1094730640);
            aa = MD5.hh(aa, bb, cc, dd, blocks[i + 13], 4, 681279174);
            dd = MD5.hh(dd, aa, bb, cc, blocks[i + 0], 11, -358537222);
            cc = MD5.hh(cc, dd, aa, bb, blocks[i + 3], 16, -722521979);
            bb = MD5.hh(bb, cc, dd, aa, blocks[i + 6], 23, 76029189);
            aa = MD5.hh(aa, bb, cc, dd, blocks[i + 9], 4, -640364487);
            dd = MD5.hh(dd, aa, bb, cc, blocks[i + 12], 11, -421815835);
            cc = MD5.hh(cc, dd, aa, bb, blocks[i + 15], 16, 530742520);
            bb = MD5.hh(bb, cc, dd, aa, blocks[i + 2], 23, -995338651);
            aa = MD5.ii(aa, bb, cc, dd, blocks[i + 0], 6, -198630844);
            dd = MD5.ii(dd, aa, bb, cc, blocks[i + 7], 10, 1126891415);
            cc = MD5.ii(cc, dd, aa, bb, blocks[i + 14], 15, -1416354905);
            bb = MD5.ii(bb, cc, dd, aa, blocks[i + 5], 21, -57434055);
            aa = MD5.ii(aa, bb, cc, dd, blocks[i + 12], 6, 1700485571);
            dd = MD5.ii(dd, aa, bb, cc, blocks[i + 3], 10, -1894986606);
            cc = MD5.ii(cc, dd, aa, bb, blocks[i + 10], 15, -1051523);
            bb = MD5.ii(bb, cc, dd, aa, blocks[i + 1], 21, -2054922799);
            aa = MD5.ii(aa, bb, cc, dd, blocks[i + 8], 6, 1873313359);
            dd = MD5.ii(dd, aa, bb, cc, blocks[i + 15], 10, -30611744);
            cc = MD5.ii(cc, dd, aa, bb, blocks[i + 6], 15, -1560198380);
            bb = MD5.ii(bb, cc, dd, aa, blocks[i + 13], 21, 1309151649);
            aa = MD5.ii(aa, bb, cc, dd, blocks[i + 4], 6, -145523070);
            dd = MD5.ii(dd, aa, bb, cc, blocks[i + 11], 10, -1120210379);
            cc = MD5.ii(cc, dd, aa, bb, blocks[i + 2], 15, 718787259);
            bb = MD5.ii(bb, cc, dd, aa, blocks[i + 9], 21, -343485551);
            aa += a; bb += b; cc += c; dd += d;
            i += 16;
        }
        MD5.digest = new ByteArray();
        MD5.digest.writeInt(aa);
        MD5.digest.writeInt(bb);
        MD5.digest.writeInt(cc);
        MD5.digest.writeInt(dd);
        MD5.digest.position = 0;
        return IntUtil.toHex(aa) + IntUtil.toHex(bb) + IntUtil.toHex(cc) + IntUtil.toHex(dd);
    }

    private static f(x: number, y: number, z: number): number { return x & y | ~x & z; }
    private static g(x: number, y: number, z: number): number { return x & z | y & ~z; }
    private static h(x: number, y: number, z: number): number { return x ^ y ^ z; }
    private static i(x: number, y: number, z: number): number { return y ^ (x | ~z); }

    private static transform(func: (x: number, y: number, z: number) => number, a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
        const n = a + func(b, c, d) + x + t;
        return IntUtil.rol(n, s) + b;
    }

    private static ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return MD5.transform(MD5.f, a, b, c, d, x, s, t); }
    private static gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return MD5.transform(MD5.g, a, b, c, d, x, s, t); }
    private static hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return MD5.transform(MD5.h, a, b, c, d, x, s, t); }
    private static ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number { return MD5.transform(MD5.i, a, b, c, d, x, s, t); }

    private static createBlocks(bytes: ByteArray): Array<number> {
        const blocks: Array<number> = [];
        const len = bytes.length * 8;
        const mask = 255;
        let i = 0;
        while (i < len) { blocks[i >> 5] = blocks[i >> 5] | (bytes[i / 8] & mask) << i % 32; i += 8; }
        blocks[len >> 5] = blocks[len >> 5] | 128 << len % 32;
        blocks[(len + 64 >>> 9 << 4) + 14] = len;
        return blocks;
    }
}
