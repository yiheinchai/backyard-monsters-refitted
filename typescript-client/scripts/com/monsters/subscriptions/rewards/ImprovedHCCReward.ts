import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { HATCHERYCC } from "../../../../HATCHERYCC";
import { MAPROOM_DESCENT } from "../../../../MAPROOM_DESCENT";

/**
 * Improved HCC reward - enhanced hatchery control center for subscribers.
 */
export class ImprovedHCCReward extends Reward {
    public static readonly ID: string = "improvedHCC";

    private readonly _QUEUE_LIMIT: number = 30;

    constructor() {
        super();
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    protected override onApplication(): void {
        HATCHERYCC.queueLimit = this._QUEUE_LIMIT;
        if (MAPROOM_DESCENT.DescentPassed) {
            HATCHERYCC.doesShowInfernoCreeps = true;
        }
    }

    public override reset(): void {
        this.removed();
    }

    public override removed(): void {
        HATCHERYCC.queueLimit = HATCHERYCC.DEFAULT_QUEUE_LIMIT;
        HATCHERYCC.doesShowInfernoCreeps = false;
    }
}
