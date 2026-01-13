import { KeywordMessage } from "../../frontPage/messages/KeywordMessage";

import { CREEPS } from "../../../../CREEPS";
import { KEYS } from "../../../../KEYS";
import { GLOBAL } from "../../../../GLOBAL";
import { POPUPS } from "../../../../POPUPS";

/**
 * KOTH reward message - shown when player wins/keeps Krallen.
 */
export class KOTHRewardMessage extends KeywordMessage {
    constructor(keptKrallen: boolean) {
        let level = 1;
        if (CREEPS.krallen) {
            level = CREEPS.krallen._level.Get();
        }
        super(keptKrallen ? "kothendkeep" : "kothendwin", "btn_brag");
        this.body = KEYS.Get(KeywordMessage.PREFIX + this._keyword, { v1: level });
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothwin");
    }

    protected override onButtonClick(): void {
        GLOBAL.CallJS("sendFeed", [
            "event4-reward",
            KEYS.Get("fb_kothstream_title"),
            KEYS.Get("fb_kothstream_desc"),
            "fb_kothstream.png"
        ]);
        POPUPS.Next();
    }
}
