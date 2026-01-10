import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Shape from "openfl/display/Shape";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { RasterData } from "./RasterData";

/**
 * Software renderer that composites RasterData objects to a canvas.
 */
export class Renderer {
    private static _debug: boolean = false;
    private static _debugShape: Shape | null = null;

    public _canvas: BitmapData;
    public _viewRect: Rectangle;
    
    private readonly _matrix: Matrix = new Matrix();
    private readonly _pt: Point = new Point();
    private readonly _bm: Bitmap = new Bitmap();
    private _curCopyIndex: number = 0;
    private _curDrawIndex: number = 0;

    constructor(canvas: BitmapData, viewRect: Rectangle) {
        this._canvas = canvas;
        this._viewRect = viewRect;
    }

    public static get debug(): boolean {
        return Renderer._debug;
    }

    public static set debug(value: boolean) {
        Renderer._debug = value;
        if (Renderer._debug) {
            Renderer._debugShape = Renderer._debugShape || new Shape();
            RasterData.showDebug();
        } else {
            Renderer._debugShape = null;
            RasterData.hideDebug();
        }
    }

    public set canvas(value: BitmapData) {
        this._canvas = value;
    }

    public render(): void {
        const visibleData = RasterData.visibleData;
        this._curCopyIndex = this._curDrawIndex = 0;
        
        if (RasterData.needsSort) {
            visibleData.sort(this.sortRasterData);
            RasterData.needsSort = false;
        }
        
        this._canvas.lock();
        this.rasterize((RasterData.unsortedData as RasterData[]).concat(visibleData));
        this._canvas.unlock();
    }

    private cull(data: RasterData[]): void {
        for (const rd of data) {
            const rect = rd._rect;
            rect.x = rd._pt.x;
            rect.y = rd._pt.y;
            if (this._viewRect.intersects(rect)) {
                data.push(rd);
            }
        }
    }

    private sortRasterData(a: RasterData, b: RasterData): number {
        return a._depth - b._depth;
    }

    private rasterize(data: RasterData[]): void {
        const len = data.length;
        for (let i = 0; i < len; i++) {
            const rd = data[i];
            const bmd = rd._data as BitmapData;
            this._pt.x = rd._pt.x;
            this._pt.y = rd._pt.y;
            
            if (bmd && !rd._blendMode && !rd._filter && (rd._scaleX & rd._scaleY) === 100) {
                let alphaBmd: BitmapData | null = null;
                if (rd._alpha !== 0xFF000000) {
                    alphaBmd = new BitmapData(bmd.width, bmd.height, true, rd._alpha);
                }
                this._canvas.copyPixels(bmd, bmd.rect, this._pt, alphaBmd);
                if (alphaBmd) {
                    alphaBmd.dispose();
                    alphaBmd = null;
                }
            } else {
                this._matrix.createBox(rd._scaleX * 0.01, rd._scaleY * 0.01, 0, this._pt.x, this._pt.y);
                if (rd._filter && bmd) {
                    this._bm.bitmapData = bmd;
                    this._bm.filters = [rd._filter];
                    this._canvas.draw(this._bm, this._matrix, null, rd._blendMode);
                } else {
                    this._canvas.draw(rd._data, this._matrix, null, rd._blendMode);
                }
            }
        }
    }
}
