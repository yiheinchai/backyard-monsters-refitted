import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { BUILDING23 } from "../../../../../BUILDING23";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 15 - Laser Tower suggestion message.
 */
export class BuildTree_15_LaserTower extends BuildTreeMessage {
    constructor() {
        super("laser", BUILDING23.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 4 && BASE.hasNumBuildings(BUILDING23.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(BUILDING23.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
