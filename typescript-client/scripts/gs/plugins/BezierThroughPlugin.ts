import { BezierPlugin } from "./BezierPlugin";
import { TweenLite } from "../TweenLite";

/**
 * BezierThroughPlugin - Tweens through points (through mode Bezier).
 */
export class BezierThroughPlugin extends BezierPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    constructor() {
        super();
        this.propName = "bezierThrough";
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!Array.isArray(value)) {
            return false;
        }
        this.init(tween, value as Array<any>, true);
        return true;
    }
}
