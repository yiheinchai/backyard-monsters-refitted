import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Battletoads promo message 1.
 */
export class BattletoadsPromoMessage1 extends ReplayableEventPromoMessage {
    constructor() {
        super("event1pop1");
        this.imageURL = BattletoadsPromoMessage1._IMAGE_DIRECTORY + "fp_event1pop1.v2.jpg";
    }

    protected static readonly _IMAGE_DIRECTORY: string = "";
}
