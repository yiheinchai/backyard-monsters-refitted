import URLRequest from "openfl/net/URLRequest";

import { FrontPageGraphic } from "../../../../frontPage/FrontPageGraphic";
import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";
import { Message } from "../../../../frontPage/messages/Message";
import { Maproom3OptInPopup } from "../../../../frontPage/messages/promotions/Maproom3OptInPopup";
import { HellRaisers } from "../HellRaisers";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../../../maproom_manager/MapRoomManager").MapRoomManager; }
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }



/**
 * Hell Raisers promo message - promotional message for Hell Raisers event.
 */
export class HellRaisersPromoMessage extends Message {
    private _buttonAction: Function;

    constructor(keyword: string) {
        let modifiedKeyword: string | null = null;
        if (getMapRoomManager().instance.isInMapRoom2) {
            modifiedKeyword = keyword + "_upgrade";
            const buttonCopy = "btn_joinnow";
            super(
                KeywordMessage.PREFIX + modifiedKeyword + "_title",
                KeywordMessage.PREFIX + modifiedKeyword,
                KeywordMessage.PREFIX + keyword + ".jpg",
                buttonCopy
            );
            this._buttonAction = this.showUpgradeToMR3Popup.bind(this);
        } else {
            modifiedKeyword = keyword;
            const buttonCopy = "btn_rsvp";
            super(
                KeywordMessage.PREFIX + modifiedKeyword + "_title",
                KeywordMessage.PREFIX + modifiedKeyword,
                KeywordMessage.PREFIX + keyword + ".jpg",
                buttonCopy
            );
            this._buttonAction = this.RSVP.bind(this);
        }
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        this._buttonAction();
    }

    private showUpgradeToMR3Popup(): void {
        getPOPUPS().Push(new FrontPageGraphic(new Maproom3OptInPopup()));
    }

    private RSVP(): void {
        // navigateToURL equivalent - open in new window
        window.open(HellRaisers.k_eventPage, "_blank");
    }
}
