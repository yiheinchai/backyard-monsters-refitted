import { BuildingEvent } from "../../../../events/BuildingEvent";
import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

import { GLOBAL } from "../../../../../../GLOBAL";
import { BASE } from "../../../../../../BASE";
import { POPUPS } from "../../../../../../POPUPS";
import { YARD_PROPS } from "../../../../../../YARD_PROPS";
import { SpurtzCannon } from "../../../../../../SpurtzCannon";
import { LOGGER } from "../../../../../../LOGGER";

/**
 * Spurtz Cannon reward message 2 - shown when second cannon is unlocked.
 */
export class SpurtzCannonRewardMessage2 extends KeywordMessage {
    constructor() {
        super("event_bruwarreward2", "btn_buildnow");
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        if (YARD_PROPS._yardProps[SpurtzCannon.TYPE - 1].blocked) {
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
            GLOBAL.Brag("event5-reward", "event_bruwarreward2_streamtitle", "event_bruwarreward2_streamdesc", "event_bruwarreward2_stream.png");
        }
    }
}
