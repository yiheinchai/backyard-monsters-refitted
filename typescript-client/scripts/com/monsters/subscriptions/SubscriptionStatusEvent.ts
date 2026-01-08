import { Event } from "openfl/events/Event";

/**
 * Subscription status event - fired when subscription status changes.
 */
export class SubscriptionStatusEvent extends Event {
    public static readonly STATUS_EVENT: string = "statusEvent";

    public renewalDate: number;
    public expirationDate: number;
    public subscriptionID: number;

    constructor(type: string, renewalDate: number = 0, expirationDate: number = 0, subscriptionID: number = 0) {
        super(type, false, false);
        this.renewalDate = renewalDate;
        this.expirationDate = expirationDate;
        this.subscriptionID = subscriptionID;
    }

    public toString(): string {
        return "renewalDate:" + this.renewalDate + " expirationDate:" + this.expirationDate + " subscriptionID:" + this.subscriptionID;
    }
}
