import { SecNum } from './com/cc/utils/SecNum';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { SiegeFactory } from './com/monsters/siege/SiegeFactory';
import { SiegeLab } from './com/monsters/siege/SiegeLab';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';
import { MAPROOM_DESCENT } from './MAPROOM_DESCENT';
import { PLEASEWAIT } from './PLEASEWAIT';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }


/**
 * INFERNOPORTAL - Inferno Portal Building
 * Portal between overworld and Inferno dimension
 */
export class INFERNOPORTAL extends BFOUNDATION {
    public static readonly ENTER_BUTTON: string = "btn_entercavern";
    public static readonly ASCENSION_BUTTON: string = "btn_ascendmonsters";
    public static readonly EXIT_BUTTON: string = "btn_exitcavern";

    private static _ascensionMc: any = null;
    public static building: INFERNOPORTAL | null = null;
    public static _descentPassed: boolean = false;
    public static _ascensionData: Record<string, SecNum> | null = null;
    private static _ogInfernoData: any = null;
    private static _ogAscensionData: Record<string, number> | null = null;

    private _popup: any = null;

    constructor() {
        super();
        this._type = 127;
        this._footprint = [new Rectangle(0, 0, 190, 160)];
        this._gridCost = [[new Rectangle(0, 0, 190, 160), 200]];
        this.SetProps();
    }

    public static GetMaxLevel(): number {
        if (!INFERNOPORTAL.building) {
            throw new Error("No portal building");
        }
        return INFERNOPORTAL.building._buildingProps.costs.length;
    }

    public static EnterPortal(force: boolean = false): void {
        if (getGLOBAL()._flags.inferno !== 1) {
            getGLOBAL().Message(getKEYS().Get("inferno_msg_disabled"));
        } else if (MAPROOM_DESCENT.DescentPassed) {
            if (getGLOBAL()._flags.inferno !== 1) {
                getGLOBAL().Message(getKEYS().Get("inferno_msg_disabled"));
                return;
            }
            INFERNOPORTAL.ToggleYard();
        } else {
            INFERNOPORTAL.EnterDescent();
        }
    }

    public static AscendMonsters(): void {
        const onLoad = (serverData: any): void => {
            PLEASEWAIT.Hide();
            INFERNOPORTAL._ogInfernoData = serverData.imonsters;
            INFERNOPORTAL._ascensionData = {};
            INFERNOPORTAL._ogAscensionData = {};
            for (const monster in serverData.imonsters) {
                if (monster.substr(0, 2) === "IC") {
                    const val = typeof serverData.imonsters[monster] === 'number'
                        ? serverData.imonsters[monster] as number
                        : INFERNOPORTAL.numHealthyCreeps(monster, serverData.imonsters[monster] as any[]);
                    INFERNOPORTAL._ascensionData![monster] = new SecNum(val);
                    INFERNOPORTAL._ogAscensionData![monster] = INFERNOPORTAL._ascensionData![monster].Get();
                }
            }
            INFERNOPORTAL.ShowAscendMonstersDialog();
        };
        const onError = (): void => {
            getLOGGER().Log("err", "INFERNOPORTAL.AscendMonsters No inferno monster data");
            getGLOBAL().ErrorMessage("INFERNOPORTAL.AscendMonsters No inferno monster data");
        };

        if (!getBASE().isMainYard) return;
        PLEASEWAIT.Show(getKEYS().Get("msg_loading"));
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._infBaseURL + "infernomonsters", [["type", "get"]], onLoad, onError);
    }

    private static numHealthyCreeps(creatureId: string, creeps: any[]): number {
        let count = creeps.length;
        const maxHealth = getCREATURES().GetProperty(creatureId, "health");
        for (let i = count - 1; i >= 0; i--) {
            if (creeps[i].health < maxHealth) count--;
        }
        return count;
    }

    public static PageAscensionData(): void {
        const onLoad = (response: any): void => {
            PLEASEWAIT.Hide();
            getBASE().Save();
        };
        const onError = (): void => {
            getLOGGER().Log("err", "INFERNOPORTAL.PageAscensionData Could not save inferno monster changes");
            getGLOBAL().ErrorMessage("INFERNOPORTAL.PageAscensionData Could not save inferno monster changes");
        };

        PLEASEWAIT.Show(getKEYS().Get("msg_loading"));
        let result: any = {};
        
        if (getMapRoomManager().instance.isInMapRoom3) {
            for (const s in INFERNOPORTAL._ascensionData) {
                if (s.substr(0, 2) === "IC") {
                    INFERNOPORTAL.destroyCreep(s, INFERNOPORTAL._ogAscensionData![s] - INFERNOPORTAL._ascensionData![s].Get());
                }
            }
            result = INFERNOPORTAL._ogInfernoData;
        } else {
            for (const s in INFERNOPORTAL._ascensionData) {
                if (s.substr(0, 2) === "IC" && INFERNOPORTAL._ascensionData![s].Get() > 0) {
                    result[s] = INFERNOPORTAL._ascensionData![s].Get();
                }
            }
        }
        INFERNOPORTAL._ascensionData = null;
        
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._infBaseURL + "infernomonsters", [["type", "set"], ["imonsters", JSON.stringify(result)]], onLoad, onError);
    }

    private static destroyCreep(creatureId: string, count: number): void {
        const maxHealth = getCREATURES().GetProperty(creatureId, "health");
        for (let i = 0; i < count; i++) {
            for (let j = INFERNOPORTAL._ogInfernoData[creatureId].length - 1; j >= 0; j--) {
                if (INFERNOPORTAL._ogInfernoData[creatureId][j].health === maxHealth) {
                    INFERNOPORTAL._ogInfernoData[creatureId].splice(j, 1);
                    break;
                }
            }
        }
    }

    public static ShowAscendMonstersDialog(): void {
        getGLOBAL().BlockerAdd();
        INFERNOPORTAL._ascensionMc = new (GLOBAL as any).INFERNO_ASCENSION_POPUP();
        getGLOBAL()._layerWindows.addChild(INFERNOPORTAL._ascensionMc);
        INFERNOPORTAL._ascensionMc.Center();
        INFERNOPORTAL._ascensionMc.ScaleUp();
    }

    public static HideAscendMonstersDialog(): void {
        if (INFERNOPORTAL._ascensionMc) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getGLOBAL()._layerWindows.removeChild(INFERNOPORTAL._ascensionMc);
            INFERNOPORTAL._ascensionMc = null;
        }
    }

    public static EnterDescent(): void {
        MAPROOM_DESCENT.Setup(true);
    }

    public static ToggleYard(): void {
        if (getBASE()._saving || getBASE()._loading || getBASE()._saveCounterA !== getBASE()._saveCounterB) {
            getGLOBAL()._toggleYardWaiting = 1;
            return;
        }
        getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_1;
        if (getBASE().isInfernoMainYardOrOutpost) {
            const yardType = getMapRoomManager().instance.isInMapRoom3 ? EnumYardType.PLAYER : EnumYardType.MAIN_YARD;
            getBASE().LoadBase(null, 0, 0, getGLOBAL().e_BASE_MODE.BUILD, false, yardType);
        } else {
            getBASE().LoadBase(getGLOBAL()._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
        }
    }

    public static AddPortal(level: number = 0): INFERNOPORTAL {
        const gridPos = new Point(-1200, -150);
        const isoPos = (GLOBAL as any).GRID.ToISO(gridPos.x, gridPos.y, 0);
        const portal = getBASE().addBuildingC(127) as INFERNOPORTAL;
        INFERNOPORTAL.building = portal;
        ++getBASE()._buildingCount;
        portal.Setup({
            X: gridPos.x,
            Y: gridPos.y,
            t: 127,
            id: getBASE()._buildingCount,
            l: level
        });
        portal.SetLevel(level);
        return portal;
    }

    public static isAboveMaxLevel(): boolean {
        return Boolean(INFERNOPORTAL.building) && INFERNOPORTAL.building!._lvl.Get() >= INFERNOPORTAL.GetMaxLevel();
    }

    public override Click(event: MouseEvent | null = null): void {
        if (INFERNOPORTAL.isAboveMaxLevel() && (getBASE().isInfernoMainYardOrOutpost || getGLOBAL().townHall && getGLOBAL().townHall._lvl.Get() >= (GLOBAL as any).INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT)) {
            super.Click(event);
        } else if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !(GLOBAL as any).INFERNO_EMERGENCE_EVENT.isAttackActive) {
            (GLOBAL as any).INFERNO_EMERGENCE_POPUPS.ShowRSVP(INFERNOPORTAL.building!._lvl.Get());
        }
    }

    public SetLevel(level: number): void {
        level = Math.min(level, this._buildingProps.costs.length);
        const oldLevel = this._lvl.Get();
        const maxLevel = this._buildingProps.costs.length;
        this.checkBuildingUnlocks();
        if (level === oldLevel) return;
        
        const diff = level - oldLevel;
        for (let i = 0; i < diff; i++) {
            this.Upgraded();
        }
        this.RenderClear();
        this.Update(true);
        this.Render();
    }

    private checkBuildingUnlocks(): void {
        if (INFERNOPORTAL.isAboveMaxLevel() && getBASE().isMainYard) {
            getGLOBAL()._buildingProps[(GLOBAL as any).INFERNO_MAGMA_TOWER.ID - 1].block = false;
            getGLOBAL()._buildingProps[(GLOBAL as any).INFERNOQUAKETOWER.TYPE - 1].block = false;
            getGLOBAL()._buildingProps[SiegeFactory.ID - 1].block = false;
            getGLOBAL()._buildingProps[SiegeLab.ID - 1].block = false;
        }
    }

    public Hide(): void {
        this._mc.visible = false;
        this._mcBase.visible = false;
    }

    public Show(): void {
        this._mc.visible = true;
        this._mcBase.visible = true;
    }

    public override Export(): any {
        return false;
    }
}
