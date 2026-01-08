import { UnblockUnlockMonsterAward } from "../UnblockUnlockMonsterAward";

/**
 * Unlock Vorg reward.
 */
export class UnlockVorgReward extends UnblockUnlockMonsterAward {
    public static readonly ID: string = "unlockVorg";

    constructor() {
        super("C16");
    }
}
