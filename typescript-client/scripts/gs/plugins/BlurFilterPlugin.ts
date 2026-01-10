import { BlurFilter } from "openfl/filters/BlurFilter";
import { FilterPlugin } from "./FilterPlugin";
import { TweenLite } from "../TweenLite";

/**
 * BlurFilterPlugin - Tweens BlurFilter properties.
 */
export class BlurFilterPlugin extends FilterPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "blurFilter";
        this.overwriteProps = ["blurFilter"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._type = BlurFilter;
        this.initFilter(value, new BlurFilter(0, 0, value.quality || 2));
        return true;
    }
}
