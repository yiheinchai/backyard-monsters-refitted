import { KeywordMessage } from "../../KeywordMessage";

import { GLOBAL } from "../../../../../../GLOBAL";
import { KEYS } from "../../../../../../KEYS";

/**
 * Battletoads reward message - shown when player gets Battletoads reward.
 */
export class BattletoadsRewardMessage extends KeywordMessage {
    constructor() {
        super("event1reward", "btn_brag");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + "fp_event1reward.v2.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return false;
    }

    protected override onButtonClick(): void {
        GLOBAL.CallJS("sendFeed", [
            "event1-reward",
            KEYS.Get("event1reward_streamtitle"),
            KEYS.Get("event1reward_streambody"),
            "event1reward_stream.png"
        ]);
    }
}
