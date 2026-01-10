import { TweenInfo } from "../utils/tween/TweenInfo";
import { TweenLite } from "../TweenLite";

/**
 * TweenPlugin - Base class for all GreenSock tween plugins.
 */
export class TweenPlugin {
    public static readonly VERSION: number = 1.03;
    public static readonly API: number = 1;

    public propName: string = "";
    public overwriteProps: Array<string> = [];
    public round: boolean = false;
    public onComplete: Function | null = null;
    protected _tweens: Array<TweenInfo> = [];
    protected _changeFactor: number = 0;

    constructor() {
        this._tweens = [];
    }

    public static activate(plugins: Array<any>): boolean {
        for (let i = plugins.length - 1; i > -1; i--) {
            const instance = new plugins[i]();
            TweenLite.plugins[instance.propName] = plugins[i];
        }
        return true;
    }

    public onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this.addTween(target, this.propName, target[this.propName], value, this.propName);
        return true;
    }

    protected addTween(target: any, property: string, start: number, end: any, name: string | null = null): void {
        if (end !== null && end !== undefined) {
            const change = typeof end === "number" ? end - start : Number(end);
            if (change !== 0) {
                this._tweens[this._tweens.length] = new TweenInfo(target, property, start, change, name || property, false);
            }
        }
    }

    protected updateTweens(factor: number): void {
        if (this.round) {
            for (let i = this._tweens.length - 1; i > -1; i--) {
                const ti = this._tweens[i];
                const val = ti.start + ti.change * factor;
                const sign = val < 0 ? -1 : 1;
                ti.target[ti.property] = (val % 1) * sign > 0.5 ? Math.floor(val) + sign : Math.floor(val);
            }
        } else {
            for (let i = this._tweens.length - 1; i > -1; i--) {
                const ti = this._tweens[i];
                ti.target[ti.property] = ti.start + ti.change * factor;
            }
        }
    }

    public set changeFactor(value: number) {
        this.updateTweens(value);
        this._changeFactor = value;
    }

    public get changeFactor(): number {
        return this._changeFactor;
    }

    public killProps(lookup: any): void {
        for (let i = this.overwriteProps.length - 1; i > -1; i--) {
            if (this.overwriteProps[i] in lookup) {
                this.overwriteProps.splice(i, 1);
            }
        }
        for (let i = this._tweens.length - 1; i > -1; i--) {
            if (this._tweens[i].name in lookup) {
                this._tweens.splice(i, 1);
            }
        }
    }
}
