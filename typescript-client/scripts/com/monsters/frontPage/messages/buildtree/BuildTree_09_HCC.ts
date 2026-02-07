import { BuildTreeMessage } from "../BuildTreeMessage";

import { HATCHERYCC } from "../../../../../HATCHERYCC";
import { HATCHERY } from "../../../../../HATCHERY";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }


/**
 * Build tree 09 - Hatchery Control Center suggestion message.
 */
export class BuildTree_09_HCC extends BuildTreeMessage {
    constructor() {
        super("hcc", HATCHERYCC.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = getGLOBAL().townHall._lvl.Get();
        return townHallLevel >= 3 && townHallLevel <= 5 && getBASE().hasNumBuildings(HATCHERY.TYPE, 2) >= 3 && getBASE().hasNumBuildings(HATCHERYCC.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(HATCHERYCC.TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
