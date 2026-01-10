import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";

import { BasePlanner } from "../../BasePlanner";
import { BaseTemplate } from "../../BaseTemplate";
import { ScalableFrame } from "../../../display/ScalableFrame";
import { BasePlannerTransfer_CLIP } from "./BasePlannerTransfer_CLIP";
import { BasePlannerTransferRow } from "./BasePlannerTransferRow";

/**
 * Base planner transfer popup - base class for save/load popups.
 */
export class BasePlannerTransferPopup extends BasePlannerTransfer_CLIP {
    public static readonly CLICKED_TRANSFER: string = "clickTransfer";

    protected _rows: Array<BasePlannerTransferRow> = [];
    protected _rowsContainer: Sprite | null = null;
    private _frame: ScalableFrame | null = null;

    constructor() {
        super();
    }

    public updateList(templates: Array<BaseTemplate>): void {
        let rowY: number = 0;
        if (this._rowsContainer) {
            this.mcRowContainer.removeChild(this._rowsContainer);
        }
        this._rowsContainer = new Sprite();
        this._rows = [];
        const templateCount: number = templates.length;
        for (let i = 0; i < BasePlanner.maxNumberOfSlots; i++) {
            const template: BaseTemplate | null = i >= templateCount ? null : templates[i];
            const row: BasePlannerTransferRow = new BasePlannerTransferRow(template, i);
            if (!template && i >= BasePlanner.slots) {
                row.disable();
            }
            row.bTransfer.SetupKey("basePlanner_btnSaveLayout");
            row.addEventListener(BasePlannerTransferPopup.CLICKED_TRANSFER, this.clickedTransfer.bind(this));
            row.y = rowY;
            this._rowsContainer.addChild(row);
            rowY += row.height + 5;
            this._rows.push(row);
        }
        this.mcRowContainer.addChild(this._rowsContainer);
        this.mcFrame.height = this.mcRowContainer.height + 80;
        this.mcFrame.resize();
    }

    public override get name(): string {
        return "UNASSIGNED";
    }

    protected clickedTransfer(event: Event): void {
        // Empty implementation - override in subclasses
    }

    public clear(): void {
        // Empty implementation - override in subclasses
    }
}
