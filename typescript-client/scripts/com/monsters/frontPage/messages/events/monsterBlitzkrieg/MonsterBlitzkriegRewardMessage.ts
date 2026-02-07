import { KeywordMessage } from "../../KeywordMessage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }



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
        getGLOBAL().CallJS("sendFeed", [
            "event2-reward",
            getKEYS().Get("event2reward_streamtitle"),
            getKEYS().Get("event2reward_streambody"),
            "event2reward_stream.v2.png"
        ]);
        getPOPUPS().Next();
    }
}
