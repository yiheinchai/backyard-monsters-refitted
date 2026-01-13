import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * VisiblePlugin - Sets visibility at the end of a tween.
 */
export class VisiblePlugin extends TweenPlugin {
    public static readonly VERSION: number = 1;
    public static readonly API: number = 1;

    protected _target: any = null;
    protected _tween: TweenLite | null = null;
    protected _visible: boolean = false;

    constructor() {
        super();
        this.propName = "visible";
        this.overwriteProps = ["visible"];
        this.onComplete = this.onCompleteTween.bind(this);
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        this._target = target;
        this._tween = tween;
        this._visible = Boolean(value);
        return true;
    }

    public onCompleteTween(): void {
        if (this._tween!.vars.runBackwards !== true && this._tween!.ease === this._tween!.vars.ease) {
            this._target.visible = this._visible;
        }
    }

    public override set changeFactor(value: number) {
        if (this._target.visible !== true) {
            this._target.visible = true;
        }
    }
}
