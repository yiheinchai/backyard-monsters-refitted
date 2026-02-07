import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getBUILDING25(): any { return require("../../../../../BUILDING25").BUILDING25; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 14 - Tesla Tower suggestion message.
 */
export class BuildTree_14_TeslaTower extends BuildTreeMessage {
    constructor() {
        super("tesla", getBUILDING25().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 4 && getBASE().hasNumBuildings(getBUILDING25().TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getBUILDING25().TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
