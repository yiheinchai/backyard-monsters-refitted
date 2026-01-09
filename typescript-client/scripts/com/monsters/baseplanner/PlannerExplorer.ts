import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";

import { BuildingItem } from "./components/BuildingItem";
import { PlannerExplorerButton } from "./components/PlannerExplorerButton";
import { PlannerExplorerHeader } from "./components/PlannerExplorerHeader";
import { BasePlannerNodeEvent } from "./events/BasePlannerNodeEvent";
import { BasePlannerPopup } from "./popups/BasePlannerPopup";
import { PlannerNode } from "./PlannerNode";

/**
 * Planner explorer - sidebar for browsing and selecting buildings in the base planner.
 */
export class PlannerExplorer extends Sprite {
    public static readonly EXPLORER_ITEM_CLICK: string = "explorer_item_click";
    public static readonly EXPLORER_ITEM_OVER: string = "explorer_item_over";
    public static readonly EXPLORER_ITEM_OUT: string = "explorer_item_out";
    public static readonly EXPLORER_CHANGE: string = "explorer_change";

    private _canvas: Sprite;
    private _layerHeaders: Sprite;
    private _inventoryData: Array<PlannerNode>;
    private _headers: Array<PlannerExplorerHeader>;
    private _lastClickedItem: string = "";

    constructor(inventoryData: Array<PlannerNode>) {
        super();
        this._inventoryData = inventoryData;
        this._canvas = new Sprite();
        this.addChild(this._canvas);
        this._layerHeaders = new Sprite();
        this._canvas.addChild(this._layerHeaders);
        this.addEventListener(MouseEvent.CLICK, this.onClick.bind(this));
        this._canvas.x = 0;
        this._canvas.y = 0;
        this._headers = [];
        this._headers[0] = new PlannerExplorerHeader(BuildingItem.TYPE_DEFENSIVE);
        this._headers[1] = new PlannerExplorerHeader(BuildingItem.TYPE_BUILDING);
        this._headers[2] = new PlannerExplorerHeader(BuildingItem.TYPE_RESOURCE);
        this._headers[3] = new PlannerExplorerHeader(BuildingItem.TYPE_TRAP);
        this._headers[4] = new PlannerExplorerHeader(BuildingItem.TYPE_WALL);
        this._headers[5] = new PlannerExplorerHeader(BuildingItem.TYPE_DECORATION);
        for (let i = 0; i < this._headers.length; i++) {
            this._layerHeaders.addChild(this._headers[i]);
            this._headers[i].addEventListener(PlannerExplorer.EXPLORER_CHANGE, this.onExplorerUpdate.bind(this));
        }
    }

    private sortInventoryData(): void {
        this._inventoryData.sort(this.plannerNodeSort.bind(this));
    }

    private plannerNodeSort(a: PlannerNode, b: PlannerNode): number {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        if (a.level < b.level) {
            return -1;
        }
        if (a.level > b.level) {
            return 1;
        }
        return 0;
    }

    public setup(): void {
        this.sortInventoryData();
        for (let i = 0; i < this._inventoryData.length; i++) {
            this.addElement(this._inventoryData[i], false, false);
        }
        this.reposition();
    }

    public redraw(): void {
        this.clearHeaders();
        this.setup();
    }

    private clearHeaders(): void {
        for (let i = 0; i < this._headers.length; i++) {
            this._headers[i].clear();
        }
    }

    public clearSelections(clearLast: boolean = false): void {
        if (clearLast) {
            this._lastClickedItem = "";
        }
        for (let i = 0; i < this._headers.length; i++) {
            this._headers[i].deselectChildren(this._lastClickedItem);
        }
    }

    public addElement(node: PlannerNode, reposition: boolean = true, addToData: boolean = true): void {
        const categoryIdx = this.getCategoryIndex(node.category);
        if (categoryIdx >= this._headers.length) {
            return;
        }
        const button = this._headers[categoryIdx].addElement(node);
        if (addToData) {
            this._inventoryData.push(node);
        }
        if (button.isNew()) {
            button.addEventListener(PlannerExplorer.EXPLORER_ITEM_CLICK, this.onClickBuilding.bind(this) as any);
            button.addEventListener(PlannerExplorer.EXPLORER_ITEM_OVER, this.onOverBuilding.bind(this) as any);
            button.addEventListener(PlannerExplorer.EXPLORER_ITEM_OUT, this.onOutBuilding.bind(this) as any);
        }
        this.sortInventoryData();
        if (reposition) {
            this.reposition();
        }
    }

    public onClick(event: MouseEvent | null = null): void {
        this.reposition();
    }

    public onClickBuilding(event: BasePlannerNodeEvent): void {
        const categoryIdx = this.getCategoryIndex(event.node.category);
        this._lastClickedItem = event.node.displayName;
        this.reposition();
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.EXPLORER_BUILDING_CLICK, event.node));
    }

    public onOverBuilding(event: BasePlannerNodeEvent): void {
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.PLANNER_HINT, event.node));
    }

    public onOutBuilding(event: BasePlannerNodeEvent): void {
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.PLANNER_HINT_HIDE, event.node));
    }

    public clear(): void {
        this.clearHeaders();
        this.reposition();
        this.removeEventListener(MouseEvent.CLICK, this.onClick.bind(this));
    }

    public onExplorerUpdate(event: Event | null = null): void {
        this.dispatchEvent(new Event(BasePlannerPopup.EXPLORER_UPDATE));
    }

    public removeBuilding(event: BasePlannerNodeEvent): void {
        const categoryIdx = this.getCategoryIndex(event.node.category);
        this._headers[categoryIdx].removeNode(event.node);
        this._inventoryData.splice(this._inventoryData.indexOf(event.node), 1);
        this.reposition();
    }

    private getCategoryIndex(category: string): number {
        let idx: number = 0;
        switch (category) {
            case BuildingItem.TYPE_DEFENSIVE:
                idx = 0;
                break;
            case BuildingItem.TYPE_BUILDING:
                idx = 1;
                break;
            case BuildingItem.TYPE_RESOURCE:
                idx = 2;
                break;
            case BuildingItem.TYPE_TRAP:
                idx = 3;
                break;
            case BuildingItem.TYPE_WALL:
                idx = 4;
                break;
            case BuildingItem.TYPE_DECORATION:
                idx = 5;
                break;
            case BuildingItem.TYPE_MISC:
                idx = 6;
                break;
        }
        return idx;
    }

    public reposition(updateLayout: boolean = true): void {
        let yPos: number = 0;
        const headersCount = this._headers.length;
        for (let i = 0; i < headersCount; i++) {
            this._headers[i].y = yPos;
            yPos += this._headers[i].rePosition() + this._headers[i].mc.height;
        }
    }
}
