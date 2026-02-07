import { Message } from "../../frontPage/messages/Message";
import { DebugMessage } from "../../frontPage/messages/DebugMessage";
import { KOTHPromoMessage1 } from "../../frontPage/messages/events/kingOfTheHill/KOTHPromoMessage1";
import { KOTHPromoMessage2 } from "../../frontPage/messages/events/kingOfTheHill/KOTHPromoMessage2";
import { KOTHPromoMessage3 } from "../../frontPage/messages/events/kingOfTheHill/KOTHPromoMessage3";
import { KOTHStartMessage } from "../../frontPage/messages/events/kingOfTheHill/KOTHStartMessage";
import { KOTHHandler } from "../../kingOfTheHill/KOTHHandler";
import { ReplayableEvent } from "../ReplayableEvent";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getCHAMPIONCAGE(): any { return require("../../../../CHAMPIONCAGE").CHAMPIONCAGE; }



/**
 * King of the Hill - looting event with Krallen champion rewards.
 */
export class KingOfTheHill extends ReplayableEvent {
    constructor() {
        super();
        this._name = "Champion King of the Hill";
        this._progress = -1;
        this._priority = 0;
        this._id = 4;
        this._buttonCopy = getKEYS().Get("btn_info");
        this._titleImage = "events/koth/koth_title.png";
        this._imageURL = "events/koth/koth_reward.png";
        this._messages = [
            new KOTHPromoMessage1(),
            new KOTHPromoMessage2(),
            new KOTHPromoMessage3(),
            new KOTHStartMessage(),
            new DebugMessage()
        ];
        this._originalStartDate = 1339441200;
        this._duration = 604800;
    }

    public override get hasCompletedEvent(): boolean {
        return false;
    }

    public override pressedActionButton(): void {
        if (!KOTHHandler.instance.doesQualify) {
            getGLOBAL().Message(getKEYS().Get("msg_krallen_nomr2"));
            return;
        }
        getCHAMPIONCAGE().ShowKrallenTab();
    }

    public override set score(value: number) {
        super.score = value;
        if (KOTHHandler.instance.lootThresholds.length > 0) {
            const thresholds: Array<number> = KOTHHandler.instance.lootThresholds;
            let nextThreshold: number = thresholds[0];
            let prevThreshold: number = 0;
            for (let i = 0; i < thresholds.length && value < nextThreshold; i++) {
                if (value >= thresholds[i]) {
                    nextThreshold = thresholds[i - 1];
                    prevThreshold = thresholds[i];
                    break;
                }
            }
            this.progress = (value - prevThreshold) / (nextThreshold - prevThreshold);
        } else {
            this.progress = 0;
        }
    }

    public override doesQualify(): boolean {
        return false;
    }
}
