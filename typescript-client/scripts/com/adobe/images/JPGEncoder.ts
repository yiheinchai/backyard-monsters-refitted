import { BitmapData } from "openfl/display/BitmapData";
import { ByteArray } from "openfl/utils/ByteArray";

/**
 * BitString - Helper class for JPG encoding.
 */
class BitString {
    public len: number = 0;
    public val: number = 0;
}

/**
 * JPGEncoder - JPEG image encoder.
 * Based on Adobe's AS3 JPEG encoder library.
 */
export class JPGEncoder {
    private ZigZag: Array<number>;
    private YTable: Array<number>;
    private UVTable: Array<number>;
    private fdtbl_Y: Array<number>;
    private fdtbl_UV: Array<number>;
    private YDC_HT: Array<BitString>;
    private UVDC_HT: Array<BitString>;
    private YAC_HT: Array<BitString>;
    private UVAC_HT: Array<BitString>;
    private std_dc_luminance_nrcodes: Array<number>;
    private std_dc_luminance_values: Array<number>;
    private std_ac_luminance_nrcodes: Array<number>;
    private std_ac_luminance_values: Array<number>;
    private std_dc_chrominance_nrcodes: Array<number>;
    private std_dc_chrominance_values: Array<number>;
    private std_ac_chrominance_nrcodes: Array<number>;
    private std_ac_chrominance_values: Array<number>;
    private bitcode: Array<BitString>;
    private category: Array<number>;
    private byteout: ByteArray | null = null;
    private bytenew: number = 0;
    private bytepos: number = 7;
    private DU: Array<number>;
    private YDU: Array<number>;
    private UDU: Array<number>;
    private VDU: Array<number>;

    constructor(quality: number = 50) {
        this.ZigZag = [0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43, 9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51, 55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63];
        this.YTable = new Array(64);
        this.UVTable = new Array(64);
        this.fdtbl_Y = new Array(64);
        this.fdtbl_UV = new Array(64);
        this.std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        this.std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125];
        this.std_ac_luminance_values = [1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20, 50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114, 130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250];
        this.std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
        this.std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 119];
        this.std_ac_chrominance_values = [0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81, 7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82, 240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38, 39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245, 246, 247, 248, 249, 250];
        this.bitcode = new Array(65535);
        this.category = new Array(65535);
        this.DU = new Array(64);
        this.YDU = new Array(64);
        this.UDU = new Array(64);
        this.VDU = new Array(64);
        if (quality <= 0) quality = 1;
        if (quality > 100) quality = 100;
        let sf = 0;
        if (quality < 50) sf = Math.floor(5000 / quality); else sf = Math.floor(200 - quality * 2);
        this.initHuffmanTbl();
        this.initCategoryNumber();
        this.initQuantTables(sf);
    }

    private initQuantTables(sf: number): void {
        const YQT = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
        for (let i = 0; i < 64; i++) { let t = Math.floor((YQT[i] * sf + 50) / 100); if (t < 1) t = 1; else if (t > 255) t = 255; this.YTable[this.ZigZag[i]] = t; }
        const UVQT = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99];
        for (let i = 0; i < 64; i++) { let t = Math.floor((UVQT[i] * sf + 50) / 100); if (t < 1) t = 1; else if (t > 255) t = 255; this.UVTable[this.ZigZag[i]] = t; }
        const aasf = [1, 1.387039845, 1.306562965, 1.175875602, 1, 0.785694958, 0.5411961, 0.275899379];
        let k = 0;
        for (let row = 0; row < 8; row++) { for (let col = 0; col < 8; col++) { this.fdtbl_Y[k] = 1 / (this.YTable[this.ZigZag[k]] * aasf[row] * aasf[col] * 8); this.fdtbl_UV[k] = 1 / (this.UVTable[this.ZigZag[k]] * aasf[row] * aasf[col] * 8); k++; } }
    }

    private computeHuffmanTbl(nrcodes: Array<number>, std_table: Array<number>): Array<BitString> {
        let codevalue = 0, pos_in_table = 0;
        const HT: Array<BitString> = [];
        for (let k = 1; k <= 16; k++) { for (let j = 1; j <= nrcodes[k]; j++) { HT[std_table[pos_in_table]] = new BitString(); HT[std_table[pos_in_table]].val = codevalue; HT[std_table[pos_in_table]].len = k; pos_in_table++; codevalue++; } codevalue *= 2; }
        return HT;
    }

    private initHuffmanTbl(): void {
        this.YDC_HT = this.computeHuffmanTbl(this.std_dc_luminance_nrcodes, this.std_dc_luminance_values);
        this.UVDC_HT = this.computeHuffmanTbl(this.std_dc_chrominance_nrcodes, this.std_dc_chrominance_values);
        this.YAC_HT = this.computeHuffmanTbl(this.std_ac_luminance_nrcodes, this.std_ac_luminance_values);
        this.UVAC_HT = this.computeHuffmanTbl(this.std_ac_chrominance_nrcodes, this.std_ac_chrominance_values);
    }

    private initCategoryNumber(): void {
        let nrlower = 1, nrupper = 2;
        for (let cat = 1; cat <= 15; cat++) {
            for (let nr = nrlower; nr < nrupper; nr++) { this.category[32767 + nr] = cat; this.bitcode[32767 + nr] = new BitString(); this.bitcode[32767 + nr].len = cat; this.bitcode[32767 + nr].val = nr; }
            for (let nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) { this.category[32767 + nrneg] = cat; this.bitcode[32767 + nrneg] = new BitString(); this.bitcode[32767 + nrneg].len = cat; this.bitcode[32767 + nrneg].val = nrupper - 1 + nrneg; }
            nrlower <<= 1; nrupper <<= 1;
        }
    }

    private writeBits(bs: BitString): void {
        let value = bs.val;
        for (let posval = bs.len - 1; posval >= 0; posval--) {
            if (value & (1 << posval)) this.bytenew |= (1 << this.bytepos);
            this.bytepos--;
            if (this.bytepos < 0) { if (this.bytenew === 255) { this.writeByte(255); this.writeByte(0); } else { this.writeByte(this.bytenew); } this.bytepos = 7; this.bytenew = 0; }
        }
    }

    private writeByte(value: number): void { this.byteout!.writeByte(value); }
    private writeWord(value: number): void { this.writeByte(value >> 8 & 255); this.writeByte(value & 255); }

    private fDCTQuant(data: Array<number>, fdtbl: Array<number>): Array<number> {
        let d0, d1, d2, d3, d4, d5, d6, d7, tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp10, tmp11, tmp12, tmp13, z1, z2, z3, z4, z5, z11, z13;
        let dataOff = 0;
        for (let i = 0; i < 8; i++) {
            d0 = data[dataOff]; d1 = data[dataOff + 1]; d2 = data[dataOff + 2]; d3 = data[dataOff + 3]; d4 = data[dataOff + 4]; d5 = data[dataOff + 5]; d6 = data[dataOff + 6]; d7 = data[dataOff + 7];
            tmp0 = d0 + d7; tmp7 = d0 - d7; tmp1 = d1 + d6; tmp6 = d1 - d6; tmp2 = d2 + d5; tmp5 = d2 - d5; tmp3 = d3 + d4; tmp4 = d3 - d4;
            tmp10 = tmp0 + tmp3; tmp13 = tmp0 - tmp3; tmp11 = tmp1 + tmp2; tmp12 = tmp1 - tmp2;
            data[dataOff] = tmp10 + tmp11; data[dataOff + 4] = tmp10 - tmp11;
            z1 = (tmp12 + tmp13) * 0.707106781;
            data[dataOff + 2] = tmp13 + z1; data[dataOff + 6] = tmp13 - z1;
            tmp10 = tmp4 + tmp5; tmp11 = tmp5 + tmp6; tmp12 = tmp6 + tmp7;
            z5 = (tmp10 - tmp12) * 0.382683433; z2 = 0.5411961 * tmp10 + z5; z4 = 1.306562965 * tmp12 + z5; z3 = tmp11 * 0.707106781;
            z11 = tmp7 + z3; z13 = tmp7 - z3;
            data[dataOff + 5] = z13 + z2; data[dataOff + 3] = z13 - z2; data[dataOff + 1] = z11 + z4; data[dataOff + 7] = z11 - z4;
            dataOff += 8;
        }
        let tmp6: number, tmp7: number;
        dataOff = 0;
        for (let i = 0; i < 8; i++) {
            d0 = data[dataOff]; d1 = data[dataOff + 8]; d2 = data[dataOff + 16]; d3 = data[dataOff + 24]; d4 = data[dataOff + 32]; d5 = data[dataOff + 40]; d6 = data[dataOff + 48]; d7 = data[dataOff + 56];
            tmp0 = d0 + d7; tmp7 = d0 - d7; tmp1 = d1 + d6; tmp6 = d1 - d6; tmp2 = d2 + d5; tmp5 = d2 - d5; tmp3 = d3 + d4; tmp4 = d3 - d4;
            tmp10 = tmp0 + tmp3; tmp13 = tmp0 - tmp3; tmp11 = tmp1 + tmp2; tmp12 = tmp1 - tmp2;
            data[dataOff] = tmp10 + tmp11; data[dataOff + 32] = tmp10 - tmp11;
            z1 = (tmp12 + tmp13) * 0.707106781;
            data[dataOff + 16] = tmp13 + z1; data[dataOff + 48] = tmp13 - z1;
            tmp10 = tmp4 + tmp5; tmp11 = tmp5 + tmp6; tmp12 = tmp6 + tmp7;
            z5 = (tmp10 - tmp12) * 0.382683433; z2 = 0.5411961 * tmp10 + z5; z4 = 1.306562965 * tmp12 + z5; z3 = tmp11 * 0.707106781;
            z11 = tmp7 + z3; z13 = tmp7 - z3;
            data[dataOff + 40] = z13 + z2; data[dataOff + 24] = z13 - z2; data[dataOff + 8] = z11 + z4; data[dataOff + 56] = z11 - z4;
            dataOff++;
        }
        for (let i = 0; i < 64; i++) data[i] = Math.round(data[i] * fdtbl[i]);
        return data;
    }

    private writeAPP0(): void { this.writeWord(65504); this.writeWord(16); this.writeByte(74); this.writeByte(70); this.writeByte(73); this.writeByte(70); this.writeByte(0); this.writeByte(1); this.writeByte(1); this.writeByte(0); this.writeWord(1); this.writeWord(1); this.writeByte(0); this.writeByte(0); }
    private writeSOF0(w: number, h: number): void { this.writeWord(65472); this.writeWord(17); this.writeByte(8); this.writeWord(h); this.writeWord(w); this.writeByte(3); this.writeByte(1); this.writeByte(17); this.writeByte(0); this.writeByte(2); this.writeByte(17); this.writeByte(1); this.writeByte(3); this.writeByte(17); this.writeByte(1); }
    private writeDQT(): void { this.writeWord(65499); this.writeWord(132); this.writeByte(0); for (let i = 0; i < 64; i++) this.writeByte(this.YTable[i]); this.writeByte(1); for (let i = 0; i < 64; i++) this.writeByte(this.UVTable[i]); }
    private writeDHT(): void {
        this.writeWord(65476); this.writeWord(418); this.writeByte(0);
        for (let i = 0; i < 16; i++) this.writeByte(this.std_dc_luminance_nrcodes[i + 1]);
        for (let i = 0; i <= 11; i++) this.writeByte(this.std_dc_luminance_values[i]);
        this.writeByte(16);
        for (let i = 0; i < 16; i++) this.writeByte(this.std_ac_luminance_nrcodes[i + 1]);
        for (let i = 0; i <= 161; i++) this.writeByte(this.std_ac_luminance_values[i]);
        this.writeByte(1);
        for (let i = 0; i < 16; i++) this.writeByte(this.std_dc_chrominance_nrcodes[i + 1]);
        for (let i = 0; i <= 11; i++) this.writeByte(this.std_dc_chrominance_values[i]);
        this.writeByte(17);
        for (let i = 0; i < 16; i++) this.writeByte(this.std_ac_chrominance_nrcodes[i + 1]);
        for (let i = 0; i <= 161; i++) this.writeByte(this.std_ac_chrominance_values[i]);
    }
    private writeSOS(): void { this.writeWord(65498); this.writeWord(12); this.writeByte(3); this.writeByte(1); this.writeByte(0); this.writeByte(2); this.writeByte(17); this.writeByte(3); this.writeByte(17); this.writeByte(0); this.writeByte(63); this.writeByte(0); }

    private processDU(CDU: Array<number>, fdtbl: Array<number>, DC: number, HTDC: Array<BitString>, HTAC: Array<BitString>): number {
        const EOB = HTAC[0], M16zeroes = HTAC[240];
        const DU_DCT = this.fDCTQuant(CDU, fdtbl);
        for (let i = 0; i < 64; i++) this.DU[this.ZigZag[i]] = DU_DCT[i];
        const Diff = this.DU[0] - DC;
        DC = this.DU[0];
        if (Diff === 0) this.writeBits(HTDC[0]);
        else { this.writeBits(HTDC[this.category[32767 + Diff]]); this.writeBits(this.bitcode[32767 + Diff]); }
        let end0pos = 63;
        while (end0pos > 0 && this.DU[end0pos] === 0) end0pos--;
        if (end0pos === 0) { this.writeBits(EOB); return DC; }
        let i = 1;
        while (i <= end0pos) {
            const startpos = i;
            while (this.DU[i] === 0 && i <= end0pos) i++;
            let nrzeroes = i - startpos;
            if (nrzeroes >= 16) { for (let nrmarker = 1; nrmarker <= Math.floor(nrzeroes / 16); nrmarker++) this.writeBits(M16zeroes); nrzeroes = nrzeroes & 15; }
            this.writeBits(HTAC[nrzeroes * 16 + this.category[32767 + this.DU[i]]]);
            this.writeBits(this.bitcode[32767 + this.DU[i]]);
            i++;
        }
        if (end0pos !== 63) this.writeBits(EOB);
        return DC;
    }

    private RGB2YUV(img: BitmapData, xpos: number, ypos: number): void {
        let pos = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const P = img.getPixel32(xpos + x, ypos + y);
                const R = (P >> 16) & 255, G = (P >> 8) & 255, B = P & 255;
                this.YDU[pos] = 0.299 * R + 0.587 * G + 0.114 * B - 128;
                this.UDU[pos] = -0.16874 * R + -0.33126 * G + 0.5 * B;
                this.VDU[pos] = 0.5 * R + -0.41869 * G + -0.08131 * B;
                pos++;
            }
        }
    }

    public encode(image: BitmapData): ByteArray {
        this.byteout = new ByteArray();
        this.bytenew = 0;
        this.bytepos = 7;
        this.writeWord(65496);
        this.writeAPP0();
        this.writeDQT();
        this.writeSOF0(image.width, image.height);
        this.writeDHT();
        this.writeSOS();
        let DCY = 0, DCU = 0, DCV = 0;
        this.bytenew = 0;
        this.bytepos = 7;
        for (let ypos = 0; ypos < image.height; ypos += 8) {
            for (let xpos = 0; xpos < image.width; xpos += 8) {
                this.RGB2YUV(image, xpos, ypos);
                DCY = this.processDU(this.YDU, this.fdtbl_Y, DCY, this.YDC_HT, this.YAC_HT);
                DCU = this.processDU(this.UDU, this.fdtbl_UV, DCU, this.UVDC_HT, this.UVAC_HT);
                DCV = this.processDU(this.VDU, this.fdtbl_UV, DCV, this.UVDC_HT, this.UVAC_HT);
            }
        }
        if (this.bytepos >= 0) { const fillbits = new BitString(); fillbits.len = this.bytepos + 1; fillbits.val = (1 << (this.bytepos + 1)) - 1; this.writeBits(fillbits); }
        this.writeWord(65497);
        return this.byteout;
    }
}
