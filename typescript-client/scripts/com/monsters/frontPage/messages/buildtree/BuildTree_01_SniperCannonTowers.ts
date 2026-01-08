import { BuildingEvent } from "../../../events/BuildingEvent";
import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";
import { BUILDING20 } from "../../../../../BUILDING20";
import { LOGGER } from "../../../../../LOGGER";

/**
 * Build tree 01 - Sniper/Cannon Towers suggestion message (first tower).
 */
export class BuildTree_01_SniperCannonTowers extends KeywordMessage {
    constructor() {
        super("snipercannon", "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 1 && BASE.hasNumBuildings(BUILDING20.TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyMenu(3, 1, 0);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }

    protected placedForConstruction(event: BuildingEvent): void {
        if (event.building._type === BUILDING20.TYPE) {
            GLOBAL.eventDispatcher.removeEventListener(
                BuildingEvent.PLACED_FOR_CONSTRUCTION,
                this.placedForConstruction.bind(this)
            );
            LOGGER.StatB({
                "st1": "GTP",
                "st2": "Action",
                "value": 1
            }, this._buttonCopy);
        }
    }
}
