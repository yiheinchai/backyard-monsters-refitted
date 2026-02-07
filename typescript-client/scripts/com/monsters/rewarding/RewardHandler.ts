import { IHandler } from "../interfaces/IHandler";
import { Reward } from "./Reward";
import { RewardLibrary } from "./RewardLibrary";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getUPDATES(): any { return require("../../../UPDATES").UPDATES; }



/**
 * Reward handler - manages player rewards and their application.
 */
export class RewardHandler implements IHandler {
    public static readonly k_UPDATE_ADD: string = "RA";
    public static readonly k_UPDATE_REMOVE: string = "RR";
    public static readonly k_UPDATE_VALUE: string = "RV";

    private static _instance: RewardHandler | null = null;

    public rewards: Array<Reward> = [];

    constructor() {
        this.rewards = [];
    }

    public static get instance(): RewardHandler {
        if (!RewardHandler._instance) {
            RewardHandler._instance = new RewardHandler();
        }
        return RewardHandler._instance;
    }

    public get name(): string {
        return "rewards";
    }

    public addReward(reward: Reward): boolean {
        if (this.getRewardByID(reward.id)) {
            return false;
        }
        this.rewards.push(reward);
        return true;
    }

    public addAndApplyReward(reward: Reward, forceApply: boolean = false): void {
        if (this.addReward(reward) || forceApply) {
            this.applyReward(reward);
        }
    }

    public applyReward(reward: Reward): void {
        reward.applyReward();
    }

    private applyRewards(): void {
        for (let i = 0; i < this.rewards.length; i++) {
            this.applyReward(this.rewards[i]);
        }
    }

    public getRewardByID(rewardId: string): Reward | null {
        for (let i = 0; i < this.rewards.length; i++) {
            const reward = this.rewards[i];
            if (reward.id === rewardId) {
                return reward;
            }
        }
        return null;
    }

    public removeRewardByID(rewardId: string): void {
        const reward = this.getRewardByID(rewardId);
        if (reward) {
            this.removeReward(reward);
        }
    }

    public removeReward(reward: Reward): void {
        const index = this.rewards.indexOf(reward);
        if (index >= 0) {
            reward.removed();
            this.rewards.splice(index, 1);
        }
    }

    public clear(): void {
        for (let i = 0; i < this.rewards.length; i++) {
            this.rewards[i].reset();
        }
        this.rewards.length = 0;
    }

    public initialize(data: any = null): void {
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || getBASE().isInfernoMainYardOrOutpost) {
            return;
        }
        
        getUPDATES().addAction(this.processUpdate.bind(this), this.name);
        
        if (!RewardLibrary.rewardTypes) {
            RewardLibrary.initialize();
        }
        
        if (data) {
            this.importData(data);
        }
        
        this.applyRewards();
    }

    public exportData(): any {
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || getBASE().isInfernoMainYardOrOutpost) {
            return null;
        }
        
        const result: any = {};
        for (let i = 0; i < this.rewards.length; i++) {
            const reward = this.rewards[i];
            result[reward.id] = reward.exportData();
        }
        return result;
    }

    public importData(data: any): void {
        for (const rewardId in data) {
            const reward = RewardLibrary.getRewardByID(rewardId);
            if (reward && data[rewardId]) {
                reward.importData(data[rewardId]);
                this.addReward(reward);
            }
        }
    }

    public updateExistingOrAddNewReward(rewardId: string, value: any = null): Reward | null {
        let reward = this.getRewardByID(rewardId);
        if (!reward) {
            reward = RewardLibrary.getRewardByID(rewardId);
        }
        if (reward) {
            this.addReward(reward);
            if (value !== null) {
                reward.value = value;
            }
        }
        return reward;
    }

    public processUpdate(updateData: any): boolean {
        let reward: Reward | null;
        
        switch (updateData.data[1]) {
            case RewardHandler.k_UPDATE_ADD:
                reward = RewardLibrary.getRewardByID(updateData.data[2]);
                if (reward) {
                    RewardHandler.instance.addAndApplyReward(reward);
                }
                break;
                
            case RewardHandler.k_UPDATE_REMOVE:
                RewardHandler.instance.removeRewardByID(updateData.data[2]);
                break;
                
            case RewardHandler.k_UPDATE_VALUE:
                reward = RewardHandler.instance.getRewardByID(updateData.data[2]);
                if (reward) {
                    reward.value = updateData.data[3];
                    RewardHandler.instance.addAndApplyReward(reward, true);
                }
                getBASE().Save(0, false, true);
                break;
        }
        
        return true;
    }
}
