import { Reward } from "../../../../rewarding/Reward";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../../BASE";
import { INFERNO_MAGMA_TOWER } from "../../../../../../INFERNO_MAGMA_TOWER";

/**
 * Unlock Magma Tower in outposts reward - allows magma tower construction in outposts.
 */
export class UnlockMagmaTowerInOutposts extends Reward {
    public static readonly ID: string = "magmaTowersInOutpostsReward";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        GLOBAL._buildingProps[INFERNO_MAGMA_TOWER.ID - 1].block = false;
        GLOBAL._buildingProps[INFERNO_MAGMA_TOWER.ID - 1].quantity = [this.value];
    }

    public override removed(): void {
        GLOBAL._buildingProps[INFERNO_MAGMA_TOWER.ID - 1].block = false;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    public override canBeApplied(): boolean {
        return GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && BASE.isOutpost;
    }
}
