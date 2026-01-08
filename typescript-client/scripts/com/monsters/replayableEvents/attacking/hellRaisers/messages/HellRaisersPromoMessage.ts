import { URLRequest } from "openfl/net/URLRequest";

import { FrontPageGraphic } from "../../../../FrontPageGraphic";
import { KeywordMessage } from "../../../../messages/KeywordMessage";
import { Message } from "../../../../messages/Message";
import { Maproom3OptInPopup } from "../../../../messages/promotions/Maproom3OptInPopup";
import { MapRoomManager } from "../../../../maproom_manager/MapRoomManager";
import { HellRaisers } from "../HellRaisers";

import { POPUPS } from "../../../../../../POPUPS";

/**
 * Hell Raisers promo message - promotional message for Hell Raisers event.
 */
export class HellRaisersPromoMessage extends Message {
    private _buttonAction: Function;

    constructor(keyword: string) {
        let modifiedKeyword: string | null = null;
        if (MapRoomManager.instance.isInMapRoom2) {
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
        POPUPS.Next();
        this._buttonAction();
    }

    private showUpgradeToMR3Popup(): void {
        POPUPS.Push(new FrontPageGraphic(new Maproom3OptInPopup()));
    }

    private RSVP(): void {
        // navigateToURL equivalent - open in new window
        window.open(HellRaisers.k_eventPage, "_blank");
    }
}
