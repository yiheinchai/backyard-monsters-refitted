import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 16 - Aerial Tower suggestion message.
 */
export class BuildTree_16_AerialTower extends BuildTreeMessage {
    constructor() {
        super("aerial", 115, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(115) !== 0) {
            return false;
        }
        return getGLOBAL().townHall._lvl.Get() >= 4;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(115);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
