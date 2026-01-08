import { BasePlanner } from "../../baseplanner/BasePlanner";
import { Reward } from "../../rewarding/Reward";
import { SubscriptionHandler } from "../SubscriptionHandler";

import { GLOBAL } from "../../../../GLOBAL";

/**
 * Yard planner extra slots reward - unlocks extra planner slots for subscribers.
 */
export class YardPlannerExtraSlotsReward extends Reward {
    public static readonly ID: string = "yardPlannerExtraSlots";

    constructor() {
        super();
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    protected override onApplication(): void {
        BasePlanner.slots = SubscriptionHandler.isEnabledForAll ? 10 : BasePlanner.DEFAULT_NUMBER_OF_SLOTS;
    }

    public override reset(): void {
        this.removed();
    }

    public override removed(): void {
        BasePlanner.slots = BasePlanner.DEFAULT_NUMBER_OF_SLOTS;
    }
}
