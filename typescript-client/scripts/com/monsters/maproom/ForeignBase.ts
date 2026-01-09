import { Loader } from "openfl/display/Loader";
import { SimpleButton } from "openfl/display/SimpleButton";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { IOErrorEvent } from "openfl/events/IOErrorEvent";
import { MouseEvent } from "openfl/events/MouseEvent";
import { TimerEvent } from "openfl/events/TimerEvent";
import { URLRequest } from "openfl/net/URLRequest";
import { LoaderContext } from "openfl/system/LoaderContext";
import { TextFieldAutoSize } from "openfl/text/TextFieldAutoSize";
import { Timer } from "openfl/utils/Timer";

import { BaseObject } from "./model/BaseObject";
import { MapBasePopup } from "./views/MapBasePopup";
import { ForeignBase_CLIP } from "./ForeignBase_CLIP";
import { MapRoom } from "./MapRoom";
import { PlayerHandler } from "./PlayerHandler";
import { PushPin } from "./PushPin";
import { Button } from "../../Button";

import { KEYS } from "../../../KEYS";

/**
 * Foreign base - represents another player's base on the map room.
 */
export class ForeignBase extends ForeignBase_CLIP {
    public mapX: number = 0;
    public mapY: number = 0;
    public attackBtn: Button | null = null;
    public helpBtn: Button | null = null;
    public truceBtn: Button | null = null;
    public msgBtn: Button | null = null;
    private loadingImage: boolean = false;
    public offState: Sprite | null = null;
    private nameMargin: number = 10;
    private _state: string = "";
    private mouseTimer: Timer | null = null;
    private pin: Sprite | null = null;
    private currentHitArea: SimpleButton | null = null;
    public data: BaseObject | null = null;
    public colorCode: number = 0;
    public image: Sprite | null = null;
    public nameBox: Sprite | null = null;
    public popUp: MapBasePopup;
    public handler: PlayerHandler | null = null;
    public loader: Loader | null = null;
    private imageLoadState: number = 0;

    constructor() {
        super();
        this.popUp = new MapBasePopup();
        this.popUp.title_txt.htmlText = "<b>" + KEYS.Get("map_options") + "</b>";
        this.popUp.x = 21;
        this.popUp.y = 40;
        this.addChild(this.popUp);
    }

    public Setup(baseData: BaseObject): void {
        this.data = baseData;
        if (this.data.friend.Get() === 1) {
            this.colorCode = PushPin.GREEN;
        } else if (this.data.attacksfrom.Get() === 0 && this.data.attacksto.Get() === 0) {
            this.colorCode = PushPin.YELLOW;
        } else if (this.data.attacksto.Get() > this.data.attacksfrom.Get()) {
            this.colorCode = PushPin.ORANGE;
        } else if (this.data.attacksto.Get() < this.data.attacksfrom.Get()) {
            this.colorCode = PushPin.RED;
        }
        this.loader = new Loader();
        this.removeChild(this.popUp);
        this.attackBtn = this.popUp.attackBtn;
        this.helpBtn = this.popUp.helpBtn;
        this.truceBtn = this.popUp.truceBtn;
        this.msgBtn = this.popUp.msgBtn;
        this.offState = new Sprite();
        this.offState.mouseChildren = false;
        this.image = new Sprite();
        this.image.addChild(this.photoFrame_mc);
        this.image.addChild(this.placeholder);
        this.image.addChild(this.frame_mc);
        this.offState.addChild(this.image);
        this.nameBox = new Sprite();
        this.nameBox.addChild(this.box_mc);
        this.nameBox.addChild(this.name_txt);
        this.offState.addChild(this.nameBox);
        this.nameBox.x = -2;
        this.pin = PushPin.getRandomPinWithColor(this.colorCode);
        this.addChild(this.pin);
        this.removeChild(this.smallhit);
        this.removeChild(this.largehit);
        this.name_txt.autoSize = TextFieldAutoSize.LEFT;
        this.name_txt.htmlText = "<b>" + this.data.ownerName.toUpperCase() + "</b>";
        this.name_txt.x = this.name_txt.textWidth * -0.5;
        const boxWidth: number = this.name_txt.textWidth + 2 * 7;
        this.box_mc.width = boxWidth < 51 ? 51 : boxWidth;
        this.level.lv_txt.htmlText = "<b>" + baseData.level.Get();
        this.attackBtn.Setup(MapRoom.BRIDGE.KEYS.Get("map_attack_btn"));
        this.helpBtn.Setup(MapRoom.BRIDGE.KEYS.Get("map_help_btn"));
        this.truceBtn.Setup(MapRoom.BRIDGE.KEYS.Get("map_truce_btn"));
        this.msgBtn.Setup(MapRoom.BRIDGE.KEYS.Get("map_message_btn"));
        this.removeChild(this.mediumhit);
        this.setState("off");
        this.addEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.thisDown.bind(this));
        baseData.addEventListener(Event.CHANGE, this.Update.bind(this));
        this.mouseTimer = new Timer(400);
        this.mouseTimer.addEventListener(TimerEvent.TIMER, this.onTimer.bind(this));
        this.mouseTimer.start();
        this.handler = new PlayerHandler();
        this.Update();
    }

    public setState(state: string): void {
        if (state === "off") {
            this.addChildAt(this.offState!, 0);
            this.currentHitArea = this.smallhit;
            if (!this.loadingImage && this.data!.pic && this.data!.pic.length > 5 && this.imageLoadState === 0) {
                try {
                    const LoadImageError = (event: IOErrorEvent): void => {
                    };
                    this.loader!.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onPortraitComplete.bind(this));
                    this.loader!.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
                    this.loader!.load(new URLRequest(this.data!.pic), new LoaderContext(true));
                    this.imageLoadState = 1;
                } catch (e: any) {
                    MapRoom.BRIDGE.Log("err", "ForeignBase state set: " + e.errorID + " - " + e.getStackTrace());
                }
            }
            if (this.contains(this.popUp)) {
                this.removeChild(this.popUp);
            }
        } else if (state === "down") {
            this.currentHitArea = this.largehit;
            this.addChild(this.popUp);
            this.popUp.Show();
        }
        this._state = state;
        this.dispatchEvent(new Event(state));
    }

    public get state(): string {
        return this._state;
    }

    private thisOver(event: MouseEvent): void {
        if (this._state === "off") {
            this.setState("over");
        }
    }

    private thisDown(event: MouseEvent): void {
        if (this._state === "off" || this._state === "over") {
            this.setState("down");
        }
    }

    private onPortraitComplete(event: Event): void {
        const px: number = this.placeholder.x;
        const py: number = this.placeholder.y;
        this.imageLoadState = 2;
        this.loader!.width = this.loader!.height = 44;
        this.image!.addChildAt(this.loader!, this.image!.numChildren - 1);
        this.loader!.x = px;
        this.loader!.y = py;
    }

    private onTimer(event: TimerEvent): void {
        if (this._state !== "off") {
            if (this.mouseX < this.currentHitArea!.x || this.mouseX > this.currentHitArea!.x + this.currentHitArea!.width || this.mouseY < this.currentHitArea!.y || this.mouseY > this.currentHitArea!.y + this.currentHitArea!.height) {
                this.setState("off");
            }
        }
    }

    public Update(event: Event | null = null): void {
        this.handler!.configure(this);
    }
}
