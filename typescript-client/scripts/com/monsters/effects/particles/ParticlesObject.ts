import MovieClip from "openfl/display/MovieClip";
import Point from "openfl/geom/Point";

import { Particles } from "./Particles";
import { ParticlesObject_CLIP } from "./ParticlesObject_CLIP";

import { TweenLite } from "gs/TweenLite";
import { Sine } from "gs/easing/Sine";

/**
 * ParticlesObject - animated particle for resource collection effects.
 */
export class ParticlesObject extends ParticlesObject_CLIP {
    private _frame: number = 0;
    private _id: number = 0;
    private _targetPoint: Point | null = null;
    private _target: MovieClip | null = null;
    public _cleared: boolean = false;
    private xd: number = 0;
    private yd: number = 0;
    private _targetRotation: number = 0;
    private _speed: number = 0;

    constructor() {
        super();
    }

    public init(id: number, startPos: Point, endPos: Point, distance: number, delay: number, scale: number): void {
        this._id = id;
        this.visible = false;
        this._cleared = false;
        this.x = startPos.x;
        this.y = startPos.y;
        this.scaleX = this.scaleY = scale;
        let duration: number = Math.sqrt(distance * 0.3) * 0.2;
        if (duration < 0.3) {
            duration = 0.3;
        }
        TweenLite.to(this, duration, {
            "x": endPos.x,
            "y": endPos.y,
            "visible": true,
            "ease": Sine.easeInOut,
            "delay": delay,
            "onComplete": this.Arrived.bind(this),
            "overwrite": false
        });
        TweenLite.to(this.mcDot, duration / 2, {
            "y": -(duration * 50),
            "ease": Sine.easeOut,
            "delay": delay,
            "overwrite": 0
        });
        TweenLite.to(this.mcDot, duration / 2, {
            "y": 0,
            "ease": Sine.easeIn,
            "delay": duration / 2 + delay,
            "overwrite": 0
        });
        this.cacheAsBitmap = true;
    }

    private Arrived(): void {
        if (!this._cleared) {
            Particles.SnapShot(this.x, this.y, this.scaleX, this);
            Particles.Remove(this._id);
        }
    }

    public Clear(): void {
        this._cleared = true;
    }
}
