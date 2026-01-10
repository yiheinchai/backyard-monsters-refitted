import { TweenPlugin } from "./TweenPlugin";
import { TweenLite } from "../TweenLite";

/**
 * BezierPlugin - Tweens along a Bezier path.
 */
export class BezierPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.01;
    public static readonly API: number = 1;
    protected static readonly _RAD2DEG: number = 180 / Math.PI;

    protected _target: any = null;
    protected _orientData: Array<any> | null = null;
    protected _orient: boolean = false;
    protected _future: any = {};
    protected _beziers: any = {};

    constructor() {
        super();
        this._future = {};
        this.propName = "bezier";
        this.overwriteProps = [];
    }

    public static parseBeziers(data: any, through: boolean = false): any {
        const result: any = {};
        
        if (through) {
            for (const prop in data) {
                const arr = data[prop];
                const segs: Array<Array<number>> = [];
                result[prop] = segs;
                
                if (arr.length > 2) {
                    segs[segs.length] = [arr[0], arr[1] - (arr[2] - arr[0]) / 4, arr[1]];
                    for (let i = 1; i < arr.length - 1; i++) {
                        segs[segs.length] = [arr[i], arr[i] + (arr[i] - segs[i - 1][1]), arr[i + 1]];
                    }
                } else {
                    segs[segs.length] = [arr[0], (arr[0] + arr[1]) / 2, arr[1]];
                }
            }
        } else {
            for (const prop in data) {
                const arr = data[prop];
                const segs: Array<Array<number>> = [];
                result[prop] = segs;
                
                if (arr.length > 3) {
                    segs[segs.length] = [arr[0], arr[1], (arr[1] + arr[2]) / 2];
                    for (let i = 2; i < arr.length - 2; i++) {
                        segs[segs.length] = [segs[i - 2][2], arr[i], (arr[i] + arr[i + 1]) / 2];
                    }
                    segs[segs.length] = [segs[segs.length - 1][2], arr[arr.length - 2], arr[arr.length - 1]];
                } else if (arr.length === 3) {
                    segs[segs.length] = [arr[0], arr[1], arr[2]];
                } else if (arr.length === 2) {
                    segs[segs.length] = [arr[0], (arr[0] + arr[1]) / 2, arr[1]];
                }
            }
        }
        return result;
    }

    public override onInitTween(target: any, value: any, tween: TweenLite): boolean {
        if (!Array.isArray(value)) {
            return false;
        }
        this.init(tween, value as Array<any>, false);
        return true;
    }

    protected init(tween: TweenLite, beziers: Array<any>, through: boolean): void {
        this._target = tween.target;
        
        if (tween.exposedVars.orientToBezier === true) {
            this._orientData = [["x", "y", "rotation", 0]];
            this._orient = true;
        } else if (Array.isArray(tween.exposedVars.orientToBezier)) {
            this._orientData = tween.exposedVars.orientToBezier;
            this._orient = true;
        }
        
        const props: any = {};
        for (let i = 0; i < beziers.length; i++) {
            for (const prop in beziers[i]) {
                if (props[prop] === undefined) {
                    props[prop] = [tween.target[prop]];
                }
                if (typeof beziers[i][prop] === "number") {
                    props[prop].push(beziers[i][prop]);
                } else {
                    props[prop].push(tween.target[prop] + Number(beziers[i][prop]));
                }
            }
        }
        
        for (const prop in props) {
            this.overwriteProps[this.overwriteProps.length] = prop;
            if (tween.exposedVars[prop] !== undefined) {
                if (typeof tween.exposedVars[prop] === "number") {
                    props[prop].push(tween.exposedVars[prop]);
                } else {
                    props[prop].push(tween.target[prop] + Number(tween.exposedVars[prop]));
                }
                delete tween.exposedVars[prop];
                for (let i = tween.tweens.length - 1; i > -1; i--) {
                    if (tween.tweens[i].name === prop) {
                        tween.tweens.splice(i, 1);
                    }
                }
            }
        }
        this._beziers = BezierPlugin.parseBeziers(props, through);
    }

    public override killProps(lookup: any): void {
        for (const prop in this._beziers) {
            if (prop in lookup) {
                delete this._beziers[prop];
            }
        }
        super.killProps(lookup);
    }

    public override set changeFactor(value: number) {
        if (value === 1) {
            for (const prop in this._beziers) {
                const i = this._beziers[prop].length - 1;
                this._target[prop] = this._beziers[prop][i][2];
            }
        } else {
            for (const prop in this._beziers) {
                const segs = this._beziers[prop].length;
                let idx: number;
                if (value < 0) {
                    idx = 0;
                } else if (value >= 1) {
                    idx = segs - 1;
                } else {
                    idx = Math.floor(segs * value);
                }
                const t = (value - idx * (1 / segs)) * segs;
                const seg = this._beziers[prop][idx];
                if (this.round) {
                    const val = seg[0] + t * (2 * (1 - t) * (seg[1] - seg[0]) + t * (seg[2] - seg[0]));
                    const sign = val < 0 ? -1 : 1;
                    this._target[prop] = (val % 1) * sign > 0.5 ? Math.floor(val) + sign : Math.floor(val);
                } else {
                    this._target[prop] = seg[0] + t * (2 * (1 - t) * (seg[1] - seg[0]) + t * (seg[2] - seg[0]));
                }
            }
        }
        
        if (this._orient) {
            const origTarget = this._target;
            const origRound = this.round;
            this._target = this._future;
            this.round = false;
            this._orient = false;
            this.changeFactor = value + 0.01;
            this._target = origTarget;
            this.round = origRound;
            this._orient = true;
            
            for (let i = 0; i < this._orientData!.length; i++) {
                const data = this._orientData![i];
                const offset = Number(data[3]) || 0;
                const dx = this._future[data[0]] - this._target[data[0]];
                const dy = this._future[data[1]] - this._target[data[1]];
                this._target[data[2]] = Math.atan2(dy, dx) * BezierPlugin._RAD2DEG + offset;
            }
        }
    }
}
