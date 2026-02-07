import { INFERNO_EMERGENCE_ATTACKPOPUP } from "./com/monsters/ai/INFERNO_EMERGENCE_ATTACKPOPUP";
import { ImageCache } from "./com/monsters/display/ImageCache";
import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import { INFERNO_EMERGENCE_EVENT } from "./INFERNO_EMERGENCE_EVENT";
import { INFERNO_PORTAL_ATTACK } from "./INFERNO_PORTAL_ATTACK";
import { popup_infernoemerge_upgrade } from "./popup_infernoemerge_upgrade";
import { popup_infernoemerge_dialog } from "./popup_infernoemerge_dialog";
import { popup_infernoemerge_roundover } from "./popup_infernoemerge_roundover";
import { popup_infernoemerge_complete } from "./popup_infernoemerge_complete";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getBUILDINGOPTIONS(): any { return require("./BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getBASE(): any { return require("./BASE").BASE; }


export class INFERNO_EMERGENCE_POPUPS {
    public static _warningPopup: INFERNO_EMERGENCE_ATTACKPOPUP;
    public static _lvl: number;
    public static EVENT_DIALOGUE_START: string = "emerge_dialogue_started";
    public static EVENT_DIALOGUE_1: string = "emerge_start_1";
    public static EVENT_DIALOGUE_2: string = "emerge_start_2";
    public static EVENT_DIALOGUE_3: string = "emerge_start_3";
    public static EVENT_DIALOGUE_4: string = "emerge_start_4";
    public static EVENT_DIALOGUE_5: string = "emerge_start_5";
    public static EVENT_DIALOGUE_DEFAULT: string = "emerge_dialogue_default";
    public static INFERNO_UPGRADE_SHOWN: string = "infernoUpgradeShown";

    constructor() {
        // Empty constructor
    }

    public static ShowUpgrade(): void {
        let _loc1_: popup_infernoemerge_upgrade = null;
        _loc1_ = new popup_infernoemerge_upgrade();
        _loc1_.tTitle.htmlText = getKEYS().Get("emerge_upgrade_title");
        _loc1_.tBody.htmlText = getKEYS().Get("emerge_upgrade_body");
        _loc1_.bAction.buttonMode = true;
        _loc1_.bAction.useHandCursor = true;
        _loc1_.bAction.mouseChildren = false;
        _loc1_.bAction.Setup(getKEYS().Get("emerge_upgrade_btnaction"));
        if (getGLOBAL().townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT) {
            _loc1_.bAction.visible = false;
        }
        _loc1_.bAction.addEventListener(MouseEvent.CLICK, INFERNO_EMERGENCE_POPUPS.EmergeUpgradeCB);
        getPOPUPS().Push(_loc1_, INFERNO_EMERGENCE_POPUPS.ShownUpgradeCB);
    }

    private static EmergeUpgradeCB(param1: MouseEvent): void {
        getGLOBAL()._selectedBuilding = getGLOBAL().townHall;
        getBUILDINGOPTIONS().Show(getGLOBAL().townHall, "upgrade");
        getPOPUPS().Next();
    }

    public static ShowStart(): void {
        INFERNO_EMERGENCE_POPUPS.ShowDialogue(0);
    }

    public static ShownUpgradeCB(): void {
        // Empty callback
    }

    public static ShowDialogue(param1: number): MovieClip {
        let _loc2_: string = null;
        let _loc3_: Point = null;
        let _loc4_: string = null;
        let _loc5_: string = null;
        let _loc6_: string = null;
        let _loc7_: Function = null;
        INFERNO_EMERGENCE_POPUPS._lvl = param1;
        switch (param1) {
            case 0:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_intro");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 1:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt1");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 2:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt2");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 3:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt3");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 4:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt4");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 5:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt5");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
        }
        const _loc8_: MovieClip = getPOPUPS().DisplayDialogue(_loc4_, _loc5_, _loc6_, _loc2_, _loc3_, _loc7_);
        _loc8_.addEventListener(Event.REMOVED_FROM_STAGE, INFERNO_EMERGENCE_POPUPS.DialogueCB, false, 0, true);
        return _loc8_;
    }

    public static DialogueCB(param1: Event): void {
        const _loc2_: string = INFERNO_EMERGENCE_POPUPS.EVENT_DIALOGUE_DEFAULT;
        (param1.target as any).dispatchEvent(new Event(_loc2_));
        (param1.target as any).removeEventListener(Event.REMOVED_FROM_STAGE, INFERNO_EMERGENCE_POPUPS.DialogueCB);
    }

    public static ShowRSVP(param1: number): void {
        let showRSVP: popup_infernoemerge_dialog;
        let isEventOver: boolean;
        let portrait: string = null;
        let imgOffset: Point = null;
        let title: string = null;
        let line: string = null;
        let btnLabel: string = null;
        let action: Function = null;
        const lvl: number = param1;
        
        const RSVPLink = function(param1: MouseEvent): void {
            getGLOBAL().gotoURL("http://www.facebook.com/events/242085715856757/", null, true, null);
            getPOPUPS().Next();
        };
        
        INFERNO_EMERGENCE_POPUPS._lvl = lvl;
        switch (lvl) {
            case 0:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("cavern_pop1");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
            case 1:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("cavern_pop1");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
            case 2:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("cavern_pop2");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
            case 3:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("cavern_pop3");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
            case 4:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("cavern_pop4");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
            case 5:
                portrait = "portrait_moloch.png";
                imgOffset = new Point(-75, 50);
                title = "";
                line = getKEYS().Get("entercavernfail_popup");
                btnLabel = getKEYS().Get("emerge_RSVP");
                action = getPOPUPS().Next;
                break;
        }
        showRSVP = new popup_infernoemerge_dialog();
        showRSVP.tBody.htmlText = line;
        showRSVP.bAction.buttonMode = true;
        showRSVP.bAction.useHandCursor = true;
        showRSVP.bAction.mouseChildren = false;
        isEventOver = INFERNO_EMERGENCE_EVENT.isLastDay() || INFERNO_EMERGENCE_EVENT.IsPostEvent();
        if (!isEventOver) {
            showRSVP.bAction.Setup(btnLabel);
            showRSVP.bAction.addEventListener(MouseEvent.CLICK, RSVPLink);
        } else if (getGLOBAL().townHall._lvl.Get() < INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT) {
            showRSVP.bAction.Setup(getKEYS().Get("emerge_upgrade_btnaction"));
            showRSVP.bAction.addEventListener(MouseEvent.CLICK, INFERNO_EMERGENCE_POPUPS.EmergeUpgradeCB);
        } else {
            showRSVP.bAction.visible = false;
        }
        getPOPUPS().Push(showRSVP, null, null, "");
    }

    public static ShowStagePassed(param1: number): void {
        let completeRound: popup_infernoemerge_roundover = null;
        const lvl: number = param1;
        
        const imageCompleteRoundDialogue = function(param1: string, param2: BitmapData): void {
            const _loc3_: Bitmap = new Bitmap(param2);
            _loc3_.y = -_loc3_.height + 80;
            _loc3_.x = -100;
            completeRound.mcImage.addChild(_loc3_);
        };
        
        const EmergeBragCB = function(param1: MouseEvent): void {
            getGLOBAL().CallJS("sendFeed", ["emerge-defense", getKEYS().Get("ai_caverndefense_streamtitle"), getKEYS().Get("ai_caverndefense_streambody"), "emergence_streampost01A.png"]);
            getPOPUPS().Next();
        };
        
        completeRound = new popup_infernoemerge_roundover();
        completeRound.tBody.htmlText = getKEYS().Get("ai_caverndefense");
        completeRound.bAction.buttonMode = true;
        completeRound.bAction.useHandCursor = true;
        completeRound.bAction.mouseChildren = false;
        completeRound.bAction.Setup(getKEYS().Get("btn_brag"));
        completeRound.bAction.Highlight = true;
        completeRound.bAction.addEventListener(MouseEvent.CLICK, EmergeBragCB);
        ImageCache.GetImageWithCallBack("popups/" + "portrait_moloch.png", imageCompleteRoundDialogue);
        getPOPUPS().Push(completeRound, null, null, "");
        INFERNO_EMERGENCE_POPUPS._lvl = lvl;
        switch (lvl) {
            case 0:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(0);
                break;
            case 1:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(1);
                break;
            case 2:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(2);
                break;
            case 3:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(3);
                break;
            case 4:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(4);
                break;
            case 5:
                INFERNO_EMERGENCE_POPUPS.ShowDialogue(5);
                break;
        }
        INFERNO_EMERGENCE_EVENT.EndRound();
        if (lvl == getINFERNOPORTAL().GetMaxLevel()) {
            INFERNO_EMERGENCE_POPUPS.ShowComplete();
        }
    }

    public static ShowComplete(): void {
        let completeEmerge: popup_infernoemerge_complete = null;
        
        const imageCompleteEmerge = function(param1: string, param2: BitmapData): void {
            const _loc3_: Bitmap = new Bitmap(param2);
            completeEmerge.mcImage.addChild(_loc3_);
        };
        
        const portrait: string = "portrait_moloch.png";
        const imgOffset: Point = new Point(-75, 50);
        const title: string = "";
        const line: string = getKEYS().Get("ai_moloch_intro");
        const btnLabel: string = "Next";
        const action: Function = getPOPUPS().Next;
        completeEmerge = new popup_infernoemerge_complete();
        completeEmerge.tBody.htmlText = getKEYS().Get("entercavern_popup");
        if (getGLOBAL().townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT) {
            completeEmerge.bAction.buttonMode = true;
            completeEmerge.bAction.useHandCursor = true;
            completeEmerge.bAction.mouseChildren = false;
            completeEmerge.bAction.Highlight = true;
            completeEmerge.bAction.Setup(getBASE().isInfernoMainYardOrOutpost ? getKEYS().Get(getINFERNOPORTAL().EXIT_BUTTON) : getKEYS().Get(getINFERNOPORTAL().ENTER_BUTTON));
            completeEmerge.bAction.addEventListener(MouseEvent.CLICK, getINFERNOPORTAL().EnterPortal);
        } else {
            completeEmerge.bAction.visible = false;
            completeEmerge.bAction.mouseEnabled = false;
        }
        ImageCache.GetImageWithCallBack("popups/" + "popup_emergecomplete.v2.jpg", imageCompleteEmerge);
        getPOPUPS().Push(completeEmerge, null, null, "");
    }

    public static ShowWarning(param1: number): void {
        let _loc2_: string = "portrait_moloch.png";
        let _loc3_: Point = new Point(-75, 50);
        let _loc4_: string = "";
        let _loc5_: string = getKEYS().Get("ai_moloch_intro");
        let _loc6_: string = "Next";
        let _loc7_: Function = getPOPUPS().Next;
        switch (param1) {
            case 0:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_intro");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 1:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt1");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 2:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt2");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 3:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt3");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 4:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt4");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
            case 5:
                _loc2_ = "portrait_moloch.png";
                _loc3_ = new Point(-75, 50);
                _loc4_ = "";
                _loc5_ = getKEYS().Get("ai_moloch_taunt5");
                _loc6_ = "Next";
                _loc7_ = getPOPUPS().Next;
                break;
        }
        const _loc8_: Array<any> = INFERNO_PORTAL_ATTACK.GetVariableCreeps();
        if (!INFERNO_EMERGENCE_POPUPS._warningPopup) {
            INFERNO_EMERGENCE_POPUPS._warningPopup = new INFERNO_EMERGENCE_ATTACKPOPUP(_loc8_);
            getGLOBAL()._layerWindows.addChild(INFERNO_EMERGENCE_POPUPS._warningPopup);
            getBASE().Save();
        }
    }

    public static HideWarning(): void {
        if (INFERNO_EMERGENCE_POPUPS._warningPopup) {
            if (INFERNO_EMERGENCE_POPUPS._warningPopup.parent) {
                INFERNO_EMERGENCE_POPUPS._warningPopup.parent.removeChild(INFERNO_EMERGENCE_POPUPS._warningPopup);
            }
            INFERNO_EMERGENCE_POPUPS._warningPopup = null;
        }
    }

    public static DefenseBragCB(): void {
        // Empty callback
    }
}
