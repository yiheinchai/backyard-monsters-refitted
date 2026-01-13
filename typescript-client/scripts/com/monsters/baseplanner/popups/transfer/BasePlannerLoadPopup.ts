import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";

import { BaseTemplate } from "../../BaseTemplate";
import { BasePlannerEvent } from "../../events/BasePlannerEvent";
import { BasePlannerTransferEvent } from "../../events/BasePlannerTransferEvent";
import { BasePlannerTransferPopup } from "./BasePlannerTransferPopup";
import { BasePlannerTransferRow } from "./BasePlannerTransferRow";

import { KEYS } from "../../../../../KEYS";

/**
 * Base planner load popup - popup for loading saved base templates.
 */
export class BasePlannerLoadPopup extends BasePlannerTransferPopup {
    constructor() {
        super();
        this.tTitle.htmlText = KEYS.Get("basePlanner_loadtitle");
    }

    public override updateList(templates: Array<BaseTemplate>): void {
        let rowY: number = 0;
        if (this._rowsContainer) {
            this.mcRowContainer.removeChild(this._rowsContainer);
        }
        this._rowsContainer = new Sprite();
        this._rows = [];
        const templateCount: number = templates.length;
        for (let i = 0; i < templateCount; i++) {
            const template: BaseTemplate | null = i >= templateCount ? null : templates[i];
            const row: BasePlannerTransferRow = new BasePlannerTransferRow(template, i);
            row.canEdit = false;
            row.bTransfer.SetupKey("basePlanner_btnLoadLayout");
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
        return KEYS.Get("basePlanner_btnLoad");
    }

    protected override clickedTransfer(event: Event): void {
        const row: BasePlannerTransferRow = event.currentTarget as BasePlannerTransferRow;
        this.dispatchEvent(new BasePlannerTransferEvent(BasePlannerEvent.LOAD, row.slot));
    }
}
