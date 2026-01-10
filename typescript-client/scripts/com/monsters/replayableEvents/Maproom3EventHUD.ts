import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import MouseEvent from "openfl/events/MouseEvent";

import { Chat } from "../../chat/Chat";
import { ImageCache } from "../../display/ImageCache";
import { EventStorePopup } from "../../event_store/EventStorePopup";
import { MapRoom3 } from "../../maproom3/MapRoom3";
import { IReplayableEventUI } from "./IReplayableEventUI";
import { ReplayableEvent } from "./ReplayableEvent";
import { ReplayableEventHandler } from "./ReplayableEventHandler";
import { MR3EventHUD_CLIP } from "./MR3EventHUD_CLIP";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";

/**
 * Map room 3 event HUD - displays event information in the map room.
 */
export class Maproom3EventHUD extends MR3EventHUD_CLIP implements IReplayableEventUI {
    private static readonly k_preEventState: number = 1;
    private static readonly k_duringEventState: number = 2;
    private static readonly k_postEventState: number = 3;

    private m_state: number = 0;
    private m_event: ReplayableEvent | null = null;
    private m_HUDImage: Bitmap | null = null;

    constructor() {
        super();
    }

    private getCurrentState(): number {
        if (this.m_event!.hasEventEnded) {
            return Maproom3EventHUD.k_postEventState;
        }
        if (this.m_event!.hasEventStarted) {
            return Maproom3EventHUD.k_duringEventState;
        }
        return Maproom3EventHUD.k_preEventState;
    }

    public get eventUI(): DisplayObject {
        return this;
    }

    public setup(event: ReplayableEvent): void {
        this.m_event = event;
        this.bInfo.Setup(KEYS.Get("btn_info"));
        this.updateState();
        this.update();
        this.mouseEnabled = false;
    }

    protected clickedInfoButton(event: MouseEvent): void {
        EventStorePopup.instance.Show(0);
    }

    public update(): void {
        if (this.m_state !== this.getCurrentState()) {
            this.updateState();
        }
        if (this.m_state >= Maproom3EventHUD.k_duringEventState) {
            this.tExperience.text = ">" + GLOBAL.FormatNumber(ReplayableEventHandler.eventXP) + "XP";
            this.tCountdown.text = GLOBAL.ToTime(this.m_event!.timeUntilNextDate, true, false, false);
        } else {
            this.tCountdown.text = GLOBAL.ToTime(this.m_event!.timeUntilNextDate, true);
        }
        this.resize();
    }

    private updateState(): void {
        this.m_state = this.getCurrentState();
        this.bInfo.addEventListener(MouseEvent.CLICK, this.clickedInfoButton.bind(this), false, 0, true);
        if (this.m_state >= Maproom3EventHUD.k_duringEventState) {
            this.gotoAndStop(2);
            this.tExperience.visible = true;
            ImageCache.GetImageWithCallBack(this.m_event!.eventHUDImageURL, this.loadedHUDImage.bind(this));
        } else {
            this.gotoAndStop(1);
            this.tExperience.visible = false;
            ImageCache.GetImageWithCallBack(this.m_event!.preEventHUDImageURL, this.loadedHUDImage.bind(this));
        }
    }

    private resize(): void {
        this.x = GLOBAL._SCREEN.x;
        if (Boolean(MapRoom3.mapRoom3WindowHUD) && Boolean(MapRoom3.mapRoom3WindowHUD.leftMenuButtonsBar)) {
            this.y = MapRoom3.mapRoom3WindowHUD.leftMenuButtonsBar.y;
            this.y -= this.height;
        } else if (Chat._bymChat && Chat._bymChat.chatBox && Boolean(Chat._bymChat.chatBox.background)) {
            this.y = Chat._bymChat.y + Chat._bymChat.chatBox.background.y;
            this.y -= this.height;
        } else {
            this.y = GLOBAL._SCREEN.y + (GLOBAL._SCREEN.height - this.height);
        }
    }

    private loadedHUDImage(url: string, bitmapData: BitmapData): void {
        if (this.m_HUDImage) {
            this.removeChild(this.m_HUDImage);
        }
        this.m_HUDImage = new Bitmap(bitmapData);
        this.addChildAt(this.m_HUDImage, 0);
    }
}
