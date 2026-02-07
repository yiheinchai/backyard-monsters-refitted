import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { SubscriptionHandler } from "../../SubscriptionHandler";
import { subscriptions_cancelconfirm_popup } from "../../../../../subscriptions_cancelconfirm_popup";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }



/**
 * Subscription cancel popup - confirmation popup for cancelling subscription.
 */
export class SubscriptionCancelPopup extends subscriptions_cancelconfirm_popup {
    constructor() {
        super();
        this.tTitle.htmlText = getKEYS().Get("dc_panel_cancel");
        this.tDesc.htmlText = getKEYS().Get("dc_cancel_confirmation");
        this.bConfirm.Highlight = false;
        this.bConfirm.buttonMode = true;
        this.bConfirm.Setup(getKEYS().Get("btn_cancelsub_confirm"));
        this.bConfirm.addEventListener(MouseEvent.CLICK, this.clickedConfirm.bind(this));
        this.bCancel.Highlight = true;
        this.bCancel.buttonMode = true;
        this.bCancel.Setup(getKEYS().Get("btn_cancelsub_keepsub"));
        this.bCancel.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
    }

    private clickedConfirm(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CANCELCONFIRM));
        this.Hide(event);
    }

    private clickedCancel(event: MouseEvent | null = null): void {
        this.Hide(event);
    }

    public Hide(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CLOSECONFIRM));
        this.bConfirm.removeEventListener(MouseEvent.CLICK, this.clickedConfirm.bind(this));
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        this.dispatchEvent(new Event(Event.CLOSE));
    }
}
