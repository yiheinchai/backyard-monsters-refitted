import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { ReplayableEventHandler } from "../replayableEvents/ReplayableEventHandler";
import { RewardHandler } from "../rewarding/RewardHandler";
import { EventStorePrize } from "./EventStorePrize";

import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { EventStoreItemSelectedPopupMC } from "../../../EventStoreItemSelectedPopupMC";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }


/**
 * Singleton lock for singleton pattern
 */
class SingletonLock {}

/**
 * Event store item selected popup - displays details of selected prize.
 */
export class EventStoreItemSelectedPopup extends EventStoreItemSelectedPopupMC {
    private static s_Instance: EventStoreItemSelectedPopup | null = null;

    private m_PrizeBeingDisplayed: EventStorePrize | null = null;
    private m_TitleImage: Bitmap | null = null;
    private m_PreviewImage: Bitmap | null = null;

    constructor(lock: SingletonLock) {
        super();
        this.m_TitleImage = new Bitmap();
        this.titleImageHolder.addChild(this.m_TitleImage);
        this.m_PreviewImage = new Bitmap();
        this.previewImageHolder.addChild(this.m_PreviewImage);
    }

    public static get instance(): EventStoreItemSelectedPopup {
        return EventStoreItemSelectedPopup.s_Instance = 
            EventStoreItemSelectedPopup.s_Instance || new EventStoreItemSelectedPopup(new SingletonLock());
    }

    public Show(prize: EventStorePrize): void {
        if (this.m_PrizeBeingDisplayed !== null) {
            this.Hide();
        }
        
        this.m_PrizeBeingDisplayed = prize;
        getGLOBAL().BlockerAdd(getGLOBAL()._layerTop);
        getPOPUPS().Add(this);
        POPUPSETTINGS.AlignToCenter(this);
        
        if (ReplayableEventHandler.activeEvent && ReplayableEventHandler.activeEvent.eventStoreTitleImage) {
            ImageCache.GetImageWithCallBack(ReplayableEventHandler.activeEvent.eventStoreTitleImage, this.OnTitleImageLoaded.bind(this));
        } else {
            ImageCache.GetImageWithCallBack("events/hellraisers/hellraisers_event_store_title.png", this.OnTitleImageLoaded.bind(this));
        }
        
        ImageCache.GetImageWithCallBack(this.m_PrizeBeingDisplayed.previewImageURL, this.OnPreviewImageLoaded.bind(this));
        
        const xpBalance = ReplayableEventHandler.eventXP;
        const prizeName = getKEYS().Get(this.m_PrizeBeingDisplayed.nameKey);
        
        this.prizeNameText.htmlText = getKEYS().Get("prize_title", { v1: prizeName });
        this.descriptionText.htmlText = getKEYS().Get(this.m_PrizeBeingDisplayed.descriptionKey);
        (this.experienceDisplay as any).xpBalanceText.htmlText = getKEYS().Get("event_store_xp_balance", { v1: xpBalance });
        this.xpCostText.htmlText = getKEYS().Get("event_store_cost", { v1: this.m_PrizeBeingDisplayed.xpCost });
        
        if (this.m_PrizeBeingDisplayed.lockIcon.visible) {
            this.purchaseButton.Setup(getKEYS().Get("event_store_prize_locked"));
            this.purchaseButton.Enabled = false;
        } else if (xpBalance < this.m_PrizeBeingDisplayed.xpCost) {
            const xpNeeded = this.m_PrizeBeingDisplayed.xpCost - xpBalance;
            this.purchaseButton.Setup(getKEYS().Get("event_store_xp_needed", { v1: xpNeeded }));
            this.purchaseButton.Enabled = false;
        } else {
            this.purchaseButton.Setup(getKEYS().Get("event_store_purchase"));
            this.purchaseButton.Enabled = true;
            this.purchaseButton.addEventListener(MouseEvent.CLICK, this.OnPurchaseClicked.bind(this));
        }
    }

    private OnTitleImageLoaded(path: string, data: BitmapData): void {
        if (this.m_TitleImage) {
            this.m_TitleImage.bitmapData = data;
            this.m_TitleImage.x = -(this.m_TitleImage.width * 0.5);
        }
    }

    private OnPreviewImageLoaded(path: string, data: BitmapData): void {
        if (this.m_PreviewImage) {
            this.m_PreviewImage.bitmapData = data;
        }
    }

    public Hide(): void {
        if (this.m_PrizeBeingDisplayed === null) {
            return;
        }
        
        this.purchaseButton.removeEventListener(MouseEvent.CLICK, this.OnPurchaseClicked.bind(this));
        this.purchaseButton.Enabled = false;
        
        if (this.m_TitleImage) {
            this.m_TitleImage.bitmapData = null;
        }
        if (this.m_PreviewImage) {
            this.m_PreviewImage.bitmapData = null;
        }
        
        getPOPUPS().Remove(this);
        getGLOBAL().BlockerRemove();
        this.m_PrizeBeingDisplayed = null;
    }

    private OnPurchaseClicked(e: MouseEvent): void {
        if (this.m_PrizeBeingDisplayed === null) {
            return;
        }
        if (this.m_PrizeBeingDisplayed.correspondingReward === null) {
            return;
        }
        if (ReplayableEventHandler.eventXP < this.m_PrizeBeingDisplayed.xpCost) {
            return;
        }
        
        ReplayableEventHandler.eventXP -= this.m_PrizeBeingDisplayed.xpCost;
        RewardHandler.instance.addAndApplyReward(this.m_PrizeBeingDisplayed.correspondingReward);
        
        if (this.m_PrizeBeingDisplayed.correspondingRewardValue) {
            this.m_PrizeBeingDisplayed.correspondingReward.value = this.m_PrizeBeingDisplayed.correspondingRewardValue;
        }
    }
}
