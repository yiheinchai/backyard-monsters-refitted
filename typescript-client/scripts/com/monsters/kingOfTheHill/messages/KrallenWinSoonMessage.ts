import { KeywordMessage } from "../../frontPage/messages/KeywordMessage";

/**
 * Krallen win soon message.
 */
export class KrallenWinSoonMessage extends KeywordMessage {
    constructor() {
        super("krallenwin");
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothwin");
    }
}
