import { CreepBase } from './com/monsters/monsters/creeps/CreepBase';
import Point from 'openfl/geom/Point';
import { MONSTERBAITER } from './MONSTERBAITER';

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDING27(): any { return require("./BUILDING27").BUILDING27; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getMAP(): any { return require("./MAP").MAP; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getUI2(): any { return require("./UI2").UI2; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


/**
 * CUSTOMATTACKS - Custom Attack Management
 * Handles special attack scenarios like Trojan Horse and tutorial attacks
 */
export class CUSTOMATTACKS {
    public static _history: any = {};
    public static _inProgress: boolean = false;
    public static _lastClick: number = 0;
    public static _started: boolean = false;
    public static _isAI: boolean = false;
    public static _attacks: number[] = [
        8000, 18800, 43240, 97290, 214038, 460182, 966382, 1981082, 3962164, 7726221,
        14679819, 27157666, 48883798, 85546647, 145429299, 189058089, 245775516,
        319508170, 415360622, 539968808, 701959450, 912547286, 1186311471, 1542204913,
        2004866386, 2606326302, 3388224193, 4404691451, 5726098886, 7443928552,
        9677107118, 12580239253, 16354311030, 21260604338, 27638785640, 35930421332,
        46709547731, 60722412051
    ];

    constructor() {}

    public static Setup(): void {
        CUSTOMATTACKS._started = false;
    }

    public static TrojanHorse(): void {
        if (!getBUILDING27()._exists && !getBASE().isInfernoMainYardOrOutpost) {
            const mapHeight: number = getGLOBAL()._mapHeight;
            const yPos: number = -800 - (mapHeight - 800) / 2;
            const isoPos: Point = getGRID().ToISO(-70, yPos, 0);
            const building: BFOUNDATION = getBASE().addBuildingC(27);
            ++getBASE()._buildingCount;
            building.Setup({
                t: 27,
                X: -70,
                Y: yPos,
                id: getBASE()._buildingCount
            });
            getMAP().FocusTo(isoPos.x, isoPos.y, 2);
            getBASE().Save(0, false, true);
        }
    }

    public static CustomAttack(attackData: any[], autoAttack: boolean = false): any[] {
        CUSTOMATTACKS._started = true;
        getWMATTACK()._isAI = false;
        getWMATTACK().AttackB();
        getUI2().Show("scareAway");
        if (getUI2()._scareAway) {
            getUI2()._scareAway.addEventListener("scareAway", MONSTERBAITER.End);
        }
        const spawned: any[] = getWMATTACK().SpawnA(attackData);
        const firstMonster: MonsterBase = spawned[0][0];
        getMAP().FocusTo(firstMonster.x, firstMonster.y, 2);
        return spawned;
    }

    public static WMIAttack(attackData: any[]): any[] {
        CUSTOMATTACKS._started = true;
        getWMATTACK()._isAI = false;
        getWMATTACK().AttackB();
        getUI2().Show("scareAway");
        if (getUI2()._scareAway) {
            getUI2()._scareAway.addEventListener("scareAway", MONSTERBAITER.End);
        }
        return getWMATTACK().SpawnA(attackData);
    }

    public static TutorialAttack(): void {
        CUSTOMATTACKS._started = true;
        let spawned: any[] = getWMATTACK().SpawnA([["C2", "bounce", 1, 180, -10, 0, 1]]);
        spawned = getWMATTACK().SpawnA([["C2", "bounce", 2, 190, -5, 0, 1]]);
        spawned = getWMATTACK().SpawnA([["C2", "bounce", 2, 190, 10, 0, 1]]);
        spawned = getWMATTACK().SpawnA([["C2", "bounce", 1, 250, 5, 0, 1]]);
        spawned = getWMATTACK().SpawnA([["C2", "bounce", 2, 190, 0, 0, 1]]);
        const monster = spawned[0][0];
        const distance: number = Point.distance(new Point(getGLOBAL()._bTower.x, getGLOBAL()._bTower.y), new Point(monster.x, monster.y));
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSOUNDS().PlayMusic("musicipanic");
        } else {
            getSOUNDS().PlayMusic("musicpanic");
        }
        getWMATTACK().AttackB();
        getWMATTACK().AttackC();
        getMAP().FocusTo(getGLOBAL()._bTower.x, getGLOBAL()._bTower.y, Math.floor(distance / 100), 0, 0, false);
        for (const creepId in getCREEPS()._creeps) {
            const creep = getCREEPS()._creeps[creepId] as CreepBase;
            creep.maxHealthProperty.value = 1;
            creep.setHealth(1);
        }
        getWMATTACK()._isAI = false;
        getWMATTACK()._inProgress = true;
    }
}
