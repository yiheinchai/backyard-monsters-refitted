import { KeywordMessage } from "../KeywordMessage";
import { ReplayableEventLibrary } from "../../../replayableEvents/ReplayableEventLibrary";

import { BASE } from "../../../../../BASE";
import { CREATURELOCKER } from "../../../../../CREATURELOCKER";
import { POPUPS } from "../../../../../POPUPS";

/**
 * News 04 - Slimeattikus monster news message.
 */
export class News04Slimeattikus extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (!CREATURELOCKER._lockerData["C17"]) {
            buttonCopy = "btn_unlocknow";
        }
        super("3_18_0", buttonCopy);
    }

    public override get areRequirementsMet(): boolean {
        return ReplayableEventLibrary.MONSTER_BLITZKRIEG.doesAutomaticalyGetReward() && Boolean(BASE.loadObject["events"]);
    }

    protected override onButtonClick(): void {
        CREATURELOCKER._popupCreatureID = "C17";
        CREATURELOCKER.Show();
        CREATURELOCKER._mc.ShowB("C17");
        POPUPS.Next();
    }
}
