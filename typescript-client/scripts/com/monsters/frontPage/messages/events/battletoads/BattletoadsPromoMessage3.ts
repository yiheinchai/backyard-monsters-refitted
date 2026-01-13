import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Battletoads promo message 3.
 */
export class BattletoadsPromoMessage3 extends ReplayableEventPromoMessage {
    constructor() {
        super("event1pop3");
        this.imageURL = BattletoadsPromoMessage3._IMAGE_DIRECTORY + "fp_event1pop3.v2.jpg";
    }

    protected static readonly _IMAGE_DIRECTORY: string = "";
}
