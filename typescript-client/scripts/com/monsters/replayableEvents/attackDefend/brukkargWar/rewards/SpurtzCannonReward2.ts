import { Reward } from "../../../../rewarding/Reward";

import { GLOBAL } from "../../../../../../GLOBAL";
import { SpurtzCannon } from "../../../../../../SpurtzCannon";

/**
 * Spurtz Cannon reward 2 - unlocks the second spurtz cannon for Brukkarg War.
 */
export class SpurtzCannonReward2 extends Reward {
    public static readonly ID: string = "spurtzCannonReward2";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        GLOBAL._buildingProps[SpurtzCannon.TYPE - 1].block = false;
        GLOBAL._buildingProps[SpurtzCannon.TYPE - 1].quantity = [2];
    }

    public override removed(): void {
        GLOBAL._buildingProps[SpurtzCannon.TYPE - 1].block = true;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }
}
