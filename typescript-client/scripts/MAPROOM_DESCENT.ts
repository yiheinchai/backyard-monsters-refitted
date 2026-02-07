import { PROCESS7 } from "./com/monsters/ai/PROCESS7";
import { TRIBES } from "./com/monsters/ai/TRIBES";
import { WMBASE } from "./com/monsters/ai/WMBASE";
import { Message } from "./com/monsters/mailbox/Message";
import { DescentMapRoom } from "./com/monsters/maproom_inferno/DescentMapRoom";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import ProgressEvent from "openfl/events/ProgressEvent";
import { INFERNOAPI } from "./INFERNOAPI";
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
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


export class MAPROOM_DESCENT {
    public static _mc: DescentMapRoom;
    public static _open: boolean;
    public static _inDescent: boolean = false;
    public static _descentLvl: number = 0;
    public static readonly _descentLvlMax: number = 14;
    public static _bases: Array<any> = [];
    public static _loot: any;
    public static _lastView: number = 0;
    public static _lastSort: number = 3;
    public static _lastSortReversed: number = 0;
    public static _visitingFriend: boolean = false;
    private static loadState: number;
    private static andShow: boolean = true;
    private static loadThenShow: boolean = false;
    private static bridge_obj: any;
    public static DEBUG_UNLOCKDESCENT: boolean = false;
    
    public static _descentTribe: any = {
        "id": 1,
        "name": getKEYS().Get("ai_descenttribe_name"),
        "process": PROCESS7,
        "type": 7, // getWMATTACK().TYPE_NERD - inlined to break circular dependency
        "taunt": getKEYS().Get("ai_descenttribe_taunt"),
        "splash": "popups/portrait_moloch.png",
        "description": getKEYS().Get("ai_descenttribe_description"),
        "succ": getKEYS().Get("ai_descenttribe_succ"),
        "succ_stream": getKEYS().Get("ai_descenttribe_succstream"),
        "fail": getKEYS().Get("ai_descenttribe_fail"),
        "profilepic": "monsters/tribe_dreadnaut_50.v2.jpg",
        "streampostpic": "tribe-dreadnaut.v2.png"
    };
    
    public static _initialized: boolean = false;
    public static _initing: boolean = false;

    constructor() {
        // Empty constructor
    }

    public static Setup(param1: boolean = false): void {
        MAPROOM_DESCENT._mc = null;
        MAPROOM_DESCENT.loadState = 0;
        MAPROOM_DESCENT._open = false;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            MAPROOM_DESCENT._visitingFriend = false;
            MAPROOM_DESCENT._descentLvl = getGLOBAL().StatGet("descentLvl");
            MAPROOM_DESCENT._inDescent = MAPROOM_DESCENT._descentLvl < MAPROOM_DESCENT._descentLvlMax ? true : false;
            MAPROOM_DESCENT._loot = {};
            MAPROOM_DESCENT.bridge_obj = {
                "Timestamp": getGLOBAL().Timestamp,
                "GLOBAL": GLOBAL,
                "BASE": BASE,
                "readyFunction": MAPROOM_DESCENT.onMapRoomReady,
                "ErrorMessage": getGLOBAL().ErrorMessage,
                "Log": getLOGGER().Log,
                "URLLoaderApi": URLLoaderApi,
                "Hide": MAPROOM_DESCENT.Hide,
                "truceShareHandler": MAPROOM_DESCENT.TruceSent,
                "playerBaseID": getBASE()._loadedBaseID,
                "playerBaseSeed": getBASE()._baseSeed,
                "_playerName": getLOGIN()._playerName,
                "_playerPic": getLOGIN()._playerPic,
                "LoadBase": getBASE().LoadBase,
                "MessageUI": Message,
                "HOUSING": HOUSING,
                "RequestTruce": MAPROOM_DESCENT.RequestTruce,
                "TruceSent": MAPROOM_DESCENT.TruceSent,
                "setLastView": MAPROOM_DESCENT.setLastView,
                "setLastSort": MAPROOM_DESCENT.setLastSort,
                "setLastSortReversed": MAPROOM_DESCENT.setLastSortReversed,
                "setVisitingFriend": MAPROOM_DESCENT.setVisitingFriend,
                "SOUNDS": SOUNDS,
                "BaseLevel": getBASE().BaseLevel,
                "scrollToBaseID": 0,
                "TUTORIAL": TUTORIAL,
                "WMBASE": WMBASE,
                "TRIBES": TRIBES,
                "KEYS": KEYS,
                "MAPROOM": MAPROOM_DESCENT
            };
            MAPROOM_DESCENT._initing = true;
            if (param1) {
                MAPROOM_DESCENT.loadThenShow = true;
            }
            INFERNOAPI.LoadInfernoData(getGLOBAL()._infBaseURL, 0, 0, "idescent");
            INFERNOAPI.addEventListenerStatic(INFERNOAPI.EVENT_DESCENTLOADED, MAPROOM_DESCENT.DescentDataLoaded, false, 0, true);
        }
    }

    private static DescentDataLoaded(param1: Event = null): void {
        INFERNOAPI.removeEventListenerStatic(INFERNOAPI.EVENT_DESCENTLOADED, MAPROOM_DESCENT.DescentDataLoaded);
        MAPROOM_DESCENT._initialized = true;
        MAPROOM_DESCENT._initing = false;
        if (MAPROOM_DESCENT.DescentLevel >= MAPROOM_DESCENT._descentLvlMax && MAPROOM_DESCENT.DescentPassed) {
            getINFERNOPORTAL().ToggleYard();
            return;
        }
        if (MAPROOM_DESCENT.loadThenShow) {
            MAPROOM_DESCENT.Show();
        }
    }

    public static Show(param1: MouseEvent = null): void {
        if (!MAPROOM_DESCENT._initialized) {
            return;
        }
        MAPROOM_DESCENT.bridge_obj._lastView = MAPROOM_DESCENT._lastView;
        MAPROOM_DESCENT.bridge_obj._lastSort = MAPROOM_DESCENT._lastSort;
        MAPROOM_DESCENT.bridge_obj._lastSortReversed = MAPROOM_DESCENT._lastSortReversed;
        MAPROOM_DESCENT.andShow = true;
        getGLOBAL().BlockerAdd();
        getSOUNDS().Play("click1");
        MAPROOM_DESCENT._open = true;
        MAPROOM_DESCENT.EnterDescent();
        if (MAPROOM_DESCENT.loadState != 2 && MAPROOM_DESCENT.loadState != 1) {
            MAPROOM_DESCENT._mc = new DescentMapRoom();
            MAPROOM_DESCENT._mc.init(MAPROOM_DESCENT.bridge_obj);
            getGLOBAL()._layerTop.addChild(MAPROOM_DESCENT._mc);
        } else if (MAPROOM_DESCENT.loadState == 2) {
            MAPROOM_DESCENT.ShowB();
        }
    }

    private static ShowB(): void {
        MAPROOM_DESCENT.andShow = false;
        getGLOBAL()._layerWindows.addChild(MAPROOM_DESCENT._mc);
        getGLOBAL().WaitHide();
    }

    public static EnterDescent(): void {
        if (!MAPROOM_DESCENT._inDescent) {
            MAPROOM_DESCENT._inDescent = true;
        }
    }

    public static ExitDescent(): void {
        if (MAPROOM_DESCENT._inDescent) {
            if (getBASE().isInfernoMainYardOrOutpost) {
                if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.WMATTACK || getGLOBAL().mode == getGLOBAL().e_BASE_MODE.IWMATTACK) {
                    // Empty block
                }
            }
        }
    }

    private static mapRoomProgress(param1: ProgressEvent): void {
        const _loc2_: number = param1.bytesLoaded / param1.bytesTotal * 100;
        PLEASEWAIT.MessageChange(_loc2_ + "%");
    }

    private static onMapRoomReady(): void {
        MAPROOM_DESCENT.loadState = 2;
        if (MAPROOM_DESCENT.andShow) {
            MAPROOM_DESCENT.ShowB();
        }
    }

    public static Hide(param1: MouseEvent = null): void {
        try {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            if (Boolean(MAPROOM_DESCENT._mc) && Boolean(MAPROOM_DESCENT._mc.parent)) {
                MAPROOM_DESCENT._mc.parent.removeChild(MAPROOM_DESCENT._mc);
            }
            MAPROOM_DESCENT._open = false;
            MAPROOM_DESCENT.ExitDescent();
            MAPROOM_DESCENT._mc = null;
            MAPROOM_DESCENT.loadState = 0;
            if (MAPROOM_DESCENT._initialized) {
                INFERNOAPI.RevertWmBases();
                MAPROOM_DESCENT._initialized = false;
            }
        } catch (e: any) {
            // Silently catch errors
        }
    }

    public static Tick(): void {
        if (Boolean(MAPROOM_DESCENT._mc) && Boolean(MAPROOM_DESCENT._mc.parent)) {
            MAPROOM_DESCENT._mc.Tick();
        }
    }

    public static RequestTruce(param1: string, param2: number): void {
        let mc: MovieClip = null;
        const name: string = param1;
        const baseid: number = param2;
        
        const Truce = function(param1: MouseEvent = null): void {
            const handleLoadSuccessful = function(param1: any): void {
                if (param1.error == 0) {
                    if (MAPROOM_DESCENT._mc) {
                        MAPROOM_DESCENT._mc.Get();
                    }
                } else {
                    getLOGGER().Log("err", "MAPROOM.RequestTruce: " + JSON.encode(param1));
                }
            };
            new (getURLLoaderApi())().load(getGLOBAL()._apiURL + "player/requesttruce", [["baseid", baseid], ["duration", 1209600], ["message", (mc as any).bMessage.text]], handleLoadSuccessful);
            getPOPUPS().Next();
            MAPROOM_DESCENT.TruceSent(name, (mc as any).bMessage.text);
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
        MAPROOM_DESCENT._visitingFriend = param1;
    }

    private static setLastSort(param1: number): void {
        MAPROOM_DESCENT._lastSort = param1;
        getGLOBAL().StatSet("mrls", MAPROOM._lastSort);
    }

    private static setLastView(param1: number): void {
        MAPROOM_DESCENT._lastView = param1;
        getGLOBAL().StatSet("mrlv", MAPROOM_DESCENT._lastView);
    }

    private static setLastSortReversed(param1: number): void {
        MAPROOM_DESCENT._lastSortReversed = param1;
        getGLOBAL().StatSet("mrlsr", MAPROOM._lastSortReversed);
    }

    public static get DescentLevel(): number {
        let _loc1_: number = MAPROOM_DESCENT._descentLvl;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            if (Boolean(WMBASE._descentBases) && WMBASE._descentBases.length > 0) {
                _loc1_ = WMBASE.CheckDescentProgress();
                MAPROOM_DESCENT._descentLvl = _loc1_;
                getGLOBAL().StatSet("descentLvl", MAPROOM_DESCENT._descentLvl);
            } else {
                _loc1_ = getGLOBAL().StatGet("descentLvl");
            }
        }
        return _loc1_;
    }

    public static get InDescent(): boolean {
        const _loc1_: boolean = false;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            MAPROOM_DESCENT._descentLvl = getGLOBAL().StatGet("descentLvl");
        }
        return MAPROOM_DESCENT._descentLvl < MAPROOM_DESCENT._descentLvlMax ? true : false;
    }

    public static get DescentPassed(): boolean {
        let _loc2_: number = 0;
        const _loc1_: boolean = false;
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().StatGet("descentLvl") < 1) {
            return false;
        }
        if (getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            _loc2_ = getGLOBAL().StatGet("descentLvl");
            MAPROOM_DESCENT._descentLvl = MAPROOM_DESCENT._descentLvl < _loc2_ ? _loc2_ : MAPROOM_DESCENT._descentLvl;
        }
        return MAPROOM_DESCENT._descentLvl >= MAPROOM_DESCENT._descentLvlMax;
    }
}
