import MouseEvent from "openfl/events/MouseEvent";

import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3FriendData } from "../data/MapRoom3FriendData";
import { MapRoom3RelocateMainYardPopup } from "../../../../MapRoom3RelocateMainYardPopup";
import { MapRoom3RelocatePopupDisplayList } from "./MapRoom3RelocatePopupDisplayList";

import { PLEASEWAIT } from "../../../../PLEASEWAIT";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getURLLoaderApi(): any { return require("../../../../URLLoaderApi").URLLoaderApi; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }


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
        this.titleText.htmlText = getKEYS().Get("mr3_relocate_main_yard_title");
        this.selectDescriptionText.htmlText = getKEYS().Get("mr3_relocate_main_yard_description_select");
        this.randomDescriptionText.htmlText = getKEYS().Get("mr3_relocate_main_yard_description_random");
        this.orText.htmlText = getKEYS().Get("mr3_relocate_main_yard_or");
        this.levelTitleText.htmlText = "<b>" + getKEYS().Get("mr3_relocate_main_yard_title_level") + "</b>";
        this.nameTitletext.htmlText = "<b>" + getKEYS().Get("mr3_relocate_main_yard_title_name") + "</b>";
        this.worldtTitleText.htmlText = "<b>" + getKEYS().Get("mr3_relocate_main_yard_title_world") + "</b>";
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
        getPOPUPS().Push(this);
        this.m_IsShowing = true;
        const url: string = getMapRoomManager().instance.mapRoom3URL + "getfriendinfo";
        new (getURLLoaderApi())().load(url, null, this.OnFriendInfoLoaded.bind(this));
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
        getPOPUPS().Next();
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
        if (getGLOBAL()._flags.nwm_relocate === "0") {
            getGLOBAL().Message(getKEYS().Get("mr3_relocate_confirmationOFF"), getKEYS().Get("mr3_relocate_confirmation_OK"), () => this.ConfirmRelocation(targetUserId));
        } else if (getGLOBAL()._flags.nwm_relocate === "1") {
            getGLOBAL().Message(getKEYS().Get("mr3_relocate_confirmation"), getKEYS().Get("mr3_relocate_confirmationyes"), () => this.ConfirmRelocation(targetUserId));
        }
    }

    private ConfirmRelocation(targetUserId: number = -1): void {
        this.Hide();
        PLEASEWAIT.Show(getKEYS().Get("wait_relocating"));
        const url: string = getMapRoomManager().instance.mapRoom3URL + "relocate";
        const params: Array<any> = [];
        if (targetUserId !== -1) {
            params.push(["userid", targetUserId]);
        }
        new (getURLLoaderApi())().load(url, params, this.OnRelocationSuccessful.bind(this), this.OnRelocationFailed.bind(this));
    }

    private OnRelocationSuccessful(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        if (data.error !== 0) {
            getGLOBAL().ErrorMessage("Error relocating main base, MapRoom3RelocatePopup::OnRelocationSuccessful");
            getLOGGER().Log("err", "Error relocating main base, MapRoom3RelocatePopup::OnRelocationSuccessful " + data.error);
            return;
        }
        getMapRoomManager().instance.OnMapRoom3RelocationSuccessful(data.mapheaderurl);
        getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, EnumYardType.PLAYER);
    }

    private OnRelocationFailed(data: Record<string, any>): void {
        PLEASEWAIT.Hide();
        getGLOBAL().ErrorMessage("Error relocating main base, MapRoom3RelocatePopup::OnRelocationFailed");
        getLOGGER().Log("err", "Error relocating main base, MapRoom3RelocatePopup::OnRelocationFailed " + data.error);
    }
}
