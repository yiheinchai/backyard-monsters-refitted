import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Monster Blitzkrieg promo message 3.
 */
export class MonsterBlitzkriegPromoMessage3 extends ReplayableEventPromoMessage {
    constructor() {
        super("event2pop3");
        this.imageURL = ReplayableEventPromoMessage._IMAGE_DIRECTORY + "fp_event2pop3.v2.jpg";
    }
}
