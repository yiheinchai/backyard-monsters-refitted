import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Timer from "openfl/utils/Timer";

import { Chat } from "../chat/Chat";
import { ImageCache } from "../display/ImageCache";
import { IReplayableEventUI } from "./IReplayableEventUI";
import { ReplayableEvent } from "./ReplayableEvent";
import { EventsBar_CLIP } from "../../../EventsBar_CLIP";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }



/**
 * Replayable event UI - displays event info bar with progress and countdown.
 */
export class ReplayableEventUI extends EventsBar_CLIP implements IReplayableEventUI {
    public static CLICKED_ACTION: string = "eventBarAction";
    public static CLICKED_INFO: string = "eventBarInfo";

    private points: number = 0;
    private _timer: Timer | null = null;
    private _phase: number = 0;
    private readonly _finalcountdown: number = 86400;
    private _image: string = "";
    private _titlelogo: string = "";
    private _event: ReplayableEvent | null = null;
    private readonly BASEIMAGEURL: string = "specialevent/";
    private eventText_tLabel: Array<string>;
    private eventText_barProgressTxt: Array<string>;
    private eventText_bActionTxt: Array<string>;

    constructor() {
        super();
        this.eventText_tLabel = ["tLabel", "tLabel"];
        this.eventText_barProgressTxt = ["fp_infobar_progressbar", "fp_infobar_progressbar"];
        this.eventText_bActionTxt = ["btn_info", "btn_info"];
    }

    public get eventUI(): DisplayObject {
        return this;
    }

    public setup(event: ReplayableEvent): void {
        this._event = event;
        this.bHelp.addEventListener(MouseEvent.CLICK, this.ShowInfoPopup.bind(this));
        this.bHelp.buttonMode = true;
        let frame: number = 1;
        if (getBASE().isInfernoMainYardOrOutpost) {
            frame = 2;
        }
        this.mcBG.gotoAndStop(frame);
        this.bAction.gotoAndStop(frame);
        this.mcLogo.visible = false;
        this.mcLogo.enabled = false;
        this.mcLogo.mouseEnabled = false;
        this.gotoAndStop(this.phase);
        if (Boolean(this._event.buttonCopy) && this.phase > 1) {
            this.bActionTxt.htmlText = this._event.buttonCopy;
            this.bActionTxt.mouseEnabled = false;
            this.bActionTxt.visible = true;
            this.bAction.addEventListener(MouseEvent.CLICK, this.ShowEventPopup.bind(this));
            this.bAction.buttonMode = true;
            this.bAction.visible = true;
            this.bAction.enabled = true;
            this.mcBG.width = 290;
            this.bHelp.x = 272;
        } else {
            this.bActionTxt.mouseEnabled = false;
            this.bActionTxt.visible = false;
            this.bAction.visible = false;
            this.bAction.enabled = false;
            this.mcBG.width = 290;
            this.bHelp.x = 272;
        }
        this.updateImage();
    }

    public update(): void {
        this.Tick();
    }

    private Tick(arg: any = null): void {
        this.updateText();
        this.Resize();
    }

    private get phase(): number {
        if (this._event!.hasEventStarted) {
            this._phase = 2;
        } else {
            this._phase = 1;
        }
        return this._phase;
    }

    private updateText(): void {
        if (this.tTitle) {
            this.tTitle.htmlText = this._event!.name;
            this.tTitle.mouseEnabled = false;
            if (this._event!.titleImage) {
                this.tTitle.visible = false;
            }
        }
        const timeRemaining = this._event!.timeUntilNextDate;
        if (timeRemaining <= 0) {
            this.tLabel.htmlText = "<b>DATE NOT INITIALIZED!</b>";
        } else {
            const timeStr = getGLOBAL().ToTime(timeRemaining, true);
            this.tLabel.htmlText = "<b>" + timeStr + "</b>";
        }
        this.tLabel.mouseEnabled = false;
        if (this.currentFrame > 1) {
            const progress = this._event!.progress;
            const phaseKey = this.PhaseKey(this.eventText_barProgressTxt);
            const percentComplete = Math.min(100, Math.floor(this._event!.progress * 100));
            this.barProgressTxt.htmlText = "" + phaseKey + " - " + percentComplete + " %" + "";
            this.barProgress.mcBar.width = Math.min(100, this._event!.progress * 100);
        } else if (this.phase > 1) {
            this.tLabel.htmlText = "<b>" + getKEYS().Get("refresh_to_start_event") + "<b>";
        }
    }

    private updateImage(): void {
        if (Boolean(this._event!.imageURL) && this._event!.imageURL !== this._image) {
            const imageUrl = this._event!.imageURL;
            this._image = imageUrl;
            ImageCache.GetImageWithCallBack(this._image, this.onImageLoaded.bind(this));
        }
        if (!this._event!.hasEventStarted && this._event!.titleImage && this._event!.titleImage !== this._titlelogo) {
            const logoUrl = this._event!.titleImage;
            this._titlelogo = logoUrl;
            ImageCache.GetImageWithCallBack(this._titlelogo, this.onLogoLoaded.bind(this));
        } else if (this._event!.hasEventStarted && this.mcLogo.visible) {
            this.mcLogo.visible = false;
        }
    }

    private onImageLoaded(key: string, bmd: BitmapData): void {
        while (this.mcImage.numChildren) {
            this.mcImage.removeChildAt(0);
        }
        this.mcImage.addChild(new Bitmap(bmd));
    }

    private onLogoLoaded(key: string, bmd: BitmapData): void {
        while (this.mcLogo.numChildren) {
            this.mcLogo.removeChildAt(0);
        }
        const logoBmp = new Bitmap(bmd);
        logoBmp.y = -5;
        this.mcLogo.addChild(logoBmp);
        this.mcLogo.visible = true;
    }

    private ShowEventPopup(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(ReplayableEventUI.CLICKED_ACTION));
    }

    private ShowInfoPopup(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(ReplayableEventUI.CLICKED_INFO));
    }

    private Hide(): void {
        if (Boolean(this) && Boolean(this.parent)) {
            this.bHelp.removeEventListener(MouseEvent.CLICK, this.ShowInfoPopup.bind(this));
            this.bAction.removeEventListener(MouseEvent.CLICK, this.ShowEventPopup.bind(this));
            this.parent.removeChild(this);
        }
    }

    private Resize(): void {
        getGLOBAL().RefreshScreen();
        this.x = Math.floor(getGLOBAL()._SCREEN.x + 5 + 30);
        this.y = Math.floor(getGLOBAL()._SCREEN.y + getGLOBAL()._SCREEN.height - this.mcHit.height - 10);
        if (Chat._bymChat && Chat._bymChat.chatBox && Boolean(Chat._bymChat.chatBox.background)) {
            this.y = Math.floor(Chat._bymChat.y + Chat._bymChat.chatBox.y + Chat._bymChat.chatBox.background.y - 53);
        }
    }

    private PhaseKey(keys: Array<string>, translate: boolean = true): string {
        if (this.phase - 1 < keys.length - 1) {
            if (translate) {
                return getKEYS().Get(keys[this.phase - 1]);
            }
            return keys[this.phase - 1];
        }
        if (translate) {
            return getKEYS().Get(keys[keys.length - 1]);
        }
        return keys[keys.length - 1];
    }
}
