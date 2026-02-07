import { KeywordMessage } from "../../frontPage/messages/KeywordMessage";
import { KOTHHandler } from "../KOTHHandler";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../KEYS").KEYS; }



/**
 * King of the Hill quota 1 met message.
 */
export class KOTHQuota1MetMessage extends KeywordMessage {
    constructor() {
        super(KOTHHandler.instance.tier >= 1 ? "kothquota1_havekrallen" : "kothquota1_nokrallen");
        this.body = getKEYS().Get(KeywordMessage.PREFIX + this._keyword, { v1: KOTHHandler.instance.wins + 1 });
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothwin");
    }
}
