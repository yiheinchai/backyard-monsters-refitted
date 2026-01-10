import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Matrix from "openfl/geom/Matrix";
import Rectangle from "openfl/geom/Rectangle";

/**
 * ScaleBitmap - Bitmap with 9-slice scaling support.
 */
export class ScaleBitmap extends Bitmap {
    protected _originalBitmap: BitmapData;
    protected _scale9Grid: Rectangle | null = null;

    constructor(bitmapData: BitmapData | null = null, pixelSnapping: string = "auto", smoothing: boolean = false) {
        super(bitmapData, pixelSnapping as any, smoothing);
        this._originalBitmap = bitmapData ? bitmapData.clone() : new BitmapData(1, 1);
    }

    public override set bitmapData(value: BitmapData) {
        this._originalBitmap = value.clone();
        if (this._scale9Grid !== null) {
            if (!this.validGrid(this._scale9Grid)) {
                this._scale9Grid = null;
            }
            this.setSize(value.width, value.height);
        } else {
            this.assignBitmapData(this._originalBitmap.clone());
        }
    }

    public override set width(value: number) {
        if (value !== this.width) {
            this.setSize(value, this.height);
        }
    }

    public override set height(value: number) {
        if (value !== this.height) {
            this.setSize(this.width, value);
        }
    }

    public override set scale9Grid(value: Rectangle | null) {
        if ((this._scale9Grid === null && value !== null) || (this._scale9Grid !== null && !this._scale9Grid.equals(value!))) {
            if (value === null) {
                const w = this.width;
                const h = this.height;
                this._scale9Grid = null;
                this.assignBitmapData(this._originalBitmap.clone());
                this.setSize(w, h);
            } else {
                if (!this.validGrid(value)) {
                    throw new Error("#001 - The _scale9Grid does not match the original BitmapData");
                }
                this._scale9Grid = value.clone();
                this.resizeBitmap(this.width, this.height);
                this.scaleX = 1;
                this.scaleY = 1;
            }
        }
    }

    private assignBitmapData(value: BitmapData): void {
        if (super.bitmapData) {
            super.bitmapData.dispose();
        }
        super.bitmapData = value;
    }

    private validGrid(grid: Rectangle): boolean {
        return grid.right <= this._originalBitmap.width && grid.bottom <= this._originalBitmap.height;
    }

    public override get scale9Grid(): Rectangle | null {
        return this._scale9Grid;
    }

    public setSize(w: number, h: number): void {
        if (this._scale9Grid === null) {
            super.width = w;
            super.height = h;
        } else {
            w = Math.max(w, this._originalBitmap.width - this._scale9Grid.width);
            h = Math.max(h, this._originalBitmap.height - this._scale9Grid.height);
            this.resizeBitmap(w, h);
        }
    }

    public getOriginalBitmapData(): BitmapData {
        return this._originalBitmap;
    }

    protected resizeBitmap(w: number, h: number): void {
        const newBmd = new BitmapData(w, h, true, 0);
        const rows = [0, this._scale9Grid!.top, this._scale9Grid!.bottom, this._originalBitmap.height];
        const cols = [0, this._scale9Grid!.left, this._scale9Grid!.right, this._originalBitmap.width];
        const dstRows = [0, this._scale9Grid!.top, h - (this._originalBitmap.height - this._scale9Grid!.bottom), h];
        const dstCols = [0, this._scale9Grid!.left, w - (this._originalBitmap.width - this._scale9Grid!.right), w];
        const matrix = new Matrix();

        for (let col = 0; col < 3; col++) {
            for (let row = 0; row < 3; row++) {
                const srcRect = new Rectangle(cols[col], rows[row], cols[col + 1] - cols[col], rows[row + 1] - rows[row]);
                const dstRect = new Rectangle(dstCols[col], dstRows[row], dstCols[col + 1] - dstCols[col], dstRows[row + 1] - dstRows[row]);
                matrix.identity();
                matrix.a = dstRect.width / srcRect.width;
                matrix.d = dstRect.height / srcRect.height;
                matrix.tx = dstRect.x - srcRect.x * matrix.a;
                matrix.ty = dstRect.y - srcRect.y * matrix.d;
                newBmd.draw(this._originalBitmap, matrix, null, null, dstRect, this.smoothing);
            }
        }
        this.assignBitmapData(newBmd);
    }
}
