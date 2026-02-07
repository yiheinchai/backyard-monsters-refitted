import { Reward } from "../Reward";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getCREATURELOCKER(): any { return require("../../../../CREATURELOCKER").CREATURELOCKER; }



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
        return getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && !getBASE().isInfernoMainYardOrOutpost;
    }

    protected override onApplication(): void {
        getCREATURELOCKER()._creatures[this._monsterID].blocked = false;
    }

    public override reset(): void {
        getCREATURELOCKER()._creatures[this._monsterID].blocked = true;
    }
}
