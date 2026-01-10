import DisplayObject from "openfl/display/DisplayObject";
import ColorTransform from "openfl/geom/ColorTransform";
import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";
import { TweenInfo } from "../utils/tween/TweenInfo";

/**
 * TintPlugin - Tweens the color tint of a DisplayObject.
 */
export class TintPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.1;
    public static readonly API: number = 1;

    protected static _props: Array<string> = [
        "redMultiplier", "greenMultiplier", "blueMultiplier", "alphaMultiplier",
        "redOffset", "greenOffset", "blueOffset", "alphaOffset"
    ];

    protected _target!: DisplayObject;
    protected _ct!: ColorTransform;
    protected _ignoreAlpha: boolean = false;

    constructor() {
        super();
        this.propName = "tint";
        this.overwriteProps = ["tint"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!(target instanceof DisplayObject)) {
            return false;
        }
        const endCT = new ColorTransform();
        if (value !== null && tween.exposedVars.removeTint !== true) {
            endCT.color = value as number;
        }
        this._ignoreAlpha = true;
        this.init(target as DisplayObject, endCT);
        return true;
    }

    public init(target: DisplayObject, endCT: ColorTransform): void {
        this._target = target;
        this._ct = this._target.transform.colorTransform;
        for (let i = TintPlugin._props.length - 1; i > -1; i--) {
            const prop = TintPlugin._props[i];
            if ((this._ct as any)[prop] !== (endCT as any)[prop]) {
                this._tweens[this._tweens.length] = new TweenInfo(this._ct, prop, (this._ct as any)[prop], (endCT as any)[prop] - (this._ct as any)[prop], "tint", false);
            }
        }
    }

    public override set changeFactor(value: number) {
        this.updateTweens(value);
        if (this._ignoreAlpha) {
            const currCT = this._target.transform.colorTransform;
            this._ct.alphaMultiplier = currCT.alphaMultiplier;
            this._ct.alphaOffset = currCT.alphaOffset;
        }
        this._target.transform.colorTransform = this._ct;
    }
}
