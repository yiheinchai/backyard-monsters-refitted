import { KeywordMessage } from "../KeywordMessage";

import { MAPROOM_DESCENT } from "../../../../../MAPROOM_DESCENT";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getINFERNOPORTAL(): any { return require("../../../../../INFERNOPORTAL").INFERNOPORTAL; }


/**
 * News 02 - Inferno Yard Expansion news message.
 */
export class News02InfernoYardExpansion extends KeywordMessage {
    constructor() {
        let buttonCopy: string | null = null;
        if (!getBASE().isInfernoMainYardOrOutpost && MAPROOM_DESCENT.DescentPassed) {
            buttonCopy = "btn_gotoinferno";
        }
        super("3_16_0", buttonCopy);
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        getINFERNOPORTAL().ToggleYard();
    }
}
