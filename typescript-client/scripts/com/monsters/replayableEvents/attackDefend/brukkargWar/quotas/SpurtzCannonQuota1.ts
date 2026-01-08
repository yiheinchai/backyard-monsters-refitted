import { ReplayableEventQuota } from "../../../ReplayableEventQuota";
import { AttackDefend } from "../../AttackDefend";
import { SpurtzCannonRewardMessage1 } from "../messages/SpurtzCannonRewardMessage1";
import { SpurtzCannonReward1 } from "../rewards/SpurtzCannonReward1";

/**
 * Spurtz cannon quota 1 - first quota for Brukkarg War event.
 */
export class SpurtzCannonQuota1 extends ReplayableEventQuota {
    constructor() {
        super(
            AttackDefend.SCORE_PER_YARD * 3,
            "events/brukkargWar/brukkarg_reward_1.png",
            SpurtzCannonReward1.ID,
            new SpurtzCannonRewardMessage1()
        );
    }
}
