import { KeywordMessage } from "../KeywordMessage";

import { POPUPS } from "../../../../../POPUPS";
import { BUILDINGOPTIONS } from "../../../../../BUILDINGOPTIONS";
import { GLOBAL } from "../../../../../GLOBAL";

/**
 * News 06 - Town Hall Level 10 news message.
 */
export class News06TownHallLevel10 extends KeywordMessage {
    constructor() {
        super("townhall10", "btn_upgradenow");
    }

    protected override onButtonClick(): void {
        POPUPS.Next();
        BUILDINGOPTIONS.Show(GLOBAL.townHall, "upgrade");
    }

    public override get areRequirementsMet(): boolean {
        return GLOBAL.townHall._lvl.Get() === 9;
    }
}
