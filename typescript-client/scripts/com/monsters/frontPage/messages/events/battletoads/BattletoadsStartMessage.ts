import { KeywordMessage } from "../../KeywordMessage";
import { ReplayableEventHandler } from "../../../../replayableEvents/ReplayableEventHandler";

/**
 * Battletoads start message - shown when Battletoads event starts.
 */
export class BattletoadsStartMessage extends KeywordMessage {
    constructor() {
        super("event1start", "btn_attack");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + "fp_event1start.v2.jpg";
    }

    protected override onButtonClick(): void {
        ReplayableEventHandler.activeEvent.pressedActionButton();
    }
}
