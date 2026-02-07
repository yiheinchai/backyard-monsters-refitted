import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import Sprite from 'openfl/display/Sprite';
import StageDisplayState from 'openfl/display/StageDisplayState';
import Event from 'openfl/events/Event';
import FullScreenEvent from 'openfl/events/FullScreenEvent';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import MouseEvent from 'openfl/events/MouseEvent';
import TimerEvent from 'openfl/events/TimerEvent';
import TextField from 'openfl/text/TextField';
import Timer from 'openfl/utils/Timer';
import { FriendPicker } from './com/monsters/mailbox/FriendPicker';
import { Message } from './com/monsters/mailbox/Message';
import { Contact } from './com/monsters/mailbox/model/Contact';
import { Button } from './Button';
import { SIGNS } from './SIGNS';
import { POPUPSETTINGS } from './POPUPSETTINGS';

// Lazy imports to break circular dependency chains
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getBASE(): any { return require("./BASE").BASE; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


export class SIGNPOPUP extends Sprite {
    public static readonly GRAY: number = 6710886;
    public static readonly BLACK: number = 0;

    public picker: FriendPicker;
    public sendBtn: Button;
    public subject_txt: TextField;
    public status_txt: TextField;
    public closeBtn: SimpleButton;
    public bg_mc: MovieClip;
    public requestType: string = "subject";
    private timer: Timer;
    public fsWarning: MovieClip;
    public _sign: BFOUNDATION;
    public _senderName: string;
    public _senderPic: string;
    public _senderid: number;
    public _subject: string;
    public _mode: string;

    constructor() {
        super();
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemoved.bind(this));
        this.timer = new Timer(100);
        this.timer.addEventListener(TimerEvent.TIMER, this.Validate.bind(this));
        this.timer.start();
        this.closeBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.closeDown.bind(this));
        const _loc1_ = new Contact(String(getBASE()._userID), {
            "first_name": getBASE()._ownerName,
            "last_name": "",
            "pic_square": getBASE()._ownerPic
        });
        this.picker.preloadSelection(_loc1_);
    }

    private closeDown(param1: MouseEvent): void {
        const _loc2_ = this.subject_txt.text ? this.subject_txt.text : "No Message";
        this._sign.SetGiftingProps(0, _loc2_, this._senderid, this._senderName, this._senderPic);
        SIGNS.Hide();
    }

    private sendDown(param1: MouseEvent): void {
        let _loc3_: any[];
        this._sign._subject = this.subject_txt.text;
        this._subject = this.subject_txt.text;
        const _loc2_ = this.picker.getCurrentData().userid;
        const _loc4_ = new (getURLLoaderApi())();
        if (this._mode == "create") {
            _loc3_ = [["threadid", 0], ["targetid", _loc2_], ["targetbaseid", 0], ["type", this.requestType], ["subject", this._subject]];
            _loc4_.load(getGLOBAL()._apiURL + "player/sendmessage", _loc3_, this.onSuccess.bind(this), this.onFail.bind(this));
            this.sendBtn.Enabled = false;
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        } else if (this._mode == "edit") {
            _loc3_ = [["threadid", this._sign._threadid], ["subject", this._subject]];
            _loc4_.load(getGLOBAL()._apiURL + "player/editthread", _loc3_, this.onSuccess.bind(this), this.onFail.bind(this));
            this.sendBtn.Enabled = false;
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        }
    }

    public Setup(): void {
        if (this._mode == "create") {
            this.sendBtn.SetupKey("btn_send");
        } else if (this._mode == "edit") {
            this.sendBtn.SetupKey("btn_save");
            this.subject_txt.text = this._subject;
        }
        this.status_txt.text = "";
    }

    private onSuccess(param1: any): void {
        if (param1.error != undefined && param1.error != 0) {
            try {
                getLOGGER().Log("err", "mailbox-" + param1.error);
            } catch (e) {
            }
            this.displayError();
        } else {
            this._sign.SetGiftingProps(param1.threadid, this._subject, this._senderid, this._senderName, this._senderPic);
            SIGNS.Hide();
        }
    }

    private onFail(param1: IOErrorEvent): void {
        this.displayError();
    }

    public displayError(): void {
        this.status_txt.text = "Message failed";
        this.sendBtn.Enabled = true;
        this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
    }

    private onAdd(param1: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.Center();
        this.stage.addEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        this.detectFS();
    }

    private detectFS(param1: FullScreenEvent = null): void {
        if (this.stage && this.stage.displayState == StageDisplayState.FULL_SCREEN) {
            (this.fsWarning as any).tBody.htmlText = getKEYS().Get("fswarning");
            this.addChild(this.fsWarning);
        } else if (this.contains(this.fsWarning)) {
            this.removeChild(this.fsWarning);
        }
    }

    private onRemoved(param1: Event): void {
        this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        this.removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemoved.bind(this));
        this.timer.stop();
    }

    private Validate(param1: TimerEvent): void {
        let _loc2_ = true;
        if (!this.picker.currentSelection) {
            _loc2_ = false;
        }
        if (Message.getNotWS(this.subject_txt.text).length == 0 || this.subject_txt.text == "Subject") {
            _loc2_ = false;
        }
        if (_loc2_) {
            this.sendBtn.Enabled = true;
            this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        } else {
            this.sendBtn.Enabled = false;
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        }
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
