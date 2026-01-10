import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../display/ImageCache";
import { ReplayableEventHandler } from "../replayableEvents/ReplayableEventHandler";
import { EventStoreDisplayGrid } from "./EventStoreDisplayGrid";

import { KEYS } from "../../../KEYS";
import { POPUPS } from "../../../POPUPS";

// Forward declarations
declare class EventStorePopupMC extends Sprite {
    titleImageHolder: any;
    tabButton1: any;
    tabButton2: any;
    displayContainer: any;
    experienceDisplay: any;
}

declare class ButtonBrown extends Sprite {
    SetupKey(key: string): void;
    Highlight: boolean;
}

/**
 * Singleton lock for singleton pattern
 */
class SingletonLock {}

/**
 * Event store popup - main popup for the event store.
 */
export class EventStorePopup extends EventStorePopupMC {
    private static s_Instance: EventStorePopup | null = null;

    private m_TabButtons: Array<ButtonBrown> = [];
    private m_TabDisplays: Array<DisplayObject> = [];
    private m_EventStoreDisplayGrid: EventStoreDisplayGrid | null = null;
    private m_TitleImage: Bitmap | null = null;
    private m_SelectedTabButton: ButtonBrown | null = null;
    private m_IsShowing: boolean = false;

    constructor(lock: SingletonLock) {
        super();
        
        this.m_TitleImage = new Bitmap();
        this.titleImageHolder.addChild(this.m_TitleImage);
        
        this.m_TabButtons = [];
        this.m_TabDisplays = [];
        
        const tabButton1 = this.tabButton1 as ButtonBrown;
        tabButton1.SetupKey("event_store_details_tab");
        tabButton1.addEventListener(MouseEvent.CLICK, this.OnTabButtonClicked.bind(this));
        this.m_TabButtons.push(tabButton1);
        
        const detailsSprite = new Sprite();
        this.m_TabDisplays.push(detailsSprite);
        this.displayContainer.addChild(detailsSprite);
        
        const tabButton2 = this.tabButton2 as ButtonBrown;
        tabButton2.SetupKey("event_store_prizes_tab");
        tabButton2.addEventListener(MouseEvent.CLICK, this.OnTabButtonClicked.bind(this));
        this.m_TabButtons.push(tabButton2);
        
        this.m_EventStoreDisplayGrid = new EventStoreDisplayGrid(this.displayContainer);
        this.m_TabDisplays.push(this.m_EventStoreDisplayGrid);
        this.displayContainer.addChild(this.m_EventStoreDisplayGrid);
    }

    public static get instance(): EventStorePopup {
        return EventStorePopup.s_Instance = 
            EventStorePopup.s_Instance || new EventStorePopup(new SingletonLock());
    }

    public Show(tabIndex: number = 1): void {
        if (this.m_IsShowing === true) {
            return;
        }
        
        if (ReplayableEventHandler.activeEvent === null) {
            // No active event
        }
        
        POPUPS.Push(this);
        this.m_IsShowing = true;
        
        if (ReplayableEventHandler.activeEvent && ReplayableEventHandler.activeEvent.eventStoreTitleImage) {
            ImageCache.GetImageWithCallBack(ReplayableEventHandler.activeEvent.eventStoreTitleImage, this.OnTitleImageLoaded.bind(this));
        } else {
            ImageCache.GetImageWithCallBack("events/hellraisers/hellraisers_event_store_title.png", this.OnTitleImageLoaded.bind(this));
        }
        
        const xpBalance = ReplayableEventHandler.eventXP;
        this.experienceDisplay.xpBalanceText.htmlText = KEYS.Get("event_store_xp_balance", { v1: xpBalance });
        
        if (this.m_EventStoreDisplayGrid) {
            this.m_EventStoreDisplayGrid.Populate();
        }
        
        this.SelectTab(this.m_TabButtons[tabIndex]);
    }

    private OnTitleImageLoaded(path: string, data: BitmapData): void {
        if (this.m_TitleImage) {
            this.m_TitleImage.bitmapData = data;
            this.m_TitleImage.x = -(this.m_TitleImage.width * 0.5);
        }
    }

    public Hide(): void {
        if (this.m_IsShowing === false) {
            return;
        }
        
        if (this.m_EventStoreDisplayGrid) {
            this.m_EventStoreDisplayGrid.Clear();
        }
        
        if (this.m_TitleImage) {
            this.m_TitleImage.bitmapData = null;
        }
        
        POPUPS.Next();
        this.m_IsShowing = false;
    }

    private OnTabButtonClicked(e: MouseEvent): void {
        const button = e.currentTarget as ButtonBrown;
        if (button === null || button === this.m_SelectedTabButton) {
            return;
        }
        this.SelectTab(button);
    }

    private SelectTab(button: ButtonBrown): void {
        const length = this.m_TabButtons.length;
        
        for (let i = 0; i < length; i++) {
            const tabButton = this.m_TabButtons[i];
            const tabDisplay = this.m_TabDisplays[i];
            
            if (tabButton === button) {
                tabButton.Highlight = true;
                tabDisplay.visible = true;
                this.m_SelectedTabButton = tabButton;
                this.displayContainer.gotoAndStop("tabSelected" + (i + 1));
            } else {
                tabButton.Highlight = false;
                tabDisplay.visible = false;
            }
        }
    }
}
