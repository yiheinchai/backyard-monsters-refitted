import { MouseEvent } from "openfl/events/MouseEvent";

import { PlannerExplorer } from "../PlannerExplorer";
import { PlannerNode } from "../PlannerNode";
import { BasePlannerNodeEvent } from "../events/BasePlannerNodeEvent";
import { PlannerItem } from "./PlannerItem";

import { PLANNER } from "../../../../PLANNER";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="BasePlannerPopup_ExplorerItem_Type")]
/**
 * Planner explorer button - building type button in base planner explorer.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlannerPopup_ExplorerItem_Type" })
export class PlannerExplorerButton extends PlannerItem {
    private _nodeList: Array<PlannerNode>;
    private _clicked: boolean;

    constructor(node: PlannerNode) {
        super();
        this._nodeList = [];
        this.mc = new (window as any).BasePlannerPopup_ExplorerItem_Type();
        this.addChild(this.mc);
        this.mc.tLabel.htmlText = node.displayName;
        this.mc.tLabel.mouseEnabled = false;
        this.mc.mcFrame.gotoAndStop("off");
        this.mc.buttonMode = true;
        this._clicked = false;
        this.increment(node);
    }

    public get displayName(): string {
        return this._nodeList[0].displayName;
    }

    public override onClick(event: MouseEvent | null = null): void {
        if (this.alpha > 0) {
            this.toggleSelection();
            this.dispatchEvent(new BasePlannerNodeEvent(PlannerExplorer.EXPLORER_ITEM_CLICK, this._nodeList[this._nodeList.length - 1]));
            event!.stopImmediatePropagation();
        }
    }

    public increment(node: PlannerNode): void {
        this._nodeList.push(node);
        this.mc.mcLevel.tLabel.htmlText = String(this._nodeList.length);
    }

    public clear(): void {
        this._nodeList.length = 0;
        this.removeEventListener(MouseEvent.CLICK, this.onClick.bind(this));
        this.removeEventListener(MouseEvent.ROLL_OVER, this.onRollOver.bind(this));
        this.removeEventListener(MouseEvent.ROLL_OUT, this.onRollOut.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_UP, this.onMouseUp.bind(this));
    }

    public decrement(addToInventory: boolean = true): PlannerNode {
        if (this._nodeList.length - 1 <= 0) {
            this.alpha = 0;
        }
        this.mc.mcLevel.tLabel.htmlText = String(this._nodeList.length - 1);
        if (this._nodeList.length - 1 > 0 && addToInventory) {
            PLANNER.basePlanner.popup.designView.addInventoryItem(this._nodeList[this._nodeList.length - 2]);
        } else {
            this.mc.mcFrame.gotoAndStop("off");
        }
        return this._nodeList.pop()!;
    }

    public isNew(): boolean {
        return this._nodeList.length < 2;
    }

    public get numBuildings(): number {
        return this._nodeList.length;
    }

    public cleanSelection(selectedName: string): void {
        if (selectedName !== this.displayName) {
            this._clicked = false;
            this.mc.mcFrame.gotoAndStop("off");
        }
    }

    public toggleSelection(forceState: number = -1): void {
        if (forceState === -1) {
            this._clicked = !this._clicked;
        } else {
            this._clicked = Boolean(forceState);
        }
        if (this._clicked) {
            this.mc.mcFrame.gotoAndStop("on");
        } else {
            this.mc.mcFrame.gotoAndStop("off");
        }
    }

    public override onRollOver(event: MouseEvent | null = null): void {
        if (this.alpha > 0) {
            this.mc.mcFrame.gotoAndStop("on");
            this.dispatchEvent(new BasePlannerNodeEvent(PlannerExplorer.EXPLORER_ITEM_OVER, this._nodeList[0]));
            event!.stopImmediatePropagation();
        }
    }

    public override onRollOut(event: MouseEvent | null = null): void {
        if (this.alpha > 0) {
            if (!this._clicked) {
                this.mc.mcFrame.gotoAndStop("off");
            }
            this.dispatchEvent(new BasePlannerNodeEvent(PlannerExplorer.EXPLORER_ITEM_OUT, this._nodeList[0]));
            event!.stopImmediatePropagation();
        }
    }

    public override onMouseDown(event: MouseEvent | null = null): void {
        // Empty implementation
    }

    public override onMouseUp(event: MouseEvent | null = null): void {
        // Empty implementation
    }
}
