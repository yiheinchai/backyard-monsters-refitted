import { BitmapData } from "openfl/display/BitmapData";
import { DisplayObject } from "openfl/display/DisplayObject";
import { IBitmapDrawable } from "openfl/display/IBitmapDrawable";
import { MovieClip } from "openfl/display/MovieClip";
import { Shape } from "openfl/display/Shape";
import { BitmapFilter } from "openfl/filters/BitmapFilter";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

/**
 * Rendering data for bitmap rendering system.
 * Manages visibility, depth sorting, and rendering properties.
 */
export class RasterData {
    // Static collections
    private static s_rasterData: RasterData[] = [];
    private static s_visibleData: RasterData[] = [];
    private static s_unsortedData: RasterData[] = [];
    private static s_debugData: RasterData[] = [];
    public static s_needsSort: boolean = false;
    private static s_id: number = 0;

    // Instance properties
    public readonly _id: number;
    public _data: IBitmapDrawable | null = null;
    public _pt: Point | null = null;
    public _depth: number = 0;
    public _rect: Rectangle | null = null;
    public _blendMode: string | null = null;
    public _filter: BitmapFilter | null = null;
    public _scaleX: number = 100;
    public _scaleY: number = 100;
    public _alpha: number = 0xFF000000;
    public _visible: boolean = true;
    public _unSorted: boolean = false;
    public _cleared: boolean = false;

    constructor(data: IBitmapDrawable, pt: Point, depth: number, blendMode: string | null = null, unSorted: boolean = false) {
        this._id = RasterData.s_id++;
        this.data = data;
        this._pt = pt;
        this._depth = depth;
        this._blendMode = blendMode;
        this._scaleX = 100;
        this._scaleY = 100;
        this._alpha = 0xFF000000;
        this._visible = true;
        this._unSorted = unSorted;
        
        RasterData.s_needsSort = this._unSorted ? RasterData.s_needsSort : true;
        
        if (this._unSorted) {
            RasterData.s_rasterData.push(this);
            RasterData.s_unsortedData.push(this);
        } else {
            RasterData.s_rasterData.push(this);
            RasterData.s_visibleData.push(this);
        }
    }

    public static get rasterData(): RasterData[] {
        return RasterData.s_rasterData;
    }

    public static get visibleData(): RasterData[] {
        return RasterData.s_visibleData;
    }

    public static get totalMemory(): number {
        let total = 0;
        for (const rd of RasterData.s_rasterData) {
            const bmd = rd._data as BitmapData;
            if (bmd && bmd.rect) {
                total += bmd.width * bmd.height * 4; // Approximate bytes
            }
        }
        return total;
    }

    public static showDebug(): void {
        for (const rd of RasterData.s_rasterData) {
            const bmd = rd._data as BitmapData;
            if (bmd) {
                const shape = new Shape();
                shape.graphics.lineStyle(1, 0xFF0000);
                shape.graphics.beginFill(0x990000, 0.4);
                shape.graphics.drawRect(0, 0, bmd.width, bmd.height);
                RasterData.s_debugData.push(new RasterData(shape as any, rd._pt!, rd._depth));
            }
        }
    }

    public static hideDebug(): void {
        for (const rd of RasterData.s_debugData) {
            rd.clear(true);
        }
        RasterData.s_debugData.length = 0;
    }

    public static clearAll(dispose: boolean = false): void {
        for (const rd of RasterData.s_rasterData) {
            rd.clear(dispose);
        }
        RasterData.s_unsortedData.length = 0;
        RasterData.s_visibleData.length = 0;
        RasterData.s_rasterData.length = 0;
        RasterData.s_debugData.length = 0;
    }

    public get id(): number {
        return this._id;
    }

    public get data(): IBitmapDrawable | null {
        return this._data;
    }

    public set data(value: IBitmapDrawable | null) {
        this._data = value;
        if (this._data instanceof BitmapData) {
            this._rect = (this._data as BitmapData).rect;
        } else if (this._data instanceof MovieClip) {
            this._rect = (this._data as MovieClip).getRect(this._data as MovieClip);
        } else {
            this._rect = new Rectangle();
        }
    }

    public set pt(value: Point) {
        this._pt = value;
    }

    public get rect(): Rectangle | null {
        return this._rect;
    }

    public get depth(): number {
        return this._depth;
    }

    public set depth(value: number) {
        if (this._depth !== value) {
            RasterData.s_needsSort = true;
            this._depth = value;
        }
    }

    public set blendMode(value: string) {
        this._blendMode = value;
    }

    public set filter(value: BitmapFilter) {
        this._filter = value;
    }

    public set scaleX(value: number) {
        this._scaleX = (value * 100) >> 0;
    }

    public set scaleY(value: number) {
        this._scaleY = (value * 100) >> 0;
    }

    public set alpha(value: number) {
        this._alpha = Math.ceil(value * 255) << 24;
    }

    public get visible(): boolean {
        return this._visible;
    }

    public set visible(value: boolean) {
        if (!this._visible && value) {
            if (this._unSorted) {
                RasterData.s_unsortedData.push(this);
            } else {
                RasterData.s_visibleData.push(this);
            }
            RasterData.s_needsSort = true;
        } else if (this._visible && !value) {
            if (this._unSorted) {
                const idx = RasterData.s_unsortedData.indexOf(this);
                if (idx >= 0) RasterData.s_unsortedData.splice(idx, 1);
            } else {
                const idx = RasterData.s_visibleData.indexOf(this);
                if (idx >= 0) RasterData.s_visibleData.splice(idx, 1);
            }
            RasterData.s_needsSort = true;
        }
        this._visible = value;
    }

    public clone(): RasterData {
        return new RasterData(this._data!, this._pt!, this._depth);
    }

    public clear(dispose: boolean = false): void {
        if (this._cleared) return;
        
        const rasterIdx = RasterData.s_rasterData.indexOf(this);
        if (rasterIdx >= 0) RasterData.s_rasterData.splice(rasterIdx, 1);
        
        if (this._visible) {
            if (this._unSorted) {
                const idx = RasterData.s_unsortedData.indexOf(this);
                if (idx >= 0) RasterData.s_unsortedData.splice(idx, 1);
            } else {
                const idx = RasterData.s_visibleData.indexOf(this);
                if (idx >= 0) RasterData.s_visibleData.splice(idx, 1);
            }
        }
        
        if (dispose && this._data instanceof BitmapData) {
            (this._data as BitmapData).dispose();
        }
        
        this._data = null;
        this._pt = null;
        this._rect = null;
        this._blendMode = null;
        this._cleared = true;
    }
}
