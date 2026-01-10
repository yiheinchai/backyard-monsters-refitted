import { BevelFilter } from "openfl/filters/BevelFilter";
import { FilterPlugin } from "./FilterPlugin";
import { TweenLite } from "../TweenLite";

/**
 * BevelFilterPlugin - Tweens BevelFilter properties.
 */
export class BevelFilterPlugin extends FilterPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "bevelFilter";
        this.overwriteProps = ["bevelFilter"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._type = BevelFilter;
        this.initFilter(value, new BevelFilter(0, 0, 0xFFFFFF, 0.5, 0, 0.5, 2, 2, 0, value.quality || 2));
        return true;
    }
}
