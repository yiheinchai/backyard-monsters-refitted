import { KeywordMessage } from "../../KeywordMessage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../../KEYS").KEYS; }



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
        getGLOBAL().CallJS("sendFeed", [
            "event1-reward",
            getKEYS().Get("event1reward_streamtitle"),
            getKEYS().Get("event1reward_streambody"),
            "event1reward_stream.png"
        ]);
    }
}
