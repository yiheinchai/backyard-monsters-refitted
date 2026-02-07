import URLRequest from "openfl/net/URLRequest";

import { KeywordMessage } from "../../KeywordMessage";
import { Message } from "../../Message";

import { MAPROOM } from "../../../../../../MAPROOM";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }


// Forward declaration
declare function navigateToURL(request: URLRequest): void;

/**
 * KOTH promo message - base class for King of the Hill promo messages.
 */
export class KOTHPromoMessage extends Message {
    private readonly _EVENT_PAGE_URL: string = "http://www.kixeye.com/hunt-for-krallen/";
    protected _action: Function | null = null;

    constructor(keyword: string) {
        let buttonCopy = "";
        let body = keyword;
        
        if (getMapRoomManager().instance.isInMapRoom2or3) {
            buttonCopy = "btn_rsvp";
            body = keyword;
        } else {
            body = keyword + "mr1";
            if (getGLOBAL()._bMap && getGLOBAL().townHall._lvl.Get() >= 6) {
                buttonCopy = "btn_upgradenow";
            }
        }
        
        super(
            KeywordMessage.PREFIX + keyword + "_title",
            KeywordMessage.PREFIX + body + "_desc",
            KeywordMessage.PREFIX + keyword + ".jpg",
            buttonCopy
        );
        
        if (getMapRoomManager().instance.isInMapRoom2or3) {
            this._action = this.rsvp.bind(this);
            this._buttonCopy = "btn_rsvp";
            this.body = keyword;
        } else {
            this.body = keyword + "mr1";
            if (getGLOBAL()._bMap && getGLOBAL().townHall._lvl.Get() >= 6) {
                this._action = this.upgradeMapRoom.bind(this);
                this._buttonCopy = "btn_upgradenow";
            }
        }
    }

    protected override onButtonClick(): void {
        if (this._action) {
            this._action();
        }
    }

    private rsvp(): void {
        navigateToURL(new URLRequest(this._EVENT_PAGE_URL));
    }

    protected upgradeMapRoom(): void {
        this.upgradeBuilding(MAPROOM.TYPE);
    }
}
