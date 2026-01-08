import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 02 - Radio Tower suggestion message.
 */
export class BuildTree_02_RadioTower extends BuildTreeMessage {
    constructor() {
        super("radiotower", 113, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = GLOBAL.townHall._lvl.Get();
        return BASE.hasNumBuildings(this._buildingType) <= 0 && townHallLevel >= 1 && townHallLevel <= 3 && Boolean(GLOBAL._flags.radio);
    }

    protected override onButtonClick(): void {
        this.buyBuilding(this._buildingType);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
