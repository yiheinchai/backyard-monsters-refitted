import { BuildingEvent } from "../../../events/BuildingEvent";
import { BuildTreeMessage } from "../BuildTreeMessage";

import { CHAMPIONCHAMBER } from "../../../../../CHAMPIONCHAMBER";
import { CHAMPIONCAGE } from "../../../../../CHAMPIONCAGE";
import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";

/**
 * Build tree 19 - Champion Chamber suggestion message.
 */
export class BuildTree_19_ChampionChamber extends BuildTreeMessage {
    constructor() {
        super("chamber", CHAMPIONCHAMBER.TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 4 && BASE.hasNumBuildings(CHAMPIONCHAMBER.TYPE) <= 0 && BASE.hasNumBuildings(CHAMPIONCAGE.TYPE, 1) >= 1;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(CHAMPIONCHAMBER.TYPE);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
