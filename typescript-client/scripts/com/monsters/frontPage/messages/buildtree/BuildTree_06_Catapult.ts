import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 06 - Catapult suggestion message.
 */
export class BuildTree_06_Catapult extends BuildTreeMessage {
    constructor() {
        super("catapult1", 51, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(51) !== 0) {
            return false;
        }
        return Boolean(getGLOBAL().townHall) && getGLOBAL().townHall._lvl.Get() >= 3;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(51);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
