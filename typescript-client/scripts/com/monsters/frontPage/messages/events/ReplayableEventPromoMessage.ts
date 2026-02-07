import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";

import { KeywordMessage } from "../KeywordMessage";
import { ReplayableEventHandler } from "../../../replayableEvents/ReplayableEventHandler";

import { Button } from "../../../../../Button";
import { frontpage_stonebtn } from "../../../../../frontpage_stonebtn";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getLOGIN(): any { return require("../../../../../LOGIN").LOGIN; }


/**
 * Replayable event promo message - promotional message for replayable events.
 */
export class ReplayableEventPromoMessage extends KeywordMessage {
    private _button: MovieClip | null = null;

    constructor(keyword: string, buttonCopy: string = "") {
        if (!buttonCopy && !getGLOBAL()._flags.kongregate && !getGLOBAL()._flags.viximo) {
            buttonCopy = "btn_keepposted";
        }
        super(keyword, buttonCopy);
    }

    public override setupButton(button: Button): Button | null {
        if (!this._buttonCopy) {
            button.visible = false;
            return button;
        }
        const buttonX: number = button.x;
        const buttonY: number = button.y;
        const parentContainer: DisplayObjectContainer = button.parent;
        parentContainer.removeChild(button);
        this._button = new frontpage_stonebtn();
        this._button.x = buttonX;
        this._button.y = buttonY;
        this._button.addEventListener(MouseEvent.CLICK, this.clickedButton.bind(this));
        this._button.buttonMode = true;
        (this._button as any).tLabel.text = this._buttonCopy;
        parentContainer.addChild(this._button);
        return null;
    }

    protected override onButtonClick(): void {
        ReplayableEventHandler.optInForEventEmails();
        if (this._button) {
            this._button.enabled = false;
            this._button.visible = false;
        }
        getPOPUPS().Next();
        getGLOBAL().Message(getKEYS().Get("msg_rsvpconfirmed", { "v1": getLOGIN()._email }));
    }
}
