import { BFOUNDATION } from './BFOUNDATION';
import DisplayObject from 'openfl/display/DisplayObject';
import MouseEvent from 'openfl/events/MouseEvent';
import { GLOBAL } from './GLOBAL';
import Point from 'openfl/geom/Point';

// Stubs for dependencies
class BMUSHROOM_Stubs {
    static doodad_mushroom_mc: any = class { mc: any = { gotoAndStop: () => {} }; };
    static doodad_mushroom_shadow: any = class { gotoAndStop: () => {}; blendMode: any; };
    static BYMConfig: any = { instance: { RENDERER_ON: false } };
    static MUSHROOMS: any = { Pick: () => {} };
    static BASE: any = { _pendingPurchase: [] };
    static TUTORIAL: any = { _stage: 0 };
}

export class BMUSHROOM extends BFOUNDATION {
    public _mushroom: DisplayObject | null = null;
    public _mushroomFrame: number = 0;
    public _shake: number = 0;
    public _origin: Point = new Point();
    public _picking: boolean = false;
    public _renderState: string = "";
    public _renderLevel: number = 0;
    public _lvl: any = { Get: () => 0 };

    constructor() {
        super();
    }

    public SetProps(): void {
        super.SetProps();
    }

    public PlaceB(): void {
        // Stub implementation
        // super.PlaceB();
        const doodad_mushroom_mc = BMUSHROOM_Stubs.doodad_mushroom_mc;
        const doodad_mushroom_shadow = BMUSHROOM_Stubs.doodad_mushroom_shadow;

        let _loc1_: any = new doodad_mushroom_mc();
        if (!BMUSHROOM_Stubs.BYMConfig.instance.RENDERER_ON) {
            // this._mc.addChild(_loc1_);
        }
        _loc1_.mc.gotoAndStop(this._mushroomFrame);

        let _loc2_: any = new doodad_mushroom_shadow();
        if (!BMUSHROOM_Stubs.BYMConfig.instance.RENDERER_ON) {
            // this._mcBase.addChild(_loc2_);
        }
        _loc2_.gotoAndStop(this._mushroomFrame);
        this._origin = new Point(this.x, this.y);
    }

    public Setup(param1: any): void {
        this._mushroomFrame = param1.frame;
        super.Setup(param1);
        // this.setHealth(this.maxHealth);
    }

    public Export(): any {
        let _loc1_: any = super.Export();
        _loc1_.frame = this._mushroomFrame;
        return _loc1_;
    }

    public Description(): void {
    }

    public HasWorker(): void {
        if (this._shake > 60 && BMUSHROOM_Stubs.BASE._pendingPurchase.length == 0) {
            // this._mc.x = this._origin.x;
            // this._mc.y = this._origin.y;
            BMUSHROOM_Stubs.MUSHROOMS.Pick(this);
            return;
        }
        this._shake++;
    }

    public Click(param1: MouseEvent = null): void {
        if (BMUSHROOM_Stubs.TUTORIAL._stage >= 200 && !this._picking) {
            // super.Click(param1);
        }
    }

    public Render(param1: string = ""): void {
        if (GLOBAL._zoomed || param1 === this._renderState) { // check logic
            return;
        }
        this._renderState = "default"; // k_STATE_DEFAULT stub
        this._renderLevel = this._lvl.Get();
    }

    public SoundGood(): void {
    }

    public SoundBad(): void {
    }
}
