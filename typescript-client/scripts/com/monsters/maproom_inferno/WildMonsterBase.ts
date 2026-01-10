import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Loader from "openfl/display/Loader";
import SimpleButton from "openfl/display/SimpleButton";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";
import Timer from "openfl/utils/Timer";

import { ImageCache } from "../display/ImageCache";
import { WildMonsterBaseInfo } from "../maproom/WildMonsterBaseInfo";
import { BaseObject } from "./model/BaseObject";
import { MapBasePopup } from "./views/MapBasePopup";
import { PlayerHandler } from "./PlayerHandler";
import { PushPin } from "./PushPin";
import { WildMonsterBaseInferno_CLIP } from "./WildMonsterBaseInferno_CLIP";
import { Button } from "../../../Button";

import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";

/**
 * WildMonsterBase - represents a wild monster base on the Inferno map.
 */
export class WildMonsterBase extends WildMonsterBaseInferno_CLIP {
    public mapX: number = 0;
    public mapY: number = 0;
    public attackBtn: Button | null = null;
    public helpBtn: Button | null = null;
    private loadingImage: boolean = false;
    public offState: Sprite | null = null;
    public overState: Sprite | null = null;
    private nameMargin: number = 10;
    private _state: string = "";
    private mouseTimer: Timer | null = null;
    private pin: Sprite | null = null;
    private currentHitArea: SimpleButton | null = null;
    public data: BaseObject | null = null;
    public colorCode: number = 0;
    public image: Sprite | null = null;
    public nameBox: Sprite | null = null;
    public popUp: MapBasePopup | null = null;
    public handler: PlayerHandler | null = null;
    public loader: Loader | null = null;
    public imageLoadState: number = 0;
    public info_mc: WildMonsterBaseInfo | null = null;

    constructor() {
        super();
        this.popUp = new MapBasePopup();
        this.popUp.title_txt.htmlText = "<b>" + KEYS.Get("map_options") + "</b>";
        this.popUp.x = 21;
        this.popUp.y = 40;
        this.addChild(this.popUp);
        this.info_mc = new WildMonsterBaseInfo();
        this.info_mc.x = 22;
        this.info_mc.y = 10;
        this.addChild(this.info_mc);
    }

    public Setup(baseData: BaseObject): void {
        this.data = baseData;
        this.colorCode = PushPin.RED;
        this.loader = new Loader();
        this.removeChild(this.popUp!);
        this.attackBtn = this.popUp!.attackBtn;
        this.helpBtn = this.popUp!.helpBtn;
        this.popUp!.setHeightForButtons(2);
        this.popUp!.removeChild(this.popUp!.truceBtn);
        this.popUp!.removeChild(this.popUp!.msgBtn);
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
        this.overState = new Sprite();
        this.overState.mouseChildren = false;
        this.overState.addChild(this.info_mc!);
        this.removeChild(this.smallhit);
        this.removeChild(this.largehit);
        this.name_txt.autoSize = TextFieldAutoSize.LEFT;
        this.level_txt.htmlText = "<b>" + this.data.level.Get().toString() + "</b>";
        this.name_txt.htmlText = "<b>" + KEYS.Get("inf_ai_tribe_mapview", { "v1": this.data.ownerName }).toUpperCase() + "</b>";
        this.name_txt.x = this.name_txt.textWidth * -0.5;
        const boxWidth = this.name_txt.textWidth + 2 * 7;
        this.box_mc.width = boxWidth < 51 ? 51 : boxWidth;
        this.attackBtn!.SetupKey("map_attack_btn");
        this.helpBtn!.SetupKey("map_view_btn");
        this.removeChild(this.mediumhit);
        this.setState("off");
        this.addEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.thisDown.bind(this));
        this.mouseTimer = new Timer(400);
        this.mouseTimer.addEventListener(TimerEvent.TIMER, this.onTimer.bind(this));
        this.mouseTimer.start();
        new PlayerHandler().configure(this);
    }

    public setState(state: string): void {
        if (state === "off") {
            if (this.contains(this.overState!)) {
                this.removeChild(this.overState!);
            }
            this.addChildAt(this.offState!, 0);
            this.currentHitArea = this.smallhit;
            if (!this.loadingImage && this.data!.pic.length > 5 && this.imageLoadState === 0) {
                try {
                    ImageCache.GetImageWithCallBack(this.data!.pic, this.onPortraitComplete.bind(this));
                    this.loadingImage = true;
                    this.imageLoadState = 1;
                } catch (e: any) {
                    LOGGER.Log("err", "WildMonsterBase state set: " + e.errorID + " - " + e.getStackTrace());
                }
            }
            if (this.contains(this.popUp!)) {
                this.removeChild(this.popUp!);
            }
        } else if (state === "down") {
            if (this.contains(this.overState!)) {
                this.removeChild(this.overState!);
            }
            this.currentHitArea = this.largehit;
            this.addChild(this.popUp!);
            this.popUp!.Show();
        } else if (state === "over") {
            // No specific action for over state
        }
        this._state = state;
        this.dispatchEvent(new Event(state));
    }

    private onPortraitComplete(url: string, bmd: BitmapData): void {
        const px = this.placeholder.x;
        const py = this.placeholder.y;
        this.imageLoadState = 2;
        const bmp = new Bitmap(bmd);
        bmp.width = bmp.height = 44;
        this.image!.addChildAt(bmp, this.image!.numChildren - 1);
        bmp.x = px;
        bmp.y = py;
    }

    private onTimer(event: TimerEvent): void {
        if (this._state !== "off") {
            if (this.mouseX < this.currentHitArea!.x || this.mouseX > this.currentHitArea!.x + this.currentHitArea!.width || this.mouseY < this.currentHitArea!.y || this.mouseY > this.currentHitArea!.y + this.currentHitArea!.height) {
                this.setState("off");
            }
        }
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
}
