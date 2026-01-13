import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Monster Blitzkrieg promo message 1.
 */
export class MonsterBlitzkriegPromoMessage1 extends ReplayableEventPromoMessage {
    constructor() {
        super("event2pop1");
        this.imageURL = ReplayableEventPromoMessage._IMAGE_DIRECTORY + "fp_event2pop1.v2.jpg";
    }
}
