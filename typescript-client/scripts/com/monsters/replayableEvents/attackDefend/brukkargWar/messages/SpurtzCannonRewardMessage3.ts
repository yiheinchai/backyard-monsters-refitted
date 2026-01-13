import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";

/**
 * Spurtz cannon reward message 3 - third reward message for Brukkarg War.
 */
export class SpurtzCannonRewardMessage3 extends KeywordMessage {
    constructor() {
        super("event_bruwarreward3", "btn_brag");
    }

    protected override onButtonClick(): void {
        GLOBAL.Brag(
            "event5-reward",
            "event_bruwarreward3_streamtitle",
            "event_bruwarreward3_streamdesc",
            "event_bruwarreward3_stream.png"
        );
    }
}
