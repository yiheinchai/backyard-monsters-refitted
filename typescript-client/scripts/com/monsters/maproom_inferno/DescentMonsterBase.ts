import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Loader from "openfl/display/Loader";
import SimpleButton from "openfl/display/SimpleButton";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

import { BaseObject } from "./model/BaseObject";
import { DescentBaseInfo } from "./views/DescentBaseInfo";
import { DescentBasePopup } from "./views/DescentBasePopup";
import { DescentView } from "./views/DescentView";
import { DescentMapRoom } from "./DescentMapRoom";
import { PlayerHandler } from "./PlayerHandler";
import { PushPin } from "./PushPin";
import { DescentMonsterBase_CLIP } from "./DescentMonsterBase_CLIP";
import { Button } from "../../../Button";

import { KEYS } from "../../../KEYS";

/**
 * DescentMonsterBase - represents a monster base in the Descent map.
 */
export class DescentMonsterBase extends DescentMonsterBase_CLIP {
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
    public popUp: DescentBasePopup | null = null;
    public handler: PlayerHandler | null = null;
    public loader: Loader | null = null;
    public imageLoadState: number = 0;
    public info_mc: DescentBaseInfo | null = null;

    public readonly popupCoordMap: Array<Array<number>> = [[15, -230], [-145, -215], [15, -225], [15, -225], [40, -215], [-170, -210], [-170, -215], [40, -200], [-170, -225], [30, -230], [50, -240], [-170, -220], [-60, -280]];

    // March 2012 pre-patch 7 Descent base co-ordinates
    // public readonly popupCoordMap: Array<Array<number>> = [[-145,-215],[15,-225],[-170,-210],[40,-200],[-170,-225],[50,-240],[-60,-280]];

    constructor() {
        super();
        this.popUp = new DescentBasePopup();
        this.popUp.tDepth.htmlText = "<b>" + KEYS.Get("descent_depthBar") + "</b>";
        this.popUp.x = 20;
        this.popUp.y = -250;
        this.addChild(this.popUp);
        this.info_mc = new DescentBaseInfo();
        this.info_mc.x = 22;
        this.info_mc.y = 10;
        this.addChild(this.info_mc);
    }

    public Setup(dataObj: BaseObject): void {
        this.data = dataObj;
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
        this.offState.addChild(this.mcBase);
        this.overState = new Sprite();
        this.overState.mouseChildren = false;
        this.overState.addChild(this.info_mc!);
        this.removeChild(this.smallhit);
        this.removeChild(this.largehit);
        this.attackBtn.SetupKey("map_attack_btn");
        this.helpBtn.SetupKey("map_view_btn");
        this.removeChild(this.mediumhit);
        this.setState("off");
        try {
            this.addEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
            if (this.data.level.Get() === DescentView.getInstance().players.targetLvl) {
                this.addEventListener(MouseEvent.MOUSE_DOWN, this.thisDown.bind(this));
            }
        } catch (e: any) {
        }
        this.mouseTimer = new Timer(400);
        this.mouseTimer.addEventListener(TimerEvent.TIMER, this.onTimer.bind(this));
        this.mouseTimer.start();
        new PlayerHandler().configure(this);
        this.stop();
        this.SetLevelArt();
    }

    public InitTargetListener(): void {
        try {
            this.addEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
            if (this.data!.level.Get() === DescentView.getInstance().players.targetLvl + 1) {
                this.addEventListener(MouseEvent.MOUSE_DOWN, this.thisDown.bind(this));
            }
        } catch (e: any) {
        }
    }

    public SetLevelArt(): void {
        const level = this.data!.level.Get();
        let descentLevel = 0;
        if (DescentMapRoom.BRIDGE.MAPROOM) {
            descentLevel = DescentMapRoom.BRIDGE.MAPROOM.DescentLevel;
        }
        // Setting the base sprites for each base on the descent map.
        let artName: string;
        switch (level) {
            case 1:
            case 2:
                artName = "base1";
                break;
            case 3:
            case 4:
                artName = "base2";
                break;
            case 5:
            case 6:
                artName = "base3";
                break;
            case 7:
            case 8:
                artName = "base4";
                break;
            case 9:
            case 10:
                artName = "base5";
                break;
            case 11:
            case 12:
                artName = "base6";
                break;
            case 13:
                artName = "base7";
                break;
            default:
                artName = "base1";
        }
        if (level > descentLevel) {
            artName += "_dark";
        }
        if (this.data!.destroyed) {
            artName += "_destroyed";
            this.mcBase.visible = false;
            this.removeEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
            this.removeEventListener(MouseEvent.MOUSE_DOWN, this.thisDown.bind(this));
        }
        this.mcBase.gotoAndStop(artName);
    }

    public setState(state: string): void {
        if (state === "off") {
            if (this.contains(this.overState!)) {
                this.removeChild(this.overState!);
            }
            this.addChildAt(this.offState!, 0);
            this.currentHitArea = this.smallhit;
            if (this.contains(this.popUp!)) {
                this.removeChild(this.popUp!);
            }
        } else if (state === "down") {
            if (this.contains(this.overState!)) {
                this.removeChild(this.overState!);
            }
            this.currentHitArea = this.largehit;
            this.addChild(this.popUp!);
            this.addChild(this.offState!);
            const levelIdx = this.data!.level.Get() - 1;
            if (this.data) {
                this.popUp!.Show(this.data.level.Get(), this.popupCoordMap[levelIdx][0], this.popupCoordMap[levelIdx][1]);
            } else {
                this.popUp!.Show();
            }
        } else if (state === "over") {
            this.addChild(this.offState!);
        }
        this._state = state;
        this.dispatchEvent(new Event(state));
    }

    private onPortraitComplete(url: string, bmd: BitmapData): void {
        this.imageLoadState = 2;
        const bmp = new Bitmap(bmd);
        bmp.width = bmp.height = 44;
        this.image!.addChildAt(bmp, this.image!.numChildren - 1);
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
