import { KeywordMessage } from "../../KeywordMessage";
import { ReplayableEventHandler } from "../../../../replayableEvents/ReplayableEventHandler";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }



/**
 * Brukkarg War start message - shown when Brukkarg War event starts.
 */
export class BrukkargWarStartMessage extends KeywordMessage {
    constructor() {
        super("event_bruwarstart", "btn_nextwave");
    }

    protected override onButtonClick(): void {
        ReplayableEventHandler.activeEvent.pressedActionButton();
        getPOPUPS().Next();
    }
}
