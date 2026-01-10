import { SoundTransform } from "openfl/media/SoundTransform";
import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * VolumePlugin - Tweens the volume of an object with soundTransform.
 */
export class VolumePlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;

    protected _target: any = null;
    protected _st: SoundTransform | null = null;

    constructor() {
        super();
        this.propName = "volume";
        this.overwriteProps = ["volume"];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (isNaN(value) || !target.hasOwnProperty || !target.hasOwnProperty("soundTransform")) {
            return false;
        }
        this._target = target;
        this._st = this._target.soundTransform;
        this.addTween(this._st, "volume", this._st!.volume, value, "volume");
        return true;
    }

    public override set changeFactor(value: number) {
        this.updateTweens(value);
        this._target.soundTransform = this._st;
    }
}
