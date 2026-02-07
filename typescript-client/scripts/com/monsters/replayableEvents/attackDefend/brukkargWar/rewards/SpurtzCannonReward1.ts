import { Reward } from "../../../../rewarding/Reward";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getSpurtzCannon(): any { return require("../../../../../../SpurtzCannon").SpurtzCannon; }



/**
 * Spurtz Cannon reward 1 - unlocks the first spurtz cannon for Brukkarg War.
 */
export class SpurtzCannonReward1 extends Reward {
    public static readonly ID: string = "spurtzCannonReward";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        getGLOBAL()._buildingProps[getSpurtzCannon().TYPE - 1].block = false;
        getGLOBAL()._buildingProps[getSpurtzCannon().TYPE - 1].quantity = [1];
    }

    public override removed(): void {
        getGLOBAL()._buildingProps[getSpurtzCannon().TYPE - 1].block = true;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().isAtHome();
    }
}
