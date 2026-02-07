import Point from "openfl/geom/Point";

import { Reward } from "../../../../rewarding/Reward";

import { BlackSpurtzCannon } from "../../../../../../BlackSpurtzCannon";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../../../managers/InstanceManager").InstanceManager; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../../BASE").BASE; }
function getGRID(): any { return require("../../../../../../GRID").GRID; }
function getBFOUNDATION(): any { return require("../../../../../../BFOUNDATION").BFOUNDATION; }
function getSpurtzCannon(): any { return require("../../../../../../SpurtzCannon").SpurtzCannon; }


/**
 * Spurtz Cannon reward 3 - upgrades all Spurtz Cannons to Black Spurtz Cannons.
 */
export class SpurtzCannonReward3 extends Reward {
    public static readonly ID: string = "spurtzCannonReward3";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        const cannons: Array<any> = getInstanceManager().getInstancesByClass(getSpurtzCannon());
        for (const cannon of cannons) {
            if ((cannon instanceof BlackSpurtzCannon) === false) {
                this.swapBuildings(cannon, getBASE().addBuildingC(BlackSpurtzCannon.TYPE));
            }
        }
        getGLOBAL()._buildingProps[BlackSpurtzCannon.TYPE - 1].block = false;
        getGLOBAL()._buildingProps[BlackSpurtzCannon.TYPE - 1].quantity = [2];
        getGLOBAL()._buildingProps[getSpurtzCannon().TYPE - 1].block = true;
    }

    public override removed(): void {
        getGLOBAL()._buildingProps[BlackSpurtzCannon.TYPE - 1].block = true;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    private swapBuildings(oldBuilding: BFOUNDATION, newBuilding: BFOUNDATION): void {
        const gridPos: Point = getGRID().FromISO(oldBuilding.x, oldBuilding.y);
        const buildingData: Record<string, any> = {
            "X": gridPos.x,
            "Y": gridPos.y,
            "t": newBuilding._type,
            "id": oldBuilding._id,
            "l": oldBuilding._lvl.Get()
        };
        oldBuilding.RecycleC();
        newBuilding.Setup(buildingData);
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().isAtHome();
    }
}
