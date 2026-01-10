import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { SubscriptionHandler } from "../../../SubscriptionHandler";
import { SubscriptionCancelPopup } from "./SubscriptionCancelPopup";
import { subscriptions_membership_popup } from "../../../../subscriptions_membership_popup";

import { KEYS } from "../../../../../KEYS";
import { POPUPS } from "../../../../../POPUPS";
import { POPUPSETTINGS } from "../../../../../POPUPSETTINGS";

/**
 * Membership popup - subscription management popup.
 */
export class MembershipPopup extends subscriptions_membership_popup {
    private _cancelConfirm: SubscriptionCancelPopup | null = null;

    constructor() {
        super();
        const isActive: boolean = this.subscriptionActive();
        this.tTitle.htmlText = KEYS.Get("dc_panel_benefits");
        this.tDescription.htmlText = KEYS.Get("dc_benefits_desc");
        if (isActive) {
            this.tRenew.htmlText = KEYS.Get("dc_benefits_renew", { "v1": new Date(SubscriptionHandler.instance.renewalDate * 1000).toLocaleDateString() });
        } else {
            this.tRenew.htmlText = KEYS.Get("dc_benefits_expire", { "v1": new Date(SubscriptionHandler.instance.expirationDate * 1000).toLocaleDateString() });
        }
        if (isActive) {
            this.bChange.buttonMode = true;
            this.bChange.Setup(KEYS.Get("btn_changepayment"));
            this.bChange.addEventListener(MouseEvent.CLICK, this.clickedChange.bind(this));
        } else {
            this.bChange.Enabled = false;
            this.bChange.buttonMode = false;
            this.bChange.mouseEnabled = false;
            this.bChange.visible = false;
        }
        this.bCancel.buttonMode = true;
        if (isActive) {
            this.bCancel.Setup(KEYS.Get("btn_cancelsub"));
            this.bCancel.addEventListener(MouseEvent.CLICK, this.clickedCancelConfirm.bind(this));
        } else {
            this.bCancel.Setup(KEYS.Get("btn_reactivatesub"));
            this.bCancel.addEventListener(MouseEvent.CLICK, this.clickedReactivate.bind(this));
        }
        this.bClose.Highlight = true;
        this.bClose.buttonMode = true;
        this.bClose.Setup(KEYS.Get("btn_close"));
        this.bClose.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
    }

    protected clickedReactivate(event: MouseEvent): void {
        this.dispatchEvent(new Event(SubscriptionHandler.REACTIVATE));
        this.Hide();
    }

    private subscriptionActive(): boolean {
        return Boolean(SubscriptionHandler.instance.renewalDate);
    }

    private clickedChange(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CHANGE));
        this.Hide(event);
    }

    private clickedCancel(event: MouseEvent | null = null): void {
        this.dispatchEvent(new Event(SubscriptionHandler.CANCEL));
        this.Hide(event);
    }

    private eventCancel(event: Event | null = null): void {
        this.clickedCancel();
    }

    private clickedCancelConfirm(event: MouseEvent | null = null): void {
        this._cancelConfirm = new SubscriptionCancelPopup();
        POPUPS.Add(this._cancelConfirm);
        this._cancelConfirm.addEventListener(SubscriptionHandler.CANCELCONFIRM, this.eventCancel.bind(this));
        this._cancelConfirm.addEventListener(SubscriptionHandler.CLOSECONFIRM, this.removeConfirmationPopup.bind(this));
        POPUPSETTINGS.AlignToCenter(this._cancelConfirm);
    }

    private removeConfirmationPopup(event: Event | null = null): void {
        this._cancelConfirm!.removeEventListener(SubscriptionHandler.CANCELCONFIRM, this.clickedCancel.bind(this));
        this._cancelConfirm!.removeEventListener(SubscriptionHandler.CLOSECONFIRM, this.removeConfirmationPopup.bind(this));
        POPUPS.Remove(this._cancelConfirm!);
    }

    public Hide(event: MouseEvent | null = null): void {
        if (this._cancelConfirm) {
            this.removeConfirmationPopup();
        }
        this.bChange.removeEventListener(MouseEvent.CLICK, this.clickedChange.bind(this));
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.clickedCancel.bind(this));
        this.bClose.removeEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        this.dispatchEvent(new Event(Event.CLOSE));
    }
}
