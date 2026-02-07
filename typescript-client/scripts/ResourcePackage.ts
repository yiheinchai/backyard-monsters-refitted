import Point from 'openfl/geom/Point';
import { TweenLite, Sine } from './gs/TweenLite';
import { ResourcePackage_CLIP } from './ResourcePackage_CLIP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getResourcePackages(): any { return require("./ResourcePackages").ResourcePackages; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * ResourcePackage - Individual resource package with tween animation
 * Converted from ActionScript to TypeScript
 */
export class ResourcePackage extends ResourcePackage_CLIP {
    private _frame: number = 0;
    private _id: number;
    private _targetPoint: Point;
    private _target: BFOUNDATION;
    private xd: number;
    private yd: number;
    private _targetRotation: number;
    private _speed: number;

    constructor(
        sourcePoint: Point,
        targetPoint: Point,
        startHeight: number,
        endHeight: number,
        type: number,
        id: number = 0,
        target: BFOUNDATION | null = null,
        delay: number = 0
    ) {
        super();
        const self = this;
        
        const Sound = (): void => {
            if (getBASE().isInfernoMainYardOrOutpost) {
                getSOUNDS().Play("ibankfire");
            } else {
                getSOUNDS().Play("bankfire");
            }
        };
        
        this._target = target!;
        this.visible = false;
        this.x = sourcePoint.x;
        this.y = sourcePoint.y;
        this.mcShadow.y = startHeight;
        this.mcShadow.x = startHeight / 2;
        this._id = id;
        this.mcDot.gotoAndStop(type);
        this.mcShadow.cacheAsBitmap = true;
        this.mcDot.cacheAsBitmap = true;
        
        let time: number = Point.distance(targetPoint, sourcePoint) + Math.random() * 50;
        time /= 150;
        if (time < 0.8) {
            time = 0.8;
        }
        
        TweenLite.to(this, time, {
            "x": targetPoint.x,
            "y": targetPoint.y,
            "visible": true,
            "ease": Sine.easeInOut,
            "delay": delay,
            "onStart": Sound,
            "onComplete": this.Arrived.bind(this)
        });
        TweenLite.to(this.mcDot, time / 2, {
            "y": -(time * 120),
            "ease": Sine.easeOut,
            "delay": delay,
            "overwrite": 0
        });
        TweenLite.to(this.mcDot, time / 2, {
            "y": 0,
            "ease": Sine.easeIn,
            "delay": time / 2 + delay,
            "overwrite": 0
        });
        TweenLite.to(this.mcShadow, time / 2, {
            "x": startHeight / 2 + time * 100,
            "alpha": 0,
            "ease": Sine.easeOut,
            "delay": delay,
            "overwrite": 0
        });
        TweenLite.to(this.mcShadow, time / 2, {
            "x": endHeight / 2,
            "y": endHeight,
            "alpha": 1,
            "ease": Sine.easeIn,
            "delay": time / 2 + delay,
            "overwrite": 0
        });
    }

    private Arrived(): void {
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSOUNDS().Play("ibankland");
        } else {
            getSOUNDS().Play("bankland");
        }
        if (this._target) {
            this._target._hasResources = true;
        }
        getResourcePackages().Remove(this._id);
    }
}
