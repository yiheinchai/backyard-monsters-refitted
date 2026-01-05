import { BRESOURCE } from './BRESOURCE';
import Rectangle from 'openfl/geom/Rectangle';
import Point from 'openfl/geom/Point';
import BitmapData from 'openfl/display/BitmapData';
import Bitmap from 'openfl/display/Bitmap';

export class BUILDING3 extends BRESOURCE {
    public _field: BitmapData | null = null;
    public _fieldBMP: Bitmap | null = null;
    public _frameNumber: number;
    public _animBitmap: BitmapData | null = null;

    constructor() {
        super();
        this._frameNumber = Math.random() * 5;
        this._type = 3;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this._spoutPoint = new Point(28, -17);
        this._spoutHeight = 50;
        this.SetProps();
    }
}
