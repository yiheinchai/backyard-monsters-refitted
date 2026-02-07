import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }



/**
 * Hell Raisers start message - shown when Hell Raisers event starts.
 */
export class HellRaisersStartMessage extends KeywordMessage {
    constructor() {
        super("hellraisersstart", "btn_info");
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        getGLOBAL().Message(">Show Event Details Page");
    }
}
