import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Shape from "openfl/display/Shape";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import { TweenLite } from "../../../gs/TweenLite";

import { Chat } from "../chat/Chat";
import { ImageCache } from "../display/ImageCache";
import { EventRewardRibbon } from "../../../EventRewardRibbon";
import { IReplayableEventUI } from "./IReplayableEventUI";
import { MultiRewardEventsBar } from "../../../MultiRewardEventsBar";
import { ReplayableEvent } from "./ReplayableEvent";
import { ReplayableEventQuota } from "./ReplayableEventQuota";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }



/**
 * Multi-reward replayable event UI - displays progress bar with multiple reward tiers.
 */
export class MultiRewardReplayableEventUI extends MultiRewardEventsBar implements IReplayableEventUI {
    public static CLICKED_ACTION: string = "eventBarAction";
    public static CLICKED_INFO: string = "eventBarInfo";
    public static readonly k_REWARD_COLOR: number = 15924337;
    public static readonly k_PROGRESS_COLOR: number = 8567294;

    private _event: ReplayableEvent | null = null;
    private m_progressBarFill: Shape | null = null;
    private m_rewardGraphics: Array<RewardGraphics> = [];
    private k_BUFFER: number = 0.25;

    constructor() {
        super();
        this.m_rewardGraphics = [];
    }

    public get eventUI(): DisplayObject {
        return this;
    }

    public setup(event: ReplayableEvent): void {
        this._event = event;
        this.tScore.visible = false;
        this.tScore.mouseEnabled = false;
        this.buttonHelp.addEventListener(MouseEvent.CLICK, this.ShowInfoPopup.bind(this));
        this.buttonHelp.buttonMode = true;
        if (this._event.buttonCopy) {
            this.buttonAction.stop();
            this.buttonAction.addEventListener(MouseEvent.CLICK, this.ShowEventPopup.bind(this), false, 0, true);
            this.buttonAction.buttonMode = true;
            this.buttonActionLabel.text = this._event.buttonCopy;
            this.buttonActionLabel.mouseEnabled = false;
        } else {
            this.buttonActionLabel.visible = false;
            this.buttonAction.visible = false;
        }
        this.progressBarOverlay.visible = true;
        this.progressBarOverlay.mouseEnabled = false;
        if (this._event.imageURL) {
            ImageCache.GetImageWithCallBack(this._event.imageURL, this.onImageLoaded.bind(this));
        }
        if (this._event.titleImage) {
            ImageCache.GetImageWithCallBack(this._event.titleImage, this.onLogoLoaded.bind(this));
        }
        let rewardCount = 0;
        const maxRewards = 3;
        for (let i = 0; i < maxRewards; i++) {
            (this.getChildByName("reward" + i) as any).visible = false;
        }
        const rewardsCount = this._event.rewards.length;
        for (let i = 0; i < rewardsCount; i++) {
            const quota = this._event.rewards[i] as ReplayableEventQuota;
            if (!(quota.rewardID === null || quota.rewardID === "")) {
                const ribbonIndex = maxRewards - (rewardsCount - 1) + rewardCount;
                const ribbon = this.getChildByName("reward" + String(ribbonIndex - 1)) as EventRewardRibbon;
                if (ribbon === null) {
                    break;
                }
                ribbon.visible = true;
                ImageCache.GetImageWithCallBack(quota.imageURL, this.onRewardImageLoaded.bind(this), true, 4, "", [ribbon]);
                const previousQuota = rewardCount > 0 ? this._event.rewards[i - 1].quota / this._event.maxScore : 0;
                const quotaWidth = this._event.rewards[i].quota / this._event.maxScore - previousQuota;
                const fillSprite = new Sprite();
                fillSprite.x = (rewardCount > 0 ? this._event.rewards[i - 1].quota / this._event.maxScore * this.progressBarFillMask.width : 0) + 2;
                fillSprite.y = 1;
                fillSprite.graphics.beginFill(MultiRewardReplayableEventUI.k_REWARD_COLOR);
                fillSprite.graphics.drawRect(0, 0, quotaWidth * this.progressBarFillMask.width, this.progressBarFillMask.height - 2);
                this.progressBarFill.addChild(fillSprite);
                this.m_rewardGraphics.push(new RewardGraphics(fillSprite, ribbon));
                rewardCount++;
                if (rewardCount >= maxRewards) {
                    break;
                }
            }
        }
        this.m_progressBarFill = new Shape();
        this.m_progressBarFill.x += 2;
        this.progressBarFill.addChild(this.m_progressBarFill);
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    }

    private removedFromStage(event: Event): void {
        this.m_rewardGraphics = [];
    }

    public update(): void {
        const timeRemaining = this._event!.timeUntilNextDate;
        if (timeRemaining <= 0) {
            this.timeLabel.htmlText = "<b>DATE NOT INITIALIZED!</b>";
        } else {
            this.timeLabel.htmlText = "<b>" + getGLOBAL().ToTime(timeRemaining, true) + "</b>";
        }
        if (this._event!.hasEventStarted) {
            this.m_progressBarFill!.graphics.clear();
            this.m_progressBarFill!.graphics.beginFill(MultiRewardReplayableEventUI.k_PROGRESS_COLOR);
            this.m_progressBarFill!.graphics.drawRect(0, 0, this._event!.progress * this.progressBarFillMask.width, this.progressBarFillMask.height);
            this.m_progressBarFill!.graphics.endFill();
        }
        if (this._event!.buttonCopy) {
            this.buttonActionLabel.text = this._event!.buttonCopy;
        }
        this.tScore.htmlText = "<b>" + Math.max(this._event!.score, 0) + "/" + this._event!.maxScore + "</b>";
        this.Resize();
    }

    private Resize(): void {
        this.x = Math.floor(getGLOBAL()._SCREEN.x);
        this.y = Math.floor(getGLOBAL()._SCREEN.y + (getGLOBAL()._SCREEN.height - this.mcBackground.height));
        if (Chat._bymChat && Chat._bymChat.chatBox && Boolean(Chat._bymChat.chatBox.background)) {
            this.y = Math.floor(Chat._bymChat.y + Chat._bymChat.chatBox.y + Chat._bymChat.chatBox.background.y - this.mcBackground.height);
        }
    }

    private onImageLoaded(key: string, bmd: BitmapData): void {
        const img = new Bitmap(bmd);
        const container = new Sprite();
        container.addChild(img);
        container.mouseEnabled = false;
        container.mouseChildren = false;
        this.addChildAt(container, 0);
        container.y -= container.height + this.k_BUFFER;
    }

    private onLogoLoaded(key: string, bmd: BitmapData): void {
        const logo = new Bitmap(bmd);
        this.addChild(logo);
        logo.visible = true;
    }

    private onRewardImageLoaded(key: string, bmd: BitmapData, args: Array<any>): void {
        const ribbon = args[0] as EventRewardRibbon;
        while (ribbon.rewardImage0.numChildren) {
            ribbon.rewardImage0.removeChildAt(0);
        }
        ribbon.rewardImage0.addChild(new Bitmap(bmd));
        ribbon.visible = true;
    }

    private ShowEventPopup(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(MultiRewardReplayableEventUI.CLICKED_ACTION));
    }

    private ShowInfoPopup(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(MultiRewardReplayableEventUI.CLICKED_INFO));
    }
}

/**
 * Helper class for reward graphics hover effects.
 */
class RewardGraphics {
    public ribbon: EventRewardRibbon;
    public fill: Sprite;
    private _width: number;
    private _height: number;

    constructor(fillSprite: Sprite, ribbon: EventRewardRibbon) {
        this._width = fillSprite.width;
        this._height = fillSprite.height;
        this.ribbon = ribbon;
        this.fill = fillSprite;
        this.fill.addEventListener(MouseEvent.MOUSE_OVER, this.OnProgressBarSectionMouseOver.bind(this), false, 0, true);
        this.ribbon.addEventListener(MouseEvent.MOUSE_OVER, this.OnProgressBarSectionMouseOver.bind(this), false, 0, true);
        this.fill.addEventListener(MouseEvent.MOUSE_OUT, this.OnProgressBarSectionMouseOut.bind(this), false, 0, true);
        this.ribbon.addEventListener(MouseEvent.MOUSE_OUT, this.OnProgressBarSectionMouseOut.bind(this), false, 0, true);
        this.OnProgressBarSectionMouseOut();
        this.fill.buttonMode = true;
        this.ribbon.buttonMode = true;
    }

    protected OnProgressBarSectionMouseOut(event: Event | null = null): void {
        TweenLite.to(this.ribbon.rewardImage0, 0.25, { "y": 0 });
        TweenLite.to(this.ribbon.rewardRibbon0, 0.25, { "y": 0 });
        this.SendRewardToBack(this.ribbon);
        this.redraw(0);
    }

    protected OnProgressBarSectionMouseOver(event: Event): void {
        TweenLite.to(this.ribbon.rewardImage0, 0.25, { "y": -50 });
        TweenLite.to(this.ribbon.rewardRibbon0, 0.25, {
            "y": -50,
            "onComplete": this.BringRewardToFront.bind(this),
            "onCompleteParams": [this.ribbon]
        });
        this.redraw(1);
    }

    private redraw(alpha: number): void {
        this.fill.graphics.clear();
        this.fill.graphics.lineStyle(1, 11053224);
        this.fill.graphics.beginFill(MultiRewardReplayableEventUI.k_REWARD_COLOR, alpha);
        this.fill.graphics.drawRect(0, 0, this._width, this._height);
    }

    private BringRewardToFront(obj: DisplayObject): void {
    }

    private SendRewardToBack(obj: DisplayObject): void {
    }
}
