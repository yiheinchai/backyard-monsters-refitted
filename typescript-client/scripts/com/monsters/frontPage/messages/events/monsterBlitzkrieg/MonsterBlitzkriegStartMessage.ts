import { KeywordMessage } from "../../KeywordMessage";
import { ReplayableEventHandler } from "../../../../replayableEvents/ReplayableEventHandler";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }



/**
 * Monster Blitzkrieg start message - shown when Monster Blitzkrieg event starts.
 */
export class MonsterBlitzkriegStartMessage extends KeywordMessage {
    constructor() {
        super("event2start", "btn_nextwave");
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + "fp_event2start.v2.jpg";
    }

    protected override onButtonClick(): void {
        ReplayableEventHandler.activeEvent.pressedActionButton();
        getPOPUPS().Next();
    }
}
