import { Reward } from "../Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { BASE } from "../../../../BASE";
import { CREATURELOCKER } from "../../../../CREATURELOCKER";

/**
 * Unblock monster award - reward that unblocks a specific monster.
 */
export class UnblockMonsterAward extends Reward {
    protected _monsterID: string;

    constructor(monsterID: string) {
        super();
        this._monsterID = monsterID;
    }

    public override canBeApplied(): boolean {
        return GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && !BASE.isInfernoMainYardOrOutpost;
    }

    protected override onApplication(): void {
        CREATURELOCKER._creatures[this._monsterID].blocked = false;
    }

    public override reset(): void {
        CREATURELOCKER._creatures[this._monsterID].blocked = true;
    }
}
