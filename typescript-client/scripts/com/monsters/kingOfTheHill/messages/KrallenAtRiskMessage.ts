import { KeywordMessage } from "../../../frontPage/messages/KeywordMessage";

/**
 * Krallen at risk message.
 */
export class KrallenAtRiskMessage extends KeywordMessage {
    constructor() {
        super("krallenrisk");
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothlose");
    }
}
