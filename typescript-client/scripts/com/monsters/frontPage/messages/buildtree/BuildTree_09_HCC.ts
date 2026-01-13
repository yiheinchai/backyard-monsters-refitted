import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { HATCHERYCC } from "../../../../../HATCHERYCC";
import { HATCHERY } from "../../../../../HATCHERY";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 09 - Hatchery Control Center suggestion message.
 */
export class BuildTree_09_HCC extends BuildTreeMessage {
    constructor() {
        super("hcc", HATCHERYCC.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = GLOBAL.townHall._lvl.Get();
        return townHallLevel >= 3 && townHallLevel <= 5 && BASE.hasNumBuildings(HATCHERY.TYPE, 2) >= 3 && BASE.hasNumBuildings(HATCHERYCC.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(HATCHERYCC.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
