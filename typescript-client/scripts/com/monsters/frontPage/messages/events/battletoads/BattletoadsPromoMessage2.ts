import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Battletoads promo message 2.
 */
export class BattletoadsPromoMessage2 extends ReplayableEventPromoMessage {
    constructor() {
        super("event1pop2");
        this.imageURL = BattletoadsPromoMessage2._IMAGE_DIRECTORY + "fp_event1pop2.v2.jpg";
    }

    protected static readonly _IMAGE_DIRECTORY: string = "";
}
