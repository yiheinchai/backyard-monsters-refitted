import { FrontPageGraphic } from "../frontPage/FrontPageGraphic";
import { Message } from "../frontPage/messages/Message";
import { IExportable } from "../interfaces/IExportable";
import { RewardHandler } from "../rewarding/RewardHandler";
import { RewardLibrary } from "../rewarding/RewardLibrary";

import { GLOBAL } from "../../../GLOBAL";
import { POPUPS } from "../../../POPUPS";

/**
 * Replayable event quota - tracks progress towards event goals.
 */
export class ReplayableEventQuota implements IExportable {
    public rewardID: string | null;
    public imageURL: string | null;
    public quota: number;
    public message: Message | null;
    protected _dateAwarded: number = 0;

    constructor(quota: number, imageURL: string | null = null, rewardID: string | null = null, message: Message | null = null) {
        this.rewardID = rewardID;
        this.imageURL = imageURL;
        this.quota = quota;
        this.message = message;
    }

    public get hasBeenAwarded(): boolean {
        return this._dateAwarded > 0;
    }

    public metQuota(): void {
        if (this.rewardID) {
            RewardHandler.instance.addAndApplyReward(RewardLibrary.getRewardByID(this.rewardID));
        }
        if (this.message) {
            POPUPS.Push(new FrontPageGraphic(this.message));
        }
        this._dateAwarded = GLOBAL.Timestamp();
    }

    public exportData(): Record<string, any> | null {
        if (!this._dateAwarded) {
            return null;
        }
        return { "dateAwarded": this._dateAwarded };
    }

    public importData(data: Record<string, any>): void {
        if (!data) {
            return;
        }
        this._dateAwarded = data["dateAwarded"];
    }
}
