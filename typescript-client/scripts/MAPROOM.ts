import { TRIBES } from './com/monsters/ai/TRIBES';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { Message } from './com/monsters/mailbox/Message';
import { MapRoom } from './com/monsters/maproom/MapRoom';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import { PLEASEWAIT } from './PLEASEWAIT';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }


/**
 * MAPROOM - Map Room Controller
 * Manages the world map interface and player-to-player interactions
 */
export class MAPROOM {
    public static readonly TYPE: number = 11;
    public static _mc: MapRoom | null = null;
    public static _open: boolean = false;
    public static _lastView: number = 0;
    public static _lastSort: number = 3;
    public static _lastSortReversed: number = 0;
    public static _visitingFriend: boolean = false;
    public static initMaproomSetup: boolean = false;
    private static loadState: number = 0;
    private static andShow: boolean = true;
    private static bridge_obj: any = {};

    constructor() {}

    public static Setup(): void {
        MAPROOM._mc = null;
        MAPROOM.loadState = 0;
        MAPROOM.initMaproomSetup = false;
        MAPROOM._open = false;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            MAPROOM._visitingFriend = false;
            MAPROOM.bridge_obj = {
                Timestamp: getGLOBAL().Timestamp,
                GLOBAL: GLOBAL,
                BASE: BASE,
                readyFunction: MAPROOM.onMapRoomReady,
                ErrorMessage: getGLOBAL().ErrorMessage,
                Log: getLOGGER().Log,
                URLLoaderApi: URLLoaderApi,
                Hide: MAPROOM.Hide,
                truceShareHandler: MAPROOM.TruceSent,
                playerBaseID: getBASE()._loadedBaseID,
                playerBaseSeed: getBASE()._baseSeed,
                _playerName: getLOGIN()._playerName,
                _playerPic: getLOGIN()._playerPic,
                LoadBase: getBASE().LoadBase,
                MessageUI: Message,
                HOUSING: HOUSING,
                RequestTruce: MAPROOM.RequestTruce,
                TruceSent: MAPROOM.TruceSent,
                setLastView: MAPROOM.setLastView,
                setLastSort: MAPROOM.setLastSort,
                setLastSortReversed: MAPROOM.setLastSortReversed,
                setVisitingFriend: MAPROOM.setVisitingFriend,
                SOUNDS: SOUNDS,
                BaseLevel: getBASE().BaseLevel,
                scrollToBaseID: 0,
                TUTORIAL: TUTORIAL,
                WMBASE: WMBASE,
                TRIBES: TRIBES,
                KEYS: KEYS,
                MAPROOM: MAPROOM
            };
        }
    }

    public static Show(event: MouseEvent | null = null): void {
        if (getGLOBAL()._otherStats["mrlsr"] !== undefined) {
            MAPROOM._lastSortReversed = getGLOBAL().StatGet("mrlsr");
        }
        if (getGLOBAL()._otherStats["mrls"] !== undefined) {
            MAPROOM._lastSort = getGLOBAL().StatGet("mrls");
        }
        if (getGLOBAL()._otherStats["mrlv"] !== undefined) {
            MAPROOM._lastView = getGLOBAL().StatGet("mrlv");
        }
        MAPROOM.bridge_obj._lastView = MAPROOM._lastView;
        MAPROOM.bridge_obj._lastSort = MAPROOM._lastSort;
        MAPROOM.bridge_obj._lastSortReversed = MAPROOM._lastSortReversed;
        MAPROOM.andShow = true;
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            if (getGLOBAL()._flags.maproom === 1) {
                if (getGLOBAL()._newBuilding) {
                    (getGLOBAL()._newBuilding as any).Cancel();
                }
                if (getGLOBAL()._bMap) {
                    if (getGLOBAL()._bMap._canFunction && MAPROOM.initMaproomSetup) {
                        getGLOBAL().BlockerAdd();
                        getSOUNDS().Play("click1");
                        MAPROOM._open = true;
                        if ([1, 2].indexOf(MAPROOM.loadState) === -1) {
                            MAPROOM._mc = new MapRoom();
                            MAPROOM._mc.init(MAPROOM.bridge_obj);
                            getGLOBAL()._layerTop.addChild(MAPROOM._mc as any);
                        } else if (MAPROOM.loadState === 2) {
                            MAPROOM.ShowB();
                        }
                    } else if (!getGLOBAL()._flags.discordOldEnough) {
                        getGLOBAL().Message(getKEYS().Get("newmap_discord_age"));
                    } else if (!MAPROOM.initMaproomSetup) {
                        getGLOBAL().Message(getKEYS().Get("newmap_init_setup"));
                    } else {
                        getGLOBAL().Message(getKEYS().Get("map_msg_damaged"));
                    }
                } else {
                    getGLOBAL().Message(getKEYS().Get("map_msg_notbuilt"));
                }
            } else {
                getGLOBAL().Message(getKEYS().Get("map_msg_disabled"));
            }
        }
    }

    private static ShowB(): void {
        MAPROOM.andShow = false;
        getGLOBAL()._layerWindows.addChild(MAPROOM._mc as any);
        getGLOBAL().WaitHide();
    }

    private static onMapRoomReady(): void {
        MAPROOM.loadState = 2;
        if (MAPROOM.andShow) {
            MAPROOM.ShowB();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        try {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getGLOBAL()._layerWindows.removeChild(MAPROOM._mc as any);
            MAPROOM._open = false;
            MAPROOM._mc!.Hide();
            MAPROOM._mc = null;
            MAPROOM.loadState = 0;
        } catch (e) {
            // Ignore errors
        }
    }

    public static Tick(): void {
        if (MAPROOM._mc && MAPROOM._mc.parent) {
            MAPROOM._mc.Tick();
        }
    }

    public static RequestTruce(name: string, baseid: number): void {
        const Truce = (event: MouseEvent | null = null): void => {
            const handleLoadSuccessful = (response: any): void => {
                if (response.error === 0) {
                    if (MAPROOM._mc) MAPROOM._mc.Get();
                } else {
                    getLOGGER().Log("err", "MAPROOM.RequestTruce: " + JSON.stringify(response));
                }
            };
            new (getURLLoaderApi())().load(getGLOBAL()._apiURL + "player/requesttruce", [["baseid", baseid], ["duration", 1209600], ["message", mc.bMessage.text]], handleLoadSuccessful);
            getPOPUPS().Next();
            MAPROOM.TruceSent(name, mc.bMessage.text);
        };
        
        const mc: any = new (GLOBAL as any).popup_truce();
        mc.tA.htmlText = "<b>" + getKEYS().Get("map_trucerequest") + " " + name + ".</b>";
        mc.tB.htmlText = getKEYS().Get("map_trucerequest_desc");
        mc.bSend.SetupKey("map_trucereq_btn");
        mc.bSend.addEventListener(MouseEvent.CLICK, Truce);
        mc.bMessage.htmlText = "";
        getPOPUPS().Push(mc);
    }

    public static TruceAccepted(name: string, message: string): void {
        let imgNumber: number = 0;
        const Share = (event: MouseEvent | null = null): void => {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_truceaccept_streamtitle", { v1: name }), getKEYS().Get("map_truceaccept_streambody"), "truceaccept" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        const SwitchB = (n: number): void => {
            imgNumber = n;
            for (let i = 1; i < 4; i++) mc["mcIcon" + i].alpha = 0.4;
            mc["mcIcon" + n].alpha = 1;
        };
        
        const mc: any = new (GLOBAL as any).popup_truce_accept();
        mc.bShare.SetupKey("btn_share");
        mc.bShare.addEventListener(MouseEvent.CLICK, Share);
        mc.bShare.Highlight = true;
        mc.tTitle.htmlText = getKEYS().Get("popup_desc_truceaccept");
        for (let i = 1; i < 4; i++) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i + 3);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, () => SwitchB(i));
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static TruceSent(name: string, message: string): void {
        let imgNumber: number = 0;
        const Share = (event: MouseEvent | null = null): void => {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_truceproposed_streamtitle", { v1: name }), getKEYS().Get("map_truceproposed_streambody"), "truceaccept" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        const SwitchB = (n: number): void => {
            imgNumber = n;
            for (let i = 1; i < 4; i++) mc["mcIcon" + i].alpha = 0.4;
            mc["mcIcon" + n].alpha = 1;
        };
        
        const mc: any = new (GLOBAL as any).popup_truce_sent();
        mc.bShare.SetupKey("btn_share");
        mc.bShare.addEventListener(MouseEvent.CLICK, Share);
        mc.bShare.Highlight = true;
        mc.tTitle.htmlText = getKEYS().Get("popup_desc_trucesent");
        for (let i = 1; i < 4; i++) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i + 3);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, () => SwitchB(i));
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static TruceRejected(name: string, message: string): void {
        let imgNumber: number = 0;
        const Share = (event: MouseEvent | null = null): void => {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_trucerejected_streamtitle", { v1: name }), getKEYS().Get("map_trucerejected_streambody"), "taunt" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        const SwitchB = (n: number): void => {
            imgNumber = n;
            for (let i = 1; i < 4; i++) mc["mcIcon" + i].alpha = 0.4;
            mc["mcIcon" + n].alpha = 1;
        };
        
        const mc: any = new (GLOBAL as any).popup_truce_sent();
        mc.bShare.SetupKey("btn_share");
        mc.bShare.addEventListener(MouseEvent.CLICK, Share);
        mc.bShare.Highlight = true;
        mc.tTitle.htmlText = getKEYS().Get("popup_desc_trucesent");
        for (let i = 1; i < 4; i++) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, () => SwitchB(i));
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static setVisitingFriend(visiting: boolean): void {
        MAPROOM._visitingFriend = visiting;
    }

    private static setLastSort(sort: number): void {
        MAPROOM._lastSort = sort;
        getGLOBAL().StatSet("mrls", MAPROOM._lastSort);
    }

    private static setLastView(view: number): void {
        MAPROOM._lastView = view;
        getGLOBAL().StatSet("mrlv", MAPROOM._lastView);
    }

    private static setLastSortReversed(reversed: number): void {
        MAPROOM._lastSortReversed = reversed;
        getGLOBAL().StatSet("mrlsr", MAPROOM._lastSortReversed);
    }
}
