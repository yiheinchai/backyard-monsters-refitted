import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";

import { FrontPageGraphic } from "../frontPage/FrontPageGraphic";
import { FrontPageLibrary } from "../frontPage/FrontPageLibrary";
import { Message } from "../frontPage/messages/Message";
import { IReplayableEventUI } from "./IReplayableEventUI";
import { ReplayableEventHandler } from "./ReplayableEventHandler";
import { ReplayableEventQuota } from "./ReplayableEventQuota";
import { ReplayableEventUI } from "./ReplayableEventUI";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { POPUPS } from "../../../POPUPS";

/**
 * ReplayableEvent - Base class for replayable events.
 */
export class ReplayableEvent extends EventDispatcher {
    protected readonly _DEFAULT_EVENT_DURATION: number = 345600;
    private readonly _PROMO3_DURATION: number = 259200;
    private readonly _PROMO2_DURATION: number = 86400;

    protected _priority: number = 0;
    protected _name: string = "";
    protected _dates: Array<number> | null = null;
    protected _originalStartDate: number = 0;
    protected _progress: number = -1;
    protected _imageURL: string = "";
    protected _titleImage: string = "";
    protected _eventStoreTitleImage: string = "";
    protected _messages: Array<Message> = [];
    protected _rewardMessage: Message | null = null;
    protected _id: number = 0;
    protected _score: number = -1;
    protected _buttonCopy: string = "";
    protected _duration: number = 345600;
    protected _quotas: Array<ReplayableEventQuota> = [];
    protected m_mustBeInsideBase: boolean = false;
    protected _maxScore: number = Number.MAX_VALUE;

    constructor() {
        super();
        this._maxScore = Number.MAX_VALUE;
        if (this._rewardMessage) {
            if (FrontPageLibrary.EVENTS === null) {
                FrontPageLibrary.addCategories();
            }
            FrontPageLibrary.EVENTS.addMessage(this._rewardMessage);
        }
        this._quotas = [];
    }

    public get preEventHUDImageURL(): string {
        return "";
    }

    public get eventHUDImageURL(): string {
        return "";
    }

    public createNewUI(): IReplayableEventUI {
        return new ReplayableEventUI();
    }

    public doesQualify(): boolean {
        return false;
    }

    protected onEventComplete(): void {
    }

    public pressedActionButton(): void {
    }

    protected onInitialize(): void {
    }

    public initialize(): void {
        const message = this.getCurrentMessage();
        if (message) {
            FrontPageLibrary.EVENTS.addMessage(message);
        }
        this.onInitialize();
    }

    public getCurrentMessage(): Message | null {
        if (this.hasCompletedEvent && Boolean(this._rewardMessage)) {
            return this._rewardMessage;
        }
        if (this.hasEventEnded) {
            return this._messages[this._messages.length - 1];
        }
        if (this.hasEventStarted) {
            return this._messages[this._messages.length - 2];
        }
        const timeUntilStart = this.startDate - ReplayableEventHandler.currentTime;
        if (timeUntilStart > this._PROMO3_DURATION) {
            return this._messages[0];
        }
        if (timeUntilStart > this._PROMO2_DURATION) {
            return this._messages[1];
        }
        return this._messages[2];
    }

    public pressedHelpButton(): Message | null {
        return this.getCurrentMessage();
    }

    public reset(): void {
        this.score = 0;
        this.setStartDate(0);
        for (let i = 0; i < this._messages.length; i++) {
            const message = this._messages[i];
            message.timeLastSeen = 0;
            FrontPageLibrary.EVENTS.addMessage(message);
        }
        ReplayableEventHandler.callServerMethod("resetevent", [["eventid", this._id]], this.resetCallback.bind(this));
        BASE.Save();
    }

    protected resetCallback(response: Record<string, any>): void {
        this.dispatchEvent(new Event("reset"));
    }

    public exportData(): Record<string, any> {
        const result: Record<string, any> = {};
        result.startDate = this.startDate;
        if (this._rewardMessage) {
            result.reward = this._rewardMessage.export();
        }
        const quotaCount = this._quotas ? this._quotas.length : 0;
        if (quotaCount !== 0) {
            result.quotas = new Array(quotaCount);
            for (let i = 0; i < this._quotas.length; i++) {
                const quotaData = this._quotas[i].exportData();
                if (quotaData) {
                    result.quotas[i] = quotaData;
                }
            }
        }
        return result;
    }

    public importData(data: Record<string, any>): void {
        this.setStartDate(data.startDate);
        if (Boolean(this._rewardMessage) && Boolean(data.reward)) {
            this._rewardMessage!.setup(data.reward);
        }
        if (data.quotas) {
            const localCount = this._quotas.length;
            const dataCount = data.quotas.length;
            for (let i = 0; i < localCount && i < dataCount; i++) {
                this._quotas[i].importData(data.quotas[i]);
            }
        }
        this.onImport();
    }

    protected onImport(): void {
    }

    public get duration(): number {
        return this._duration;
    }

    public get buttonCopy(): string {
        return this._buttonCopy;
    }

    public get hasCompletedEvent(): boolean {
        return this._progress >= 1;
    }

    public get hasEventStarted(): boolean {
        return ReplayableEventHandler.currentTime >= this.startDate;
    }

    public get hasEventEnded(): boolean {
        return ReplayableEventHandler.currentTime >= this.endDate;
    }

    public get endDate(): number {
        if (!this._dates) {
            return 0;
        }
        return this._dates[this._dates.length - 1];
    }

    public get name(): string {
        return this._name;
    }

    public get originalStartDate(): number {
        return this._originalStartDate;
    }

    public get progress(): number {
        return this._progress;
    }

    public set progress(value: number) {
        this._progress = value;
        if (this.hasCompletedEvent) {
            this.completedEvent();
        }
    }

    public set score(value: number) {
        if (this._score >= 0 && value - this._score > 0) {
            ReplayableEventHandler.callServerMethod("updatescore", [["eventid", this._id], ["delta", value - this._score], ["saveid", GLOBAL.Timestamp()]], this.verifyScoreFromServer.bind(this));
        }
        this._score = value;
        this.setMetQuotas();
    }

    protected setMetQuotas(): void {
        if (!this.m_mustBeInsideBase || this.m_mustBeInsideBase && GLOBAL.isAtHome() === true) {
            const count = this._quotas.length;
            for (let i = 0; i < count; i++) {
                const quota = this._quotas[i];
                if (this._score >= quota.quota) {
                    quota.metQuota();
                }
            }
        }
    }

    protected getLatestMetQuota(score: number): ReplayableEventQuota | null {
        for (let i = this._quotas.length - 1; i >= 0; i--) {
            const quota = this._quotas[i];
            if (score >= quota.quota) {
                return quota;
            }
        }
        return null;
    }

    protected verifyScoreFromServer(response: Record<string, any>): void {
        const serverScore = response.score as number;
        if (this._score !== serverScore) {
            console.log("WARNING: the server score(" + serverScore + ") doesnt match the local score(" + this._score + "), ignoring server score");
        }
    }

    protected getServerScore(): void {
        ReplayableEventHandler.callServerMethod("geteventscore", [["eventid", this._id]], this.setScoreFromServer.bind(this));
    }

    protected setScoreFromServer(response: Record<string, any>): void {
        const serverScore = response.score as number;
        if (Boolean(serverScore) && !isNaN(serverScore)) {
            this._score = serverScore;
        }
    }

    private completedEvent(): void {
        if (this.m_mustBeInsideBase && GLOBAL.isAtHome() !== true) {
            return;
        }
        if (Boolean(this._rewardMessage) && !this._rewardMessage!.hasBeenSeen) {
            POPUPS.Push(new FrontPageGraphic(this._rewardMessage!));
            this._rewardMessage!.viewed();
        }
        this.onEventComplete();
    }

    public update(): void {
    }

    public get priority(): number {
        return this._priority;
    }

    public get startDate(): number {
        if (!this._dates) {
            return 0;
        }
        return this._dates[0];
    }

    public setStartDate(date: number): void {
        this._dates = [date, date + this._duration];
    }

    public get timeUntilNextDate(): number {
        let targetDate: number;
        if (this.hasEventEnded) {
            targetDate = this.endDate + ReplayableEventHandler.k_DURATION_STORE_IS_OPEN_AFTER_EVENT;
        } else if (this.hasEventStarted) {
            targetDate = this.endDate;
        } else {
            targetDate = this.startDate;
        }
        return targetDate - ReplayableEventHandler.currentTime;
    }

    public get titleImage(): string {
        return this._titleImage;
    }

    public get eventStoreTitleImage(): string {
        return this._eventStoreTitleImage;
    }

    public get imageURL(): string {
        return this._imageURL;
    }

    public get id(): number {
        return this._id;
    }

    public get score(): number {
        return this._score;
    }

    public get rewards(): Array<ReplayableEventQuota> {
        return this._quotas;
    }

    public get maxScore(): number {
        return this._maxScore;
    }

    public get isLive(): boolean {
        return Boolean(this._originalStartDate) && (ReplayableEventHandler.currentTime >= this._originalStartDate - ReplayableEventHandler.DURATION_UNTIL_EVENT_STARTS && ReplayableEventHandler.currentTime <= this._originalStartDate + this._duration);
    }
}
