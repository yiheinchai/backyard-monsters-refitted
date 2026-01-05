import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import DisplayObjectContainer from 'openfl/display/DisplayObjectContainer';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ATTACK } from './ATTACK';
import { bubblepopup3 } from './bubblepopup3';
import { CREATUREBUTTON_CLIP } from './CREATUREBUTTON_CLIP';
import { CREATURELOCKER } from './CREATURELOCKER';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { UI2 } from './UI2';

/**
 * CREATUREBUTTON - Creature button for attack mode
 * Converted from ActionScript to TypeScript
 */
export class CREATUREBUTTON extends CREATUREBUTTON_CLIP {
    public _creatureID: string;
    public _creatureData: any;
    public _tick: number;
    public _description: bubblepopup3;
    protected m_index: number;

    constructor(param1: string, param2: number, param3: DisplayObjectContainer) {
        super();
        this._creatureID = param1;
        this._creatureData = CREATURELOCKER._creatures[this._creatureID];
        ImageCache.GetImageWithCallBack("monsters/" + this._creatureID + "-small.png", this.IconLoaded.bind(this), true, 1);
        
        let _loc4_: string = KEYS.Get(CREATURELOCKER._creatures[this._creatureID].name);
        const _loc5_: number = Math.max(0.8, Math.min(1, 1 / (_loc4_.length / 10))) * 12;
        
        if (Boolean(GLOBAL.attackingPlayer.m_upgrades[param1]) && Boolean(GLOBAL.attackingPlayer.m_upgrades[param1].level)) {
            this.txtName.htmlText = "<b><font size=\"" + _loc5_ + "\">" + _loc4_ + " Level " + GLOBAL.attackingPlayer.m_upgrades[param1].level + "</font></b>";
        } else {
            this.txtName.htmlText = "<b><font size=\"" + _loc5_ + "\">" + _loc4_ + " Level 1</font></b>";
        }
        
        this._description = new bubblepopup3();
        this._description.Setup(190, 26, KEYS.Get(CREATURELOCKER._creatures[this._creatureID].description), 5);
        param3.addChild(this._description);
        this._description.visible = false;
        this.m_index = param2;
        this._bg.gotoAndStop("bg" + String(this.m_index % 2 + 1));
        this.addEventListener(MouseEvent.ROLL_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.ROLL_OUT, this.Out.bind(this));
        
        if (!GLOBAL.isInAttackMode) {
            this.bMore.visible = false;
            this.bMore.Enabled = false;
            this.bLess.visible = false;
            this.bLess.Enabled = false;
            this.txtNumber.x = 40;
        } else {
            this.bMore.Setup("+");
            this.bMore.addEventListener(MouseEvent.MOUSE_DOWN, this.More.bind(this));
            this.bMore.addEventListener(MouseEvent.MOUSE_UP, this.Clear.bind(this));
            this.bMore.addEventListener(MouseEvent.ROLL_OVER, this.Over.bind(this));
            this.bLess.Setup("-");
            this.bLess.addEventListener(MouseEvent.MOUSE_DOWN, this.Less.bind(this));
            this.bLess.addEventListener(MouseEvent.MOUSE_UP, this.Clear.bind(this));
            this.bLess.addEventListener(MouseEvent.ROLL_OVER, this.Over.bind(this));
            this.txtNumber.x = 110;
        }
        this._tick = 0;
        this.Update();
    }

    public IconLoaded(param1: string, param2: BitmapData): void {
        const _loc3_: Bitmap = new Bitmap(param2);
        this._creatureImage.addChild(_loc3_);
    }

    public Update(): void {
        let _loc1_: number = Number(ATTACK._curCreaturesAvailable[this._creatureID]);
        let _loc2_: string = "<b>";
        if (ATTACK._flingerBucket[this._creatureID]) {
            _loc2_ = "<font color=\"#FF0000\">" + ATTACK._flingerBucket[this._creatureID].Get() + "</font> / ";
        }
        _loc2_ += _loc1_ + "</b>";
        this.txtNumber.htmlText = _loc2_;
        
        if (_loc1_ > 0) {
            this.bMore.enabled = true;
            this._bg.gotoAndStop("bg" + String(this.m_index % 2 + 1));
        }
        if (_loc1_ <= 0) {
            this.bMore.enabled = false;
            this._bg.gotoAndStop("full" + String(this.m_index % 2 + 1));
        }
    }

    public Over(param1: MouseEvent): void {
        this._description.visible = true;
    }

    public Out(param1: MouseEvent): void {
        this._description.visible = false;
    }

    public Clear(param1: MouseEvent | null = null): void {
        if (this.hasEventListener(Event.ENTER_FRAME)) {
            this.removeEventListener(Event.ENTER_FRAME, this.MoreTick.bind(this));
        }
        if (this.hasEventListener(Event.ENTER_FRAME)) {
            this.removeEventListener(Event.ENTER_FRAME, this.LessTick.bind(this));
        }
    }

    public More(param1: MouseEvent): void {
        UI2._top.BombDeselect();
        this.MoreTickB();
        this._tick = 0;
        this.addEventListener(Event.ENTER_FRAME, this.MoreTick.bind(this));
    }

    public MoreTick(param1: Event | null = null): void {
        if (this._tick > 10 && this._tick % 2 == 0) {
            this.MoreTickB();
        }
        this.MoreMovedOut();
        ++this._tick;
    }

    public MoreTickB(): void {
        ATTACK.BucketAdd(this._creatureID);
        this.Update();
        ATTACK.BucketUpdate();
    }

    public Less(param1: MouseEvent): void {
        UI2._top.BombDeselect();
        this.LessTickB();
        this._tick = 0;
        this.addEventListener(Event.ENTER_FRAME, this.LessTick.bind(this));
    }

    public LessTick(param1: Event | null = null): void {
        if (this._tick > 10 && this._tick % 2 == 0) {
            this.LessTickB();
        }
        this.LessMovedOut();
        ++this._tick;
    }

    public LessTickB(): void {
        ATTACK.BucketRemove(this._creatureID);
        this.Update();
        ATTACK.BucketUpdate();
    }

    public MoreMovedOut(): void {
        if (this.mouseX < this.bMore.x || this.mouseX > this.bMore.x + this.bMore.width || this.mouseY < this.bMore.y || this.mouseY > this.bMore.y + this.bMore.height) {
            this.Clear();
        }
    }

    public LessMovedOut(): void {
        if (this.mouseX < this.bLess.x || this.mouseX > this.bLess.x + this.bLess.width || this.mouseY < this.bLess.y || this.mouseY > this.bLess.y + this.bLess.height) {
            this.Clear();
        }
    }
}
