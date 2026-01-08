import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { MONSTERBAITER } from "../../../../../MONSTERBAITER";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 13 - Monster Baiter suggestion message.
 */
export class BuildTree_13_MonsterBaiter extends BuildTreeMessage {
    constructor() {
        super("baiter", MONSTERBAITER.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 4 && Boolean(BASE.hasNumBuildings(8, 1)) && BASE.hasNumBuildings(MONSTERBAITER.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(MONSTERBAITER.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
