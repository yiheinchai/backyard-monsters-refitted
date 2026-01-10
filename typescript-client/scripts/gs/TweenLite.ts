import { DisplayObject } from "openfl/display/DisplayObject";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { TweenPlugin } from "./plugins/TweenPlugin";
import { TweenInfo } from "./utils/tween/TweenInfo";

/**
 * TweenLite - Lightweight, high-performance tweening engine.
 */
export class TweenLite {
    public static readonly version: number = 10.092;

    public static plugins: { [key: string]: any } = {};
    public static killDelayedCallsTo: Function = TweenLite.killTweensOf;
    public static defaultEase: Function = TweenLite.easeOut;
    public static overwriteManager: any = null;
    public static currentTime: number = 0;
    public static masterList: Map<any, Array<TweenLite>> = new Map();
    public static timingSprite: Sprite = new Sprite();

    private static _tlInitted: boolean = false;
    private static _timerInterval: any = null;

    protected static _reservedProps: { [key: string]: number } = {
        "ease": 1,
        "delay": 1,
        "overwrite": 1,
        "onComplete": 1,
        "onCompleteParams": 1,
        "runBackwards": 1,
        "startAt": 1,
        "onUpdate": 1,
        "onUpdateParams": 1,
        "roundProps": 1,
        "onStart": 1,
        "onStartParams": 1,
        "persist": 1,
        "renderOnStart": 1,
        "proxiedEase": 1,
        "easeParams": 1,
        "yoyo": 1,
        "loop": 1,
        "onCompleteListener": 1,
        "onUpdateListener": 1,
        "onStartListener": 1,
        "orientToBezier": 1,
        "timeScale": 1
    };

    public duration: number = 0;
    public vars: any;
    public delay: number = 0;
    public startTime: number = 0;
    public initTime: number = 0;
    public tweens: Array<TweenInfo> = [];
    public target: any;
    public active: boolean = false;
    public ease: Function;
    public initted: boolean = false;
    public combinedTimeScale: number = 1;
    public gc: boolean = false;
    public started: boolean = false;
    public exposedVars: any;
    protected _hasPlugins: boolean = false;
    protected _hasUpdate: boolean = false;

    constructor(target: any, duration: number, vars: any) {
        if (target === null) {
            return;
        }
        if (!TweenLite._tlInitted) {
            // Note: Plugin activation simplified - plugins should be manually activated
            TweenLite.currentTime = Date.now();
            TweenLite.timingSprite.addEventListener(Event.ENTER_FRAME, TweenLite.updateAll);
            if (TweenLite.overwriteManager === null) {
                TweenLite.overwriteManager = {
                    mode: 1,
                    enabled: false
                };
            }
            TweenLite._timerInterval = setInterval(TweenLite.killGarbage, 2000);
            TweenLite._tlInitted = true;
        }
        this.vars = vars;
        this.duration = duration || 0.001;
        this.delay = Number(vars.delay) || 0;
        this.combinedTimeScale = Number(vars.timeScale) || 1;
        this.active = duration === 0 && this.delay === 0;
        this.target = target;
        if (typeof this.vars.ease !== "function") {
            this.vars.ease = TweenLite.defaultEase;
        }
        if (this.vars.easeParams !== null && this.vars.easeParams !== undefined) {
            this.vars.proxiedEase = this.vars.ease;
            this.vars.ease = this.easeProxy.bind(this);
        }
        this.ease = this.vars.ease;
        this.exposedVars = this.vars.isTV === true ? this.vars.exposedVars : this.vars;
        this.tweens = [];
        this.initTime = TweenLite.currentTime;
        this.startTime = this.initTime + this.delay * 1000;

        const overwriteMode = vars.overwrite === undefined || (!TweenLite.overwriteManager.enabled && vars.overwrite > 1) 
            ? TweenLite.overwriteManager.mode 
            : vars.overwrite;

        if (!TweenLite.masterList.has(target) || overwriteMode === 1) {
            TweenLite.masterList.set(target, [this]);
        } else {
            TweenLite.masterList.get(target)!.push(this);
        }

        if ((this.vars.runBackwards === true && this.vars.renderOnStart !== true) || this.active) {
            this.initTweenVals();
            if (this.active) {
                this.render(this.startTime + 1);
            } else {
                this.render(this.startTime);
            }
            if (this.exposedVars.visible !== undefined && this.vars.runBackwards === true && this.target instanceof DisplayObject) {
                this.target.visible = this.exposedVars.visible;
            }
        }
    }

    public static to(target: any, duration: number, vars: any): TweenLite {
        return new TweenLite(target, duration, vars);
    }

    public static from(target: any, duration: number, vars: any): TweenLite {
        vars.runBackwards = true;
        return new TweenLite(target, duration, vars);
    }

    public static delayedCall(delay: number, callback: Function, params: Array<any> | null = null): TweenLite {
        return new TweenLite(callback, 0, {
            delay: delay,
            onComplete: callback,
            onCompleteParams: params,
            overwrite: 0
        });
    }

    public static updateAll(event: Event | null = null): void {
        const time = TweenLite.currentTime = Date.now();
        TweenLite.masterList.forEach((tweens, target) => {
            for (let i = tweens.length - 1; i > -1; i--) {
                const tween = tweens[i];
                if (tween.active) {
                    tween.render(time);
                } else if (tween.gc) {
                    tweens.splice(i, 1);
                } else if (time >= tween.startTime) {
                    tween.activate();
                    tween.render(time);
                }
            }
        });
    }

    public static removeTween(tween: TweenLite, clear: boolean = true): void {
        if (tween !== null) {
            if (clear) {
                tween.clear();
            }
            tween.enabled = false;
        }
    }

    public static killTweensOf(target: any = null, complete: boolean = false): void {
        if (target !== null && TweenLite.masterList.has(target)) {
            const tweens = TweenLite.masterList.get(target)!;
            for (let i = tweens.length - 1; i > -1; i--) {
                const tween = tweens[i];
                if (complete && !tween.gc) {
                    tween.complete(false);
                }
                tween.clear();
            }
            TweenLite.masterList.delete(target);
        }
    }

    protected static killGarbage(): void {
        TweenLite.masterList.forEach((tweens, target) => {
            if (tweens.length === 0) {
                TweenLite.masterList.delete(target);
            }
        });
    }

    public static easeOut(t: number, b: number, c: number, d: number): number {
        t = t / d;
        return -c * t * (t - 2) + b;
    }

    public initTweenVals(): void {
        if (this.exposedVars.timeScale !== undefined && this.target.hasOwnProperty && this.target.hasOwnProperty("timeScale")) {
            this.tweens[this.tweens.length] = new TweenInfo(this.target, "timeScale", this.target.timeScale, this.exposedVars.timeScale - this.target.timeScale, "timeScale", false);
        }
        for (const prop in this.exposedVars) {
            if (!(prop in TweenLite._reservedProps)) {
                if (prop in TweenLite.plugins) {
                    const plugin = new TweenLite.plugins[prop]();
                    if (plugin.onInitTween(this.target, this.exposedVars[prop], this) === false) {
                        this.tweens[this.tweens.length] = new TweenInfo(this.target, prop, this.target[prop], typeof this.exposedVars[prop] === "number" ? this.exposedVars[prop] - this.target[prop] : Number(this.exposedVars[prop]), prop, false);
                    } else {
                        this.tweens[this.tweens.length] = new TweenInfo(plugin, "changeFactor", 0, 1, plugin.overwriteProps.length === 1 ? String(plugin.overwriteProps[0]) : "_MULTIPLE_", true);
                        this._hasPlugins = true;
                    }
                } else {
                    this.tweens[this.tweens.length] = new TweenInfo(this.target, prop, this.target[prop], typeof this.exposedVars[prop] === "number" ? this.exposedVars[prop] - this.target[prop] : Number(this.exposedVars[prop]), prop, false);
                }
            }
        }
        if (this.vars.runBackwards === true) {
            for (let i = this.tweens.length - 1; i > -1; i--) {
                const ti = this.tweens[i];
                ti.start += ti.change;
                ti.change = -ti.change;
            }
        }
        if (this.vars.onUpdate !== null && this.vars.onUpdate !== undefined) {
            this._hasUpdate = true;
        }
        if (TweenLite.overwriteManager.enabled && TweenLite.masterList.has(this.target)) {
            TweenLite.overwriteManager.manageOverwrites(this, TweenLite.masterList.get(this.target));
        }
        this.initted = true;
    }

    public activate(): void {
        this.started = this.active = true;
        if (!this.initted) {
            this.initTweenVals();
        }
        if (this.vars.onStart !== null && this.vars.onStart !== undefined) {
            this.vars.onStart.apply(null, this.vars.onStartParams);
        }
        if (this.duration === 0.001) {
            this.startTime--;
        }
    }

    public render(time: number): void {
        let factor: number;
        let elapsed = (time - this.startTime) * 0.001;
        if (elapsed >= this.duration) {
            elapsed = this.duration;
            factor = this.ease === this.vars.ease || this.duration === 0.001 ? 1 : 0;
        } else {
            factor = this.ease(elapsed, 0, 1, this.duration);
        }
        for (let i = this.tweens.length - 1; i > -1; i--) {
            const ti = this.tweens[i];
            ti.target[ti.property] = ti.start + factor * ti.change;
        }
        if (this._hasUpdate) {
            this.vars.onUpdate.apply(null, this.vars.onUpdateParams);
        }
        if (elapsed === this.duration) {
            this.complete(true);
        }
    }

    public complete(skipRender: boolean = false): void {
        if (!skipRender) {
            if (!this.initted) {
                this.initTweenVals();
            }
            this.startTime = TweenLite.currentTime - this.duration * 1000 / this.combinedTimeScale;
            this.render(TweenLite.currentTime);
            return;
        }
        if (this._hasPlugins) {
            for (let i = this.tweens.length - 1; i > -1; i--) {
                if (this.tweens[i].isPlugin && this.tweens[i].target.onComplete !== null) {
                    this.tweens[i].target.onComplete();
                }
            }
        }
        if (this.vars.persist !== true) {
            this.enabled = false;
        }
        if (this.vars.onComplete !== null && this.vars.onComplete !== undefined) {
            this.vars.onComplete.apply(null, this.vars.onCompleteParams);
        }
    }

    public clear(): void {
        this.tweens = [];
        this.vars = this.exposedVars = { ease: this.vars.ease };
        this._hasUpdate = false;
    }

    public killVars(lookup: any): void {
        if (TweenLite.overwriteManager.enabled) {
            TweenLite.overwriteManager.killVars(lookup, this.exposedVars, this.tweens);
        }
    }

    protected easeProxy(t: number, b: number, c: number, d: number): number {
        return this.vars.proxiedEase.apply(null, [t, b, c, d].concat(this.vars.easeParams));
    }

    public get enabled(): boolean {
        return !this.gc;
    }

    public set enabled(value: boolean) {
        if (value) {
            if (!TweenLite.masterList.has(this.target)) {
                TweenLite.masterList.set(this.target, [this]);
            } else {
                const tweens = TweenLite.masterList.get(this.target)!;
                let found = false;
                for (let i = tweens.length - 1; i > -1; i--) {
                    if (tweens[i] === this) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    tweens[tweens.length] = this;
                }
            }
        }
        this.gc = !value;
        if (this.gc) {
            this.active = false;
        } else {
            this.active = this.started;
        }
    }
}
