import { KeywordMessage } from "../KeywordMessage";
import { ReplayableEventLibrary } from "../../../replayableEvents/ReplayableEventLibrary";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getCREATURELOCKER(): any { return require("../../../../../CREATURELOCKER").CREATURELOCKER; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }



/**
 * News 04 - Slimeattikus monster news message.
 */
export class News04Slimeattikus extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (!getCREATURELOCKER()._lockerData["C17"]) {
            buttonCopy = "btn_unlocknow";
        }
        super("3_18_0", buttonCopy);
    }

    public override get areRequirementsMet(): boolean {
        return ReplayableEventLibrary.MONSTER_BLITZKRIEG.doesAutomaticalyGetReward() && Boolean(getBASE().loadObject["events"]);
    }

    protected override onButtonClick(): void {
        getCREATURELOCKER()._popupCreatureID = "C17";
        getCREATURELOCKER().Show();
        getCREATURELOCKER()._mc.ShowB("C17");
        getPOPUPS().Next();
    }
}
