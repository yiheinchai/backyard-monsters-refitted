import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getBUILDING9(): any { return require("../../../../../BUILDING9").BUILDING9; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 11 - Monster Juicer suggestion message.
 */
export class BuildTree_11_MonsterJuicer extends BuildTreeMessage {
    constructor() {
        super("juicer", getBUILDING9().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = getGLOBAL().townHall._lvl.Get();
        return townHallLevel >= 3 && townHallLevel <= 4 && getBASE().hasNumBuildings(this._buildingType) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(this._buildingType);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
