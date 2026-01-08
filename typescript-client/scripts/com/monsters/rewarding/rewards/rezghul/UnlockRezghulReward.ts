import { UnblockUnlockMonsterAward } from "../UnblockUnlockMonsterAward";

/**
 * Unlock Rezghul reward.
 */
export class UnlockRezghulReward extends UnblockUnlockMonsterAward {
    public static readonly k_REWARD_ID: string = "unlockRezghul";

    constructor() {
        super("C19");
    }

    protected override onApplication(): void {
        super.onApplication();
    }
}
