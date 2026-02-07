import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 03 - Monster Locker suggestion message.
 */
export class BuildTree_03_MonsterLocker extends BuildTreeMessage {
    constructor() {
        super("locker", 8, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(8) !== 0) {
            return false;
        }
        return getGLOBAL().townHall._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(8);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
