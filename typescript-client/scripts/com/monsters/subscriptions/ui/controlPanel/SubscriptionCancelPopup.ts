import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { SubscriptionHandler } from "../../SubscriptionHandler";
import { subscriptions_cancelconfirm_popup } from "../../../../../subscriptions_cancelconfirm_popup";

import { KEYS } from "../../../../../KEYS";

/**
 * Subscription cancel popup - confirmation popup for cancelling subscription.
 */
export class SubscriptionCancelPopup extends subscriptions_cancelconfirm_popup {
    constructor() {
        super();
        this.tTitle.htmlText = KEYS.Get("dc_panel_cancel");
        this.tDesc.htmlText = KEYS.Get("dc_cancel_confirmation");
        this.bConfirm.Highlight = false;
        this.bConfirm.buttonMode = true;
        this.bConfirm.Setup(KEYS.Get("btn_cancelsub_confirm"));
        this.bConfirm.addEventListener(MouseEvent.CLICK, this.clickedConfirm.bind(this));
        this.bCancel.Highlight = true;
        this.bCancel.buttonMode = true;
        this.bCancel.Setup(KEYS.Get("btn_cancelsub_keepsub"));
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
