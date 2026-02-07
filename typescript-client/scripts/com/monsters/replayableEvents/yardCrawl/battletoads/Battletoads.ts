import { Message } from "../../../frontPage/messages/Message";
import { BattletoadsPromoMessage1 } from "../../../frontPage/messages/events/battletoads/BattletoadsPromoMessage1";
import { BattletoadsPromoMessage2 } from "../../../frontPage/messages/events/battletoads/BattletoadsPromoMessage2";
import { BattletoadsPromoMessage3 } from "../../../frontPage/messages/events/battletoads/BattletoadsPromoMessage3";
import { BattletoadsStartMessage } from "../../../frontPage/messages/events/battletoads/BattletoadsStartMessage";
import { BattletoadsEndMessage } from "../../../frontPage/messages/events/battletoads/BattletoadsEndMessage";
import { BattletoadsRewardMessage } from "../../../frontPage/messages/events/battletoads/BattletoadsRewardMessage";
import { YardCrawl } from "../YardCrawl";
import { RewardHandler } from "../../../rewarding/RewardHandler";
import { RewardLibrary } from "../../../rewarding/RewardLibrary";
import { UnblockVorgReward } from "../../../rewarding/rewards/vorg/UnblockVorgReward";
import { UnlockVorgReward } from "../../../rewarding/rewards/vorg/UnlockVorgReward";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }



/**
 * Battletoads - Creature Carnage yard crawl event.
 */
export class Battletoads extends YardCrawl {
    public static readonly ID: number = 1;

    private readonly _MONSTER_REWARD_ID: string = "C16";

    constructor() {
        super();
        this._name = "Creature Carnage";
        this._originalStartDate = 0;
        this._id = Battletoads.ID;
        this._progress = -1;
        this._priority = 100;
        this._yardsToDestroy = 10;
        this._titleImage = "events/creatureCarnage/creatureCarnage_logo.v3.png";
        this._imageURL = "events/creatureCarnage/creatureCarnage_event.v3.png";
        this._messages = [
            new BattletoadsPromoMessage1(),
            new BattletoadsPromoMessage2(),
            new BattletoadsPromoMessage3(),
            new BattletoadsStartMessage(),
            new BattletoadsEndMessage()
        ];
        this._rewardMessage = new BattletoadsRewardMessage();
    }

    public override doesQualify(): boolean {
        const townHallLevel: number = getGLOBAL().townHall._lvl.Get();
        return townHallLevel >= 2 && townHallLevel <= 4;
    }

    public doesAutomaticalyGetReward(): boolean {
        return Boolean(getGLOBAL().townHall) && getGLOBAL().townHall._lvl.Get() >= 5 && !this.startDate;
    }

    protected override onImport(): void {
        if (this.doesAutomaticalyGetReward()) {
            RewardHandler.instance.addAndApplyReward(RewardLibrary.getRewardByID(UnblockVorgReward.ID));
        }
    }

    protected override onEventComplete(): void {
        RewardHandler.instance.addAndApplyReward(RewardLibrary.getRewardByID(UnlockVorgReward.ID));
    }
}
