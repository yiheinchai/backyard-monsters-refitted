import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * AutoAlphaPlugin - Tweens alpha and manages visibility based on alpha value.
 */
export class AutoAlphaPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    protected _tweenVisible: boolean = false;
    protected _visible: boolean = false;
    protected _tween: TweenLite | null = null;
    protected _target: any = null;

    constructor() {
        super();
        this.propName = "autoAlpha";
        this.overwriteProps = ["alpha", "visible"];
        this.onComplete = this.onCompleteTween.bind(this);
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._tween = tween;
        this._visible = value !== 0;
        this._tweenVisible = true;
        this.addTween(target, "alpha", target.alpha, value, "alpha");
        return true;
    }

    public override killProps(lookup: any): void {
        super.killProps(lookup);
        this._tweenVisible = !("visible" in lookup);
    }

    public onCompleteTween(): void {
        if (this._tweenVisible && this._tween!.vars.runBackwards !== true && this._tween!.ease === this._tween!.vars.ease) {
            this._target.visible = this._visible;
        }
    }

    public override set changeFactor(value: number) {
        this.updateTweens(value);
        if (this._target.visible !== true && this._tweenVisible) {
            this._target.visible = true;
        }
    }
}
