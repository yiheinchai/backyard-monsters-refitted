import Point from "openfl/geom/Point";

import { SecNum } from "../../cc/utils/SecNum";
import { BaseTemplateNode } from "../baseplanner/BaseTemplateNode";
import { PlannerTemplate } from "../baseplanner/PlannerTemplate";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../BFOUNDATION").BFOUNDATION; }
function getBTOTEM(): any { return require("../../../BTOTEM").BTOTEM; }
function getGRID(): any { return require("../../../GRID").GRID; }



/**
 * Instance enforcer for singleton pattern
 */
class InstanceEnforcer {}

/**
 * Inventory manager - manages building storage inventory.
 */
export class InventoryManager {
    constructor(enforcer: InstanceEnforcer) {}

    public static buildingStorageAdd(buildingType: number, level: number = 0): void {
        if (!getBASE()._buildingsStored["b" + buildingType]) {
            getBASE()._buildingsStored["b" + buildingType] = new SecNum(0);
        }
        getBASE()._buildingsStored["b" + buildingType].Add(1);
        
        if (getBTOTEM().IsTotem(buildingType) || getBTOTEM().IsTotem2(buildingType)) {
            getBASE()._buildingsStored["bl" + buildingType] = new SecNum(level);
        }
    }

    public static buildingStorageRemove(buildingType: number): number {
        if (getBASE()._buildingsStored["b" + buildingType]) {
            if (getBASE()._buildingsStored["b" + buildingType].Get() >= 1) {
                getBASE()._buildingsStored["b" + buildingType].Add(-1);
                let level = 1;
                
                if (getBASE()._buildingsStored["bl" + buildingType]) {
                    level = getBASE()._buildingsStored["bl" + buildingType].Get();
                    delete getBASE()._buildingsStored["bl" + buildingType];
                }
                return level;
            }
        }
        return 0;
    }

    public static buildingStorageCount(buildingType: number): number {
        if (getBASE()._buildingsStored["b" + buildingType]) {
            return getBASE()._buildingsStored["b" + buildingType].Get();
        }
        return 0;
    }

    public static getBuildingFromNode(node: BaseTemplateNode): BFOUNDATION | null {
        let building: BFOUNDATION | null = null;
        const isoPos = getGRID().ToISO(node.x, node.y, 0);
        
        if (node.id === PlannerTemplate._DECORATION_ID) {
            const buildingType = node.type;
            building = getBASE().addBuildingC(buildingType);
            
            const buildData: any = {
                X: node.x,
                Y: node.y,
                t: buildingType,
                id: getBASE()._buildingCount++
            };
            
            if (getBASE()._buildingsStored["bl" + buildingType]) {
                buildData.l = getBASE()._buildingsStored["bl" + buildingType].Get();
            }
            
            building.Setup(buildData);
            node.id = building._id;
            getBASE()._buildingsStored["b" + buildingType].Set(getBASE()._buildingsStored["b" + buildingType].Get() - 1);
        } else {
            building = getBASE().getBuildingByID(node.id);
        }
        
        return building;
    }
}
