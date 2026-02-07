import { Reward } from "../../../../rewarding/Reward";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../../BASE").BASE; }
function getINFERNO_MAGMA_TOWER(): any { return require("../../../../../../INFERNO_MAGMA_TOWER").INFERNO_MAGMA_TOWER; }



/**
 * Unlock Magma Tower in outposts reward - allows magma tower construction in outposts.
 */
export class UnlockMagmaTowerInOutposts extends Reward {
    public static readonly ID: string = "magmaTowersInOutpostsReward";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        getGLOBAL()._buildingProps[getINFERNO_MAGMA_TOWER().ID - 1].block = false;
        getGLOBAL()._buildingProps[getINFERNO_MAGMA_TOWER().ID - 1].quantity = [this.value];
    }

    public override removed(): void {
        getGLOBAL()._buildingProps[getINFERNO_MAGMA_TOWER().ID - 1].block = false;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isOutpost;
    }
}
