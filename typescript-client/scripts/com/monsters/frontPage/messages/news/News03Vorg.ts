import { KeywordMessage } from "../KeywordMessage";
import { ReplayableEventLibrary } from "../../../replayableEvents/ReplayableEventLibrary";

import { BASE } from "../../../../../BASE";
import { CREATURELOCKER } from "../../../../../CREATURELOCKER";
import { POPUPS } from "../../../../../POPUPS";

/**
 * News 03 - Vorg monster news message.
 */
export class News03Vorg extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (!CREATURELOCKER._lockerData["C16"]) {
            buttonCopy = "btn_unlocknow";
        }
        super("3_17_0", buttonCopy);
    }

    public override get areRequirementsMet(): boolean {
        return ReplayableEventLibrary.BATTLE_TOADS.doesAutomaticalyGetReward() && Boolean(BASE.loadObject["events"]);
    }

    protected override onButtonClick(): void {
        CREATURELOCKER._popupCreatureID = "C16";
        CREATURELOCKER.Show();
        CREATURELOCKER._mc.ShowB("C16");
        POPUPS.Next();
    }
}
