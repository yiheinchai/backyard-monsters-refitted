import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 06 - Catapult suggestion message.
 */
export class BuildTree_06_Catapult extends BuildTreeMessage {
    constructor() {
        super("catapult1", 51, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (BASE.hasNumBuildings(51) !== 0) {
            return false;
        }
        return Boolean(GLOBAL.townHall) && GLOBAL.townHall._lvl.Get() >= 3;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(51);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
