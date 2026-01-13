import { ReplayableEventPromoMessage } from "../ReplayableEventPromoMessage";

/**
 * Battletoads end message.
 */
export class BattletoadsEndMessage extends ReplayableEventPromoMessage {
    constructor() {
        super("event1end");
        this.imageURL = BattletoadsEndMessage._IMAGE_DIRECTORY + "fp_event1end.v2.jpg";
    }

    protected static readonly _IMAGE_DIRECTORY: string = "";
}
