import { Point } from "openfl/geom/Point";

import { SecNum } from "../../cc/utils/SecNum";
import { BaseTemplateNode } from "../baseplanner/BaseTemplateNode";
import { PlannerTemplate } from "../baseplanner/PlannerTemplate";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BTOTEM } from "../../../BTOTEM";
import { GRID } from "../../../GRID";

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
        if (!BASE._buildingsStored["b" + buildingType]) {
            BASE._buildingsStored["b" + buildingType] = new SecNum(0);
        }
        BASE._buildingsStored["b" + buildingType].Add(1);
        
        if (BTOTEM.IsTotem(buildingType) || BTOTEM.IsTotem2(buildingType)) {
            BASE._buildingsStored["bl" + buildingType] = new SecNum(level);
        }
    }

    public static buildingStorageRemove(buildingType: number): number {
        if (BASE._buildingsStored["b" + buildingType]) {
            if (BASE._buildingsStored["b" + buildingType].Get() >= 1) {
                BASE._buildingsStored["b" + buildingType].Add(-1);
                let level = 1;
                
                if (BASE._buildingsStored["bl" + buildingType]) {
                    level = BASE._buildingsStored["bl" + buildingType].Get();
                    delete BASE._buildingsStored["bl" + buildingType];
                }
                return level;
            }
        }
        return 0;
    }

    public static buildingStorageCount(buildingType: number): number {
        if (BASE._buildingsStored["b" + buildingType]) {
            return BASE._buildingsStored["b" + buildingType].Get();
        }
        return 0;
    }

    public static getBuildingFromNode(node: BaseTemplateNode): BFOUNDATION | null {
        let building: BFOUNDATION | null = null;
        const isoPos = GRID.ToISO(node.x, node.y, 0);
        
        if (node.id === PlannerTemplate._DECORATION_ID) {
            const buildingType = node.type;
            building = BASE.addBuildingC(buildingType);
            
            const buildData: any = {
                X: node.x,
                Y: node.y,
                t: buildingType,
                id: BASE._buildingCount++
            };
            
            if (BASE._buildingsStored["bl" + buildingType]) {
                buildData.l = BASE._buildingsStored["bl" + buildingType].Get();
            }
            
            building.Setup(buildData);
            node.id = building._id;
            BASE._buildingsStored["b" + buildingType].Set(BASE._buildingsStored["b" + buildingType].Get() - 1);
        } else {
            building = BASE.getBuildingByID(node.id);
        }
        
        return building;
    }
}
