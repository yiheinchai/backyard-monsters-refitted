import DisplayObject from "openfl/display/DisplayObject";
import MouseEvent from "openfl/events/MouseEvent";

import { Chat } from "../chat/Chat";
import { MapRoom3 } from "../maproom3/MapRoom3";
import { UI_MISSIONMENU } from "../missions/UI_MISSIONMENU";
import { MonsterMadness } from "../replayableEvents/attacking/monsterMadness/MonsterMadness";
import { MonsterMadnessInfoBar } from "../replayableEvents/attacking/monsterMadness/MonsterMadnessInfoBar";
import { UI_MENU } from "../../../UI_MENU";
import { UI_NEXTWAVE } from "../../../UI_NEXTWAVE";
import { UI_NEXTWAVE_WM1 } from "../../../UI_NEXTWAVE_WM1";
import { popup_prefab_help } from "../../../popup_prefab_help";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getBUILDINGS(): any { return require("../../../BUILDINGS").BUILDINGS; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getSPECIALEVENT(): any { return require("../../../SPECIALEVENT").SPECIALEVENT; }
function getSTORE(): any { return require("../../../STORE").STORE; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }
function getUI2(): any { return require("../../../UI2").UI2; }



/**
 * UI_BOTTOM - manages the bottom UI bar with build, quests, store, and map buttons.
 */
export class UI_BOTTOM {
    public static _nextwave: UI_NEXTWAVE | null = null;
    public static _nextwave_wm1: UI_NEXTWAVE_WM1 | null = null;
    public static _mc: UI_MENU | null = null;
    public static _missions: UI_MISSIONMENU | null = null;
    public static _monsterMadness: MonsterMadnessInfoBar | null = null;
    private static _children: Array<DisplayObject> = [];

    constructor() {
    }

    public static Setup(): void {
        UI_BOTTOM._children = [];
        UI_BOTTOM._mc = new UI_MENU();
        if (!UI_BOTTOM._missions && !getGLOBAL()._flags.viximo) {
            UI_BOTTOM._missions = new UI_MISSIONMENU();
        }
        UI_BOTTOM._mc.Setup();
        UI_BOTTOM._mc.bBuild.addEventListener(MouseEvent.CLICK, getBUILDINGS().Show);
        UI_BOTTOM._mc.bQuests.addEventListener(MouseEvent.CLICK, getQUESTS().Show);
        UI_BOTTOM._mc.bStore.addEventListener(MouseEvent.CLICK, UI_BOTTOM.clickedStore);
        UI_BOTTOM._mc.bMap.addEventListener(MouseEvent.CLICK, getGLOBAL().ShowMap);
        if (UI_BOTTOM._missions) {
            getGLOBAL()._layerUI.addChild(UI_BOTTOM._missions);
        }
        if (UI_BOTTOM._mc) {
            getGLOBAL()._layerUI.addChild(UI_BOTTOM._mc);
        }
        if (getBASE().isOutpostMapRoom2Only) {
            UI_BOTTOM._mc.bKits.addEventListener(MouseEvent.CLICK, UI_BOTTOM.ShowStarterKits);
        }
        if (!getUI2()._showBottom) {
            UI_BOTTOM.Hide();
        }
        UI_BOTTOM._nextwave = new UI_NEXTWAVE();
        UI_BOTTOM._nextwave.Setup();
        if (UI_BOTTOM._nextwave) {
            getGLOBAL()._layerUI.addChild(UI_BOTTOM._nextwave);
        }
        UI_BOTTOM._nextwave.visible = false;

        UI_BOTTOM._nextwave_wm1 = new UI_NEXTWAVE_WM1();
        UI_BOTTOM._nextwave_wm1.Setup();
        if (UI_BOTTOM._nextwave_wm1) {
            getGLOBAL()._layerUI.addChild(UI_BOTTOM._nextwave_wm1);
        }
        UI_BOTTOM._nextwave_wm1.visible = false;
    }

    public static clickedStore(event: MouseEvent): void {
        if (getMapRoomManager().instance.isInMapRoom3 && !getBASE().isMainYardOrInfernoMainYard) {
            return;
        }
        getSTORE().Show(1, 1)(event);
    }

    public static ShowStarterKits(event: MouseEvent | null = null): void {
        getPOPUPS().Push(new popup_prefab_help());
    }

    public static Update(): void {
        let completedCount = 0;
        for (const completed of getQUESTS()._completed) {
            if (completed === 1) {
                completedCount += 1;
            }
        }
        UI_BOTTOM._mc!.bQuests.Alert = "";
        if (UI_BOTTOM._missions) {
            UI_BOTTOM._missions.Update();
        }
        if (UI_BOTTOM._mc!.bStore) {
            if (getMapRoomManager().instance.isInMapRoom3 && getBASE().isMainYardOrInfernoMainYard && Boolean(getGLOBAL()._bStore)) {
                UI_BOTTOM._mc!.bStore.Enabled = true;
            } else if (!getMapRoomManager().instance.isInMapRoom3 && (getGLOBAL()._bStore || !getBASE().isMainYard)) {
                UI_BOTTOM._mc!.bStore.Enabled = true;
            } else {
                UI_BOTTOM._mc!.bStore.Enabled = getBASE().isMainYardInfernoOnly;
            }
        }
        if (Boolean(getGLOBAL()._bMap) || !getBASE().isMainYard) {
            UI_BOTTOM._mc!.bMap.Enabled = true;
        } else {
            UI_BOTTOM._mc!.bMap.Enabled = false;
        }
        const inMR3NonMainYard = !getBASE().isMainYardOrInfernoMainYard && getMapRoomManager().instance.isInMapRoom3;
        UI_BOTTOM._mc!.bQuests.Enabled = !inMR3NonMainYard;
        UI_BOTTOM._mc!.bQuests.mouseEnabled = !inMR3NonMainYard;
        if (!UI_BOTTOM._mc!._sorted) {
            UI_BOTTOM._mc!.sortAll();
        }
    }

    public static Resize(): void {
        if (Boolean(UI_BOTTOM._mc) && UI_BOTTOM._mc!._loaded) {
            UI_BOTTOM._mc!.Resize();
        }
        if (UI_BOTTOM._nextwave) {
            UI_BOTTOM._nextwave.Resize();
        }
        if (UI_BOTTOM._nextwave_wm1) {
            UI_BOTTOM._nextwave_wm1.Resize();
        }
        if (getTUTORIAL()._stage < getTUTORIAL()._endstage) {
            getTUTORIAL().Resize();
        }
        if (MapRoom3.mapRoom3Window) {
            MapRoom3.mapRoom3WindowHUD.PositionRightMenuButtonsBar();
        }
    }

    public static Clear(): void {
        if (Boolean(UI_BOTTOM._mc) && Boolean(UI_BOTTOM._mc!.parent)) {
            UI_BOTTOM._mc!.bBuild.removeEventListener(MouseEvent.CLICK, getBUILDINGS().Show);
            UI_BOTTOM._mc!.bQuests.removeEventListener(MouseEvent.CLICK, getQUESTS().Show);
            UI_BOTTOM._mc!.bStore.removeEventListener(MouseEvent.CLICK, getSTORE().Show(1, 1));
            UI_BOTTOM._mc!.bMap.removeEventListener(MouseEvent.CLICK, getGLOBAL().ShowMap);
            UI_BOTTOM._mc!.parent.removeChild(UI_BOTTOM._mc!);
            UI_BOTTOM._mc = null;
        }
    }

    public static Show(): void {
        if (UI_BOTTOM._mc) {
            UI_BOTTOM._mc.visible = true;
        }
        if (UI_BOTTOM._missions) {
            UI_BOTTOM._missions.visible = true;
        }
        if (Chat.flagsShouldChatDisplay()) {
            if (Chat._bymChat) {
                Chat._bymChat.show();
            }
        }
        getSPECIALEVENT().updateNextWaveUI();
        if (MonsterMadness.infoBar) {
            MonsterMadness.addInfoBar();
        }
        UI_BOTTOM.showChildren();
    }

    public static Hide(): void {
        if (UI_BOTTOM._mc) {
            UI_BOTTOM._mc.bQuests.Alert = "";
            UI_BOTTOM._mc.visible = false;
        }
        if (!Chat.flagsShouldChatDisplay()) {
            if (Chat._bymChat) {
                Chat._bymChat.hide();
            }
        }
        if (UI_BOTTOM._nextwave) {
            UI_BOTTOM._nextwave.visible = false;
        }
        if (UI_BOTTOM._nextwave_wm1) {
            UI_BOTTOM._nextwave_wm1.visible = false;
        }
        if (MonsterMadness.infoBar) {
            MonsterMadness.removeInfoBar();
        }
        UI_BOTTOM.hideChildren();
    }

    private static hideChildren(): void {
        for (let i = 0; i < UI_BOTTOM._children.length; i++) {
            UI_BOTTOM._children[i].visible = false;
        }
    }

    private static showChildren(): void {
        for (let i = 0; i < UI_BOTTOM._children.length; i++) {
            UI_BOTTOM._children[i].visible = true;
        }
    }

    public static addChild(child: DisplayObject): void {
        UI_BOTTOM._children.push(child);
        getGLOBAL()._layerUI.addChild(child);
    }

    public static removeChild(child: DisplayObject): void {
        UI_BOTTOM._children.push(child);
        const idx = UI_BOTTOM._children.indexOf(child);
        if (idx) {
            UI_BOTTOM._children.splice(idx, 1);
        }
        if (child.parent) {
            child.parent.removeChild(child);
        }
    }
}
