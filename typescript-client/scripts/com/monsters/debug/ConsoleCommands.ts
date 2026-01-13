import Shape from "openfl/display/Shape";
import Event from "openfl/events/Event";
import GlowFilter from "openfl/filters/GlowFilter";
import ColorTransform from "openfl/geom/ColorTransform";

import { Console } from "./Console";
import { SecNum } from "../../cc/utils/SecNum";
import { BYMConfig } from "../configs/BYMConfig";
import { ChampionBase } from "../monsters/champions/ChampionBase";
import { RasterData } from "../rendering/RasterData";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BUY } from "../../../BUY";
import { CHAMPIONCAGE } from "../../../CHAMPIONCAGE";
import { CHAMPIONCAGEPOPUP } from "../../../CHAMPIONCAGEPOPUP";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { CREEPS } from "../../../CREEPS";
import { CREATURES } from "../../../CREATURES";
import { CUSTOMATTACKS } from "../../../CUSTOMATTACKS";
import { GAME } from "../../../GAME";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAP } from "../../../MAP";
import { PLANNER } from "../../../PLANNER";
import { POPUPS } from "../../../POPUPS";
import { QUESTS } from "../../../QUESTS";
import { SPECIALEVENT } from "../../../SPECIALEVENT";
import { TUTORIAL } from "../../../TUTORIAL";
import { WMATTACK } from "../../../WMATTACK";

/**
 * Debug console commands for development and testing.
 */
export class ConsoleCommands {
    constructor() {}

    public static initialize(): void {
        Console.registerCommand("unlockquest", ConsoleCommands.unlockQuest);
        Console.registerCommand("lockquest", ConsoleCommands.lockQuest);
        Console.registerCommand("lab", ConsoleCommands.creatureLab);
        Console.registerCommand("academy", ConsoleCommands.creatureAcademy);
        Console.registerCommand("setfeedtime", ConsoleCommands.setChampionFeedTime);
        Console.registerCommand("setstarvetime", ConsoleCommands.setChampionStarveTime);
        Console.registerCommand("tut_stage", ConsoleCommands.tutorialGetStage);
        Console.registerCommand("tutorialArrowRotation", ConsoleCommands.tutorialArrowRotation);
        Console.registerCommand("removeDP", ConsoleCommands.removeDamageProtection);
        Console.registerCommand("sam", ConsoleCommands.sam);
        Console.registerCommand("ROFLPWN", ConsoleCommands.roflpwn);
        Console.registerCommand("printMaxResources", ConsoleCommands.printMaxResources);
        Console.registerCommand("setKorathLevel", ConsoleCommands.setKorathLevel);
        Console.registerCommand("changeAlpha", ConsoleCommands.changeAlpha);
        Console.registerCommand("forceAFK", ConsoleCommands.forceAFK);
        Console.registerCommand("showbaseresources", ConsoleCommands.showBaseResources);
        Console.registerCommand("trojan", ConsoleCommands.spawnTrojan);
        Console.registerCommand("wmattack", ConsoleCommands.spawnWildMonsters);
        Console.registerCommand("toggleBuildingBases", ConsoleCommands.toggleBuildingBases);
        Console.registerCommand("toggleBuildingTops", ConsoleCommands.toggleBuildingTops);
        Console.registerCommand("toggleRenderer", ConsoleCommands.toggleRenderer);
        Console.registerCommand("rendererdebug", ConsoleCommands.showRendererDebug);
        Console.registerCommand("numBuildings", ConsoleCommands.showNumBuildings);
        Console.registerCommand("version", ConsoleCommands.showVersion);
        Console.registerCommand("printJS", ConsoleCommands.printJSCalls);
        Console.registerCommand("fullscreen", ConsoleCommands.toggleFullScreen);
        Console.registerCommand("giveChampion", ConsoleCommands.giveChampion);
        Console.registerCommand("deleteChamps", ConsoleCommands.deleteChampions);
    }

    private static sam(_param: any): string {
        const shape = new Shape();
        shape.graphics.beginFill(0xFFFFFF);
        shape.graphics.drawRect(GLOBAL._SCREEN.x, GLOBAL._SCREEN.y, GLOBAL._SCREEN.width, GLOBAL._SCREEN.height);
        shape.graphics.endFill();
        shape.filters = [new GlowFilter(0xFFFFFF, 1, 10, 10, 2, 1, true)];
        GAME._instance.stage.addChild(shape);
        
        shape.addEventListener(Event.ENTER_FRAME, (e: Event) => {
            (e.currentTarget as Shape).transform.colorTransform = new ColorTransform(Math.random(), Math.random(), Math.random());
            shape.x = GLOBAL._SCREEN.x;
            shape.y = GLOBAL._SCREEN.y;
            shape.width = GLOBAL._SCREEN.width + 100;
            shape.height = GLOBAL._SCREEN.height + 100;
        });
        return "";
    }

    private static roflpwn(_param: any): string {
        for (let i = 1; i <= CHAMPIONCAGE._guardians.length; i++) {
            CHAMPIONCAGE._guardians["G" + i].classType = CHAMPIONCAGE.CLASS_TYPE_SPECIAL;
        }
        for (let i = 1; i <= CHAMPIONCAGE._guardians.length; i++) {
            GLOBAL._bCage.SpawnGuardian(6, 0, 0, i, 1000000000, "", 0, 3);
        }
        return "  lolol";
    }

    private static printMaxResources(_param: any): string {
        let result = "";
        for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
            if (!GLOBAL._resources["r" + i + "max"]) break;
            result += "r" + i + ":" + GLOBAL._resources["r" + i + "max"] + " ";
        }
        return result;
    }

    private static deleteChampions(param: any): string {
        if (param) {
            return "This function is broken";
        }
        GLOBAL._playerGuardianData.length = 0;
        BASE._guardianData.length = 0;
        CREATURES._guardianList.length = 0;
        CREEPS._guardianList.length = 0;
        return "ALL champs have been destroyed, GLHF";
    }

    private static giveChampion(param: any): string {
        if (!param) return "Specify a champion type.";
        
        let cage: BFOUNDATION | null = null;
        for (const building of Object.values(BASE._buildingsAll)) {
            if (building instanceof CHAMPIONCAGE) {
                cage = building;
                break;
            }
        }
        
        if (cage) {
            (cage as any).SpawnGuardian(1, 0, 0, param, CHAMPIONCAGE.GetGuardianProperty("G" + param, 1, "health"), "", 0, 1);
            return "Champion " + param + " given.";
        }
        return "No champion cage found.";
    }

    public static setChampionStarveTime(param: any): string {
        if (CREATURES._guardian) {
            const old = CHAMPIONCAGE.STARVETIMER;
            CHAMPIONCAGE.STARVETIMER = Number(param);
            CREATURES._guardian._feedTime = new SecNum(GLOBAL.Timestamp());
            return "Champion starve time set to " + CHAMPIONCAGE.STARVETIMER + " from " + old;
        }
        return "You dont have a champion... idiot";
    }

    public static setChampionFeedTime(param: any): string {
        if (CREATURES._guardian) {
            const oldTime = CREATURES._guardian._feedTime.Get();
            const newTime = GLOBAL.Timestamp() + Number(param);
            CREATURES._guardian._feedTime = new SecNum(newTime);
            return "Champion feed time set to " + GLOBAL.ToTime(newTime - GLOBAL.Timestamp()) + " from " + GLOBAL.ToTime(oldTime - GLOBAL.Timestamp());
        }
        return "You dont have a champion... idiot";
    }

    public static setKorathLevel(param: number): string {
        if (GLOBAL.mode !== "build") {
            return "ERROR: can only set level in your base!";
        }
        CHAMPIONCAGE._guardians["G4"].props.powerLevel = param;
        const data = CHAMPIONCAGE.GetGuardianData(4);
        if (data) {
            data.pl = new SecNum(param);
        }
        return "Korath level targeted: " + param + " set: " + data.pl;
    }

    public static creatureAcademy(param1: string | null = null, param2: number = 0): string | null {
        if (param1 == null || param1 === "all") {
            for (const key in CREATURELOCKER._creatures) {
                GLOBAL.player.m_upgrades[param1!].powerup = param2;
            }
            return null;
        }
        GLOBAL.player.m_upgrades[param1].powerup = param2;
        return KEYS.Get(CREATURELOCKER._creatures[param1].name) + " upgraded to " + param2;
    }

    public static creatureLab(param1: any, param2: number): string | null {
        if (param1 == null || param1 === "all") {
            for (const key in CREATURELOCKER._creatures) {
                GLOBAL.player.m_upgrades[param1!] = { level: param2 };
            }
            return null;
        }
        GLOBAL.player.m_upgrades[param1] = { level: param2 };
        return KEYS.Get(CREATURELOCKER._creatures[param1].name) + " upgraded to " + param2;
    }

    public static changeAlpha(param: number = 1): string {
        MAP._GROUND.alpha = param;
        return param.toString();
    }

    public static unlockQuest(param: any): string | null {
        if (param == null || param === "all") {
            for (const quest of Object.values(QUESTS._quests)) {
                QUESTS._completed[(quest as any).id] = 1;
            }
            return null;
        }
        QUESTS._completed[param] = 1;
        return KEYS.Get(QUESTS.GetQuestByID(param).name);
    }

    public static lockQuest(param: any): string | null {
        if (param == null || param === "all") {
            for (const quest of Object.values(QUESTS._quests)) {
                delete QUESTS._completed[(quest as any).id];
            }
            return null;
        }
        delete QUESTS._completed[param];
        return KEYS.Get(QUESTS.GetQuestByID(param).name);
    }

    public static tutorialArrowRotation(param: number = 0): string {
        if (TUTORIAL._mcArrow) {
            TUTORIAL._mcArrow.mcArrow.rotation = param;
            return "TUTORIAL._mcArrow: Rotation - " + TUTORIAL._mcArrow.rotation;
        }
        return "TUTORIAL._mcArrow is NULL - there is no arrow to manipulate.";
    }

    public static tutorialGetStage(_param: number = 0): string {
        return "TUTORIAL._stage = " + TUTORIAL._stage;
    }

    public static forceAFK(param: number = 0): string {
        let type: string;
        if (param === 1) {
            POPUPS.AFK();
            type = "afk";
        } else {
            POPUPS.Timeout();
            type = "timeout";
        }
        return "forcing afk popup type: " + type;
    }

    public static printJSCalls(param: any = null): string {
        if (param !== 1 && param !== 0) {
            return "CONSOLE: printJS - ERROR - please provide a 1 or 0 value";
        }
        GLOBAL.debugLogJSCalls = Boolean(param);
        return "CONSOLE: printJS set to " + GLOBAL.debugLogJSCalls;
    }

    public static toggleFullScreen(_param: any = null): string {
        GLOBAL.goFullScreen();
        return "CONSOLE: Toggle FullScreen, press ESC to exit";
    }

    public static removeDamageProtection(_param: any = null): string {
        BASE._isProtected = 0;
        BASE.Save();
        return "CONSOLE: BASE._isProtected set to: " + Boolean(BASE._isProtected);
    }

    public static showBaseResources(_param: any = null): string {
        let result = "BASE RESOURCES:\n";
        for (const key in BASE._resources) {
            let value = 0;
            if (BASE._resources[key] instanceof SecNum) {
                value = BASE._resources[key].Get();
            } else {
                value = BASE._resources[key];
            }
            result += " | " + key + ": " + value;
        }
        result += "\n";
        if (BASE._iresources) {
            for (const key in BASE._iresources) {
                let value = 0;
                if (BASE._iresources[key] instanceof SecNum) {
                    value = BASE._iresources[key].Get();
                } else {
                    value = BASE._iresources[key];
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
        WMATTACK.Trigger(true);
        return "Creating Wild Monster attacks via WMATTACK.Trigger.";
    }

    public static toggleBuildingBases(_param: any = null): string {
        MAP._BUILDINGBASES.visible = !MAP._BUILDINGBASES.visible;
        return "Building Bases Visible:" + MAP._BUILDINGBASES.visible;
    }

    public static toggleBuildingTops(_param: any = null): string {
        MAP._BUILDINGTOPS.visible = !MAP._BUILDINGTOPS.visible;
        return "Building Tops Visible:" + MAP._BUILDINGTOPS.visible;
    }

    public static toggleRenderer(_param: any = null): string {
        MAP.instance.canvasContainer.visible = !MAP.instance.canvasContainer.visible;
        return "Renderer set to:" + MAP.instance.canvasContainer.visible.toString();
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
        for (const _ in BASE._buildingsAll) {
            count++;
        }
        return "NumBuildings:" + count.toString();
    }

    public static showVersion(_param: any = null): string {
        return "version:" + GLOBAL._version.Get() + " " + GLOBAL._softversion;
    }
}
