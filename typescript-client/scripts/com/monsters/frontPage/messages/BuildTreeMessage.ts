import { BuildingEvent } from "../../events/BuildingEvent";
import { KeywordMessage } from "./KeywordMessage";

import { GLOBAL } from "../../../../GLOBAL";
import { LOGGER } from "../../../../LOGGER";

/**
 * Build tree message - base class for building suggestion messages.
 */
export class BuildTreeMessage extends KeywordMessage {
    protected _buildingType: number;

    constructor(keyword: string, buildingType: number, buttonCopy: string | null = null) {
        super(keyword, buttonCopy);
        this._buildingType = buildingType;
        this.name = this._keyword;
    }

    protected placedForConstruction(event: BuildingEvent): void {
        if (event.building._type === this._buildingType) {
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

    protected targetHasUpgraded(event: BuildingEvent): void {
        if (event.building._type === this._buildingType) {
            GLOBAL.eventDispatcher.removeEventListener(
                BuildingEvent.UPGRADED,
                this.targetHasUpgraded.bind(this)
            );
            LOGGER.StatB({
                "st1": "GTP",
                "st2": "Action",
                "value": 1
            }, this._buttonCopy);
        }
    }
}
