import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";
import { IEventDispatcher } from "openfl/events/IEventDispatcher";
import { TweenEvent } from "./events/TweenEvent";
import { OverwriteManager } from "./OverwriteManager";
import { TweenLite } from "./TweenLite";
import { TweenInfo } from "./utils/tween/TweenInfo";

/**
 * TweenMax - Extended tweening engine with additional features like pause, reverse, yoyo.
 */
export class TweenMax extends TweenLite implements IEventDispatcher {
    public static readonly version: number = 10.12;

    public static killTweensOf: Function = TweenLite.killTweensOf;
    public static killDelayedCallsTo: Function = TweenLite.killTweensOf;
    public static removeTween: Function = TweenLite.removeTween;

    protected static _pausedTweens: Map<TweenMax, TweenMax> = new Map();
    protected static _globalTimeScale: number = 1;

    protected _dispatcher: EventDispatcher | null = null;
    protected _callbacks: any = null;
    protected _repeatCount: number = 0;
    protected _timeScale: number = 1;
    public pauseTime: number = NaN;

    constructor(target: any, duration: number, vars: any) {
        super(target, duration, vars);
        
        // Initialize OverwriteManager if not already done
        if (!OverwriteManager.enabled) {
            OverwriteManager.init();
        }
        
        if (this.combinedTimeScale !== 1 && this.target instanceof TweenMax) {
            this._timeScale = 1;
            this.combinedTimeScale = TweenMax._globalTimeScale;
        } else {
            this._timeScale = this.combinedTimeScale;
            this.combinedTimeScale *= TweenMax._globalTimeScale;
        }
        
        if (this.combinedTimeScale !== 1 && this.delay !== 0) {
            this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
        }
        
        if (this.vars.onCompleteListener !== null || this.vars.onUpdateListener !== null || this.vars.onStartListener !== null) {
            this.initDispatcher();
            if (duration === 0 && this.delay === 0) {
                this.onUpdateDispatcher();
                this.onCompleteDispatcher();
            }
        }
        
        this._repeatCount = 0;
        if (!isNaN(this.vars.yoyo) || !isNaN(this.vars.loop)) {
            this.vars.persist = true;
        }
        
        if (this.delay === 0 && this.vars.startAt !== null && this.vars.startAt !== undefined) {
            this.vars.startAt.overwrite = 0;
            new TweenMax(this.target, 0, this.vars.startAt);
        }
    }

    public static to(target: any, duration: number, vars: any): TweenMax {
        return new TweenMax(target, duration, vars);
    }

    public static from(target: any, duration: number, vars: any): TweenMax {
        vars.runBackwards = true;
        return new TweenMax(target, duration, vars);
    }

    public static delayedCall(delay: number, callback: Function, params: Array<any> | null = null, persist: boolean = false): TweenMax {
        return new TweenMax(callback, 0, {
            delay: delay,
            onComplete: callback,
            onCompleteParams: params,
            persist: persist,
            overwrite: 0
        });
    }

    public static setGlobalTimeScale(scale: number): void {
        if (scale < 0.00001) {
            scale = 0.00001;
        }
        TweenMax._globalTimeScale = scale;
        TweenLite.masterList.forEach((tweens) => {
            for (let i = tweens.length - 1; i > -1; i--) {
                if (tweens[i] instanceof TweenMax) {
                    (tweens[i] as TweenMax).timeScale *= 1;
                }
            }
        });
    }

    public static getTweensOf(target: any): Array<TweenLite> {
        const list = TweenLite.masterList.get(target);
        const result: Array<TweenLite> = [];
        if (list !== undefined) {
            for (let i = list.length - 1; i > -1; i--) {
                if (!list[i].gc) {
                    result[result.length] = list[i];
                }
            }
        }
        TweenMax._pausedTweens.forEach((tween) => {
            if (tween.target === target) {
                result[result.length] = tween;
            }
        });
        return result;
    }

    public static isTweening(target: any): boolean {
        const tweens = TweenMax.getTweensOf(target);
        for (let i = tweens.length - 1; i > -1; i--) {
            if ((tweens[i].active || tweens[i].startTime === TweenLite.currentTime) && !tweens[i].gc) {
                return true;
            }
        }
        return false;
    }

    public static getAllTweens(): Array<TweenLite> {
        const result: Array<TweenLite> = [];
        TweenLite.masterList.forEach((tweens) => {
            for (let i = tweens.length - 1; i > -1; i--) {
                if (!tweens[i].gc) {
                    result[result.length] = tweens[i];
                }
            }
        });
        TweenMax._pausedTweens.forEach((tween) => {
            result[result.length] = tween;
        });
        return result;
    }

    public static killAllTweens(complete: boolean = false): void {
        TweenMax.killAll(complete, true, false);
    }

    public static killAllDelayedCalls(complete: boolean = false): void {
        TweenMax.killAll(complete, false, true);
    }

    public static killAll(complete: boolean = false, tweens: boolean = true, delayedCalls: boolean = true): void {
        const all = TweenMax.getAllTweens();
        for (let i = all.length - 1; i > -1; i--) {
            const isDelayedCall = all[i].target === all[i].vars.onComplete;
            if (isDelayedCall === delayedCalls || isDelayedCall !== tweens) {
                if (complete) {
                    all[i].complete(false);
                    all[i].clear();
                } else {
                    TweenLite.removeTween(all[i], true);
                }
            }
        }
    }

    public static pauseAll(tweens: boolean = true, delayedCalls: boolean = false): void {
        TweenMax.changePause(true, tweens, delayedCalls);
    }

    public static resumeAll(tweens: boolean = true, delayedCalls: boolean = false): void {
        TweenMax.changePause(false, tweens, delayedCalls);
    }

    public static changePause(pause: boolean, tweens: boolean = true, delayedCalls: boolean = false): void {
        const all = TweenMax.getAllTweens();
        for (let i = all.length - 1; i > -1; i--) {
            const isDelayedCall = all[i].target === all[i].vars.onComplete;
            if (all[i] instanceof TweenMax && (isDelayedCall === delayedCalls || isDelayedCall !== tweens)) {
                (all[i] as TweenMax).paused = pause;
            }
        }
    }

    public static get globalTimeScale(): number {
        return TweenMax._globalTimeScale;
    }

    public static set globalTimeScale(value: number) {
        TweenMax.setGlobalTimeScale(value);
    }

    public override initTweenVals(): void {
        if (this.vars.startAt !== null && this.vars.startAt !== undefined && this.delay !== 0) {
            this.vars.startAt.overwrite = 0;
            new TweenMax(this.target, 0, this.vars.startAt);
        }
        super.initTweenVals();
        
        // Handle roundProps
        if (Array.isArray(this.exposedVars.roundProps) && TweenLite.plugins.roundProps !== undefined) {
            const props = this.exposedVars.roundProps;
            let roundPlugin: any = null;
            
            for (let i = props.length - 1; i > -1; i--) {
                const propName = String(props[i]);
                for (let j = this.tweens.length - 1; j > -1; j--) {
                    const ti = this.tweens[j];
                    if (ti.name === propName) {
                        if (ti.isPlugin) {
                            ti.target.round = true;
                        } else if (roundPlugin === null) {
                            roundPlugin = new TweenLite.plugins.roundProps();
                            roundPlugin.add(ti.target, propName, ti.start, ti.change);
                            this._hasPlugins = true;
                            this.tweens[j] = new TweenInfo(roundPlugin, "changeFactor", 0, 1, propName, true);
                        } else {
                            roundPlugin.add(ti.target, propName, ti.start, ti.change);
                            this.tweens.splice(j, 1);
                        }
                    } else if (ti.isPlugin && ti.name === "_MULTIPLE_" && !ti.target.round) {
                        const overwriteProps = " " + ti.target.overwriteProps.join(" ") + " ";
                        if (overwriteProps.indexOf(" " + propName + " ") !== -1) {
                            ti.target.round = true;
                        }
                    }
                }
            }
        }
    }

    public pause(): void {
        if (isNaN(this.pauseTime)) {
            this.pauseTime = TweenLite.currentTime;
            this.startTime = 999999999999999;
            this.enabled = false;
            TweenMax._pausedTweens.set(this, this);
        }
    }

    public resume(): void {
        this.enabled = true;
        if (!isNaN(this.pauseTime)) {
            this.initTime += TweenLite.currentTime - this.pauseTime;
            this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
            this.pauseTime = NaN;
            if (!this.started && TweenLite.currentTime >= this.startTime) {
                this.activate();
            } else {
                this.active = this.started;
            }
            TweenMax._pausedTweens.delete(this);
        }
    }

    public restart(includeDelay: boolean = false): void {
        if (includeDelay) {
            this.initTime = TweenLite.currentTime;
            this.startTime = TweenLite.currentTime + this.delay * (1000 / this.combinedTimeScale);
        } else {
            this.startTime = TweenLite.currentTime;
            this.initTime = TweenLite.currentTime - this.delay * (1000 / this.combinedTimeScale);
        }
        this._repeatCount = 0;
        if (this.target !== this.vars.onComplete) {
            this.render(this.startTime);
        }
        this.pauseTime = NaN;
        TweenMax._pausedTweens.delete(this);
        this.enabled = true;
    }

    public reverse(forceReverse: boolean = true, adjustDuration: boolean = true): void {
        this.ease = this.vars.ease === this.ease ? this.reverseEase.bind(this) : this.vars.ease;
        const prog = this.progress;
        if (forceReverse && prog > 0) {
            this.startTime = TweenLite.currentTime - (1 - prog) * this.duration * 1000 / this.combinedTimeScale;
            this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
        }
        if (adjustDuration !== false) {
            if (prog < 1) {
                this.resume();
            } else {
                this.restart();
            }
        }
    }

    public reverseEase(t: number, b: number, c: number, d: number): number {
        return this.vars.ease(d - t, b, c, d);
    }

    public invalidate(adjustStartValues: boolean = true): void {
        if (this.initted) {
            const prog = this.progress;
            if (!adjustStartValues && prog !== 0) {
                this.progress = 0;
            }
            this.tweens = [];
            this._hasPlugins = false;
            this.exposedVars = this.vars.isTV === true ? this.vars.exposedProps : this.vars;
            this.initTweenVals();
            this._timeScale = Number(this.vars.timeScale) || 1;
            this.combinedTimeScale = this._timeScale * TweenMax._globalTimeScale;
            this.delay = Number(this.vars.delay) || 0;
            if (isNaN(this.pauseTime)) {
                this.startTime = this.initTime + this.delay * 1000 / this.combinedTimeScale;
            }
            if (this.vars.onCompleteListener !== null || this.vars.onUpdateListener !== null || this.vars.onStartListener !== null) {
                if (this._dispatcher !== null) {
                    this.vars.onStart = this._callbacks.onStart;
                    this.vars.onUpdate = this._callbacks.onUpdate;
                    this.vars.onComplete = this._callbacks.onComplete;
                    this._dispatcher = null;
                }
                this.initDispatcher();
            }
            if (prog !== 0) {
                if (adjustStartValues) {
                    this.adjustStartValues();
                } else {
                    this.progress = prog;
                }
            }
        }
    }

    public setDestination(prop: string, value: any, adjustStartValues: boolean = true): void {
        const prog = this.progress;
        if (this.initted) {
            if (!adjustStartValues) {
                for (let i = this.tweens.length - 1; i > -1; i--) {
                    const ti = this.tweens[i];
                    if (ti.name === prop) {
                        ti.target[ti.property] = ti.start;
                    }
                }
            }
            const oldVars = this.vars;
            const oldExposed = this.exposedVars;
            const oldTweens = this.tweens;
            const hadPlugins = this._hasPlugins;
            
            this.tweens = [];
            this.vars = this.exposedVars = {};
            this.vars[prop] = value;
            this.initTweenVals();
            
            if (this.ease !== this.reverseEase.bind(this) && typeof oldVars.ease === "function") {
                this.ease = oldVars.ease;
            }
            if (adjustStartValues && prog !== 0) {
                this.adjustStartValues();
            }
            
            const newTweens = this.tweens;
            this.vars = oldVars;
            this.exposedVars = oldExposed;
            this.tweens = oldTweens;
            
            const propLookup: any = {};
            propLookup[prop] = true;
            
            for (let i = this.tweens.length - 1; i > -1; i--) {
                const ti = this.tweens[i];
                if (ti.name === prop) {
                    this.tweens.splice(i, 1);
                } else if (ti.isPlugin && ti.name === "_MULTIPLE_") {
                    ti.target.killProps(propLookup);
                    if (ti.target.overwriteProps.length === 0) {
                        this.tweens.splice(i, 1);
                    }
                }
            }
            this.tweens = this.tweens.concat(newTweens);
            this._hasPlugins = hadPlugins || this._hasPlugins;
        }
        this.vars[prop] = this.exposedVars[prop] = value;
    }

    protected adjustStartValues(): void {
        const prog = this.progress;
        if (prog !== 0) {
            const factor = this.ease(prog, 0, 1, 1);
            const ratio = 1 / (1 - factor);
            for (let i = this.tweens.length - 1; i > -1; i--) {
                const ti = this.tweens[i];
                const endVal = ti.start + ti.change;
                if (ti.isPlugin) {
                    ti.change = (endVal - factor) * ratio;
                } else {
                    ti.change = (endVal - ti.target[ti.property]) * ratio;
                }
                ti.start = endVal - ti.change;
            }
        }
    }

    public killProperties(props: Array<string>): void {
        const lookup: any = {};
        for (let i = props.length - 1; i > -1; i--) {
            lookup[props[i]] = true;
        }
        this.killVars(lookup);
    }

    public override render(time: number): void {
        let factor: number;
        let elapsed = (time - this.startTime) * 0.001 * this.combinedTimeScale;
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

    public override complete(skipRender: boolean = false): void {
        if ((!isNaN(this.vars.yoyo) && (this._repeatCount < this.vars.yoyo || this.vars.yoyo === 0)) ||
            (!isNaN(this.vars.loop) && (this._repeatCount < this.vars.loop || this.vars.loop === 0))) {
            this._repeatCount++;
            if (!isNaN(this.vars.yoyo)) {
                this.ease = this.vars.ease === this.ease ? this.reverseEase.bind(this) : this.vars.ease;
            }
            this.startTime = skipRender ? this.startTime + this.duration * (1000 / this.combinedTimeScale) : TweenLite.currentTime;
            this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
        } else if (this.vars.persist === true) {
            this.pause();
        }
        super.complete(skipRender);
    }

    protected initDispatcher(): void {
        if (this._dispatcher === null) {
            this._dispatcher = new EventDispatcher(this);
            this._callbacks = {
                onStart: this.vars.onStart,
                onUpdate: this.vars.onUpdate,
                onComplete: this.vars.onComplete
            };
            
            // Clone vars
            const newVars: any = {};
            for (const prop in this.vars) {
                newVars[prop] = this.vars[prop];
            }
            this.vars = newVars;
            
            this.vars.onStart = this.onStartDispatcher.bind(this);
            this.vars.onComplete = this.onCompleteDispatcher.bind(this);
            
            if (typeof this.vars.onStartListener === "function") {
                this._dispatcher.addEventListener(TweenEvent.START, this.vars.onStartListener);
            }
            if (typeof this.vars.onUpdateListener === "function") {
                this._dispatcher.addEventListener(TweenEvent.UPDATE, this.vars.onUpdateListener);
                this.vars.onUpdate = this.onUpdateDispatcher.bind(this);
                this._hasUpdate = true;
            }
            if (typeof this.vars.onCompleteListener === "function") {
                this._dispatcher.addEventListener(TweenEvent.COMPLETE, this.vars.onCompleteListener);
            }
        }
    }

    protected onStartDispatcher(...rest: any[]): void {
        if (this._callbacks.onStart !== null) {
            this._callbacks.onStart.apply(null, this.vars.onStartParams);
        }
        this._dispatcher!.dispatchEvent(new TweenEvent(TweenEvent.START));
    }

    protected onUpdateDispatcher(...rest: any[]): void {
        if (this._callbacks.onUpdate !== null) {
            this._callbacks.onUpdate.apply(null, this.vars.onUpdateParams);
        }
        this._dispatcher!.dispatchEvent(new TweenEvent(TweenEvent.UPDATE));
    }

    protected onCompleteDispatcher(...rest: any[]): void {
        if (this._callbacks.onComplete !== null) {
            this._callbacks.onComplete.apply(null, this.vars.onCompleteParams);
        }
        this._dispatcher!.dispatchEvent(new TweenEvent(TweenEvent.COMPLETE));
    }

    public addEventListener(type: string, listener: Function, useCapture: boolean = false, priority: number = 0, useWeakReference: boolean = false): void {
        if (this._dispatcher === null) {
            this.initDispatcher();
        }
        if (type === TweenEvent.UPDATE && this.vars.onUpdate !== this.onUpdateDispatcher.bind(this)) {
            this.vars.onUpdate = this.onUpdateDispatcher.bind(this);
            this._hasUpdate = true;
        }
        this._dispatcher!.addEventListener(type, listener as any, useCapture, priority, useWeakReference);
    }

    public removeEventListener(type: string, listener: Function, useCapture: boolean = false): void {
        if (this._dispatcher !== null) {
            this._dispatcher.removeEventListener(type, listener as any, useCapture);
        }
    }

    public hasEventListener(type: string): boolean {
        if (this._dispatcher === null) {
            return false;
        }
        return this._dispatcher.hasEventListener(type);
    }

    public willTrigger(type: string): boolean {
        if (this._dispatcher === null) {
            return false;
        }
        return this._dispatcher.willTrigger(type);
    }

    public dispatchEvent(event: Event): boolean {
        if (this._dispatcher === null) {
            return false;
        }
        return this._dispatcher.dispatchEvent(event);
    }

    public get paused(): boolean {
        return !isNaN(this.pauseTime);
    }

    public set paused(value: boolean) {
        if (value) {
            this.pause();
        } else {
            this.resume();
        }
    }

    public get reversed(): boolean {
        return this.ease === this.reverseEase.bind(this);
    }

    public set reversed(value: boolean) {
        if (this.reversed !== value) {
            this.reverse();
        }
    }

    public get timeScale(): number {
        return this._timeScale;
    }

    public set timeScale(value: number) {
        if (value < 0.00001) {
            value = this._timeScale = 0.00001;
        } else {
            this._timeScale = value;
            value *= TweenMax._globalTimeScale;
        }
        this.initTime = TweenLite.currentTime - (TweenLite.currentTime - this.initTime - this.delay * (1000 / this.combinedTimeScale)) * this.combinedTimeScale * (1 / value) - this.delay * (1000 / value);
        if (this.startTime !== 999999999999999) {
            this.startTime = this.initTime + this.delay * (1000 / value);
        }
        this.combinedTimeScale = value;
    }

    public override set enabled(value: boolean) {
        if (!value) {
            TweenMax._pausedTweens.delete(this);
        }
        super.enabled = value;
        if (value) {
            this.combinedTimeScale = this._timeScale * TweenMax._globalTimeScale;
        }
    }

    public override get enabled(): boolean {
        return super.enabled;
    }

    public get repeatCount(): number {
        return this._repeatCount;
    }

    public set repeatCount(value: number) {
        this._repeatCount = value;
    }

    public get progress(): number {
        const time = !isNaN(this.pauseTime) ? this.pauseTime : TweenLite.currentTime;
        let prog = ((time - this.initTime) * 0.001 - this.delay / this.combinedTimeScale) / this.duration * this.combinedTimeScale;
        if (prog > 1) {
            return 1;
        }
        if (prog < 0) {
            return 0;
        }
        return prog;
    }

    public set progress(value: number) {
        this.startTime = TweenLite.currentTime - this.duration * value * 1000;
        this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
        if (!this.started) {
            this.activate();
        }
        this.render(TweenLite.currentTime);
        if (!isNaN(this.pauseTime)) {
            this.pauseTime = TweenLite.currentTime;
            this.startTime = 999999999999999;
            this.active = false;
        }
    }
}
