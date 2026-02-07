import { Reward } from "../../rewarding/Reward";

import { BUILDINGBUTTON } from "../../../../BUILDINGBUTTON";

// Lazy imports to break circular dependency chains
function getInventoryManager(): any { return require("../../inventory/InventoryManager").InventoryManager; }
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }


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
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
        BUILDINGBUTTON.setOnClickedWhenLockedCallback(DAVEStatueReward.DAVE_STATUE_TYPE_ID, callback);
    }

    public static doesStatueRewardExistsInInventory(): boolean {
        return getInventoryManager().buildingStorageCount(DAVEStatueReward.DAVE_STATUE_TYPE_ID) > 0;
    }

    public static findStatueRewardInWorld(): BFOUNDATION | null {
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].cls);
        for (const building of buildings) {
            if (building._type === DAVEStatueReward.DAVE_STATUE_TYPE_ID) {
                return building;
            }
        }
        return null;
    }

    public override canBeApplied(): boolean {
        return getGLOBAL().isAtHome();
    }

    protected override onApplication(): void {
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = true;
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = false;
        const existsInInventory: boolean = DAVEStatueReward.doesStatueRewardExistsInInventory();
        const existsInWorld: boolean = DAVEStatueReward.findStatueRewardInWorld() !== null;
        if (!existsInInventory && !existsInWorld) {
            getInventoryManager().buildingStorageAdd(DAVEStatueReward.DAVE_STATUE_TYPE_ID, 1);
        }
    }

    public override removed(): void {
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].cls);
        for (const building of buildings) {
            if (building._type === DAVEStatueReward.DAVE_STATUE_TYPE_ID) {
                building.RecycleC();
            }
        }
        getInventoryManager().buildingStorageRemove(DAVEStatueReward.DAVE_STATUE_TYPE_ID);
    }

    public override reset(): void {
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].block = false;
        getGLOBAL()._buildingProps[DAVEStatueReward.DAVE_STATUE_BUILDING_PROPS_INDEX].locked = true;
    }
}
