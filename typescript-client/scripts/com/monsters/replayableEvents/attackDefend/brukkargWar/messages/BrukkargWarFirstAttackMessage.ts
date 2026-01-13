import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";
import { ReplayableEvent } from "../../../ReplayableEvent";
import { ReplayableEventHandler } from "../../../ReplayableEventHandler";

/**
 * Brukkarg War first attack message - shown for first attack in event.
 */
export class BrukkargWarFirstAttackMessage extends KeywordMessage {
    constructor() {
        super("event_bruwarattack", "btn_attack");
    }

    protected override onButtonClick(): void {
        const event: ReplayableEvent | null = ReplayableEventHandler.activeEvent;
        if (event) {
            event.pressedActionButton();
        }
    }
}
