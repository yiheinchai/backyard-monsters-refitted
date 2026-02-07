import { AttackEvent } from "../../../events/AttackEvent";
import { KeywordMessage } from "../../../frontPage/messages/KeywordMessage";
import { Message } from "../../../frontPage/messages/Message";
import { IReplayableEventUI } from "../../IReplayableEventUI";
import { Maproom3EventHUD } from "../../Maproom3EventHUD";
import { ReplayableEvent } from "../../ReplayableEvent";
import { HellRaisersPromoMessage } from "./messages/HellRaisersPromoMessage";
import { HellRaisersStartMessage } from "./messages/HellRaisersStartMessage";
import { HellRaisersBattleSummary } from "./popups/HellRaisersBattleSummary";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../../managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("../../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Hell Raisers - attacking event with battle summaries.
 */
export class HellRaisers extends ReplayableEvent {
    public static readonly k_eventPage: string = "http://www.kixeye.com/hell-raisers";
    private static readonly k_hellRaisersTribeID: number = 0; // NaN in original "derp"

    constructor() {
        super();
        this._name = "Hell Raisers";
        this._progress = -1;
        this._priority = 0;
        this._id = 7;
        this._buttonCopy = getKEYS().Get("btn_info");
        this._titleImage = "events/hellraisers/hellraisers_title.png";
        this._eventStoreTitleImage = "events/hellraisers/hellraisers_event_store_title.png";
        this._imageURL = "events/hellraisers/hellraisers_reward.png";
        this._messages = [
            new HellRaisersPromoMessage("hellraiserspop1"),
            new HellRaisersPromoMessage("hellraiserspop2"),
            new HellRaisersPromoMessage("hellraiserspop3"),
            new HellRaisersStartMessage(),
            new KeywordMessage("hellraisersend")
        ];
        this._originalStartDate = 0;
        this._duration = this._DEFAULT_EVENT_DURATION;
    }

    public override get preEventHUDImageURL(): string {
        return "events/hellraisers/preEventHud.png";
    }

    public override get eventHUDImageURL(): string {
        return "events/hellraisers/eventHud.png";
    }

    protected override onInitialize(): void {
        getGLOBAL().eventDispatcher.addEventListener(AttackEvent.ATTACK_OVER, this.onAttackEnd.bind(this));
    }

    protected onAttackEnd(event: AttackEvent): void {
        if (event.attackType === HellRaisers.k_hellRaisersTribeID) {
            const xpWorth: number = this.getBasesWorthInXP();
            getPOPUPS().Push(new HellRaisersBattleSummary(event.wasBaseDestroyed, xpWorth).graphic);
            this.score += xpWorth;
        }
    }

    private getBasesWorthInXP(): number {
        let count: number = 0;
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (const building of buildings) {
            count++;
        }
        return count;
    }

    public override createNewUI(): IReplayableEventUI {
        return new Maproom3EventHUD();
    }

    public override doesQualify(): boolean {
        return getMapRoomManager().instance.isInMapRoom3;
    }
}
