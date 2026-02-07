import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 05 - Blocks suggestion message.
 */
export class BuildTree_05_Blocks extends BuildTreeMessage {
    constructor() {
        super("blocks1", 17, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(17) !== 0) {
            return false;
        }
        return getGLOBAL().townHall._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(17);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
