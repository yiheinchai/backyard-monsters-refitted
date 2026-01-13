import { BuildingEvent } from "../../../../events/BuildingEvent";
import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

import { GLOBAL } from "../../../../../../GLOBAL";
import { BASE } from "../../../../../../BASE";
import { POPUPS } from "../../../../../../POPUPS";
import { YARD_PROPS } from "../../../../../../YARD_PROPS";
import { SpurtzCannon } from "../../../../../../SpurtzCannon";
import { LOGGER } from "../../../../../../LOGGER";

/**
 * Spurtz Cannon reward message 1 - shown when first cannon is unlocked.
 */
export class SpurtzCannonRewardMessage1 extends KeywordMessage {
    constructor() {
        super("event_bruwarreward1", "btn_buildnow");
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        if (YARD_PROPS._yardProps[SpurtzCannon.TYPE - 1].block) {
            return;
        }
        BASE.addBuildingB(SpurtzCannon.TYPE, true);
        GLOBAL.eventDispatcher.addEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.constructedBuilding.bind(this)
        );
    }

    protected constructedBuilding(event: BuildingEvent): void {
        LOGGER.StatB({
            "st1": "ERS",
            "st2": "Brukkarg War",
            "st3": "cannon_placed"
        }, "Cannon_Placed");
        GLOBAL.eventDispatcher.removeEventListener(
            BuildingEvent.PLACED_FOR_CONSTRUCTION,
            this.constructedBuilding.bind(this)
        );
        if (event.building instanceof SpurtzCannon) {
            GLOBAL.Brag("event5-reward", "event_bruwarreward1_streamtitle", "event_bruwarreward1_streamdesc", "event_bruwarreward1_stream.png");
        }
    }
}
