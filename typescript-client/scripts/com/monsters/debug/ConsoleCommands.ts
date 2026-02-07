import Shape from "openfl/display/Shape";
import Event from "openfl/events/Event";
import GlowFilter from "openfl/filters/GlowFilter";
import ColorTransform from "openfl/geom/ColorTransform";

import { SecNum } from "../../cc/utils/SecNum";
import { BYMConfig } from "../configs/BYMConfig";
import { ChampionBase } from "../monsters/champions/ChampionBase";
import { RasterData } from "../rendering/RasterData";

import { CHAMPIONCAGEPOPUP } from "../../../CHAMPIONCAGEPOPUP";
import { CUSTOMATTACKS } from "../../../CUSTOMATTACKS";
import { GAME } from "../../../GAME";

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("./Console").Console; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }
function getBUY(): any { return require("../../../BUY").BUY; }
function getCHAMPIONCAGE(): any { return require("../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURELOCKER(): any { return require("../../../CREATURELOCKER").CREATURELOCKER; }
function getCREEPS(): any { return require("../../../CREEPS").CREEPS; }
function getCREATURES(): any { return require("../../../CREATURES").CREATURES; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getMAP(): any { return require("../../../MAP").MAP; }
function getPLANNER(): any { return require("../../../PLANNER").PLANNER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getSPECIALEVENT(): any { return require("../../../SPECIALEVENT").SPECIALEVENT; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }
function getWMATTACK(): any { return require("../../../WMATTACK").WMATTACK; }


/**
 * Debug console commands for development and testing.
 */
export class ConsoleCommands {
    constructor() {}

    public static initialize(): void {
        getConsole().registerCommand("unlockquest", ConsoleCommands.unlockQuest);
        getConsole().registerCommand("lockquest", ConsoleCommands.lockQuest);
        getConsole().registerCommand("lab", ConsoleCommands.creatureLab);
        getConsole().registerCommand("academy", ConsoleCommands.creatureAcademy);
        getConsole().registerCommand("setfeedtime", ConsoleCommands.setChampionFeedTime);
        getConsole().registerCommand("setstarvetime", ConsoleCommands.setChampionStarveTime);
        getConsole().registerCommand("tut_stage", ConsoleCommands.tutorialGetStage);
        getConsole().registerCommand("tutorialArrowRotation", ConsoleCommands.tutorialArrowRotation);
        getConsole().registerCommand("removeDP", ConsoleCommands.removeDamageProtection);
        getConsole().registerCommand("sam", ConsoleCommands.sam);
        getConsole().registerCommand("ROFLPWN", ConsoleCommands.roflpwn);
        getConsole().registerCommand("printMaxResources", ConsoleCommands.printMaxResources);
        getConsole().registerCommand("setKorathLevel", ConsoleCommands.setKorathLevel);
        getConsole().registerCommand("changeAlpha", ConsoleCommands.changeAlpha);
        getConsole().registerCommand("forceAFK", ConsoleCommands.forceAFK);
        getConsole().registerCommand("showbaseresources", ConsoleCommands.showBaseResources);
        getConsole().registerCommand("trojan", ConsoleCommands.spawnTrojan);
        getConsole().registerCommand("wmattack", ConsoleCommands.spawnWildMonsters);
        getConsole().registerCommand("toggleBuildingBases", ConsoleCommands.toggleBuildingBases);
        getConsole().registerCommand("toggleBuildingTops", ConsoleCommands.toggleBuildingTops);
        getConsole().registerCommand("toggleRenderer", ConsoleCommands.toggleRenderer);
        getConsole().registerCommand("rendererdebug", ConsoleCommands.showRendererDebug);
        getConsole().registerCommand("numBuildings", ConsoleCommands.showNumBuildings);
        getConsole().registerCommand("version", ConsoleCommands.showVersion);
        getConsole().registerCommand("printJS", ConsoleCommands.printJSCalls);
        getConsole().registerCommand("fullscreen", ConsoleCommands.toggleFullScreen);
        getConsole().registerCommand("giveChampion", ConsoleCommands.giveChampion);
        getConsole().registerCommand("deleteChamps", ConsoleCommands.deleteChampions);
    }

    private static sam(_param: any): string {
        const shape = new Shape();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.drawRect(getGLOBAL()._SCREEN.x, getGLOBAL()._SCREEN.y, getGLOBAL()._SCREEN.width, getGLOBAL()._SCREEN.height);
        shape.graphics.endFill();
        shape.filters = [new GlowFilter(0xFFFFFF, 1, 10, 10, 2, 1, true)];
        GAME._instance.stage.addChild(shape);
        
        shape.addEventListener(Event.ENTER_FRAME, (e: Event) => {
            (e.currentTarget as Shape).transform.colorTransform = new ColorTransform(Math.random(), Math.random(), Math.random());
            shape.x = getGLOBAL()._SCREEN.x;
            shape.y = getGLOBAL()._SCREEN.y;
            shape.width = getGLOBAL()._SCREEN.width + 100;
            shape.height = getGLOBAL()._SCREEN.height + 100;
        });
        return "";
    }

    private static roflpwn(_param: any): string {
        for (let i = 1; i <= getCHAMPIONCAGE()._guardians.length; i++) {
            getCHAMPIONCAGE()._guardians["G" + i].classType = getCHAMPIONCAGE().CLASS_TYPE_SPECIAL;
        }
        for (let i = 1; i <= getCHAMPIONCAGE()._guardians.length; i++) {
            getGLOBAL()._bCage.SpawnGuardian(6, 0, 0, i, 1000000000, "", 0, 3);
        }
        return "  lolol";
    }

    private static printMaxResources(_param: any): string {
        let result = "";
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (!getGLOBAL()._resources["r" + i + "max"]) break;
            result += "r" + i + ":" + getGLOBAL()._resources["r" + i + "max"] + " ";
        }
        return result;
    }

    private static deleteChampions(param: any): string {
        if (param) {
            return "This function is broken";
        }
        getGLOBAL()._playerGuardianData.length = 0;
        getBASE()._guardianData.length = 0;
        getCREATURES()._guardianList.length = 0;
        getCREEPS()._guardianList.length = 0;
        return "ALL champs have been destroyed, GLHF";
    }

    private static giveChampion(param: any): string {
        if (!param) return "Specify a champion type.";
        
        let cage: BFOUNDATION | null = null;
        for (const building of Object.values(getBASE()._buildingsAll)) {
            if (building instanceof getCHAMPIONCAGE()) {
                cage = building;
                break;
            }
        }
        
        if (cage) {
            (cage as any).SpawnGuardian(1, 0, 0, param, getCHAMPIONCAGE().GetGuardianProperty("G" + param, 1, "health"), "", 0, 1);
            return "Champion " + param + " given.";
        }
        return "No champion cage found.";
    }

    public static setChampionStarveTime(param: any): string {
        if (getCREATURES()._guardian) {
            const old = getCHAMPIONCAGE().STARVETIMER;
            getCHAMPIONCAGE().STARVETIMER = Number(param);
            getCREATURES()._guardian._feedTime = new SecNum(getGLOBAL().Timestamp());
            return "Champion starve time set to " + getCHAMPIONCAGE().STARVETIMER + " from " + old;
        }
        return "You dont have a champion... idiot";
    }

    public static setChampionFeedTime(param: any): string {
        if (getCREATURES()._guardian) {
            const oldTime = getCREATURES()._guardian._feedTime.Get();
            const newTime = getGLOBAL().Timestamp() + Number(param);
            getCREATURES()._guardian._feedTime = new SecNum(newTime);
            return "Champion feed time set to " + getGLOBAL().ToTime(newTime - getGLOBAL().Timestamp()) + " from " + getGLOBAL().ToTime(oldTime - getGLOBAL().Timestamp());
        }
        return "You dont have a champion... idiot";
    }

    public static setKorathLevel(param: number): string {
        if (getGLOBAL().mode !== "build") {
            return "ERROR: can only set level in your base!";
        }
        getCHAMPIONCAGE()._guardians["G4"].props.powerLevel = param;
        const data = getCHAMPIONCAGE().GetGuardianData(4);
        if (data) {
            data.pl = new SecNum(param);
        }
        return "Korath level targeted: " + param + " set: " + data.pl;
    }

    public static creatureAcademy(param1: string | null = null, param2: number = 0): string | null {
        if (param1 == null || param1 === "all") {
            for (const key in getCREATURELOCKER()._creatures) {
                getGLOBAL().player.m_upgrades[param1!].powerup = param2;
            }
            return null;
        }
        getGLOBAL().player.m_upgrades[param1].powerup = param2;
        return getKEYS().Get(getCREATURELOCKER()._creatures[param1].name) + " upgraded to " + param2;
    }

    public static creatureLab(param1: any, param2: number): string | null {
        if (param1 == null || param1 === "all") {
            for (const key in getCREATURELOCKER()._creatures) {
                getGLOBAL().player.m_upgrades[param1!] = { level: param2 };
            }
            return null;
        }
        getGLOBAL().player.m_upgrades[param1] = { level: param2 };
        return getKEYS().Get(getCREATURELOCKER()._creatures[param1].name) + " upgraded to " + param2;
    }

    public static changeAlpha(param: number = 1): string {
        getMAP()._GROUND.alpha = param;
        return param.toString();
    }

    public static unlockQuest(param: any): string | null {
        if (param == null || param === "all") {
            for (const quest of Object.values(getQUESTS()._quests)) {
                getQUESTS()._completed[(quest as any).id] = 1;
            }
            return null;
        }
        getQUESTS()._completed[param] = 1;
        return getKEYS().Get(getQUESTS().GetQuestByID(param).name);
    }

    public static lockQuest(param: any): string | null {
        if (param == null || param === "all") {
            for (const quest of Object.values(getQUESTS()._quests)) {
                delete getQUESTS()._completed[(quest as any).id];
            }
            return null;
        }
        delete getQUESTS()._completed[param];
        return getKEYS().Get(getQUESTS().GetQuestByID(param).name);
    }

    public static tutorialArrowRotation(param: number = 0): string {
        if (getTUTORIAL()._mcArrow) {
            getTUTORIAL()._mcArrow.mcArrow.rotation = param;
            return "getTUTORIAL()._mcArrow: Rotation - " + getTUTORIAL()._mcArrow.rotation;
        }
        return "getTUTORIAL()._mcArrow is NULL - there is no arrow to manipulate.";
    }

    public static tutorialGetStage(_param: number = 0): string {
        return "getTUTORIAL()._stage = " + getTUTORIAL()._stage;
    }

    public static forceAFK(param: number = 0): string {
        let type: string;
        if (param === 1) {
            getPOPUPS().AFK();
            type = "afk";
        } else {
            getPOPUPS().Timeout();
            type = "timeout";
        }
        return "forcing afk popup type: " + type;
    }

    public static printJSCalls(param: any = null): string {
        if (param !== 1 && param !== 0) {
            return "CONSOLE: printJS - ERROR - please provide a 1 or 0 value";
        }
        getGLOBAL().debugLogJSCalls = Boolean(param);
        return "CONSOLE: printJS set to " + getGLOBAL().debugLogJSCalls;
    }

    public static toggleFullScreen(_param: any = null): string {
        getGLOBAL().goFullScreen();
        return "CONSOLE: Toggle FullScreen, press ESC to exit";
    }

    public static removeDamageProtection(_param: any = null): string {
        getBASE()._isProtected = 0;
        getBASE().Save();
        return "CONSOLE: getBASE()._isProtected set to: " + Boolean(getBASE()._isProtected);
    }

    public static showBaseResources(_param: any = null): string {
        let result = "BASE RESOURCES:\n";
        for (const key in getBASE()._resources) {
            let value = 0;
            if (getBASE()._resources[key] instanceof SecNum) {
                value = getBASE()._resources[key].Get();
            } else {
                value = getBASE()._resources[key];
            }
            result += " | " + key + ": " + value;
        }
        result += "\n";
        if (getBASE()._iresources) {
            for (const key in getBASE()._iresources) {
                let value = 0;
                if (getBASE()._iresources[key] instanceof SecNum) {
                    value = getBASE()._iresources[key].Get();
                } else {
                    value = getBASE()._iresources[key];
                }
                result += " I " + key + ": " + value;
            }
        }
        return result;
    }

    public static spawnTrojan(_param: any = null): string {
        CUSTOMATTACKS.TrojanHorse();
        return "Creating CUSTOMATTACKS.TrojanHorse";
    }

    public static spawnWildMonsters(_param: any = null): string {
        getWMATTACK().Trigger(true);
        return "Creating Wild Monster attacks via getWMATTACK().Trigger.";
    }

    public static toggleBuildingBases(_param: any = null): string {
        getMAP()._BUILDINGBASES.visible = !getMAP()._BUILDINGBASES.visible;
        return "Building Bases Visible:" + getMAP()._BUILDINGBASES.visible;
    }

    public static toggleBuildingTops(_param: any = null): string {
        getMAP()._BUILDINGTOPS.visible = !getMAP()._BUILDINGTOPS.visible;
        return "Building Tops Visible:" + getMAP()._BUILDINGTOPS.visible;
    }

    public static toggleRenderer(_param: any = null): string {
        getMAP().instance.canvasContainer.visible = !getMAP().instance.canvasContainer.visible;
        return "Renderer set to:" + getMAP().instance.canvasContainer.visible.toString();
    }

    public static showRendererDebug(_param: any = null): string {
        if (!BYMConfig.instance.RENDERER_ON) {
            return "Renderer disabled";
        }
        // Renderer.debug = !Renderer.debug;
        return "RasterData:" + RasterData.rasterData.length + " | " + RasterData.visibleData.length + " | " + Math.floor(RasterData.totalMemory / 1024) + "Kb";
    }

    public static showNumBuildings(_param: any = null): string {
        let count = 0;
        for (const _ in getBASE()._buildingsAll) {
            count++;
        }
        return "NumBuildings:" + count.toString();
    }

    public static showVersion(_param: any = null): string {
        return "version:" + getGLOBAL()._version.Get() + " " + getGLOBAL()._softversion;
    }
}
