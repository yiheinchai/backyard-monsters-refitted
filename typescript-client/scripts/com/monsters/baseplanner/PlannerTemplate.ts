import Point from "openfl/geom/Point";

import { InstanceManager } from "../managers/InstanceManager";
import { BaseTemplate } from "./BaseTemplate";
import { BaseTemplateNode } from "./BaseTemplateNode";
import { PlannerNode } from "./PlannerNode";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { GRID } from "../../../GRID";
import { YARD_PROPS } from "../../../YARD_PROPS";

/**
 * PlannerTemplate - represents a saved base layout template.
 */
export class PlannerTemplate {
    public static readonly _DECORATION_ID: number = 1000000;

    public slot: number = 0;
    public name: string = "";
    public inventoryData: Array<PlannerNode> = [];
    public displayData: Array<PlannerNode> = [];
    private _savableData: BaseTemplate | null = null;

    constructor(template: BaseTemplate | null = null) {
        this.inventoryData = [];
        this.displayData = [];
        if (template) {
            this.importData(template);
        }
    }

    public exportData(): BaseTemplate {
        const result = new BaseTemplate(this.name);
        const nodes: Array<BaseTemplateNode> = [];
        for (let i = 0; i < this.displayData.length; i++) {
            const node = this.displayData[i];
            if (!BASE.isBuildingIgnoredInYardPlannerSave(node.building)) {
                nodes.push(new BaseTemplateNode(node.x, node.y, node.id, node.type));
            }
        }
        result.nodes = nodes;
        result.slot = this.slot;
        return result;
    }

    public importData(template: BaseTemplate): void {
        this._savableData = template;
        this.name = this._savableData.name;
        this.slot = this._savableData.slot;
        this.getPlannerDataFromTemplate(template);
    }

    private getPlannerDataFromTemplate(template: BaseTemplate): void {
        this.displayData.length = 0;
        this.inventoryData.length = 0;
        const unassignedNodes: Array<BaseTemplateNode> = [];
        for (let i = 0; i < template.nodes.length; i++) {
            const templateNode = template.nodes[i];
            const building = this.getBuildingFromNode(templateNode);
            if (!building) {
                unassignedNodes.push(templateNode);
            } else {
                const plannerNode = new PlannerNode(building, templateNode.x, templateNode.y);
                this.displayData.push(plannerNode);
            }
        }
        const unusedNodes = this.getNodesFromUnusedBuildings(template);
        for (let i = 0; i < unusedNodes.length; i++) {
            const node = unusedNodes[i];
            if (node.category === "misc") {
                const pt = GRID.FromISO(node.building.x, node.building.y);
                node.x = pt.x;
                node.y = pt.y;
                this.displayData.push(node);
            } else {
                this.inventoryData.push(node);
            }
        }
        const storedNodes = this.getNodesFromStoredBuildings();
        for (let i = 0; i < storedNodes.length; i++) {
            let found = false;
            const unassignedLen = unassignedNodes.length;
            for (let j = 0; j < unassignedLen; j++) {
                if (storedNodes[i].type === unassignedNodes[j].type) {
                    storedNodes[i].x = unassignedNodes[j].x;
                    storedNodes[i].y = unassignedNodes[j].y;
                    unassignedNodes.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (found) {
                this.displayData.push(storedNodes[i]);
            } else {
                this.inventoryData.push(storedNodes[i]);
            }
        }
    }

    private getBuildingFromNode(templateNode: BaseTemplateNode): BFOUNDATION | null {
        return BASE.getBuildingByID(templateNode.id);
    }

    private getNodesFromUnusedBuildings(template: BaseTemplate): Array<PlannerNode> {
        const buildings = BASE.getYardPlannerBuildings();
        const result: Array<PlannerNode> = [];
        for (const building of buildings) {
            if (!template.getNodeFromBuildingID(building._id)) {
                result.push(new PlannerNode(building));
            }
        }
        return result;
    }

    private getNodesFromStoredBuildings(): Array<PlannerNode> {
        const result: Array<PlannerNode> = [];
        if (BASE._buildingsStored) {
            for (const key in BASE._buildingsStored) {
                if (key.charAt(1) !== "l") {
                    const buildingType = parseInt(key.substr(key.indexOf("b") + 1));
                    const count = BASE._buildingsStored[key].Get();

                    if (YARD_PROPS._yardProps[buildingType - 1] && YARD_PROPS._yardProps[buildingType - 1].cls === null) {
                        continue;
                    }

                    for (let i = 0; i < count; i++) {
                        const data: Record<string, any> = {};
                        data.t = buildingType;
                        data.x = 0;
                        data.y = 0;
                        data.id = PlannerTemplate._DECORATION_ID;
                        let level = 1;
                        if (BASE._buildingsStored["bl" + buildingType]) {
                            level = BASE._buildingsStored["bl" + buildingType].Get();
                        }
                        data.l = level;
                        const building = new BFOUNDATION();
                        InstanceManager.removeInstance(building);
                        building._id = PlannerTemplate._DECORATION_ID;
                        building._type = buildingType;
                        building._lvl.Set(level);
                        building._fortification.Set(0);
                        building._range = 0;
                        result.push(new PlannerNode(building));
                    }
                }
            }
        }
        return result;
    }
}
