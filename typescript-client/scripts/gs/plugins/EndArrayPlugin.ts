import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";
import { ArrayTweenInfo } from "../utils/tween/ArrayTweenInfo";

/**
 * EndArrayPlugin - Tweens arrays of numbers.
 */
export class EndArrayPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;

    protected _a: Array<number> = [];
    protected _info: Array<ArrayTweenInfo> = [];

    constructor() {
        super();
        this._info = [];
        this.propName = "endArray";
        this.overwriteProps = ["endArray"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!Array.isArray(target) || !Array.isArray(value)) {
            return false;
        }
        this.init(target as Array<number>, value as Array<number>);
        return true;
    }

    public init(start: Array<number>, end: Array<number>): void {
        this._a = start;
        for (let i = end.length - 1; i > -1; i--) {
            if (start[i] !== end[i] && start[i] !== null) {
                this._info[this._info.length] = new ArrayTweenInfo(i, this._a[i], end[i] - this._a[i]);
            }
        }
    }

    public override set changeFactor(value: number) {
        if (this.round) {
            for (let i = this._info.length - 1; i > -1; i--) {
                const ti = this._info[i];
                const val = ti.start + ti.change * value;
                const sign = val < 0 ? -1 : 1;
                this._a[ti.index] = (val % 1) * sign > 0.5 ? Math.floor(val) + sign : Math.floor(val);
            }
        } else {
            for (let i = this._info.length - 1; i > -1; i--) {
                const ti = this._info[i];
                this._a[ti.index] = ti.start + ti.change * value;
            }
        }
    }
}
