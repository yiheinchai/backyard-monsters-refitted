import Event from "openfl/events/Event";

import { BasePlannerEvent } from "../../events/BasePlannerEvent";
import { BasePlannerTransferEvent } from "../../events/BasePlannerTransferEvent";
import { BasePlannerTransferPopup } from "./BasePlannerTransferPopup";
import { BasePlannerTransferRow } from "./BasePlannerTransferRow";
import { BasePlannerTransferConfirmation } from "./BasePlannerTransferConfirmation";

import { POPUPSETTINGS } from "../../../../../POPUPSETTINGS";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }


/**
 * Base planner save popup - popup for saving base layouts.
 */
export class BasePlannerSavePopup extends BasePlannerTransferPopup {
    private _row: BasePlannerTransferRow | null = null;
    private _confirmationPopup: BasePlannerTransferConfirmation | null = null;

    constructor() {
        super();
        this.tTitle.htmlText = getKEYS().Get("basePlanner_savetitle");
    }

    public override get name(): string {
        return getKEYS().Get("basePlanner_btnSave");
    }

    protected override clickedTransfer(event: Event): void {
        this._row = event.currentTarget as BasePlannerTransferRow;
        if (this._row.template) {
            if (!this._confirmationPopup) {
                this._confirmationPopup = new BasePlannerTransferConfirmation("'" + this._row.template.name + "'");
                this._confirmationPopup.addEventListener(BasePlannerEvent.SAVE, this.confirmedSave.bind(this));
                this._confirmationPopup.addEventListener(Event.CLOSE, this.clickedClose.bind(this));
                getPOPUPS().Add(this._confirmationPopup);
                POPUPSETTINGS.AlignToCenter(this._confirmationPopup);
            }
        } else {
            this.confirmedSave(null);
        }
    }

    protected clickedClose(event: Event | null = null): void {
        if (this._confirmationPopup) {
            this._confirmationPopup.removeEventListener(BasePlannerEvent.SAVE, this.confirmedSave.bind(this));
            this._confirmationPopup.removeEventListener(Event.CLOSE, this.clickedClose.bind(this));
            getPOPUPS().Remove(this._confirmationPopup);
            this._confirmationPopup = null;
        }
    }

    protected confirmedSave(event: Event | null): void {
        this.dispatchEvent(new BasePlannerTransferEvent(BasePlannerEvent.SAVE, this._row!.slot, this._row!.tTemplateName.text));
        if (this._confirmationPopup) {
            this.clickedClose();
        }
    }

    public override clear(): void {
        this.clickedClose();
    }
}
