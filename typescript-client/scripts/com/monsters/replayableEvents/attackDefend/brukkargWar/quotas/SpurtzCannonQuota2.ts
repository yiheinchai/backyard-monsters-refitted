import { ReplayableEventQuota } from "../../../ReplayableEventQuota";
import { AttackDefend } from "../../AttackDefend";
import { SpurtzCannonRewardMessage2 } from "../messages/SpurtzCannonRewardMessage2";
import { SpurtzCannonReward1 } from "../rewards/SpurtzCannonReward1";
import { SpurtzCannonReward2 } from "../rewards/SpurtzCannonReward2";
import { RewardHandler } from "../../../../rewarding/RewardHandler";

/**
 * Spurtz cannon quota 2 - second quota for Brukkarg War event.
 */
export class SpurtzCannonQuota2 extends ReplayableEventQuota {
    constructor() {
        super(
            AttackDefend.SCORE_PER_YARD * 4,
            "events/brukkargWar/brukkarg_reward_2.png",
            SpurtzCannonReward2.ID,
            new SpurtzCannonRewardMessage2()
        );
    }

    public override metQuota(): void {
        super.metQuota();
        RewardHandler.instance.removeRewardByID(SpurtzCannonReward1.ID);
    }
}
