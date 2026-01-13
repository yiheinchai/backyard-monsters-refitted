import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * HexColorsPlugin - Tweens hex color properties.
 */
export class HexColorsPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;

    protected _colors: Array<any> = [];

    constructor() {
        super();
        this.propName = "hexColors";
        this.overwriteProps = [];
        this._colors = [];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        for (const prop in value) {
            this.initColor(target, prop, target[prop] as number, value[prop] as number);
        }
        return true;
    }

    public initColor(target: any, propName: string, startColor: number, endColor: number): void {
        if (startColor !== endColor) {
            const sR = startColor >> 16;
            const sG = (startColor >> 8) & 255;
            const sB = startColor & 255;
            this._colors[this._colors.length] = [
                target,
                propName,
                sR,
                (endColor >> 16) - sR,
                sG,
                ((endColor >> 8) & 255) - sG,
                sB,
                (endColor & 255) - sB
            ];
            this.overwriteProps[this.overwriteProps.length] = propName;
        }
    }

    public override killProps(lookup: any): void {
        for (let i = this._colors.length - 1; i > -1; i--) {
            if (lookup[this._colors[i][1]] !== undefined) {
                this._colors.splice(i, 1);
            }
        }
        super.killProps(lookup);
    }

    public override set changeFactor(value: number) {
        for (let i = this._colors.length - 1; i > -1; i--) {
            const c = this._colors[i];
            c[0][c[1]] = ((c[2] + value * c[3]) << 16) | ((c[4] + value * c[5]) << 8) | (c[6] + value * c[7]);
        }
    }
}
