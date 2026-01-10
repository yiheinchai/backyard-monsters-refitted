import Loader from "openfl/display/Loader";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";

import { MapRoom3FriendData } from "../data/MapRoom3FriendData";
import { MapRoom3RelocatePopup } from "./MapRoom3RelocatePopup";
import { MapRoom3RelocateMainYardPopupFriendItemDisplay } from "./MapRoom3RelocateMainYardPopupFriendItemDisplay";

import { KEYS } from "../../../../KEYS";

/**
 * Map room 3 relocate popup item display - displays a friend item for relocation.
 */
export class MapRoom3RelocatePopupItemDisplay extends MapRoom3RelocateMainYardPopupFriendItemDisplay {
    private static readonly PORTRAIT_WIDTH: number = 50;
    private static readonly PORTRAIT_HEIGHT: number = 50;

    private m_FriendToDisplay: MapRoom3FriendData | null;
    private m_ProfilePicture: Loader;

    constructor(friendData: MapRoom3FriendData) {
        super();
        this.m_FriendToDisplay = friendData;
        this.m_ProfilePicture = new Loader();
        this.m_ProfilePicture.load(new URLRequest("http://graph.facebook.com/" + this.m_FriendToDisplay.facebookId + "/picture"));
        this.m_ProfilePicture.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.OnProfilePictureIOErrorEvent.bind(this), false, 0, true);
        this.imageHolder.addChild(this.m_ProfilePicture);
        this.levelIcon.lv_txt.htmlText = "<b>" + this.m_FriendToDisplay.level + "</b>";
        this.nameText.htmlText = "<b>" + friendData.name + "</b>";
        this.nameText.mouseEnabled = false;
        const worldDescription: string = friendData.isInPlayersWorld ? KEYS.Get("mr3_relocate_main_yard_same") : KEYS.Get("mr3_relocate_main_yard_world", { "v1": friendData.world });
        this.worldText.htmlText = "<b>" + worldDescription + "</b>";
        this.worldText.mouseEnabled = false;
        this.coordinatesText.htmlText = "(" + friendData.baseX.toString() + "," + friendData.baseY.toString() + ")";
        this.coordinatesText.mouseEnabled = false;
        if (!friendData.isInPlayersWorld) {
            this.worldText.y = this.nameText.y;
            this.coordinatesText.visible = false;
        }
        this.relocateButton.SetupKey("btn_moveHere");
        this.relocateButton.addEventListener(MouseEvent.CLICK, this.OnRelocateButtonClicked.bind(this), false, 0, true);
        this.relocateButton.buttonMode = true;
    }

    private OnProfilePictureIOErrorEvent(event: IOErrorEvent): void {
        // Empty error handler
    }

    public Clear(): void {
        this.relocateButton.removeEventListener(MouseEvent.CLICK, this.OnRelocateButtonClicked.bind(this));
        this.m_ProfilePicture.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, this.OnProfilePictureIOErrorEvent.bind(this));
        this.imageHolder.removeChild(this.m_ProfilePicture);
        this.m_FriendToDisplay = null;
    }

    private OnRelocateButtonClicked(event: MouseEvent): void {
        if (this.m_FriendToDisplay !== null) {
            MapRoom3RelocatePopup.instance.Relocate(this.m_FriendToDisplay.userId);
        }
    }
}
