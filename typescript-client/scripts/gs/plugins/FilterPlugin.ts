import { BitmapFilter } from "openfl/filters/BitmapFilter";
import { TweenPlugin } from "./TweenPlugin";
import { TweenInfo } from "../utils/tween/TweenInfo";
import { HexColorsPlugin } from "./HexColorsPlugin";

/**
 * FilterPlugin - Base class for filter tweening plugins.
 */
export class FilterPlugin extends TweenPlugin {
    public static readonly VERSION: number = 1.03;
    public static readonly API: number = 1;

    protected _target: any = null;
    protected _type: any = null;
    protected _filter: BitmapFilter | null = null;
    protected _index: number = -1;
    protected _remove: boolean = false;

    constructor() {
        super();
    }

    protected initFilter(vars: any, defaultFilter: BitmapFilter): void {
        const filters: Array<BitmapFilter> = this._target.filters ? [...this._target.filters] : [];
        this._index = -1;
        
        if (vars.index !== null && vars.index !== undefined) {
            this._index = vars.index;
        } else {
            for (let i = filters.length - 1; i > -1; i--) {
                if (filters[i] instanceof this._type) {
                    this._index = i;
                    break;
                }
            }
        }
        
        if (this._index === -1 || filters[this._index] === null || vars.addFilter === true) {
            this._index = vars.index !== null && vars.index !== undefined ? vars.index : filters.length;
            filters[this._index] = defaultFilter;
            this._target.filters = filters;
        }
        
        this._filter = filters[this._index];
        this._remove = vars.remove === true;
        if (this._remove) {
            this.onComplete = this.onCompleteTween.bind(this);
        }
        
        const exposedVars = vars.isTV === true ? vars.exposedVars : vars;
        for (const prop in exposedVars) {
            if (prop in (this._filter as any) && (this._filter as any)[prop] !== exposedVars[prop] && prop !== "remove" && prop !== "index" && prop !== "addFilter") {
                if (prop === "color" || prop === "highlightColor" || prop === "shadowColor") {
                    const colorPlugin = new HexColorsPlugin();
                    colorPlugin.initColor(this._filter, prop, (this._filter as any)[prop], exposedVars[prop]);
                    this._tweens[this._tweens.length] = new TweenInfo(colorPlugin, "changeFactor", 0, 1, prop, false);
                } else if (prop === "quality" || prop === "inner" || prop === "knockout" || prop === "hideObject") {
                    (this._filter as any)[prop] = exposedVars[prop];
                } else {
                    this.addTween(this._filter, prop, (this._filter as any)[prop], exposedVars[prop], prop);
                }
            }
        }
    }

    public onCompleteTween(): void {
        if (this._remove) {
            const filters: Array<BitmapFilter> = this._target.filters ? [...this._target.filters] : [];
            if (!(filters[this._index] instanceof this._type)) {
                for (let i = filters.length - 1; i > -1; i--) {
                    if (filters[i] instanceof this._type) {
                        filters.splice(i, 1);
                        break;
                    }
                }
            } else {
                filters.splice(this._index, 1);
            }
            this._target.filters = filters;
        }
    }

    public override set changeFactor(value: number) {
        const filters: Array<BitmapFilter> = this._target.filters ? [...this._target.filters] : [];
        for (let i = this._tweens.length - 1; i > -1; i--) {
            const ti = this._tweens[i];
            ti.target[ti.property] = ti.start + ti.change * value;
        }
        if (!(filters[this._index] instanceof this._type)) {
            this._index = filters.length - 1;
            for (let i = filters.length - 1; i > -1; i--) {
                if (filters[i] instanceof this._type) {
                    this._index = i;
                    break;
                }
            }
        }
        filters[this._index] = this._filter!;
        this._target.filters = filters;
    }
}
