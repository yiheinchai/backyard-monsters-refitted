import { MovieClip } from "openfl/display/MovieClip";
import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * FramePlugin - Tweens MovieClip frame position.
 */
export class FramePlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;

    public frame: number = 0;
    protected _target: MovieClip | null = null;

    constructor() {
        super();
        this.propName = "frame";
        this.overwriteProps = ["frame"];
        this.round = true;
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!(target instanceof MovieClip) || isNaN(value)) {
            return false;
        }
        this._target = target as MovieClip;
        this.frame = this._target.currentFrame;
        this.addTween(this, "frame", this.frame, value, "frame");
        return true;
    }

    public override set changeFactor(value: number) {
        this.updateTweens(value);
        this._target!.gotoAndStop(this.frame);
    }
}
