import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { BUILDING25 } from "../../../../../BUILDING25";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 14 - Tesla Tower suggestion message.
 */
export class BuildTree_14_TeslaTower extends BuildTreeMessage {
    constructor() {
        super("tesla", BUILDING25.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 4 && BASE.hasNumBuildings(BUILDING25.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(BUILDING25.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
