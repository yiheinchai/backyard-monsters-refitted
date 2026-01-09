import { MouseEvent } from "openfl/events/MouseEvent";

import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3FriendData } from "../data/MapRoom3FriendData";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { MapRoom3RelocateMainYardPopup } from "./MapRoom3RelocateMainYardPopup";
import { MapRoom3RelocatePopupDisplayList } from "./MapRoom3RelocatePopupDisplayList";
import { URLLoaderApi } from "../../URLLoaderApi";

import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { BASE } from "../../../../BASE";
import { POPUPS } from "../../../../POPUPS";
import { PLEASEWAIT } from "../../../../PLEASEWAIT";
import { LOGGER } from "../../../../LOGGER";

/**
 * Map room 3 relocate popup - main yard relocation popup.
 */
export class MapRoom3RelocatePopup extends MapRoom3RelocateMainYardPopup {
    private static s_Instance: MapRoom3RelocatePopup | null = null;
    public static readonly k_RELOCATE_BUTTONINFO: string = "btn_relocateYard";
    private static readonly k_MAX_FRIEND_ITEMS_TO_DISPLAY: number = 6;

    private m_LoadedFriendData: Array<MapRoom3FriendData> | null = null;
    private m_DisplayList: MapRoom3RelocatePopupDisplayList | null = null;
    private m_IsShowing: boolean = false;

    constructor() {
        super();
        this.titleText.htmlText = KEYS.Get("mr3_relocate_main_yard_title");
        this.selectDescriptionText.htmlText = KEYS.Get("mr3_relocate_main_yard_description_select");
        this.randomDescriptionText.htmlText = KEYS.Get("mr3_relocate_main_yard_description_random");
        this.orText.htmlText = KEYS.Get("mr3_relocate_main_yard_or");
        this.levelTitleText.htmlText = "<b>" + KEYS.Get("mr3_relocate_main_yard_title_level") + "</b>";
        this.nameTitletext.htmlText = "<b>" + KEYS.Get("mr3_relocate_main_yard_title_name") + "</b>";
        this.worldtTitleText.htmlText = "<b>" + KEYS.Get("mr3_relocate_main_yard_title_world") + "</b>";
        this.randomButton.SetupKey("btn_random");
        this.randomButton.addEventListener(MouseEvent.CLICK, this.OnRandomButtonClicked.bind(this), false, 0, true);
        this.contentsFrame.mouseEnabled = false;
        this.contentsMask.mouseEnabled = false;
    }

    public static get instance(): MapRoom3RelocatePopup {
        return MapRoom3RelocatePopup.s_Instance = MapRoom3RelocatePopup.s_Instance || new MapRoom3RelocatePopup();
    }

    public Show(): void {
        if (this.m_IsShowing === true) {
            return;
        }
        POPUPS.Push(this);
        this.m_IsShowing = true;
        const url: string = MapRoomManager.instance.mapRoom3URL + "getfriendinfo";
        new URLLoaderApi().load(url, null, this.OnFriendInfoLoaded.bind(this));
    }

    private OnFriendInfoLoaded(data: Record<string, any>): void {
        if (this.m_IsShowing === false) {
            return;
        }
        if (data === null || !data.hasOwnProperty("friends") || data.friends.length === 0) {
            return;
        }
        const count: number = data.friends.length;
        this.m_LoadedFriendData = new Array(count);
        for (let i = 0; i < count; i++) {
            this.m_LoadedFriendData[i] = new MapRoom3FriendData(data.friends[i]);
        }
        this.m_DisplayList = new MapRoom3RelocatePopupDisplayList(this.m_LoadedFriendData, MapRoom3RelocatePopup.k_MAX_FRIEND_ITEMS_TO_DISPLAY);
        this.contentsContainer.addChild(this.m_DisplayList);
    }

    public Hide(): void {
        if (this.m_IsShowing === false) {
            return;
        }
        POPUPS.Next();
        this.m_IsShowing = false;
        if (this.m_DisplayList !== null) {
            this.contentsContainer.removeChild(this.m_DisplayList);
            this.m_DisplayList.Clear();
            this.m_DisplayList = null;
        }
        if (this.m_LoadedFriendData !== null) {
            this.m_LoadedFriendData.length = 0;
            this.m_LoadedFriendData = null;
        }
    }

    private OnRandomButtonClicked(event: MouseEvent): void {
        this.Relocate();
    }

    public Relocate(targetUserId: number = -1): void {
        if (GLOBAL._flags.nwm_relocate === "0") {
            GLOBAL.Message(KEYS.Get("mr3_relocate_confirmationOFF"), KEYS.Get("mr3_relocate_confirmation_OK"), () => this.ConfirmRelocation(targetUserId));
        } else if (GLOBAL._flags.nwm_relocate === "1") {
            GLOBAL.Message(KEYS.Get("mr3_relocate_confirmation"), KEYS.Get("mr3_relocate_confirmationyes"), () => this.ConfirmRelocation(targetUserId));
        }
    }

    private ConfirmRelocation(targetUserId: number = -1): void {
        this.Hide();
        PLEASEWAIT.Show(KEYS.Get("wait_relocating"));
        const url: string = MapRoomManager.instance.mapRoom3URL + "relocate";
        const params: Array<any> = [];
        if (targetUserId !== -1) {
            params.push(["userid", targetUserId]);
        }
        new URLLoaderApi().load(url, params, this.OnRelocationSuccessful.bind(this), this.OnRelocationFailed.bind(this));
    }

    private OnRelocationSuccessful(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        if (data.error !== 0) {
            GLOBAL.ErrorMessage("Error relocating main base, MapRoom3RelocatePopup::OnRelocationSuccessful");
            LOGGER.Log("err", "Error relocating main base, MapRoom3RelocatePopup::OnRelocationSuccessful " + data.error);
            return;
        }
        MapRoomManager.instance.OnMapRoom3RelocationSuccessful(data.mapheaderurl);
        BASE.LoadBase(null, 0, 0, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.PLAYER);
    }

    private OnRelocationFailed(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        GLOBAL.ErrorMessage("Error relocating main base, MapRoom3RelocatePopup::OnRelocationFailed");
        LOGGER.Log("err", "Error relocating main base, MapRoom3RelocatePopup::OnRelocationFailed " + data.error);
    }
}
