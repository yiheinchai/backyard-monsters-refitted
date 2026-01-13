import { UnblockMonsterAward } from "../UnblockMonsterAward";

/**
 * Unblock Vorg reward.
 */
export class UnblockVorgReward extends UnblockMonsterAward {
    public static readonly ID: string = "unblockVorg";

    constructor() {
        super("C16");
    }
}
