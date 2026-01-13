import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

import { POPUPS } from "../../../../../../POPUPS";
import { GLOBAL } from "../../../../../GLOBAL";

/**
 * Hell Raisers start message - shown when Hell Raisers event starts.
 */
export class HellRaisersStartMessage extends KeywordMessage {
    constructor() {
        super("hellraisersstart", "btn_info");
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        GLOBAL.Message(">Show Event Details Page");
    }
}
