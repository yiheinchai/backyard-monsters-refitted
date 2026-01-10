import { DisplayObject } from "openfl/display/DisplayObject";
import { Point } from "openfl/geom/Point";
import { TweenPlugin } from "./TweenPlugin";
import { ShortRotationPlugin } from "./ShortRotationPlugin";
import { TweenLite } from "../TweenLite";
import { TweenInfo } from "../utils/tween/TweenInfo";

/**
 * TransformAroundPointPlugin - Transforms display object around a point.
 */
export class TransformAroundPointPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.02;
    public static readonly API: number = 1;

    protected _target!: DisplayObject;
    protected _local!: Point;
    protected _point!: Point;
    protected _shortRotation: ShortRotationPlugin | null = null;

    constructor() {
        super();
        this.propName = "transformAroundPoint";
        this.overwriteProps = [];
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!(value.point instanceof Point)) {
            return false;
        }
        this._target = target as DisplayObject;
        this._point = value.point.clone();
        this._local = this._target.globalToLocal(this._target.parent!.localToGlobal(this._point));
        
        const vars = value.isTV === true ? value.exposedVars : value;
        
        for (const prop in vars) {
            if (prop !== "point") {
                if (prop === "shortRotation") {
                    this._shortRotation = new ShortRotationPlugin();
                    this._shortRotation.onInitTween(this._target, vars[prop], tween);
                    this.addTween(this._shortRotation, "changeFactor", 0, 1, "shortRotation");
                    for (const rotProp in vars[prop]) {
                        this.overwriteProps[this.overwriteProps.length] = rotProp;
                    }
                } else if (prop === "x" || prop === "y") {
                    this.addTween(this._point, prop, (this._point as any)[prop], vars[prop], prop);
                    this.overwriteProps[this.overwriteProps.length] = prop;
                } else if (prop === "scale") {
                    this.addTween(this._target, "scaleX", this._target.scaleX, vars.scale, "scaleX");
                    this.addTween(this._target, "scaleY", this._target.scaleY, vars.scale, "scaleY");
                    this.overwriteProps[this.overwriteProps.length] = "scaleX";
                    this.overwriteProps[this.overwriteProps.length] = "scaleY";
                } else {
                    this.addTween(this._target, prop, (this._target as any)[prop], vars[prop], prop);
                    this.overwriteProps[this.overwriteProps.length] = prop;
                }
            }
        }
        
        if (tween !== null) {
            if ("x" in tween.exposedVars || "y" in tween.exposedVars) {
                let endX: number = NaN;
                let endY: number = NaN;
                if ("x" in tween.exposedVars) {
                    endX = typeof tween.exposedVars.x === "number" ? Number(tween.exposedVars.x) : this._target.x + Number(tween.exposedVars.x);
                }
                if ("y" in tween.exposedVars) {
                    endY = typeof tween.exposedVars.y === "number" ? Number(tween.exposedVars.y) : this._target.y + Number(tween.exposedVars.y);
                }
                tween.killVars({ x: true, y: true });
                this.changeFactor = 1;
                if (!isNaN(endX)) {
                    this.addTween(this._point, "x", this._point.x, this._point.x + (endX - this._target.x), "x");
                    this.overwriteProps[this.overwriteProps.length] = "x";
                }
                if (!isNaN(endY)) {
                    this.addTween(this._point, "y", this._point.y, this._point.y + (endY - this._target.y), "y");
                    this.overwriteProps[this.overwriteProps.length] = "y";
                }
                this.changeFactor = 0;
            }
        }
        return true;
    }

    public override killProps(lookup: any): void {
        if (this._shortRotation !== null) {
            this._shortRotation.killProps(lookup);
            if (this._shortRotation.overwriteProps.length === 0) {
                lookup.shortRotation = true;
            }
        }
        super.killProps(lookup);
    }

    public override set changeFactor(value: number) {
        if (this.round) {
            for (let i = this._tweens.length - 1; i > -1; i--) {
                const ti = this._tweens[i];
                const val = ti.start + ti.change * value;
                const sign = val < 0 ? -1 : 1;
                ti.target[ti.property] = (val % 1) * sign > 0.5 ? Math.floor(val) + sign : Math.floor(val);
            }
            const global = this._target.parent!.globalToLocal(this._target.localToGlobal(this._local));
            const dx = this._target.x + this._point.x - global.x;
            const dy = this._target.y + this._point.y - global.y;
            const signX = dx < 0 ? -1 : 1;
            const signY = dy < 0 ? -1 : 1;
            this._target.x = (dx % 1) * signX > 0.5 ? Math.floor(dx) + signX : Math.floor(dx);
            this._target.y = (dy % 1) * signY > 0.5 ? Math.floor(dy) + signY : Math.floor(dy);
        } else {
            for (let i = this._tweens.length - 1; i > -1; i--) {
                const ti = this._tweens[i];
                ti.target[ti.property] = ti.start + ti.change * value;
            }
            const global = this._target.parent!.globalToLocal(this._target.localToGlobal(this._local));
            this._target.x += this._point.x - global.x;
            this._target.y += this._point.y - global.y;
        }
        this._changeFactor = value;
    }
}
