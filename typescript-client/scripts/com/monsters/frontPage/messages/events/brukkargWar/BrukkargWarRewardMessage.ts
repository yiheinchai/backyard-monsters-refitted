import { KeywordMessage } from "../../KeywordMessage";

import { POPUPS } from "../../../../../../POPUPS";
import { GLOBAL } from "../../../../../../GLOBAL";

/**
 * Brukkarg War reward message - shown when player gets Brukkarg War reward.
 */
export class BrukkargWarRewardMessage extends KeywordMessage {
    constructor() {
        super("event_bruwarreward3", "btn_brag");
    }

    public override get areRequirementsMet(): boolean {
        return false;
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        GLOBAL.Brag(
            "event5-reward",
            "event_bruwarreward3_streamtitle",
            "event_bruwarreward3_streamdesc",
            "event_bruwarreward3_stream.png"
        );
    }
}
