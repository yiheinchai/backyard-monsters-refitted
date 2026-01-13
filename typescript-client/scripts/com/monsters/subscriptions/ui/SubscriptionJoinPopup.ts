import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../../display/ImageCache";
import { SubscriptionHandler } from "../SubscriptionHandler";
import { subscriptions_promo_popup } from "../../../../subscriptions_promo_popup";

import { KEYS } from "../../../../KEYS";
import { GLOBAL } from "../../../../GLOBAL";
import { SOUNDS } from "../../../../SOUNDS";
import { POPUPSETTINGS } from "../../../../POPUPSETTINGS";

/**
 * Subscription join popup - Dave's Club promo popup.
 */
export class SubscriptionJoinPopup extends subscriptions_promo_popup {
    private readonly _DAVECLUB_IMAGEURL: string = "subscriptions/";
    private readonly _DAVECLUB_BENEFIT_IMAGEURL: Array<string> = [
        "daveClub_slot01.png",
        "daveClub_slot02.png",
        "daveClub_slot03.png",
        "daveClub_slot04.png",
        "daveClub_slot05.png",
        "daveClub_slot06.v2.png"
    ];
    public rewardIndex: number = 0;
    private circleNavigation: Array<any> = [];

    constructor() {
        super();
        POPUPSETTINGS.AlignToCenter(this);
        this.circleNavigation = [this.mcCircle1, this.mcCircle2, this.mcCircle3, this.mcCircle4, this.mcCircle5, this.mcCircle6];
        this.visible = false;
        this.setup();
    }

    public setup(): void {
        ImageCache.GetImageWithCallBack(this._DAVECLUB_IMAGEURL + "daveclub_promo_BG_buttons.v2.png", this.daveClubImageLoaded.bind(this), true, 1, "", [this.mcImageBG]);
        ImageCache.GetImageWithCallBack(this._DAVECLUB_IMAGEURL + "daveClub_promo_pricetag_995.png", this.daveClubImageLoaded.bind(this), true, 1, "", [this.mcImagePrice]);
        for (let i = 0; i < this.circleNavigation.length; i++) {
            this.circleNavigation[i].gotoAndStop("off");
        }
        this.tDescription1.htmlText = KEYS.Get("daveClub_promo_desc1");
        this.tDescription2.htmlText = KEYS.Get("daveClub_promo_desc2");
        this.mcArrowLeft.buttonMode = true;
        this.mcArrowLeft.mouseChildren = false;
        this.mcArrowLeft.addEventListener(MouseEvent.CLICK, this.onArrowClickPrev.bind(this));
        this.mcArrowRight.buttonMode = true;
        this.mcArrowRight.mouseChildren = false;
        this.mcArrowRight.addEventListener(MouseEvent.CLICK, this.onArrowClickNext.bind(this));
        this.bCancel.buttonMode = true;
        this.bCancel.mouseChildren = false;
        this.bCancel.addEventListener(MouseEvent.CLICK, this.onCancelClick.bind(this));
        this.bJoin.buttonMode = true;
        this.bJoin.mouseChildren = false;
        this.bJoin.addEventListener(MouseEvent.CLICK, this.onJoinClick.bind(this));
        this.changePortrait(0);
    }

    public update(): void {
        // Update handler
    }

    public changePortrait(index: number = 0): void {
        if (index < 0) {
            index = this._DAVECLUB_BENEFIT_IMAGEURL.length - 1;
        }
        if (index >= this._DAVECLUB_BENEFIT_IMAGEURL.length) {
            index = 0;
        }
        ImageCache.GetImageWithCallBack(this._DAVECLUB_IMAGEURL + this._DAVECLUB_BENEFIT_IMAGEURL[index], this.daveClubImageLoaded.bind(this), true, 1, "", [this.mcImageSlot]);
        this.rewardIndex = index;
        for (let i = 0; i < this.circleNavigation.length; i++) {
            if (i === this.rewardIndex) {
                (this.circleNavigation[i] as MovieClip).gotoAndStop("on");
            } else {
                (this.circleNavigation[i] as MovieClip).gotoAndStop("off");
            }
        }
    }

    private onArrowClickPrev(event: MouseEvent): void {
        this.changePortrait(this.rewardIndex - 1);
    }

    private onArrowClickNext(event: MouseEvent): void {
        this.changePortrait(this.rewardIndex + 1);
    }

    public onJoinClick(event: MouseEvent | null = null): void {
        console.log("|SubscriptionJoinPopup| - join clicked");
        this.dispatchEvent(new Event(SubscriptionHandler.JOIN));
    }

    public onCancelClick(event: MouseEvent | null = null): void {
        console.log("|SubscriptionJoinPopup| - cancel clicked");
        this.dispatchEvent(new Event(Event.CLOSE));
    }

    private daveClubImageLoaded(url: string, bitmapData: BitmapData, args: Array<any> = []): void {
        const container: MovieClip = args[0];
        if (container) {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
            const bitmap: Bitmap = new Bitmap(bitmapData);
            container.addChild(bitmap);
            container.visible = true;
        }
        if (!this.visible) {
            this.visible = true;
        }
    }

    public Hide(): void {
        this.mcArrowLeft.removeEventListener(MouseEvent.CLICK, this.onArrowClickPrev.bind(this));
        this.mcArrowRight.removeEventListener(MouseEvent.CLICK, this.onArrowClickNext.bind(this));
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.onCancelClick.bind(this));
        this.bJoin.removeEventListener(MouseEvent.CLICK, this.onJoinClick.bind(this));
        SOUNDS.Play("close");
    }

    public Resize(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
    }
}
