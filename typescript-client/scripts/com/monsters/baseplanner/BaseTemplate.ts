import { IExportable } from "../interfaces/IExportable";
import { BaseTemplateNode } from "./BaseTemplateNode";

/**
 * Base template - represents a saved base layout.
 */
export class BaseTemplate implements IExportable {
    public name: string;
    public nodes: Array<BaseTemplateNode>;
    public slot: number = 0;

    constructor(name: string | null = null, nodes: Array<BaseTemplateNode> | null = null) {
        this.name = name ? name : "";
        if (nodes) {
            this.nodes = nodes;
        } else {
            this.nodes = [];
        }
    }

    public addNode(node: BaseTemplateNode): void {
        this.nodes.push(node);
    }

    public exportData(): any {
        const data: any = {};
        for (let i = 0; i < this.nodes.length; i++) {
            data[i] = this.nodes[i].exportData();
        }
        return data;
    }

    public importData(data: any): void {
        for (const key in data) {
            const item = data[key];
            if (!(typeof item === "number")) {
                const node = new BaseTemplateNode();
                node.importData(item);
                this.nodes.push(node);
            }
        }
    }

    public toString(): string {
        return this.name + "(" + this.slot + ")";
    }

    public getNodeFromBuildingID(buildingId: number): boolean {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (node.id === buildingId) {
                return true;
            }
        }
        return false;
    }
}
