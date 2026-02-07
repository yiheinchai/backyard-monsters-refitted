import { UnblockMonsterAward } from "./UnblockMonsterAward";

// Lazy imports to break circular dependency chains
function getCREATURELOCKER(): any { return require("../../../../CREATURELOCKER").CREATURELOCKER; }



/**
 * Unblock and unlock monster award - both unblocks and unlocks a monster.
 */
export class UnblockUnlockMonsterAward extends UnblockMonsterAward {
    constructor(monsterID: string) {
        super(monsterID);
    }

    protected override onApplication(): void {
        getCREATURELOCKER()._lockerData[this._monsterID] = { t: 2 };
        super.onApplication();
    }

    public override reset(): void {
        delete getCREATURELOCKER()._lockerData[this._monsterID];
        super.reset();
    }
}
