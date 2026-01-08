import { KeywordMessage } from "../../KeywordMessage";
import { KOTHPromoMessage } from "./KOTHPromoMessage";

/**
 * King of the Hill promo message 2.
 */
export class KOTHPromoMessage2 extends KOTHPromoMessage {
    constructor() {
        super("event_kothpromo2");
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothpromo3");
    }
}
