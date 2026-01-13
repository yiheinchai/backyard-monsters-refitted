import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { ReplayableEventHandler } from "../replayableEvents/ReplayableEventHandler";
import { Reward } from "../rewarding/Reward";
import { RewardHandler } from "../rewarding/RewardHandler";
import { RewardLibrary } from "../rewarding/RewardLibrary";
import { EventStoreItemSelectedPopup } from "./EventStoreItemSelectedPopup";

import { KEYS } from "../../../KEYS";
import { EventStoreDisplayItem } from "../../../EventStoreDisplayItem";

/**
 * Event store prize - represents a single prize in the event store.
 */
export class EventStorePrize extends EventStoreDisplayItem {
    private m_Id: string;
    private m_NameKey: string;
    private m_DescriptionKey: string;
    private m_ImageURL: string;
    private m_LockedImageURL: string;
    private m_PreviewImageURL: string;
    private m_CorrespondingReward: Reward | null = null;
    private m_CorrespondingRewardValue: number = 0;
    private m_XPCost: number;
    private m_Image: Bitmap | null = null;

    constructor(data: any) {
        super();
        
        this.m_Image = new Bitmap();
        this.m_Id = data.id;
        this.m_NameKey = data.name_key;
        this.m_DescriptionKey = data.description_key;
        this.m_ImageURL = data.image;
        this.m_LockedImageURL = data.locked_image;
        this.m_PreviewImageURL = data.preview_image;
        this.m_XPCost = data.xpcost;
        
        this.m_Image = new Bitmap();
        this.buttonMode = true;
        
        this.nameText.htmlText = KEYS.Get(this.m_NameKey);
        this.imageHolder.addChild(this.m_Image);
        
        this.addEventListener(MouseEvent.CLICK, this.OnClicked.bind(this), false, 0, true);
        
        const xpBalance = ReplayableEventHandler.eventXP;
        
        if (xpBalance < this.m_XPCost) {
            this.xpText.htmlText = xpBalance + "/" + this.m_XPCost;
            this.xpBarBlue.visible = false;
            this.xpBarGreen.visible = true;
            this.xpBarYellow.visible = false;
        } else {
            this.xpText.htmlText = KEYS.Get("event_store_prize_unlocked");
            this.xpBarBlue.visible = false;
            this.xpBarGreen.visible = false;
            this.xpBarYellow.visible = true;
        }
        
        const rewardId = String(data.correspondingRewardId);
        this.m_CorrespondingRewardValue = data.correspondingRewardValue;
        this.m_CorrespondingReward = RewardHandler.instance.getRewardByID(rewardId);
        
        if (this.m_CorrespondingReward !== null && this.m_CorrespondingReward.value >= this.m_CorrespondingRewardValue) {
            this.lockIcon.visible = false;
            this.tickIcon.visible = true;
            this.xpBarBlue.visible = true;
            this.xpBarGreen.visible = false;
            this.xpBarYellow.visible = false;
            this.xpText.htmlText = KEYS.Get("event_store_prize_purchased");
            ImageCache.GetImageWithCallBack(this.m_ImageURL, this.OnImageLoaded.bind(this));
            return;
        }
        
        if (this.m_CorrespondingReward === null) {
            this.m_CorrespondingReward = RewardLibrary.getRewardByID(rewardId);
        }
        
        if (this.m_CorrespondingReward === null) {
            this.lockIcon.visible = true;
            this.tickIcon.visible = false;
            ImageCache.GetImageWithCallBack(this.m_LockedImageURL, this.OnImageLoaded.bind(this));
            return;
        }
        
        const requiredRewardId = String(data.requiredReward);
        if (requiredRewardId === null || requiredRewardId === "") {
            this.lockIcon.visible = false;
            this.tickIcon.visible = false;
            ImageCache.GetImageWithCallBack(this.m_ImageURL, this.OnImageLoaded.bind(this));
            return;
        }
        
        const requiredReward = RewardHandler.instance.getRewardByID(requiredRewardId);
        const requiredRewardValue = Number(data.requiredRewardValue);
        
        if (requiredReward === null || requiredReward.value < requiredRewardValue) {
            this.lockIcon.visible = true;
            this.tickIcon.visible = false;
            ImageCache.GetImageWithCallBack(this.m_LockedImageURL, this.OnImageLoaded.bind(this));
            return;
        }
        
        this.lockIcon.visible = false;
        this.tickIcon.visible = false;
        ImageCache.GetImageWithCallBack(this.m_ImageURL, this.OnImageLoaded.bind(this));
    }

    public get id(): string {
        return this.m_Id;
    }

    public get nameKey(): string {
        return this.m_NameKey;
    }

    public get descriptionKey(): string {
        return this.m_DescriptionKey;
    }

    public get imageURL(): string {
        return this.m_ImageURL;
    }

    public get lockedImageURL(): string {
        return this.m_LockedImageURL;
    }

    public get previewImageURL(): string {
        return this.m_PreviewImageURL;
    }

    public get correspondingReward(): Reward | null {
        return this.m_CorrespondingReward;
    }

    public get correspondingRewardValue(): number {
        return this.m_CorrespondingRewardValue;
    }

    public get xpCost(): number {
        return this.m_XPCost;
    }

    private OnImageLoaded(path: string, data: BitmapData): void {
        if (this.m_Image !== null) {
            this.m_Image.bitmapData = data;
        }
    }

    public Destroy(): void {
        this.removeEventListener(MouseEvent.CLICK, this.OnClicked.bind(this));
        this.imageHolder.removeChild(this.m_Image);
        if (this.m_Image) {
            this.m_Image.bitmapData = null;
            this.m_Image = null;
        }
        this.m_CorrespondingReward = null;
    }

    private OnClicked(e: MouseEvent): void {
        EventStoreItemSelectedPopup.instance.Show(this);
    }
}
