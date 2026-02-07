import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import BlendMode from 'openfl/display/BlendMode';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * BUILDING10 - Yard Planner
 * Extends BFOUNDATION for base layout planning building
 */
export class BUILDING10 extends BFOUNDATION {
    constructor() {
        super();
        this._type = 10;
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this._spoutPoint = new Point(0, -28);
        this._spoutHeight = 80;
        this.SetProps();
    }

    private onAssetLoaded(url: string, bitmapData: BitmapData): void {
        if (url === this.imageData.shadowURL) {
            const bitmap: Bitmap = this._mcBase!.addChild(new Bitmap(bitmapData)) as Bitmap;
            bitmap.x = this.imageData.shadowX;
            bitmap.y = this.imageData.shadowY;
            bitmap.blendMode = BlendMode.MULTIPLY;
        } else if (url === this.imageData.topURL) {
            (this.animContainer as MovieClip).addChild(new Bitmap(bitmapData));
        }
    }

    public override PlaceB(): void {
        super.PlaceB();
    }

    public override Description(): void {
        super.Description();
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bYardPlanner = this;
    }

    public override RecycleC(): void {
        getGLOBAL()._bYardPlanner = null;
        super.RecycleC();
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bYardPlanner = this;
        }
    }
}
