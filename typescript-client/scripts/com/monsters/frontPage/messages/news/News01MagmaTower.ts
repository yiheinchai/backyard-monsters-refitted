import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { BUILDING14 } from "../../../../../BUILDING14";
import { INFERNO_MAGMA_TOWER } from "../../../../../INFERNO_MAGMA_TOWER";

/**
 * News 01 - Magma Tower news message.
 */
export class News01MagmaTower extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (GLOBAL.StatGet(BUILDING14.UNDERHALL_LEVEL) >= 1) {
            buttonCopy = "btn_buildnow";
        }
        super("3_14_0", buttonCopy);
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "magmaabove.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return !GLOBAL._flags.viximo && !GLOBAL._flags.kongregate;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(INFERNO_MAGMA_TOWER.ID);
    }
}
