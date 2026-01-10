import DropShadowFilter from "openfl/filters/DropShadowFilter";
import { FilterPlugin } from "./FilterPlugin";
import { TweenLite } from "../TweenLite";

/**
 * DropShadowFilterPlugin - Tweens DropShadowFilter properties.
 */
export class DropShadowFilterPlugin extends FilterPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "dropShadowFilter";
        this.overwriteProps = ["dropShadowFilter"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._type = DropShadowFilter;
        this.initFilter(value, new DropShadowFilter(0, 45, 0, 0, 0, 0, 1, value.quality || 2, value.inner, value.knockout, value.hideObject));
        return true;
    }
}
