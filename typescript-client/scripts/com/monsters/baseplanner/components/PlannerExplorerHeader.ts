import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { PlannerExplorer } from "../PlannerExplorer";
import { PlannerNode } from "../PlannerNode";
import { BuildingItem } from "./BuildingItem";
import { PlannerExplorerButton } from "./PlannerExplorerButton";
import { PlannerItem } from "./PlannerItem";
import { BasePlannerPopup_ExplorerItem_Category } from "../../../../BasePlannerPopup_ExplorerItem_Category";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../KEYS").KEYS; }



/**
 * Planner explorer header - collapsible category header in the base planner sidebar.
 */
export class PlannerExplorerHeader extends PlannerItem {
    public _category: string;
    private _collapsed: boolean = false;
    private _elementList: Array<PlannerExplorerButton> = [];

    constructor(category: string) {
        super();
        this._category = category;
        this._elementList = [];
        this.mc = new BasePlannerPopup_ExplorerItem_Category();
        this.addChild(this.mc);
        let label: string;
        switch (category) {
            case BuildingItem.TYPE_DEFENSIVE:
                label = getKEYS().Get("basePlanner_catDefensive");
                break;
            case BuildingItem.TYPE_BUILDING:
                label = getKEYS().Get("basePlanner_catBuilding");
                break;
            case BuildingItem.TYPE_RESOURCE:
                label = getKEYS().Get("basePlanner_catResource");
                break;
            case BuildingItem.TYPE_DECORATION:
                label = getKEYS().Get("basePlanner_catDecoration");
                break;
            case BuildingItem.TYPE_TRAP:
                label = getKEYS().Get("basePlanner_catTrap");
                break;
            case BuildingItem.TYPE_WALL:
                label = getKEYS().Get("basePlanner_catWall");
                break;
            case BuildingItem.TYPE_MISC:
            default:
                label = getKEYS().Get("basePlanner_catMisc");
        }
        this.mc.tLabel.htmlText = label;
        this.mc.mcCarrot.rotation = 90;
        this.mc.mcBG.gotoAndStop(category);
        this.mc.mcFrame.gotoAndStop("off");
        this.emptyCheck();
    }

    public override onClick(event: MouseEvent | null = null): void {
        if (this._collapsed) {
            this.expand();
        } else {
            this.collapse();
        }
        this.dispatchEvent(new Event(PlannerExplorer.EXPLORER_CHANGE));
    }

    private expand(): void {
        this._collapsed = false;
        for (let i = 0; i < this._elementList.length; i++) {
            this._elementList[i].alpha = 1;
        }
        this.mc.mcCarrot.rotation = 90;
    }

    private collapse(): void {
        this._collapsed = true;
        for (let i = 0; i < this._elementList.length; i++) {
            this._elementList[i].alpha = 0;
        }
        this.mc.mcCarrot.rotation = 0;
    }

    private emptyCheck(): void {
        if (this._elementList.length === 0) {
            this.mc.mcCarrot.visible = false;
        } else {
            this.mc.mcCarrot.visible = true;
        }
    }

    public clear(): void {
        for (let i = 0; i < this._elementList.length; i++) {
            this._elementList[i].clear();
        }
        this._elementList.length = 0;
        this.emptyCheck();
        let idx = 0;
        while (this.numChildren > 1) {
            if (this.getChildAt(idx) !== this.mc) {
                this.removeChildAt(idx);
            } else {
                idx++;
            }
        }
    }

    public deselectChildren(lastClicked: string | null = null): void {
        for (let i = 0; i < this._elementList.length; i++) {
            this._elementList[i].cleanSelection(lastClicked);
        }
    }

    public removeNode(node: PlannerNode): void {
        for (let i = 0; i < this._elementList.length; i++) {
            if (this._elementList[i].displayName === node.displayName) {
                this._elementList[i].decrement();
                if (this._elementList[i].numBuildings <= 0) {
                    const button = this._elementList[i];
                    button.x = 30000;
                    this._elementList.splice(i, 1);
                    this.removeChild(button);
                    button.clear();
                }
            }
        }
        this.emptyCheck();
    }

    public override update(): void {
    }

    public rePosition(): number {
        let yPos: number = 0;
        for (let i = 0; i < this._elementList.length; i++) {
            this._elementList[i].x = 0;
            if (this._collapsed) {
                this._elementList[i].y = 0;
            } else {
                yPos += this._elementList[i].height;
                this._elementList[i].y = yPos;
            }
        }
        return yPos;
    }

    public addElement(node: PlannerNode): PlannerExplorerButton | null {
        let isNew: boolean = true;
        for (let i = 0; i < this._elementList.length; i++) {
            if (this._elementList[i].displayName === node.displayName) {
                this._elementList[i].increment(node);
                isNew = false;
                this.emptyCheck();
                return this._elementList[i];
            }
        }
        if (isNew) {
            const button = new PlannerExplorerButton(node);
            this._elementList.push(button);
            this._elementList.sort(this.sortExplorerButtons.bind(this));
            this.addChild(button);
            if (this._collapsed) {
                button.alpha = 0;
            }
            this.emptyCheck();
            return button;
        }
        return null;
    }

    private sortExplorerButtons(a: PlannerExplorerButton, b: PlannerExplorerButton): number {
        if (a.displayName < b.displayName) {
            return -1;
        }
        if (a.displayName > b.displayName) {
            return 1;
        }
        return 0;
    }

    public override onRollOver(event: MouseEvent | null = null): void {
        this.mc.mcFrame.gotoAndStop("on");
    }

    public override onRollOut(event: MouseEvent | null = null): void {
        this.mc.mcFrame.gotoAndStop("off");
    }

    public override onMouseDown(event: MouseEvent | null = null): void {
    }

    public override onMouseUp(event: MouseEvent | null = null): void {
    }
}
