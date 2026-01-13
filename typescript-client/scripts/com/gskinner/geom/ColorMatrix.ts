/**
 * ColorMatrix - Color matrix manipulation utility for adjusting brightness, contrast, saturation and hue.
 * Based on Grant Skinner's ColorMatrix class.
 */
export class ColorMatrix extends Array<number> {
    private static readonly DELTA_INDEX: Array<number> = [0, 0.01, 0.02, 0.04, 0.05, 0.06, 0.07, 0.08, 0.1, 0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2, 0.21, 0.22, 0.24, 0.25, 0.27, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.42, 0.44, 0.46, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.65, 0.68, 0.71, 0.74, 0.77, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1, 1.06, 1.12, 1.18, 1.24, 1.3, 1.36, 1.42, 1.48, 1.54, 1.6, 1.66, 1.72, 1.78, 1.84, 1.9, 1.96, 2, 2.12, 2.25, 2.37, 2.5, 2.62, 2.75, 2.87, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.3, 4.7, 4.9, 5, 5.5, 6, 6.5, 6.8, 7, 7.3, 7.5, 7.8, 8, 8.4, 8.7, 9, 9.4, 9.6, 9.8, 10];
    private static readonly IDENTITY_MATRIX: Array<number> = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
    private static readonly LENGTH: number = ColorMatrix.IDENTITY_MATRIX.length;

    constructor(matrix: Array<number> | null = null) {
        super();
        matrix = this.fixMatrix(matrix);
        this.copyMatrix(matrix.length === ColorMatrix.LENGTH ? matrix : ColorMatrix.IDENTITY_MATRIX);
    }

    public reset(): void { for (let i = 0; i < ColorMatrix.LENGTH; i++) this[i] = ColorMatrix.IDENTITY_MATRIX[i]; }

    public adjustColor(brightness: number, contrast: number, saturation: number, hue: number): void {
        this.adjustHue(hue);
        this.adjustContrast(contrast);
        this.adjustBrightness(brightness);
        this.adjustSaturation(saturation);
    }

    public adjustBrightness(value: number): void {
        value = this.cleanValue(value, 100);
        if (value === 0 || isNaN(value)) return;
        this.multiplyMatrix([1, 0, 0, 0, value, 0, 1, 0, 0, value, 0, 0, 1, 0, value, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    public adjustContrast(value: number): void {
        value = this.cleanValue(value, 100);
        if (value === 0 || isNaN(value)) return;
        let x: number;
        if (value < 0) { x = 127 + value / 100 * 127; }
        else {
            x = value % 1;
            if (x === 0) x = Number(ColorMatrix.DELTA_INDEX[value]);
            else x = ColorMatrix.DELTA_INDEX[value << 0] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x;
            x = x * 127 + 127;
        }
        this.multiplyMatrix([x / 127, 0, 0, 0, 0.5 * (127 - x), 0, x / 127, 0, 0, 0.5 * (127 - x), 0, 0, x / 127, 0, 0.5 * (127 - x), 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    public adjustSaturation(value: number): void {
        value = this.cleanValue(value, 100);
        if (value === 0 || isNaN(value)) return;
        const x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
        const lumR = 0.3086;
        const lumG = 0.6094;
        const lumB = 0.082;
        this.multiplyMatrix([lumR * (1 - x) + x, lumG * (1 - x), lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x) + x, lumB * (1 - x), 0, 0, lumR * (1 - x), lumG * (1 - x), lumB * (1 - x) + x, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    public adjustHue(value: number): void {
        value = this.cleanValue(value, 180) / 180 * Math.PI;
        if (value === 0 || isNaN(value)) return;
        const cos = Math.cos(value);
        const sin = Math.sin(value);
        const lumR = 0.213;
        const lumG = 0.715;
        const lumB = 0.072;
        this.multiplyMatrix([lumR + cos * (1 - lumR) + sin * -lumR, lumG + cos * -lumG + sin * -lumG, lumB + cos * -lumB + sin * (1 - lumB), 0, 0, lumR + cos * -lumR + sin * 0.143, lumG + cos * (1 - lumG) + sin * 0.14, lumB + cos * -lumB + sin * -0.283, 0, 0, lumR + cos * -lumR + sin * -(1 - lumR), lumG + cos * -lumG + sin * lumG, lumB + cos * (1 - lumB) + sin * lumB, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    }

    public concatMatrix(matrix: Array<number>): void {
        matrix = this.fixMatrix(matrix);
        if (matrix.length !== ColorMatrix.LENGTH) return;
        this.multiplyMatrix(matrix);
    }

    public clone(): ColorMatrix { return new ColorMatrix(this as any as Array<number>); }
    public override toString(): string { return "ColorMatrix [ " + this.join(" , ") + " ]"; }
    public toArray(): Array<number> { return this.slice(0, 20); }

    protected copyMatrix(matrix: Array<number>): void { for (let i = 0; i < ColorMatrix.LENGTH; i++) this[i] = matrix[i]; }

    protected multiplyMatrix(matrix: Array<number>): void {
        const col: Array<number> = [];
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) col[x] = this[x + y * 5];
            for (let x = 0; x < 5; x++) {
                let val = 0;
                for (let z = 0; z < 5; z++) val += matrix[x + z * 5] * col[z];
                this[x + y * 5] = val;
            }
        }
    }

    protected cleanValue(value: number, limit: number): number { return Math.min(limit, Math.max(-limit, value)); }

    protected fixMatrix(matrix: Array<number> | null | any = null): Array<number> {
        if (matrix === null) return ColorMatrix.IDENTITY_MATRIX.slice();
        if (matrix instanceof ColorMatrix) matrix = matrix.slice(0);
        if (matrix.length < ColorMatrix.LENGTH) matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
        else if (matrix.length > ColorMatrix.LENGTH) matrix = matrix.slice(0, ColorMatrix.LENGTH);
        return matrix;
    }
}
