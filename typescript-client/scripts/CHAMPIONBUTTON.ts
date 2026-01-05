import { ImageCache } from './com/monsters/display/ImageCache';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import DisplayObjectContainer from 'openfl/display/DisplayObjectContainer';
import MouseEvent from 'openfl/events/MouseEvent';
import { ATTACK } from './ATTACK';
import { bubblepopup3 } from './bubblepopup3';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { CREEPS } from './CREEPS';
import { GLOBAL } from './GLOBAL';
import { GUARDIANBUTTON_CLIP } from './GUARDIANBUTTON_CLIP';
import { KEYS } from './KEYS';

/**
 * CHAMPIONBUTTON - Champion button for attack mode
 * Handles champion/guardian selection in attack mode
 * Converted from ActionScript to TypeScript
 */
export class CHAMPIONBUTTON extends GUARDIANBUTTON_CLIP {
    public _creatureID: string = "";
    public _creatureData: any;
    public _level: number = 0;
    public _description!: bubblepopup3;
    public _sent: boolean = false;
    private _index: number = 0;
    private readonly MAX_ICON_LEVEL: number = 6;

    constructor(param1: string, param2: number, param3: number, param4: number, param5: DisplayObjectContainer) {
        super();
        this._index = param3;
        this._creatureID = param1;
        this._creatureData = CHAMPIONCAGE._guardians[param1];
        this._level = Math.min(this.MAX_ICON_LEVEL, param2);
        const _loc6_: string = String(CHAMPIONCAGE._guardians[param1].name);
        if (Boolean(GLOBAL._playerGuardianData[this._index]) && Boolean(GLOBAL._playerGuardianData[this._index].l.Get())) {
            this.txtName.htmlText = "<b>" + _loc6_ + " Level " + GLOBAL._playerGuardianData[this._index].l.Get() + "</b>";
        } else {
            this.txtName.htmlText = "<b>" + _loc6_ + " Level 1</b>";
        }
        ImageCache.GetImageWithCallBack("monsters/" + this._creatureID + "_L" + this._level + "-small.png", this.IconLoaded.bind(this), true, 1);
        this._description = new bubblepopup3();
        this._description.Setup(190, 26, KEYS.Get(CHAMPIONCAGE._guardians[this._creatureID].description), 5);
        param5.addChild(this._description);
        this._description.visible = false;
        this._bg.gotoAndStop("bg" + String(param4 % 2 + 1));
        this.bSend.SetupKey("btn_send");
        this.bSend.addEventListener(MouseEvent.CLICK, this.Send.bind(this));
        this.bRetreat.SetupKey("btn_retreat");
        this.bRetreat.addEventListener(MouseEvent.CLICK, this.Retreat.bind(this));
        this.addEventListener(MouseEvent.ROLL_OVER, this.Over.bind(this));
        this.addEventListener(MouseEvent.ROLL_OUT, this.Out.bind(this));
        if (!GLOBAL.isInAttackMode) {
            this.bSend.visible = false;
            this.bSend.Enabled = false;
            this.bRetreat.visible = false;
            this.bRetreat.Enabled = false;
        }
        if (CREEPS._flungGuardian) {
            CREEPS._flungGuardian[this._index] = false;
        }
        this.Update();
    }

    public IconLoaded(param1: string, param2: BitmapData): void {
        this.mcImage.addChild(new Bitmap(param2));
    }

    public Update(): void {
        if (CREEPS._flungGuardian[this._index]) {
            this.bSend.removeEventListener(MouseEvent.CLICK, this.Send.bind(this));
            this.bSend.Enabled = false;
        }
    }

    public Send(param1: MouseEvent): void {
        if (!this._sent) {
            ATTACK.BucketAdd(this._creatureID);
            this.bSend.SetupKey("btn_hold");
            ATTACK.BucketUpdate();
            this._sent = true;
        } else {
            this.deSelectSend();
        }
        this.Update();
    }

    public deSelectSend(): void {
        if (this.bSend.Enabled) {
            ATTACK.BucketRemove(this._creatureID);
            this.bSend.SetupKey("btn_send");
            ATTACK.BucketUpdate();
            this._sent = false;
        }
    }

    public Retreat(param1: MouseEvent): void {
        const _loc2_: number = CREEPS.getGuardianIndex(Number(this._creatureID.substr(1)));
        if (_loc2_ >= 0) {
            CREEPS._guardianList[_loc2_].changeModeRetreat();
        }
    }

    public Over(param1: MouseEvent): void {
        this._description.visible = true;
    }

    public Out(param1: MouseEvent): void {
        this._description.visible = false;
    }
}
