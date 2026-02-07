import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import TimerEvent from 'openfl/events/TimerEvent';
import Timer from 'openfl/utils/Timer';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ResourceBombs } from './com/monsters/effects/ResourceBombs';
import { CATAPULTPOPUP_view } from './CATAPULTPOPUP_view';
import { CATAPULTITEM } from './CATAPULTITEM';
import { CHAMPIONBUTTON } from './CHAMPIONBUTTON';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getUI2(): any { return require("./UI2").UI2; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }


/**
 * CATAPULTPOPUP - Catapult popup for bomb selection and firing
 * Converted from ActionScript to TypeScript
 */
export class CATAPULTPOPUP extends CATAPULTPOPUP_view {
    private _t: Timer | null = null;
    private _open: boolean = false;
    private _items: CATAPULTITEM[] = [];
    private _currentImage: string = "";
    private _bm: Bitmap | null = null;
    private _canClose: boolean = false;
    private m_waitTime: number = 0;

    constructor() {
        super();
    }

    public static Format(param1: number, param2: boolean = false): string {
        let _loc3_: string = "";
        let _loc4_: string = "";
        if (param1 > 1000000) {
            _loc3_ = "" + param1 / 1000000;
            _loc4_ = param2 ? " " + getKEYS().Get("bomb_million_long") : getKEYS().Get("bomb_million_short");
            _loc3_ += _loc4_;
        } else {
            _loc3_ = getGLOBAL().FormatNumber(param1);
        }
        return _loc3_;
    }

    public get waitTime(): number {
        return this.m_waitTime;
    }

    public Setup(param1: boolean): void {
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        let _loc4_: string = "";
        let _loc5_: CATAPULTITEM;
        (this._imageContainer as any).txtName.selectable = false;
        if (param1) {
            this._mc.visible = false;
            this.Update();
            return;
        }
        this._mc.visible = true;
        this._imageContainer.addEventListener(MouseEvent.MOUSE_DOWN, this.Show.bind(this));
        (this._imageContainer as any)._image.buttonMode = true;
        this._items = [];
        for (_loc4_ in ResourceBombs._bombs) {
            _loc3_ = Number(ResourceBombs._bombs[_loc4_].col);
            _loc2_ = Number(ResourceBombs._bombs[_loc4_].group);
            _loc5_ = new CATAPULTITEM();
            _loc5_.x = (this._mc as any)[_loc4_].x;
            _loc5_.y = (this._mc as any)[_loc4_].y;
            this._mc.removeChild((this._mc as any)[_loc4_]);
            _loc5_.Setup(_loc4_);
            _loc5_.addEventListener(MouseEvent.MOUSE_OVER, this.overBomb(_loc5_));
            _loc5_.addEventListener(MouseEvent.MOUSE_OUT, this.hideBomb(_loc5_));
            _loc5_.addEventListener(MouseEvent.MOUSE_DOWN, this.downBomb(_loc5_));
            this._mc.addChild(_loc5_);
            this._items.push(_loc5_);
        }
        this._t = new Timer(100);
        this._t.addEventListener(TimerEvent.TIMER, this.testMouseOff.bind(this));
        ResourceBombs._mc = this;
        this.Update();
        this.Hide();
    }

    private downBomb(b: CATAPULTITEM): (param1: MouseEvent) => void {
        return (param1: MouseEvent): void => {
            if (b.Enabled) {
                this.Hide();
                ResourceBombs._bombid = b._bombid;
                (this._imageContainer as any).txtName.htmlText = "<font color=\"#FF0000\">Cancel</font>";
                this.Update();
                this.Fire(param1);
            }
        };
    }

    private hideBomb(b: CATAPULTITEM): (param1: MouseEvent) => void {
        return (param1: MouseEvent): void => {
            b.Hide();
        };
    }

    private overBomb(b: CATAPULTITEM): (param1: MouseEvent) => void {
        return (param1: MouseEvent): void => {
            b.ShowOver();
            if (b.parent) {
                b.parent.setChildIndex(b, b.parent.numChildren - 1);
            }
        };
    }

    private testMouseOff(param1: TimerEvent): void {
        if (this._open) {
            const _bg = (this._mc as any)._bg;
            if (this._canClose && (this._mc.mouseX < _bg.x || this._mc.mouseX > _bg.width + _bg.x || this._mc.mouseY < _bg.y || this._mc.mouseY > _bg.height + _bg.y)) {
                this.Hide();
            } else if (this._mc.mouseX > _bg.x && this._mc.mouseX < _bg.width + _bg.x && this._mc.mouseY > _bg.y && this._mc.mouseY < _bg.height + _bg.y) {
                this._canClose = true;
            }
        }
    }

    public Update(): void {
        let _loc4_: CATAPULTITEM;
        const _loc1_: any = {
            "tw": getKEYS().Get("bomb_tw_name"),
            "pb": getKEYS().Get("bomb_pb_name"),
            "pu": getKEYS().Get("bomb_pu_name")
        };
        const _loc2_: any = ResourceBombs._bombs[ResourceBombs._bombid];
        (this._mc as any).tTitleTwig.htmlText = getKEYS().Get("bomb_tw_name_pl");
        (this._mc as any).tTitlePebble.htmlText = getKEYS().Get("bomb_pb_name_pl");
        (this._mc as any).tTitlePutty.htmlText = getKEYS().Get("bomb_pu_name");
        const _loc3_: string = String(_loc1_[ResourceBombs._bombid.substr(0, 2)]);
        if (_loc2_.image != this._currentImage) {
            ImageCache.GetImageWithCallBack(_loc2_.image, this.onImageLoaded.bind(this));
        }
        for (_loc4_ of this._items) {
            _loc4_.Update();
        }
        if (ResourceBombs._state == 0) {
            (this._imageContainer as any).txtName.htmlText = "<font color=\"#FFFFFF\">Catapult</font>";
        } else if (ResourceBombs._state == 1) {
            (this._imageContainer as any).txtName.htmlText = "<font color=\"#FF0000\">Cancel</font>";
        }
    }

    private onImageLoaded(param1: string, param2: BitmapData): void {
        if (this._bm) {
            if (this._bm.parent) {
                this._bm.parent.removeChild(this._bm);
            }
            this._bm = null;
        }
        this._bm = new Bitmap(param2);
        this._bm.width = this._bm.height = 60;
        (this._imageContainer as any)._image.addChild(this._bm);
        this._currentImage = param1;
    }

    public fired(): void {
        (this._imageContainer as any).txtName.htmlText = "<font color=\"#FFFFFF\">Catapult</font>";
    }

    public Show(param1: MouseEvent | null = null): void {
        let _loc2_: string = "";
        let _loc3_: any;
        for (_loc2_ in getATTACK()._flingerBucket) {
            if (getATTACK()._flingerBucket[_loc2_].Get() > 0) {
                if (_loc2_.substr(0, 1) != "G") {
                    getATTACK()._curCreaturesAvailable[_loc2_] += getATTACK()._flingerBucket[_loc2_].Get();
                    getATTACK()._flingerBucket[_loc2_].Set(0);
                }
            }
        }
        for (_loc3_ of getUI2()._top._creatureButtons) {
            if (_loc3_ instanceof CHAMPIONBUTTON) {
                if (_loc3_._sent) {
                    (_loc3_ as CHAMPIONBUTTON).deSelectSend();
                }
            }
            _loc3_.Update();
        }
        getATTACK().RemoveDropZone();
        if (getUI2()._top._siegeweapon) {
            getUI2()._top._siegeweapon.Cancel();
        }
        if (ResourceBombs._state != 0) {
            ResourceBombs.BombRemove();
            (this._imageContainer as any).txtName.htmlText = "<font color=\"#FFFFFF\">Catapult</font>";
            return;
        }
        this.addChild(this._mc);
        if (this._t) {
            this._t.start();
        }
        this._open = true;
        this._canClose = false;
        if (param1) {
            param1.stopImmediatePropagation();
        }
    }

    public Fire(param1: MouseEvent | null = null): void {
        this.m_waitTime = getGLOBAL().Timestamp() + 1;
        if (getUI2()._top._siegeweapon) {
            getUI2()._top._siegeweapon.Cancel();
        }
        if (ResourceBombs._state == 0) {
            if (ResourceBombs._bombid && !ResourceBombs._bombs[ResourceBombs._bombid].used && getGLOBAL()._attackersResources["r" + ResourceBombs._bombs[ResourceBombs._bombid].resource].Get() >= ResourceBombs._bombs[ResourceBombs._bombid].cost) {
                ResourceBombs.BombAdd(ResourceBombs._bombs[ResourceBombs._bombid]);
            }
        } else {
            ResourceBombs.BombRemove();
        }
    }

    public Hide(): void {
        if (this._mc.parent) {
            this._mc.parent.removeChild(this._mc);
        }
        if (this._t) {
            this._t.stop();
        }
        this._open = false;
        this.Update();
    }

    public CanUse(): boolean {
        return true;
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
