import { BuildTreeMessage } from "../BuildTreeMessage";

import { MONSTERBAITER } from "../../../../../MONSTERBAITER";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }


/**
 * Build tree 13 - Monster Baiter suggestion message.
 */
export class BuildTree_13_MonsterBaiter extends BuildTreeMessage {
    constructor() {
        super("baiter", MONSTERBAITER.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 4 && Boolean(getBASE().hasNumBuildings(8, 1)) && getBASE().hasNumBuildings(MONSTERBAITER.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(MONSTERBAITER.TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
