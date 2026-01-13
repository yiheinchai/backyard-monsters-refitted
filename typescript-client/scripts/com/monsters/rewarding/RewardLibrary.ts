import { Console } from "../debug/Console";
import { Reward } from "./Reward";
import { UnlockVorgReward } from "./rewards/vorg/UnlockVorgReward";
import { UnlockSlimeattikusReward } from "./rewards/slimeattikus/UnlockSlimeattikusReward";
import { UnblockSlimeattikusReward } from "./rewards/slimeattikus/UnblockSlimeattikusReward";
import { UnblockVorgReward } from "./rewards/vorg/UnblockVorgReward";
import { UnlockRezghulReward } from "./rewards/rezghul/UnlockRezghulReward";

// Forward declarations for reward types that don't have files yet
declare class UnlockMagmaTowerInOutposts extends Reward { static ID: string; }
declare class KrallenReward extends Reward { static ID: string; }
declare class KrallenBuffReward extends Reward { static ID: string; }
declare class DAVEStatueReward extends Reward { static ID: string; }
declare class ExtraTilesReward extends Reward { static ID: string; }
declare class GoldenDAVEReward extends Reward { static ID: string; }
declare class ImprovedHCCReward extends Reward { static ID: string; }
declare class YardPlannerExtraSlotsReward extends Reward { static ID: string; }
declare class SpurtzCannonReward1 extends Reward { static ID: string; }
declare class SpurtzCannonReward2 extends Reward { static ID: string; }
declare class SpurtzCannonReward3 extends Reward { static ID: string; }
declare class KorathReward extends Reward { static k_REWARD_ID: string; }

/**
 * Reward library - registry of all reward types.
 */
export class RewardLibrary {
    public static rewardTypes: { [key: string]: new () => Reward } | null = null;

    constructor() {}

    public static initialize(): void {
        RewardLibrary.rewardTypes = {};
        
        // Note: These reward classes need to be imported and registered when converted
        // For now, using placeholder registrations that will be populated as classes are converted
        /*
        RewardLibrary.addRewardType(UnlockVorgReward.ID, UnlockVorgReward);
        RewardLibrary.addRewardType(UnlockSlimeattikusReward.ID, UnlockSlimeattikusReward);
        RewardLibrary.addRewardType(UnblockSlimeattikusReward.ID, UnblockSlimeattikusReward);
        RewardLibrary.addRewardType(UnblockVorgReward.ID, UnblockVorgReward);
        RewardLibrary.addRewardType(UnlockMagmaTowerInOutposts.ID, UnlockMagmaTowerInOutposts);
        RewardLibrary.addRewardType(KrallenReward.ID, KrallenReward);
        RewardLibrary.addRewardType(KrallenBuffReward.ID, KrallenBuffReward);
        RewardLibrary.addRewardType(DAVEStatueReward.ID, DAVEStatueReward);
        RewardLibrary.addRewardType(ExtraTilesReward.ID, ExtraTilesReward);
        RewardLibrary.addRewardType(GoldenDAVEReward.ID, GoldenDAVEReward);
        RewardLibrary.addRewardType(ImprovedHCCReward.ID, ImprovedHCCReward);
        RewardLibrary.addRewardType(YardPlannerExtraSlotsReward.ID, YardPlannerExtraSlotsReward);
        RewardLibrary.addRewardType(SpurtzCannonReward1.ID, SpurtzCannonReward1);
        RewardLibrary.addRewardType(SpurtzCannonReward2.ID, SpurtzCannonReward2);
        RewardLibrary.addRewardType(SpurtzCannonReward3.ID, SpurtzCannonReward3);
        RewardLibrary.addRewardType(KorathReward.k_REWARD_ID, KorathReward);
        RewardLibrary.addRewardType(UnlockRezghulReward.k_REWARD_ID, UnlockRezghulReward);
        */
    }

    public static addRewardType(rewardId: string, rewardClass: new () => Reward): void {
        if (!RewardLibrary.rewardTypes) {
            RewardLibrary.rewardTypes = {};
        }
        
        if (RewardLibrary.rewardTypes[rewardId]) {
            Console.warning("You tried to add the reward(" + rewardId + ") that already exists");
        }
        RewardLibrary.rewardTypes[rewardId] = rewardClass;
    }

    public static getRewardByID(rewardId: string): Reward | null {
        if (!RewardLibrary.rewardTypes) {
            return null;
        }
        
        const RewardClass = RewardLibrary.rewardTypes[rewardId];
        if (RewardClass) {
            const reward = new RewardClass();
            reward.id = rewardId;
            return reward;
        }
        return null;
    }
}
