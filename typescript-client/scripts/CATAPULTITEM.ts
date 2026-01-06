import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import Sprite from 'openfl/display/Sprite';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ResourceBombs } from './com/monsters/effects/ResourceBombs';
import { CATAPULTITEM_view } from './CATAPULTITEM_view';
import { CATAPULTPOPUP } from './CATAPULTPOPUP';
import { bubblepopup3 } from './bubblepopup3';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';

/**
 * CATAPULTITEM - Catapult item for bomb selection
 * Converted from ActionScript to TypeScript
 */
export class CATAPULTITEM extends CATAPULTITEM_view {
    public _props: any;
    public _bombid: string = "";
    public _enabled: boolean = false;
    public _image: Sprite | null = null;
    public _locked: boolean = false;
    public _popX: number = 0;
    public _popY: number = 0;
    public _popup: bubblepopup3 | null = null;
    private _constant: boolean = false;

    constructor() {
        super();
    }

    public Setup(param1: string, param2: boolean = false, param3: boolean = false, param4: boolean = true): void {
        this._props = ResourceBombs._bombs[param1];
        this._bombid = param1;
        (this._txtMC as any)._tA.htmlText = "<b>" + this._props.name + "</b>";
        this._image = new Sprite();
        this.addChild(this._image);
        this._popup = new bubblepopup3();
        this._popup.x = 44;
        this._popup.y = 29;
        this.addChild(this._popup);
        this._popX = this._popup.x;
        this._popY = this._popup.y;
        this._constant = param2;
        if (this._constant) {
            this.Enabled = param3;
        }
        this.setChildIndex(this._image, 1);
        this.setChildIndex(this._txtMC, 2);
        this.setChildIndex(this._popup, 3);
        ImageCache.GetImageWithCallBack(this._props.image, this.imageComplete.bind(this));
        this.mouseEnabled = false;
        this.Hide();
        this.Update();
    }

    public imageComplete(param1: string, param2: BitmapData): void {
        const _loc3_: Bitmap = new Bitmap(param2);
        if (this._image) {
            this._image.addChild(_loc3_);
        }
        _loc3_.width = 60;
        _loc3_.height = 60;
    }

    public Update(): void {
        this._props = ResourceBombs._bombs[this._bombid];
        if (this._constant) {
            return;
        }
        this._locked = this._props.catapultLevel > GLOBAL._attackersCatapult;
        if (!this._props.used) {
            if (!this._locked) {
                this.Enabled = this._props.cost <= GLOBAL._attackersResources["r" + this._props.resource].Get();
            } else {
                this.Enabled = false;
            }
        } else {
            this.Enabled = false;
        }
    }

    public ShowOver(): void {
        let _loc1_: string = "<b>" + this._props.name + "</b>";
        if (this._props.description) {
            _loc1_ += "<br>" + KEYS.Get(this._props.description, {
                "v1": this._props.speed * 100 + "%",
                "v2": Math.round((1 - this._props.damageMult) * 100) + "%",
                "v3": this._props.speedlength
            });
        }
        _loc1_ += "<br>" + KEYS.Get("bomb_cost_resources", {
            "v1": CATAPULTPOPUP.Format(this._props.cost),
            "v2": KEYS.Get(GLOBAL._resourceNames[this._props.resource - 1])
        }) + "<br>";
        if (this._props.catapultLevel > GLOBAL._attackersCatapult) {
            _loc1_ += "<br>" + "<b><font color = \"#FF0000\">" + KEYS.Get("bomb_catapult_level", {"v1": this._props.catapultLevel}) + "</font></b>";
        } else if (this._props.cost > GLOBAL._attackersResources["r" + this._props.resource].Get() && !this._props.used) {
            _loc1_ += "<br><b><font color = \"#FF0000\">" + KEYS.Get("bomb_need_resources", {"v1": KEYS.Get(GLOBAL._resourceNames[this._props.resource - 1])}) + "</font></b>";
        }
        if (this._popup) {
            this._popup.mouseEnabled = false;
            this._popup.Setup(this._popX, this._popY, _loc1_);
            this._popup.visible = true;
        }
    }

    public Hide(): void {
        if (this._popup) {
            this._popup.visible = false;
        }
    }

    public set Enabled(param1: boolean) {
        this._enabled = param1;
        const _loc2_: number = this._enabled ? 1 : 0.5;
        (this._txtMC as any)._tA.alpha = _loc2_;
        if (this._image) {
            this._image.alpha = _loc2_;
        }
        this.useHandCursor = this._enabled;
        this.buttonMode = this._enabled;
    }

    public get Enabled(): boolean {
        return this._enabled;
    }
}
