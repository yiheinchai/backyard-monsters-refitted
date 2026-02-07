import { KeywordMessage } from "../../frontPage/messages/KeywordMessage";

// Lazy imports to break circular dependency chains
function getCREEPS(): any { return require("../../../../CREEPS").CREEPS; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * KOTH reward message - shown when player wins/keeps Krallen.
 */
export class KOTHRewardMessage extends KeywordMessage {
    constructor(keptKrallen: boolean) {
        let level = 1;
        if (getCREEPS().krallen) {
            level = getCREEPS().krallen._level.Get();
        }
        super(keptKrallen ? "kothendkeep" : "kothendwin", "btn_brag");
        this.body = getKEYS().Get(KeywordMessage.PREFIX + this._keyword, { v1: level });
        this.imageURL = KeywordMessage.getImageURLFromKeyword("event_kothwin");
    }

    protected override onButtonClick(): void {
        getGLOBAL().CallJS("sendFeed", [
            "event4-reward",
            getKEYS().Get("fb_kothstream_title"),
            getKEYS().Get("fb_kothstream_desc"),
            "fb_kothstream.png"
        ]);
        getPOPUPS().Next();
    }
}
