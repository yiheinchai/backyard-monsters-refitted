import { FrontPageHandler } from "../../FrontPageHandler";
import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../BASE";
import { STORE } from "../../../../../STORE";

/**
 * Build tree 07 - Stone Blocks upgrade suggestion message.
 */
export class BuildTree_07_StoneBlocks extends KeywordMessage {
    constructor() {
        super("blocks2", "btn_upgrade");
    }

    public override get areRequirementsMet(): boolean {
        if (BASE.hasNumBuildings(17, 2) !== 0 && BASE.hasNumBuildings(17, 1) > 0) {
            return false;
        }
        return Boolean(GLOBAL.townHall) && GLOBAL.townHall._lvl.Get() >= 3 && BASE.hasNumBuildings(17, 1) > 0;
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
