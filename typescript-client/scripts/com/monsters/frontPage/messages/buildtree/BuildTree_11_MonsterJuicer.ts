import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { BUILDING9 } from "../../../../../BUILDING9";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 11 - Monster Juicer suggestion message.
 */
export class BuildTree_11_MonsterJuicer extends BuildTreeMessage {
    constructor() {
        super("juicer", BUILDING9.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        const townHallLevel: number = GLOBAL.townHall._lvl.Get();
        return townHallLevel >= 3 && townHallLevel <= 4 && BASE.hasNumBuildings(this._buildingType) <= 0;
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
