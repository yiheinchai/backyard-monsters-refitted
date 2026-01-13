import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";
import { ReplayableEvent } from "../../../ReplayableEvent";
import { ReplayableEventHandler } from "../../../ReplayableEventHandler";

/**
 * Brukkarg War final attack message - shown for final attack in event.
 */
export class BrukkargWarFinalAttackMessage extends KeywordMessage {
    constructor() {
        super("event_bruwarfinal", "btn_attack");
    }

    protected override onButtonClick(): void {
        const event: ReplayableEvent | null = ReplayableEventHandler.activeEvent;
        if (event) {
            event.pressedActionButton();
        }
    }
}
