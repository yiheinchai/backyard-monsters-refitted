import { KeywordMessage } from "../../frontPage/messages/KeywordMessage";

/**
 * King of the Hill end message.
 */
export class KOTHEndMessage extends KeywordMessage {
    constructor(lostKrallen: boolean) {
        super(lostKrallen ? "kothendlosekrallen" : "kothendlose");
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothlose");
    }
}
