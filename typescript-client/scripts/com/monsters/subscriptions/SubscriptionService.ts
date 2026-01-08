import { EventDispatcher } from "openfl/events/EventDispatcher";

import { Console } from "../debug/Console";
import { SubscriptionStatusEvent } from "./SubscriptionStatusEvent";

import { GLOBAL } from "../../../GLOBAL";
import { LOGGER } from "../../../LOGGER";

// Forward declaration for ExternalInterface
declare class ExternalInterface {
    static available: boolean;
    static addCallback(funcName: string, callback: Function): void;
}

declare const JSON: { decode(str: string): any };

/**
 * Subscription service - handles subscription API calls to Facebook/server.
 */
export class SubscriptionService extends EventDispatcher {
    private _callbacks: string[] = [];

    constructor() {
        super();
        this._callbacks = [];
    }

    private callJS(funcName: string, callback: Function | null = null, param: number = 2, waitForResult: boolean = true): void {
        const cleanName = funcName.replace("cc.", "");
        if (callback && ExternalInterface.available && this._callbacks.indexOf(cleanName) < 0) {
            ExternalInterface.addCallback(cleanName, callback);
            this._callbacks.push(cleanName);
        }
        GLOBAL.CallJS(funcName, [param], waitForResult);
    }

    public getSubscriptionData(): void {
        this.callJS("cc.getUserSubscriptions", this.getUserSubscriptions.bind(this), 2, false);
    }

    public getUserSubscriptions(jsonData: string): void {
        let event = new SubscriptionStatusEvent(SubscriptionStatusEvent.STATUS_EVENT);
        
        if (!jsonData) {
            Console.warning("did not recieve json back from the server");
            this.dispatchEvent(event);
            return;
        }
        
        const data = JSON.decode(jsonData)[0];
        if (data.length === 0) {
            Console.warning("got subscription data but it's emtpy, not going to try to parse it");
            this.dispatchEvent(event);
            return;
        }
        
        event = new SubscriptionStatusEvent(SubscriptionStatusEvent.STATUS_EVENT);
        event.subscriptionID = Number(data["fb_subscriptionid"]);
        
        const status = String(data["status"]);
        const nextBillTime = Number(data["nextbilltime"]);
        
        if (status === "active") {
            event.renewalDate = nextBillTime;
        } else if (status === "pending_cancel") {
            event.expirationDate = nextBillTime;
        }
        
        this.dispatchEvent(event);
    }

    public startSubscription(): void {
        LOGGER.StatB({ st1: "daves_club" }, "subscribe");
        this.callJS("cc.showSubscriptionDialog", this.showSubscriptionDialog.bind(this));
    }

    public reactivateSubscription(subscriptionID: number): void {
        this.callJS("cc.showSubscriptionDialog", this.showSubscriptionDialog.bind(this));
    }

    private showSubscriptionDialog(jsonData: string | null = null): void {
        if (!jsonData) {
            Console.warning("got a calback @ 'showSubscriptionDialog' but theres no JSON data!");
        }
        this.getUserSubscriptions(jsonData || "");
    }

    public changeSubscription(subscriptionID: number): void {
        this.callJS("cc.changeSubscriptionPayType", null, subscriptionID);
    }

    private changeSubscriptionCallback(jsonData: string): void {
        this.getUserSubscriptions(jsonData);
    }

    public cancelSubscription(subscriptionID: number): void {
        LOGGER.StatB({ st1: "daves_club" }, "unsubscribe");
        this.callJS("cc.showSubscriptionDialog", this.showSubscriptionDialog.bind(this));
    }

    private cancelSubscriptionCallback(jsonData: string): void {
        this.getUserSubscriptions(jsonData);
    }
}
