import { InventoryManager } from "../../inventory/InventoryManager";
import { InstanceManager } from "../../managers/InstanceManager";
import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";
import { BUILDINGBUTTON } from "../../../../BUILDINGBUTTON";
import { BFOUNDATION } from "../../../../BFOUNDATION";

/**
 * DAVE statue reward - subscription reward that grants decorative DAVE statue.
 */
export class DAVEStatueReward extends Reward {
    public static readonly ID: string = "daveStatue";
    public static readonly DAVE_STATUE_TYPE_ID: number = 135;
    private static readonly DAVE_STATUE_BUILDING_PROPS_INDEX: number = DAVEStatueReward.DAVE_STATUE_TYPE_ID - 1;

    constructor() {
        super();
    }

    public static unlockTeaserInformation(callback: Function): void {
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
        BUILDINGBUTTON.setOnClickedWhenLockedCallback(DAVEStatueReward.DAVE_STATUE_TYPE_ID, callback);
    }

    public static doesStatueRewardExistsInInventory(): boolean {
        return InventoryManager.buildingStorageCount(DAVEStatueReward.DAVE_STATUE_TYPE_ID) > 0;
    }

    public static findStatueRewardInWorld(): BFOUNDATION | null {
        const buildings: Array<any> = InstanceManager.getInstancesByClass(GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].cls);
        for (const building of buildings) {
            if (building._type === DAVEStatueReward.DAVE_STATUE_TYPE_ID) {
                return building;
            }
        }
        return null;
    }

    public override canBeApplied(): boolean {
        return GLOBAL.isAtHome();
    }

    protected override onApplication(): void {
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = true;
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = false;
        const existsInInventory: boolean = DAVEStatueReward.doesStatueRewardExistsInInventory();
        const existsInWorld: boolean = DAVEStatueReward.findStatueRewardInWorld() !== null;
        if (!existsInInventory && !existsInWorld) {
            InventoryManager.buildingStorageAdd(DAVEStatueReward.DAVE_STATUE_TYPE_ID, 1);
        }
    }

    public override removed(): void {
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
        const buildings: Array<any> = InstanceManager.getInstancesByClass(GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].cls);
        for (const building of buildings) {
            if (building._type === DAVEStatueReward.DAVE_STATUE_TYPE_ID) {
                building.RecycleC();
            }
        }
        InventoryManager.buildingStorageRemove(DAVEStatueReward.DAVE_STATUE_TYPE_ID);
    }

    public override reset(): void {
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        GLOBAL._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
    }
}
