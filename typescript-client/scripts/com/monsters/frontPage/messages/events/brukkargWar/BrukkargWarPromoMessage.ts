import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";

import { KeywordMessage } from "../../KeywordMessage";
import { ReplayableEventHandler } from "../../../../replayableEvents/ReplayableEventHandler";
import { ReplayableEventLibrary } from "../../../../replayableEvents/ReplayableEventLibrary";

import { Button } from "../../../../../../Button";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }
function getKEYS(): any { return require("../../../../../../KEYS").KEYS; }
function getLOGIN(): any { return require("../../../../../../LOGIN").LOGIN; }


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
        getPOPUPS().Next();
        this._action();
    }

    private goToEventPage(): void {
        // navigateToURL equivalent - open in new window
        window.open(BrukkargWarPromoMessage.k_BRUKKARG_EVENT_PAGE_URL, "_blank");
    }

    private optInForEventEmails(): void {
        ReplayableEventHandler.optInForEventEmails();
        getGLOBAL().Message(getKEYS().Get("msg_rsvpconfirmed", { "v1": getLOGIN()._email }));
    }
}
