import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { PLANNER } from "../../../../../PLANNER";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 10 - Yard Planner suggestion message.
 */
export class BuildTree_10_YardPlanner extends BuildTreeMessage {
    constructor() {
        super("planner", PLANNER.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (GLOBAL._flags.yp_version === 2) {
            return false;
        }
        return GLOBAL.townHall._lvl.Get() >= 3 && BASE.hasNumBuildings(PLANNER.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(PLANNER.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
