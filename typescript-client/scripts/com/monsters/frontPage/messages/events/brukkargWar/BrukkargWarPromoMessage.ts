import { MouseEvent } from "openfl/events/MouseEvent";
import { URLRequest } from "openfl/net/URLRequest";

import { KeywordMessage } from "../../KeywordMessage";
import { ReplayableEventHandler } from "../../../../replayableEvents/ReplayableEventHandler";
import { ReplayableEventLibrary } from "../../../../replayableEvents/ReplayableEventLibrary";

import { GLOBAL } from "../../../../../../GLOBAL";
import { POPUPS } from "../../../../../../POPUPS";
import { KEYS } from "../../../../../../KEYS";
import { LOGIN } from "../../../../../../LOGIN";
import { Button } from "../../../../../Button";

/**
 * Brukkarg War promo message - promotional message for Brukkarg War event.
 */
export class BrukkargWarPromoMessage extends KeywordMessage {
    private static readonly k_BRUKKARG_EVENT_PAGE_URL: string = "http://www.kixeye.com/brukkarg-war";

    private _action: Function;

    constructor(keyword: string) {
        super(keyword, "btn_rsvp");
        this._action = this.goToEventPage.bind(this);
    }

    public override setupButton(button: Button): Button {
        super.setupButton(button);
        if (ReplayableEventHandler.currentTime >= ReplayableEventLibrary.BRUKKARG_EVENT.originalStartDate) {
            button.SetupKey("btn_keepposted");
            this._action = this.optInForEventEmails.bind(this);
        }
        return button;
    }

    protected override clickedButton(event: MouseEvent): void {
        POPUPS.Next();
        this._action();
    }

    private goToEventPage(): void {
        // navigateToURL equivalent - open in new window
        window.open(BrukkargWarPromoMessage.k_BRUKKARG_EVENT_PAGE_URL, "_blank");
    }

    private optInForEventEmails(): void {
        ReplayableEventHandler.optInForEventEmails();
        GLOBAL.Message(KEYS.Get("msg_rsvpconfirmed", { "v1": LOGIN._email }));
    }
}
