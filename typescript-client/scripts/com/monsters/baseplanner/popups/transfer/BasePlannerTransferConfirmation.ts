import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { BasePlannerEvent } from "../../events/BasePlannerEvent";
import { BasePlannerTransferConfirmation_CLIP } from "../../../../../BasePlannerTransferConfirmation_CLIP";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }



/**
 * Base planner transfer confirmation popup - confirms overwriting a saved template.
 */
export class BasePlannerTransferConfirmation extends BasePlannerTransferConfirmation_CLIP {
    constructor(templateName: string | null = null) {
        super();
        this.tTitle.htmlText = getKEYS().Get("pop_areyousure");
        this.tBody.htmlText = getKEYS().Get("basePlanner_overwrite", { "v1": templateName });
        this.bCancel.SetupKey("btn_cancel");
        this.bConfirm.SetupKey("basePlanner_btnSave");
        this.bCancel.addEventListener(MouseEvent.CLICK, this.clickedCancel.bind(this), false, 0, true);
        this.bConfirm.addEventListener(MouseEvent.CLICK, this.clickedConfirm.bind(this), false, 0, true);
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    }

    protected removedFromStage(event: Event): void {
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.clickedCancel.bind(this));
        this.bConfirm.removeEventListener(MouseEvent.CLICK, this.clickedConfirm.bind(this));
        this.removeEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
    }

    protected clickedConfirm(event: MouseEvent): void {
        this.dispatchEvent(new Event(BasePlannerEvent.SAVE));
    }

    protected clickedCancel(event: MouseEvent): void {
        this.dispatchEvent(new Event(Event.CLOSE));
    }

    public Hide(): void {
        this.dispatchEvent(new Event(Event.CLOSE));
    }
}
