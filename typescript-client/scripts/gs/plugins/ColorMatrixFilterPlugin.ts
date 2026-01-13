import ColorMatrixFilter from "openfl/filters/ColorMatrixFilter";
import { FilterPlugin } from "./FilterPlugin";
import { EndArrayPlugin } from "./EndArrayPlugin";
import { TweenLite } from "../TweenLite";

/**
 * ColorMatrixFilterPlugin - Tweens ColorMatrixFilter properties including brightness, contrast, saturation, hue.
 */
export class ColorMatrixFilterPlugin extends FilterPlugin {
    public static readonly VERSION: number = 1.1;
    public static readonly API: number = 1;

    protected static _idMatrix: Array<number> = [1,0,0,0,0, 0,1,0,0,0, 0,0,1,0,0, 0,0,0,1,0];
    protected static _lumR: number = 0.212671;
    protected static _lumG: number = 0.71516;
    protected static _lumB: number = 0.072169;

    protected _matrix: Array<number> = [];
    protected _matrixTween!: EndArrayPlugin;

    constructor() {
        super();
        this.propName = "colorMatrixFilter";
        this.overwriteProps = ["colorMatrixFilter"];
    }

    public static colorize(matrix: Array<number>, color: number, amount: number = 1): Array<number> {
        if (isNaN(color)) {
            return matrix;
        }
        if (isNaN(amount)) {
            amount = 1;
        }
        const r = ((color >> 16) & 255) / 255;
        const g = ((color >> 8) & 255) / 255;
        const b = (color & 255) / 255;
        const inv = 1 - amount;
        const m: Array<number> = [
            inv + amount * r * ColorMatrixFilterPlugin._lumR, amount * r * ColorMatrixFilterPlugin._lumG, amount * r * ColorMatrixFilterPlugin._lumB, 0, 0,
            amount * g * ColorMatrixFilterPlugin._lumR, inv + amount * g * ColorMatrixFilterPlugin._lumG, amount * g * ColorMatrixFilterPlugin._lumB, 0, 0,
            amount * b * ColorMatrixFilterPlugin._lumR, amount * b * ColorMatrixFilterPlugin._lumG, inv + amount * b * ColorMatrixFilterPlugin._lumB, 0, 0,
            0, 0, 0, 1, 0
        ];
        return ColorMatrixFilterPlugin.applyMatrix(m, matrix);
    }

    public static setThreshold(matrix: Array<number>, threshold: number): Array<number> {
        if (isNaN(threshold)) {
            return matrix;
        }
        const m: Array<number> = [
            ColorMatrixFilterPlugin._lumR * 256, ColorMatrixFilterPlugin._lumG * 256, ColorMatrixFilterPlugin._lumB * 256, 0, -256 * threshold,
            ColorMatrixFilterPlugin._lumR * 256, ColorMatrixFilterPlugin._lumG * 256, ColorMatrixFilterPlugin._lumB * 256, 0, -256 * threshold,
            ColorMatrixFilterPlugin._lumR * 256, ColorMatrixFilterPlugin._lumG * 256, ColorMatrixFilterPlugin._lumB * 256, 0, -256 * threshold,
            0, 0, 0, 1, 0
        ];
        return ColorMatrixFilterPlugin.applyMatrix(m, matrix);
    }

    public static setHue(matrix: Array<number>, hue: number): Array<number> {
        if (isNaN(hue)) {
            return matrix;
        }
        hue *= Math.PI / 180;
        const cos = Math.cos(hue);
        const sin = Math.sin(hue);
        const m: Array<number> = [
            ColorMatrixFilterPlugin._lumR + cos * (1 - ColorMatrixFilterPlugin._lumR) + sin * -ColorMatrixFilterPlugin._lumR,
            ColorMatrixFilterPlugin._lumG + cos * -ColorMatrixFilterPlugin._lumG + sin * -ColorMatrixFilterPlugin._lumG,
            ColorMatrixFilterPlugin._lumB + cos * -ColorMatrixFilterPlugin._lumB + sin * (1 - ColorMatrixFilterPlugin._lumB), 0, 0,
            ColorMatrixFilterPlugin._lumR + cos * -ColorMatrixFilterPlugin._lumR + sin * 0.143,
            ColorMatrixFilterPlugin._lumG + cos * (1 - ColorMatrixFilterPlugin._lumG) + sin * 0.14,
            ColorMatrixFilterPlugin._lumB + cos * -ColorMatrixFilterPlugin._lumB + sin * -0.283, 0, 0,
            ColorMatrixFilterPlugin._lumR + cos * -ColorMatrixFilterPlugin._lumR + sin * -(1 - ColorMatrixFilterPlugin._lumR),
            ColorMatrixFilterPlugin._lumG + cos * -ColorMatrixFilterPlugin._lumG + sin * ColorMatrixFilterPlugin._lumG,
            ColorMatrixFilterPlugin._lumB + cos * (1 - ColorMatrixFilterPlugin._lumB) + sin * ColorMatrixFilterPlugin._lumB, 0, 0,
            0, 0, 0, 1, 0
        ];
        return ColorMatrixFilterPlugin.applyMatrix(m, matrix);
    }

    public static setBrightness(matrix: Array<number>, brightness: number): Array<number> {
        if (isNaN(brightness)) {
            return matrix;
        }
        brightness = brightness * 100 - 100;
        return ColorMatrixFilterPlugin.applyMatrix([
            1, 0, 0, 0, brightness,
            0, 1, 0, 0, brightness,
            0, 0, 1, 0, brightness,
            0, 0, 0, 1, 0
        ], matrix);
    }

    public static setSaturation(matrix: Array<number>, saturation: number): Array<number> {
        if (isNaN(saturation)) {
            return matrix;
        }
        const inv = 1 - saturation;
        const iR = inv * ColorMatrixFilterPlugin._lumR;
        const iG = inv * ColorMatrixFilterPlugin._lumG;
        const iB = inv * ColorMatrixFilterPlugin._lumB;
        const m: Array<number> = [
            iR + saturation, iG, iB, 0, 0,
            iR, iG + saturation, iB, 0, 0,
            iR, iG, iB + saturation, 0, 0,
            0, 0, 0, 1, 0
        ];
        return ColorMatrixFilterPlugin.applyMatrix(m, matrix);
    }

    public static setContrast(matrix: Array<number>, contrast: number): Array<number> {
        if (isNaN(contrast)) {
            return matrix;
        }
        contrast += 0.01;
        const m: Array<number> = [
            contrast, 0, 0, 0, 128 * (1 - contrast),
            0, contrast, 0, 0, 128 * (1 - contrast),
            0, 0, contrast, 0, 128 * (1 - contrast),
            0, 0, 0, 1, 0
        ];
        return ColorMatrixFilterPlugin.applyMatrix(m, matrix);
    }

    public static applyMatrix(matrix: Array<number>, target: Array<number>): Array<number> {
        if (!Array.isArray(matrix) || !Array.isArray(target)) {
            return target;
        }
        const result: Array<number> = [];
        let idx = 0;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 5; x++) {
                let offset = x === 4 ? matrix[idx + 4] : 0;
                result[idx + x] = matrix[idx] * target[x] + matrix[idx + 1] * target[x + 5] + matrix[idx + 2] * target[x + 10] + matrix[idx + 3] * target[x + 15] + offset;
            }
            idx += 5;
        }
        return result;
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._type = ColorMatrixFilter;
        
        this.initFilter({
            remove: value.remove,
            index: value.index,
            addFilter: value.addFilter
        }, new ColorMatrixFilter([...ColorMatrixFilterPlugin._idMatrix]));
        
        this._matrix = (this._filter as ColorMatrixFilter).matrix;
        let endMatrix: Array<number>;
        
        if (value.matrix !== null && value.matrix !== undefined && Array.isArray(value.matrix)) {
            endMatrix = value.matrix;
        } else {
            if (value.relative === true) {
                endMatrix = [...this._matrix];
            } else {
                endMatrix = [...ColorMatrixFilterPlugin._idMatrix];
            }
            endMatrix = ColorMatrixFilterPlugin.setBrightness(endMatrix, value.brightness);
            endMatrix = ColorMatrixFilterPlugin.setContrast(endMatrix, value.contrast);
            endMatrix = ColorMatrixFilterPlugin.setHue(endMatrix, value.hue);
            endMatrix = ColorMatrixFilterPlugin.setSaturation(endMatrix, value.saturation);
            endMatrix = ColorMatrixFilterPlugin.setThreshold(endMatrix, value.threshold);
            if (!isNaN(value.colorize)) {
                endMatrix = ColorMatrixFilterPlugin.colorize(endMatrix, value.colorize, value.amount);
            }
        }
        
        this._matrixTween = new EndArrayPlugin();
        this._matrixTween.init(this._matrix, endMatrix);
        return true;
    }

    public override set changeFactor(value: number) {
        this._matrixTween.changeFactor = value;
        (this._filter as ColorMatrixFilter).matrix = this._matrix;
        super.changeFactor = value;
    }
}
