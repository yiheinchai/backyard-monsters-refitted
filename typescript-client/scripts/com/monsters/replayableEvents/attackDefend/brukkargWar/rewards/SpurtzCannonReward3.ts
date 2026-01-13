import Point from "openfl/geom/Point";

import { InstanceManager } from "../../../../managers/InstanceManager";
import { Reward } from "../../../../rewarding/Reward";

import { GLOBAL } from "../../../../../GLOBAL";
import { BASE } from "../../../../../../BASE";
import { GRID } from "../../../../../../GRID";
import { BFOUNDATION } from "../../../../../../BFOUNDATION";
import { SpurtzCannon } from "../../../../../../SpurtzCannon";
import { BlackSpurtzCannon } from "../../../../../../BlackSpurtzCannon";

/**
 * Spurtz Cannon reward 3 - upgrades all Spurtz Cannons to Black Spurtz Cannons.
 */
export class SpurtzCannonReward3 extends Reward {
    public static readonly ID: string = "spurtzCannonReward3";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        const cannons: Array<any> = InstanceManager.getInstancesByClass(SpurtzCannon);
        for (const cannon of cannons) {
            if ((cannon instanceof BlackSpurtzCannon) === false) {
                this.swapBuildings(cannon, BASE.addBuildingC(BlackSpurtzCannon.TYPE));
            }
        }
        GLOBAL._buildingProps[BlackSpurtzCannon.TYPE - 1].block = false;
        GLOBAL._buildingProps[BlackSpurtzCannon.TYPE - 1].quantity = [2];
        GLOBAL._buildingProps[SpurtzCannon.TYPE - 1].block = true;
    }

    public override removed(): void {
        GLOBAL._buildingProps[BlackSpurtzCannon.TYPE - 1].block = true;
    }

    public override reset(): void {
        if (this.canBeApplied()) {
            this.removed();
        }
    }

    private swapBuildings(oldBuilding: BFOUNDATION, newBuilding: BFOUNDATION): void {
        const gridPos: Point = GRID.FromISO(oldBuilding.x, oldBuilding.y);
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
        return GLOBAL.isAtHome();
    }
}
