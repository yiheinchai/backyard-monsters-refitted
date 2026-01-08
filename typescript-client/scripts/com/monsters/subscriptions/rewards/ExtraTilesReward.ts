import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { MAP } from "../../../../MAP";

/**
 * Extra tiles reward - unlocks extra yard tiles for subscribers.
 */
export class ExtraTilesReward extends Reward {
    public static readonly ID: string = "extraTiles";

    constructor() {
        super();
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    protected override onApplication(): void {
        MAP.swapIntBG(this.value);
    }

    public override removed(): void {
        MAP.swapIntBG(0);
    }
}
