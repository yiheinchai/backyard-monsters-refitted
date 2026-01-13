import { KeywordMessage } from "../../KeywordMessage";

import { GLOBAL } from "../../../../../../GLOBAL";
import { KEYS } from "../../../../../../KEYS";
import { POPUPS } from "../../../../../../POPUPS";

/**
 * Monster Blitzkrieg reward message - shown when player gets reward.
 */
export class MonsterBlitzkriegRewardMessage extends KeywordMessage {
    constructor() {
        super("event2reward", "btn_brag");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + "fp_event2start.v2.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return false;
    }

    protected override onButtonClick(): void {
        GLOBAL.CallJS("sendFeed", [
            "event2-reward",
            KEYS.Get("event2reward_streamtitle"),
            KEYS.Get("event2reward_streambody"),
            "event2reward_stream.v2.png"
        ]);
        POPUPS.Next();
    }
}
