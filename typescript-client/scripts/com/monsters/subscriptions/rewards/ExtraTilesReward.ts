import { Reward } from "../../rewarding/Reward";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getMAP(): any { return require("../../../../MAP").MAP; }



/**
 * Extra tiles reward - unlocks extra yard tiles for subscribers.
 */
export class ExtraTilesReward extends Reward {
    public static readonly ID: string = "extraTiles";

    constructor() {
        super();
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().isAtHome();
    }

    protected override onApplication(): void {
        getMAP().swapIntBG(this.value);
    }

    public override removed(): void {
        getMAP().swapIntBG(0);
    }
}
