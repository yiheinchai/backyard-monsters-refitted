import { KeywordMessage } from "../../../frontPage/messages/KeywordMessage";

/**
 * King of the Hill quota 2 met message.
 */
export class KOTHQuota2MetMessage extends KeywordMessage {
    constructor() {
        super("kothquota2");
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothwin");
    }
}
