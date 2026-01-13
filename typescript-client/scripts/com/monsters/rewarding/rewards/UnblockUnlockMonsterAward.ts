import { UnblockMonsterAward } from "./UnblockMonsterAward";

import { CREATURELOCKER } from "../../../../CREATURELOCKER";

/**
 * Unblock and unlock monster award - both unblocks and unlocks a monster.
 */
export class UnblockUnlockMonsterAward extends UnblockMonsterAward {
    constructor(monsterID: string) {
        super(monsterID);
    }

    protected override onApplication(): void {
        CREATURELOCKER._lockerData[this._monsterID] = { t: 2 };
        super.onApplication();
    }

    public override reset(): void {
        delete CREATURELOCKER._lockerData[this._monsterID];
        super.reset();
    }
}
