import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Monster Blitzkrieg promo message 2.
 */
export class MonsterBlitzkriegPromoMessage2 extends ReplayableEventPromoMessage {
    constructor() {
        super("event2pop2");
        this.imageURL = ReplayableEventPromoMessage._IMAGE_DIRECTORY + "fp_event2pop2.v2.jpg";
    }
}
