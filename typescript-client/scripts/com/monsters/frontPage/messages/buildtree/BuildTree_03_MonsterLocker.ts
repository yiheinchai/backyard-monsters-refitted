import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 03 - Monster Locker suggestion message.
 */
export class BuildTree_03_MonsterLocker extends BuildTreeMessage {
    constructor() {
        super("locker", 8, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (BASE.hasNumBuildings(8) !== 0) {
            return false;
        }
        return GLOBAL.townHall._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(8);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
