import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { MONSTERBAITER } from './MONSTERBAITER';
import { MonsterBaiterItem_CLIP } from './MonsterBaiterItem_CLIP';

// Lazy imports to break circular dependency chains
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * MonsterBaiterItem - Individual monster item for monster baiter
 * Converted from ActionScript to TypeScript
 */
export class MonsterBaiterItem extends MonsterBaiterItem_CLIP {
    public _count: number = 0;
    public _cost: number = 0;
    public _configObj: any;
    public _level: number = 0;
    public _key: string;
    private tick: number = 0;
    private _enabled: boolean = false;
    private _initialCount: number = 0;

    constructor() {
        super();
        this.tInfo.textColor = 16711680;
    }

    public Setup(param1: string): void {
        this._configObj = getCREATURELOCKER()._creatures[param1];
        this._key = param1;
        ImageCache.GetImageWithCallBack("monsters/" + param1 + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [this.mcIcon]);
        this.tInfo.text = "";
        this.tName.htmlText = "<b>" + getKEYS().Get(this._configObj.name) + "</b>";
        this._cost = getCREATURES().GetProperty(param1, "cStorage");
        this.decr_btn.addEventListener(MouseEvent.MOUSE_DOWN, this.decrDown.bind(this));
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.incr_btn.addEventListener(MouseEvent.MOUSE_DOWN, this.incrDownB.bind(this));
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] | null = null): void {
        const _loc4_: Bitmap = new Bitmap(param2);
        _loc4_.smoothing = true;
        if (param3 && param3[0]) {
            param3[0].mcImage.addChild(_loc4_);
            param3[0].mcImage.visible = true;
        }
    }

    private onAdd(param1: Event): void {
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onStageUp.bind(this));
        MONSTERBAITER._mc.Update();
    }

    private onStageUp(param1: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.moreTick.bind(this));
        MONSTERBAITER._mc.Update();
    }

    public Update(): void {
        if (this._count > 0) {
            this.tInfo.htmlText = getKEYS().Get("bait_sending", {"v1": this._count});
        } else {
            this.tInfo.htmlText = "";
        }
        this.dispatchEvent(new Event(Event.CHANGE));
    }

    public getCost(): number {
        return this._cost * this._count;
    }

    private incrDown(param1: MouseEvent): void {
        this._initialCount = this._count;
        ++this._count;
        this.tick = 0;
        this.addEventListener(Event.ENTER_FRAME, this.moreTick.bind(this));
        this.addEventListener(MouseEvent.MOUSE_UP, this.Stop.bind(this));
        MONSTERBAITER._mc.Update();
        getSOUNDS().Play("click1");
    }

    private incrDownB(param1: MouseEvent): void {
        this.dispatchEvent(new Event("increment"));
        MONSTERBAITER._mc.Update();
    }

    private moreTick(param1: Event): void {
        if (this.tick > 10 && this.tick % 2 == 0 || this._count - this._initialCount > 60) {
            this.moreTickB();
        }
        ++this.tick;
        this.MovedOut();
    }

    private moreTickB(): void {
        ++this._count;
        MONSTERBAITER._mc.Update();
    }

    private decrDown(param1: MouseEvent): void {
        if (this._count > 0) {
            this._initialCount = this._count;
            --this._count;
            this.tick = 0;
            this.addEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
            this.addEventListener(MouseEvent.MOUSE_UP, this.Stop.bind(this));
            getSOUNDS().Play("click1");
            MONSTERBAITER._mc.Update();
        }
    }

    private lessTick(param1: Event): void {
        if (this.tick > 10 && this.tick % 2 == 0 || this._initialCount - this._count > 60) {
            this.lessTickB();
        }
        ++this.tick;
        this.MovedOut();
    }

    private lessTickB(): void {
        if (this._count > 0) {
            --this._count;
        } else {
            this.removeEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
        }
        MONSTERBAITER._mc.Update();
    }

    public Enable(param1: boolean): void {
        const _loc2_: number = 0.3;
        if (param1) {
            if (!this._enabled) {
                this._enabled = true;
                this.incr_btn.addEventListener(MouseEvent.MOUSE_DOWN, this.incrDown.bind(this));
                this.incr_btn.alpha = this.decr_btn.alpha = 1;
            }
        } else {
            this._enabled = false;
            this.incr_btn.removeEventListener(MouseEvent.MOUSE_DOWN, this.incrDown.bind(this));
            this.incr_btn.alpha = _loc2_;
            this.removeEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
            this.removeEventListener(Event.ENTER_FRAME, this.moreTick.bind(this));
        }
        this.decr_btn.alpha = this._count > 0 ? 1 : _loc2_;
    }

    private MovedOut(): void {
        if (this.mouseX < this.incr_btn.x || this.mouseX > this.incr_btn.x + this.incr_btn.width || this.mouseY < this.incr_btn.y || this.mouseY > this.decr_btn.y + this.decr_btn.height) {
            this.removeEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
            this.removeEventListener(Event.ENTER_FRAME, this.moreTick.bind(this));
        }
    }

    private Stop(param1: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.lessTick.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.moreTick.bind(this));
    }
}
