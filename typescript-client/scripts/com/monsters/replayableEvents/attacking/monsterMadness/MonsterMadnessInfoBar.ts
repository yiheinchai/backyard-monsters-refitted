import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Timer } from "openfl/utils/Timer";

import { Chat } from "../../../chat/Chat";
import { ImageCache } from "../../../display/ImageCache";
import { MonsterMadness } from "./MonsterMadness";
import { MonsterMadnessBar_CLIP } from "./MonsterMadnessBar_CLIP";

import { BASE } from "../../../../../BASE";
import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";

/**
 * MonsterMadnessInfoBar - bottom UI bar showing Monster Madness event progress.
 */
export class MonsterMadnessInfoBar extends MonsterMadnessBar_CLIP {
    public points: number = 0;
    public _timer: Timer | null = null;
    public eventstage: number = 0;
    private _finalcountdown: number = 86400;
    private _image: string = "";
    private readonly BASEIMAGEURL: string = "specialevent/monstermadness/";

    constructor() {
        super();
    }

    public static ShowEventPopup(event: MouseEvent | null = null): void {
        MonsterMadness.showPopup(true);
    }

    public Setup(): void {
        if (MonsterMadness.stage <= 0) {
            return;
        }
        this.addEventListener(MouseEvent.CLICK, MonsterMadnessInfoBar.ShowEventPopup);
        this.buttonMode = true;
        this.mouseChildren = false;
        this.bActionTxt.htmlText = KEYS.Get("btn_info");
        this.bActionTxt.mouseEnabled = false;
        this.bAction.addEventListener(MouseEvent.CLICK, MonsterMadnessInfoBar.ShowEventPopup);
        let frame = 1;
        if (BASE.isInfernoMainYardOrOutpost) {
            frame = 2;
        }
        this.mcBG.gotoAndStop(frame);
        this.bAction.gotoAndStop(frame);
        this.Update();
        GLOBAL._layerUI.addChild(this);
    }

    public Update(): void {
        if (MonsterMadness.stage > 1) {
            this.gotoAndStop(2);
        } else {
            this.gotoAndStop(1);
        }
        this.updateText();
        this.updateImage();
        this.Resize();
    }

    public updateText(): void {
        const stage = MonsterMadness.stage;
        const timeRemaining = MonsterMadness.timeUntilNextPhase;
        const timeStr = GLOBAL.ToTime(timeRemaining);
        this.tLabel.htmlText = "<b>" + timeStr + "</b>";
        if (stage > 1 && stage < 5) {
            let pct = 0;
            let points = MonsterMadness.points;
            let goal = MonsterMadness.POINTS_GOAL1;
            let label = "";
            if (stage === 2) {
                goal = MonsterMadness.POINTS_GOAL1;
                label = KEYS.Get("mm_infobar_progressbar");
            } else if (stage === 3) {
                goal = MonsterMadness.POINTS_GOAL2 - MonsterMadness.POINTS_GOAL1;
                points = MonsterMadness.points - MonsterMadness.POINTS_GOAL1;
                label = KEYS.Get("mm_infobar_progressbar2");
            } else if (stage === 4) {
                goal = MonsterMadness.POINTS_GOAL3 - MonsterMadness.POINTS_GOAL2;
                points = MonsterMadness.points - MonsterMadness.POINTS_GOAL2;
                label = KEYS.Get("mm_infobar_progressbar3");
            }
            pct = Math.min(100, Math.floor(points / goal * 100));
            this.barProgressTxt.htmlText = "" + label + pct + " %" + "";
            this.barProgress.mcBar.width = Math.min(100, 100 / goal * points);
        }
    }

    public updateImage(): void {
        const stage = MonsterMadness.stage;
        let suffix = "1";
        if (stage === 3) {
            suffix = "2.v4";
        } else if (stage === 4) {
            suffix = "3.v3";
        } else {
            suffix = "1.v3";
        }
        if (this._image !== this.BASEIMAGEURL + "mm_infoicon_" + suffix + ".png") {
            this._image = this.BASEIMAGEURL + "mm_infoicon_" + suffix + ".png";
            ImageCache.GetImageWithCallBack(this._image, this.onImageLoaded.bind(this));
        }
    }

    public onImageLoaded(key: string, bmd: BitmapData): void {
        while (this.mcImage.numChildren) {
            this.mcImage.removeChildAt(0);
        }
        this.mcImage.addChild(new Bitmap(bmd));
    }

    public Hide(): void {
        if (Boolean(this) && Boolean(this.parent)) {
            this.parent.removeChild(this);
        }
    }

    public Resize(): void {
        GLOBAL.RefreshScreen();
        this.x = Math.floor(GLOBAL._SCREEN.x + 5 + 30);
        this.y = Math.floor(GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - this.mcHit.height - 10);
        if (Boolean(Chat._bymChat) && Boolean(Chat._bymChat.chatBox.background)) {
            this.y = Math.floor(Chat._bymChat.y + Chat._bymChat.chatBox.y + Chat._bymChat.chatBox.background.y - 53);
        }
    }
}
