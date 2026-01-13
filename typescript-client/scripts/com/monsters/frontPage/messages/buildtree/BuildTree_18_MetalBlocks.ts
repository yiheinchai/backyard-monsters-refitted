import { FrontPageHandler } from "../../FrontPageHandler";
import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";
import { STORE } from "../../../../../STORE";

/**
 * Build tree 18 - Metal Blocks suggestion message.
 */
export class BuildTree_18_MetalBlocks extends KeywordMessage {
    constructor() {
        super("blocks3", "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() >= 4 && BASE.hasNumBuildings(17, 1) >= 1 && BASE.hasNumBuildings(17, 3) <= 0;
    }

    protected override onButtonClick(): void {
        FrontPageHandler.closeAll();
        if (BASE.isInfernoMainYardOrOutpost) {
            STORE.ShowB(1, 0, ["BLK2I", "BLK3I"]);
        } else {
            STORE.ShowB(1, 0, ["BLK2", "BLK3", "BLK4", "BLK5"]);
        }
    }
}
