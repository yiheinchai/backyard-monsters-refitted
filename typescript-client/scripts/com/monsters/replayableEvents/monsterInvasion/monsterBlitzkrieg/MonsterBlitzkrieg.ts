import { Message } from "../../../frontPage/messages/Message";
import { MonsterBlitzkriegPromoMessage1 } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegPromoMessage1";
import { MonsterBlitzkriegPromoMessage2 } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegPromoMessage2";
import { MonsterBlitzkriegPromoMessage3 } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegPromoMessage3";
import { MonsterBlitzkriegStartMessage } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegStartMessage";
import { MonsterBlitzkriegEndMessage } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegEndMessage";
import { MonsterBlitzkriegRewardMessage } from "../../../frontPage/messages/events/monsterBlitzkrieg/MonsterBlitzkriegRewardMessage";
import { MonsterInvasion } from "../MonsterInvasion";
import { WaveObj } from "../WaveObj";
import { RewardHandler } from "../../../rewarding/RewardHandler";
import { RewardLibrary } from "../../../rewarding/RewardLibrary";
import { UnblockSlimeattikusReward } from "../../../rewarding/rewards/slimeattikus/UnblockSlimeattikusReward";
import { UnlockSlimeattikusReward } from "../../../rewarding/rewards/slimeattikus/UnlockSlimeattikusReward";

import { GLOBAL } from "../../../../../GLOBAL";

/**
 * Monster Blitzkrieg - monster invasion event with wave-based defense.
 */
export class MonsterBlitzkrieg extends MonsterInvasion {
    private static readonly WAVES: Array<Array<any>> = [
        [new WaveObj("C2", "bounce", 8, WaveObj.DIR.N, 0, 0, true)],
        [new WaveObj("C2", "bounce", 10, WaveObj.DIR.N, 0, 0, true), 1, new WaveObj("C3", "bounce", 5, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C2", "bounce", 5, WaveObj.DIR.N, 0, 0, true), 1, new WaveObj("C1", "bounce", 10, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C1", "bounce", 20, WaveObj.DIR.N, 0, 0, true), 1, new WaveObj("C3", "bounce", 15, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C17", "bounce", 3, WaveObj.DIR.N, 0, 0, true), new WaveObj("C4", "bounce", 5, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C2", "bounce", 6, WaveObj.DIR.N, 0, 0, true), 2, new WaveObj("C4", "bounce", 8, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C6", "bounce", 10, WaveObj.DIR.N, 0, 0, true), 5, new WaveObj("C3", "bounce", 50, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C1", "bounce", 40, WaveObj.DIR.N, 0, 0, true), 2, new WaveObj("C4", "bounce", 8, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C2", "bounce", 10, WaveObj.DIR.N, 0, 0, true), 1, new WaveObj("C1", "bounce", 10, WaveObj.DIR.N, 0, 0), new WaveObj("C4", "bounce", 10, WaveObj.DIR.N, 0, 0), 5, new WaveObj("C3", "bounce", 10, WaveObj.DIR.N, 0, 0)],
        [new WaveObj("C17", "bounce", 8, WaveObj.DIR.N, 0, 0, true)]
    ];

    private readonly _WAVES_TOTAL: number = 10;
    private readonly _CREATURE_REWARD_ID: string = "C17";

    constructor() {
        super(10);
        this._name = "Monster Blitzkrieg";
        this._originalStartDate = 0;
        this._progress = -1;
        this._priority = 200;
        this._id = 2;
        this._titleImage = "events/monblitz/monblitz_logo.v3.png";
        this._imageURL = "events/monblitz/monblitz_event.png";
        this._messages = [
            new MonsterBlitzkriegPromoMessage1(),
            new MonsterBlitzkriegPromoMessage2(),
            new MonsterBlitzkriegPromoMessage3(),
            new MonsterBlitzkriegStartMessage(),
            new MonsterBlitzkriegEndMessage()
        ];
        this._wavesTotal = this._WAVES_TOTAL;
        this._rewardMessage = new MonsterBlitzkriegRewardMessage();
    }

    protected override getWaveArray(): Array<Array<any>> {
        return MonsterBlitzkrieg.WAVES;
    }

    public override doesQualify(): boolean {
        const townHallLevel: number = GLOBAL.townHall._lvl.Get();
        return townHallLevel >= 3 && townHallLevel <= 4;
    }

    protected override onEventComplete(): void {
        RewardHandler.instance.addAndApplyReward(RewardLibrary.getRewardByID(UnlockSlimeattikusReward.ID));
    }

    public doesAutomaticalyGetReward(): boolean {
        return Boolean(GLOBAL.townHall) && GLOBAL.townHall._lvl.Get() >= 5 && !this.startDate;
    }

    protected override onImport(): void {
        if (this.doesAutomaticalyGetReward()) {
            RewardHandler.instance.addAndApplyReward(RewardLibrary.getRewardByID(UnblockSlimeattikusReward.ID));
        }
    }
}
