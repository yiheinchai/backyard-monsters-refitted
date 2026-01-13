import { AttackEvent } from "../../../events/AttackEvent";
import { KeywordMessage } from "../../../frontPage/messages/KeywordMessage";
import { Message } from "../../../frontPage/messages/Message";
import { InstanceManager } from "../../../managers/InstanceManager";
import { MapRoomManager } from "../../../maproom_manager/MapRoomManager";
import { IReplayableEventUI } from "../../IReplayableEventUI";
import { Maproom3EventHUD } from "../../Maproom3EventHUD";
import { ReplayableEvent } from "../../ReplayableEvent";
import { HellRaisersPromoMessage } from "./messages/HellRaisersPromoMessage";
import { HellRaisersStartMessage } from "./messages/HellRaisersStartMessage";
import { HellRaisersBattleSummary } from "./popups/HellRaisersBattleSummary";

import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";
import { POPUPS } from "../../../../../POPUPS";
import { BFOUNDATION } from "../../../../../BFOUNDATION";

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
        this._buttonCopy = KEYS.Get("btn_info");
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
        GLOBAL.eventDispatcher.addEventListener(AttackEvent.ATTACK_OVER, this.onAttackEnd.bind(this));
    }

    protected onAttackEnd(event: AttackEvent): void {
        if (event.attackType === HellRaisers.k_hellRaisersTribeID) {
            const xpWorth: number = this.getBasesWorthInXP();
            POPUPS.Push(new HellRaisersBattleSummary(event.wasBaseDestroyed, xpWorth).graphic);
            this.score += xpWorth;
        }
    }

    private getBasesWorthInXP(): number {
        let count: number = 0;
        const buildings: Array<any> = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const building of buildings) {
            count++;
        }
        return count;
    }

    public override createNewUI(): IReplayableEventUI {
        return new Maproom3EventHUD();
    }

    public override doesQualify(): boolean {
        return MapRoomManager.instance.isInMapRoom3;
    }
}
