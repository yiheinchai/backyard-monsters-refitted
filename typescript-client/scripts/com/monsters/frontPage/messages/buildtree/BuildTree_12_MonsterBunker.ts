import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { MONSTERBUNKER } from "../../../../../MONSTERBUNKER";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 12 - Monster Bunker suggestion message.
 */
export class BuildTree_12_MonsterBunker extends BuildTreeMessage {
    constructor() {
        super("bunker", MONSTERBUNKER.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 3 && BASE.hasNumBuildings(MONSTERBUNKER.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(MONSTERBUNKER.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
