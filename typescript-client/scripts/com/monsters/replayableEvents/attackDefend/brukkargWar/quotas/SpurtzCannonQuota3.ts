import { ReplayableEventQuota } from "../../../ReplayableEventQuota";
import { AttackDefend } from "../../AttackDefend";
import { SpurtzCannonRewardMessage3 } from "../messages/SpurtzCannonRewardMessage3";
import { SpurtzCannonReward2 } from "../rewards/SpurtzCannonReward2";
import { SpurtzCannonReward3 } from "../rewards/SpurtzCannonReward3";
import { RewardHandler } from "../../../../rewarding/RewardHandler";

/**
 * Spurtz cannon quota 3 - third quota for Brukkarg War event.
 */
export class SpurtzCannonQuota3 extends ReplayableEventQuota {
    constructor() {
        super(
            AttackDefend.SCORE_PER_YARD * 5,
            "events/brukkargWar/brukkarg_reward_3.png",
            SpurtzCannonReward3.ID,
            new SpurtzCannonRewardMessage3()
        );
    }

    public override metQuota(): void {
        super.metQuota();
        RewardHandler.instance.removeRewardByID(SpurtzCannonReward2.ID);
    }
}
