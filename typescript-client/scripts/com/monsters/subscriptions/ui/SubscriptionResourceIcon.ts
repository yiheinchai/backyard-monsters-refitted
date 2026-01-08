import { daveClubBar } from "../../../daveClubBar";

/**
 * Subscription resource icon - shows subscription status on resource bar.
 */
export class SubscriptionResourceIcon extends daveClubBar {
    constructor(isActive: boolean) {
        super();
        this.update(isActive);
        this.buttonMode = true;
        this.mouseChildren = false;
    }

    public update(isActive: boolean): void {
        if (isActive) {
            this.gotoAndStop("on");
        } else {
            this.gotoAndStop("off");
        }
    }
}
