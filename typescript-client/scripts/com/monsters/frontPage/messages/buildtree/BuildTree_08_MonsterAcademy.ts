import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 08 - Monster Academy suggestion message.
 */
export class BuildTree_08_MonsterAcademy extends BuildTreeMessage {
    constructor() {
        super("academy", 26, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (BASE.hasNumBuildings(26) !== 0) {
            return false;
        }
        return GLOBAL.townHall && GLOBAL.townHall._lvl.Get() >= 3 && Boolean(GLOBAL._bLocker) && GLOBAL._bLocker._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(26);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
