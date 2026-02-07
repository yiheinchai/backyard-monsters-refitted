import { KeywordMessage } from "../../KeywordMessage";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }



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
        getPOPUPS().Next();
        getGLOBAL().Brag(
            "event5-reward",
            "event_bruwarreward3_streamtitle",
            "event_bruwarreward3_streamdesc",
            "event_bruwarreward3_stream.png"
        );
    }
}
