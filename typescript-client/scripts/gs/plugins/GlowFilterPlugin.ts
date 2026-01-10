import { GlowFilter } from "openfl/filters/GlowFilter";
import { FilterPlugin } from "./FilterPlugin";
import { TweenLite } from "../TweenLite";

/**
 * GlowFilterPlugin - Tweens GlowFilter properties.
 */
export class GlowFilterPlugin extends FilterPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "glowFilter";
        this.overwriteProps = ["glowFilter"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._type = GlowFilter;
        this.initFilter(value, new GlowFilter(0xFFFFFF, 0, 0, 0, Number(value.strength) || 1, value.quality || 2, value.inner, value.knockout));
        return true;
    }
}
