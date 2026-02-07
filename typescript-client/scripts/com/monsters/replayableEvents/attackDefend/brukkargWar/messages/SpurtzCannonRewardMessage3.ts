import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }



/**
 * Spurtz cannon reward message 3 - third reward message for Brukkarg War.
 */
export class SpurtzCannonRewardMessage3 extends KeywordMessage {
    constructor() {
        super("event_bruwarreward3", "btn_brag");
    }

    protected override onButtonClick(): void {
        getGLOBAL().Brag(
            "event5-reward",
            "event_bruwarreward3_streamtitle",
            "event_bruwarreward3_streamdesc",
            "event_bruwarreward3_stream.png"
        );
    }
}
