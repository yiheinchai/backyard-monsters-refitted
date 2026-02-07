import { Reward } from "../../rewarding/Reward";

import { HATCHERYCC } from "../../../../HATCHERYCC";
import { MAPROOM_DESCENT } from "../../../../MAPROOM_DESCENT";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }


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
        return getGLOBAL().isAtHome();
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
