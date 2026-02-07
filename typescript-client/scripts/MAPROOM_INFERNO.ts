import { TRIBES } from "./com/monsters/ai/TRIBES";
import { WMBASE } from "./com/monsters/ai/WMBASE";
import { Message } from "./com/monsters/mailbox/Message";
import { MapRoom as InfernoMapRoom } from "./com/monsters/maproom_inferno/MapRoom";
import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";
import ProgressEvent from "openfl/events/ProgressEvent";
import { PLEASEWAIT } from "./PLEASEWAIT";
import { MAPROOM } from "./MAPROOM";
import { popup_truce } from "./popup_truce";
import { popup_truce_accept } from "./popup_truce_accept";
import { popup_truce_sent } from "./popup_truce_sent";
import { JSON } from "./JSON";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getBASE(): any { return require("./BASE").BASE; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


export class MAPROOM_INFERNO {
    public static _mc: InfernoMapRoom;
    public static _open: boolean;
    public static _lastView: number = 0;
    public static _lastSort: number = 3;
    public static _lastSortReversed: number = 0;
    public static _visitingFriend: boolean = false;
    private static loadState: number;
    private static andShow: boolean = true;
    private static bridge_obj: any;
    public static _initialized: boolean = false;

    constructor() {
        // Empty constructor
    }

    public static Setup(): void {
        MAPROOM_INFERNO._mc = null;
        MAPROOM_INFERNO.loadState = 0;
        MAPROOM_INFERNO._open = false;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            MAPROOM_INFERNO._visitingFriend = false;
            MAPROOM_INFERNO.bridge_obj = {
                "Timestamp": getGLOBAL().Timestamp,
                "GLOBAL": GLOBAL,
                "BASE": BASE,
                "readyFunction": MAPROOM_INFERNO.onMapRoomReady,
                "ErrorMessage": getGLOBAL().ErrorMessage,
                "Log": getLOGGER().Log,
                "URLLoaderApi": URLLoaderApi,
                "Hide": MAPROOM_INFERNO.Hide,
                "truceShareHandler": MAPROOM_INFERNO.TruceSent,
                "playerBaseID": getBASE()._loadedBaseID,
                "playerBaseSeed": getBASE()._baseSeed,
                "_playerName": getLOGIN()._playerName,
                "_playerPic": getLOGIN()._playerPic,
                "LoadBase": getBASE().LoadBase,
                "MessageUI": Message,
                "HOUSING": HOUSING,
                "RequestTruce": MAPROOM_INFERNO.RequestTruce,
                "TruceSent": MAPROOM_INFERNO.TruceSent,
                "setLastView": MAPROOM_INFERNO.setLastView,
                "setLastSort": MAPROOM_INFERNO.setLastSort,
                "setLastSortReversed": MAPROOM_INFERNO.setLastSortReversed,
                "setVisitingFriend": MAPROOM_INFERNO.setVisitingFriend,
                "SOUNDS": SOUNDS,
                "BaseLevel": getBASE().BaseLevel,
                "scrollToBaseID": 0,
                "TUTORIAL": TUTORIAL,
                "WMBASE": WMBASE,
                "TRIBES": TRIBES,
                "KEYS": KEYS,
                "MAPROOM": MAPROOM_INFERNO
            };
            MAPROOM_INFERNO._initialized = true;
        }
    }

    public static Show(param1: MouseEvent = null): void {
        if (getGLOBAL()._otherStats["mrlsr"] != undefined) {
            MAPROOM_INFERNO._lastSortReversed = getGLOBAL().StatGet("mrlsr");
        }
        if (getGLOBAL()._otherStats["mrls"] != undefined) {
            MAPROOM_INFERNO._lastSort = getGLOBAL().StatGet("mrls");
        }
        if (getGLOBAL()._otherStats["mrlv"] != undefined) {
            MAPROOM_INFERNO._lastView = getGLOBAL().StatGet("mrlv");
        }
        MAPROOM_INFERNO.bridge_obj._lastView = MAPROOM_INFERNO._lastView;
        MAPROOM_INFERNO.bridge_obj._lastSort = MAPROOM_INFERNO._lastSort;
        MAPROOM_INFERNO.bridge_obj._lastSortReversed = MAPROOM_INFERNO._lastSortReversed;
        MAPROOM_INFERNO.andShow = true;
        if (getGLOBAL()._flags.infernoMapBlocked == 0) {
            getGLOBAL().Message(getKEYS().Get("map_msg_disabled"));
            return;
        }
        if (getGLOBAL()._flags.maproom == 1) {
            getGLOBAL().BlockerAdd();
            getSOUNDS().Play("click1");
            MAPROOM_INFERNO._open = true;
            if (MAPROOM_INFERNO.loadState != 2 && MAPROOM_INFERNO.loadState != 1) {
                MAPROOM_INFERNO._mc = new InfernoMapRoom();
                MAPROOM_INFERNO._mc.init(MAPROOM_INFERNO.bridge_obj);
                getGLOBAL()._layerTop.addChild(MAPROOM_INFERNO._mc);
            } else if (MAPROOM_INFERNO.loadState == 2) {
                MAPROOM_INFERNO.ShowB();
            }
        } else {
            getGLOBAL().Message(getKEYS().Get("map_msg_disabled"));
        }
    }

    private static ShowB(): void {
        MAPROOM_INFERNO.andShow = false;
        getGLOBAL()._layerWindows.addChild(MAPROOM_INFERNO._mc);
        getGLOBAL().WaitHide();
    }

    private static mapRoomProgress(param1: ProgressEvent): void {
        const _loc2_: number = param1.bytesLoaded / param1.bytesTotal * 100;
        PLEASEWAIT.MessageChange(_loc2_ + "%");
    }

    private static onMapRoomReady(): void {
        MAPROOM_INFERNO.loadState = 2;
        if (MAPROOM_INFERNO.andShow) {
            MAPROOM_INFERNO.ShowB();
        }
    }

    public static Hide(param1: MouseEvent = null): void {
        try {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getGLOBAL()._layerWindows.removeChild(MAPROOM_INFERNO._mc);
            MAPROOM_INFERNO._open = false;
            MAPROOM_INFERNO._mc.Hide();
            MAPROOM_INFERNO._mc = null;
            MAPROOM_INFERNO.loadState = 0;
        } catch (e: any) {
            // Silently catch errors
        }
    }

    public static Tick(): void {
        if (Boolean(MAPROOM_INFERNO._mc) && Boolean(MAPROOM_INFERNO._mc.parent)) {
            MAPROOM_INFERNO._mc.Tick();
        }
    }

    public static RequestTruce(param1: string, param2: number): void {
        let mc: MovieClip = null;
        const name: string = param1;
        const baseid: number = param2;
        
        const Truce = function(param1: MouseEvent = null): void {
            const handleLoadSuccessful = function(param1: any): void {
                if (param1.error == 0) {
                    if (MAPROOM_INFERNO._mc) {
                        MAPROOM_INFERNO._mc.Get();
                    }
                } else {
                    getLOGGER().Log("err", "MAPROOM.RequestTruce: " + JSON.encode(param1));
                }
            };
            new (getURLLoaderApi())().load(getGLOBAL()._apiURL + "player/requesttruce", [["baseid", baseid], ["duration", 1209600], ["message", (mc as any).bMessage.text]], handleLoadSuccessful);
            getPOPUPS().Next();
            MAPROOM_INFERNO.TruceSent(name, (mc as any).bMessage.text);
        };
        
        mc = new popup_truce();
        (mc as any).tA.htmlText = "<b>" + getKEYS().Get("map_trucerequest") + " " + name + ".</b>";
        (mc as any).tB.htmlText = getKEYS().Get("map_trucerequest_desc");
        (mc as any).bSend.SetupKey("map_trucereq_btn");
        (mc as any).bSend.addEventListener(MouseEvent.CLICK, Truce);
        (mc as any).bMessage.htmlText = "";
        getPOPUPS().Push(mc);
    }

    public static TruceAccepted(param1: string, param2: string): void {
        let mc: MovieClip = null;
        let i: number = 0;
        let imgNumber: number = 0;
        const name: string = param1;
        const message: string = param2;
        
        const Share = function(param1: MouseEvent = null): void {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_truceaccept_streamtitle", { "v1": name }), getKEYS().Get("map_truceaccept_streambody"), "truceaccept" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        
        const Switch = function(param1: number): Function {
            const n: number = param1;
            return function(param1: MouseEvent = null): void {
                SwitchB(n);
            };
        };
        
        const SwitchB = function(param1: number): void {
            imgNumber = param1;
            i = 1;
            while (i < 4) {
                mc["mcIcon" + i].alpha = 0.4;
                ++i;
            }
            mc["mcIcon" + param1].alpha = 1;
        };
        
        mc = new popup_truce_accept();
        (mc as any).bShare.SetupKey("btn_share");
        (mc as any).bShare.addEventListener(MouseEvent.CLICK, Share);
        (mc as any).bShare.Highlight = true;
        (mc as any).tTitle.htmlText = getKEYS().Get("popup_desc_truceaccept");
        i = 1;
        while (i < 4) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i + 3);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, Switch(i));
            i++;
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static TruceSent(param1: string, param2: string): void {
        let mc: MovieClip = null;
        let i: number = 0;
        let imgNumber: number = 0;
        const name: string = param1;
        const message: string = param2;
        
        const Share = function(param1: MouseEvent = null): void {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_truceproposed_streamtitle", { "v1": name }), getKEYS().Get("map_truceproposed_streambody"), "truceaccept" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        
        const Switch = function(param1: number): Function {
            const n: number = param1;
            return function(param1: MouseEvent = null): void {
                SwitchB(n);
            };
        };
        
        const SwitchB = function(param1: number): void {
            imgNumber = param1;
            i = 1;
            while (i < 4) {
                mc["mcIcon" + i].alpha = 0.4;
                ++i;
            }
            mc["mcIcon" + param1].alpha = 1;
        };
        
        mc = new popup_truce_sent();
        (mc as any).bShare.SetupKey("btn_share");
        (mc as any).bShare.addEventListener(MouseEvent.CLICK, Share);
        (mc as any).bShare.Highlight = true;
        (mc as any).tTitle.htmlText = getKEYS().Get("popup_desc_trucesent");
        i = 1;
        while (i < 4) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i + 3);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, Switch(i));
            i++;
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static TruceRejected(param1: string, param2: string): void {
        let mc: MovieClip = null;
        let i: number = 0;
        let imgNumber: number = 0;
        const name: string = param1;
        const message: string = param2;
        
        const Share = function(param1: MouseEvent = null): void {
            getGLOBAL().CallJS("sendFeed", ["Truce", getKEYS().Get("map_trucerejected_streamtitle", { "v1": name }), getKEYS().Get("map_trucerejected_streambody"), "taunt" + imgNumber + ".png", 0]);
            getPOPUPS().Next();
        };
        
        const Switch = function(param1: number): Function {
            const n: number = param1;
            return function(param1: MouseEvent = null): void {
                SwitchB(n);
            };
        };
        
        const SwitchB = function(param1: number): void {
            imgNumber = param1;
            i = 1;
            while (i < 4) {
                mc["mcIcon" + i].alpha = 0.4;
                ++i;
            }
            mc["mcIcon" + param1].alpha = 1;
        };
        
        mc = new popup_truce_sent();
        (mc as any).bShare.SetupKey("btn_share");
        (mc as any).bShare.addEventListener(MouseEvent.CLICK, Share);
        (mc as any).bShare.Highlight = true;
        (mc as any).tTitle.htmlText = getKEYS().Get("popup_desc_trucesent");
        i = 1;
        while (i < 4) {
            mc["mcIcon" + i].buttonMode = true;
            mc["mcIcon" + i].gotoAndStop(i);
            mc["mcIcon" + i].addEventListener(MouseEvent.CLICK, Switch(i));
            i++;
        }
        getPOPUPS().Push(mc);
        SwitchB(1);
    }

    public static setVisitingFriend(param1: boolean): void {
        MAPROOM_INFERNO._visitingFriend = param1;
    }

    private static setLastSort(param1: number): void {
        MAPROOM_INFERNO._lastSort = param1;
        getGLOBAL().StatSet("mrls", MAPROOM._lastSort);
    }

    private static setLastView(param1: number): void {
        MAPROOM_INFERNO._lastView = param1;
        getGLOBAL().StatSet("mrlv", MAPROOM_INFERNO._lastView);
    }

    private static setLastSortReversed(param1: number): void {
        MAPROOM_INFERNO._lastSortReversed = param1;
        getGLOBAL().StatSet("mrlsr", MAPROOM._lastSortReversed);
    }
}
