import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 16 - Aerial Tower suggestion message.
 */
export class BuildTree_16_AerialTower extends BuildTreeMessage {
    constructor() {
        super("aerial", 115, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (BASE.hasNumBuildings(115) !== 0) {
            return false;
        }
        return GLOBAL.townHall._lvl.Get() >= 4;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(115);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
