import { KeywordMessage } from "../KeywordMessage";
import { ReplayableEventLibrary } from "../../../replayableEvents/ReplayableEventLibrary";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getCREATURELOCKER(): any { return require("../../../../../CREATURELOCKER").CREATURELOCKER; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }



/**
 * News 03 - Vorg monster news message.
 */
export class News03Vorg extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (!getCREATURELOCKER()._lockerData["C16"]) {
            buttonCopy = "btn_unlocknow";
        }
        super("3_17_0", buttonCopy);
    }

    public override get areRequirementsMet(): boolean {
        return ReplayableEventLibrary.BATTLE_TOADS.doesAutomaticalyGetReward() && Boolean(getBASE().loadObject["events"]);
    }

    protected override onButtonClick(): void {
        getCREATURELOCKER()._popupCreatureID = "C16";
        getCREATURELOCKER().Show();
        getCREATURELOCKER()._mc.ShowB("C16");
        getPOPUPS().Next();
    }
}
