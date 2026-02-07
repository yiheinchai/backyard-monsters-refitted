import MouseEvent from "openfl/events/MouseEvent";

import { AttackEvent } from "../events/AttackEvent";
import { FrontPageGraphic } from "../frontPage/FrontPageGraphic";
import { Message } from "../frontPage/messages/Message";
import { IHandler } from "../interfaces/IHandler";
import { KOTHHUDGraphic } from "./graphics/KOTHHUDGraphic";
import { KOTHEndMessage } from "./messages/KOTHEndMessage";
import { KOTHQuota1MetMessage } from "./messages/KOTHQuota1MetMessage";
import { KOTHQuota2MetMessage } from "./messages/KOTHQuota2MetMessage";
import { KOTHRewardMessage } from "./messages/KOTHRewardMessage";
import { KrallenAtRiskMessage } from "./messages/KrallenAtRiskMessage";
import { KrallenWinSoonMessage } from "./messages/KrallenWinSoonMessage";
import { KrallenBuffReward } from "./rewards/KrallenBuffReward";
import { KrallenReward } from "./rewards/KrallenReward";
import { ReplayableEventHandler } from "../replayableEvents/ReplayableEventHandler";
import { KingOfTheHill } from "../replayableEvents/looting/KingOfTheHill";
import { Reward } from "../rewarding/Reward";
import { RewardHandler } from "../rewarding/RewardHandler";
import { RewardLibrary } from "../rewarding/RewardLibrary";

import { CHAMPIONCAGEPOPUP } from "../../../CHAMPIONCAGEPOPUP";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../events/BuildingEvent").BuildingEvent; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getCHAMPIONCAGE(): any { return require("../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURES(): any { return require("../../../CREATURES").CREATURES; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }
function getUI2(): any { return require("../../../UI2").UI2; }


/**
 * KOTHHandler - King of the Hill event handler for Krallen champion.
 */
export class KOTHHandler implements IHandler {
    private static _instance: KOTHHandler | null = null;

    private readonly k_CONSECUTIVE_WINS_TO_PERMAKRALLEN: number = 5;
    private readonly _WARNING_DURATION: number = 86400;
    private readonly _LAST_LOOT_SCORE_LABEL: string = "lastKOTHScore";
    private readonly _LAST_TIER_LABEL: string = "lastKOTHTier";

    private _lootingDuration: number = 604800;
    private _lootThresholds: Array<number> = [];
    private _tierChangeMessages: Array<any> = [KOTHQuota1MetMessage, KOTHQuota2MetMessage];
    private _lootChangeMessages: Array<any> = [KOTHQuota1MetMessage, KOTHQuota2MetMessage];
    private _wins: number = 0;
    private _totalLoot: number = 0;
    private _timeToReset: number = 0;
    private _tier: number = 0;
    private _hudGraphic: KOTHHUDGraphic | null = null;

    constructor() {
        this._lootThresholds = [];
        this._tierChangeMessages = [KOTHQuota1MetMessage, KOTHQuota2MetMessage];
        this._lootChangeMessages = [KOTHQuota1MetMessage, KOTHQuota2MetMessage];
    }

    public static get instance(): KOTHHandler {
        if (!KOTHHandler._instance) {
            KOTHHandler._instance = new KOTHHandler();
        }
        return KOTHHandler._instance;
    }

    public initialize(data: Record<string, any> | null = null): void {
        if (!getGLOBAL()._flags[this.name] || getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || !getBASE().isMainYard) {
            return;
        }
        if (data) {
            this.importData(data);
        }
        if (this.doesQualify) {
            CHAMPIONCAGEPOPUP._kothEnabled = true;
        }
        getGLOBAL().eventDispatcher.addEventListener(AttackEvent.ATTACK_OVER, this.endedAttack.bind(this));
        this.updtateEvent();
        this.checkWarnings();
        this.checkEventReset();
        this.checkQuotaPopups();
        this.updateRewards();
        this.addHUDGraphic();
    }

    private checkEventReset(): void {
        let message: Message | null = null;
        const lastScore = getGLOBAL().StatGet(this._LAST_LOOT_SCORE_LABEL);
        if (this._totalLoot < lastScore) {
            if (this._wins) {
                if (!this.hasWonPermanantly) {
                    message = new KOTHRewardMessage(this._wins > 1);
                }
            } else {
                message = new KOTHEndMessage(getGLOBAL().StatGet(this._LAST_TIER_LABEL) >= 1);
            }
            if (message) {
                getPOPUPS().Push(new FrontPageGraphic(message));
            }
        }
    }

    private checkQuotaPopups(): void {
        const lastTier = this.getTier(getGLOBAL().StatGet(this._LAST_LOOT_SCORE_LABEL));
        const currentTier = this.getTier(this._totalLoot);
        if (currentTier > lastTier && currentTier <= this._lootChangeMessages.length) {
            const message = new this._lootChangeMessages[currentTier - 1]();
            getPOPUPS().Push(new FrontPageGraphic(message));
        }
    }

    protected endedAttack(event: AttackEvent): void {
        const loot = event.loot;
        const totalLoot = loot.r1.Get() + loot.r2.Get() + loot.r3.Get() + loot.r4.Get();
        getLOGGER().StatB({ "st1": "KOTH", "value": totalLoot.toString() }, "Loot");
    }

    protected destroyedMaproom(event: BuildingEvent): void {
        CHAMPIONCAGEPOPUP._kothEnabled = false;
        const data = { tier: 0, wins: 0, loot: 0, countdown: 0 };
        this.initialize(data);
    }

    private checkWarnings(): void {
        if (this._timeToReset <= this._WARNING_DURATION) {
            if (this._tier && this._totalLoot < this.minimumLootRequiredToUnlockKrallen() && !this.hasWonPermanantly) {
                getPOPUPS().Push(new FrontPageGraphic(new KrallenAtRiskMessage()));
            } else if (!this._tier && this._totalLoot >= this.minimumLootRequiredToUnlockKrallen() * 0.9) {
                getPOPUPS().Push(new FrontPageGraphic(new KrallenWinSoonMessage()));
            }
        }
    }

    private updtateEvent(): void {
        if (Boolean(ReplayableEventHandler.activeEvent) && ReplayableEventHandler.activeEvent instanceof KingOfTheHill) {
            const koth = ReplayableEventHandler.activeEvent as KingOfTheHill;
            koth.score = this._totalLoot;
        }
    }

    private updateRewards(): void {
        this.updateReward(KrallenReward.ID, this.tier, true);
        this.updateReward(KrallenBuffReward.ID, this._wins);
    }

    private updateReward(rewardID: string, value: number, logChampion: boolean = false): void {
        let reward = RewardHandler.instance.getRewardByID(rewardID);
        if (reward) {
            if (!value) {
                RewardHandler.instance.removeReward(reward);
                reward = null!;
                if (logChampion) {
                    getLOGGER().StatB({ "st1": "KOTH", "st2": "Champion", "st3": "Removed" }, this.tier + "_" + (this.wins - 1));
                }
            }
        } else if (value) {
            reward = RewardLibrary.getRewardByID(rewardID);
            if (logChampion) {
                getLOGGER().StatB({ "st1": "KOTH", "st2": "Champion", "st3": "Awarded" }, this.tier + "_" + (this.wins - 1));
            }
        }
        if (reward) {
            RewardHandler.instance.addReward(reward);
            reward.value = value;
            RewardHandler.instance.applyReward(reward);
        }
    }

    private addHUDGraphic(): void {
        if (!this.doesQualify || getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD || !getBASE().isMainYard) {
            return;
        }
        let krallenLevel = 0;
        if (getCREATURES()._krallen) {
            krallenLevel = getCREATURES()._krallen._level.Get();
        }
        this._hudGraphic = new KOTHHUDGraphic(Boolean(this.tier), krallenLevel);
        getUI2()._top.addIcon(this._hudGraphic);
        this._hudGraphic.addEventListener(MouseEvent.CLICK, this.clickedHUDGraphic.bind(this));
    }

    private removeHUDGraphic(): void {
        if (!this._hudGraphic) {
            return;
        }
        getUI2()._top.removeIcon(this._hudGraphic);
        this._hudGraphic.removeEventListener(MouseEvent.CLICK, this.clickedHUDGraphic.bind(this));
    }

    protected clickedHUDGraphic(event: MouseEvent): void {
        getCHAMPIONCAGE().ShowKrallenTab();
    }

    public get name(): string {
        return "krallen";
    }

    public importData(data: Record<string, any>): void {
        this._tier = data.tier;
        this._wins = data.wins;
        this._totalLoot = data.loot;
        this._timeToReset = data.countdown;
        if (this.hasWonPermanantly) {
            this._lootThresholds.push(getGLOBAL()._flags["krallen_special1_award_threshold"] - getGLOBAL()._flags["krallen_award_threshold"]);
        } else {
            this._lootThresholds.push(getGLOBAL()._flags["krallen_special1_award_threshold"]);
        }
        this._lootThresholds.push(getGLOBAL()._flags["krallen_award_threshold"]);
        this._lootThresholds.push(0);
        this._lootingDuration = getGLOBAL()._flags["krallen_duration"] * 86400;
    }

    public minimumLootRequiredToUnlockKrallen(): number {
        if (this._lootThresholds.length >= 2) {
            return this._lootThresholds[this._lootThresholds.length - 2];
        }
        return Number.MAX_VALUE;
    }

    public setDebugTimeToReset(time: number): void {
        this._timeToReset = time;
        this.checkWarnings();
    }

    public get timePerRound(): number {
        return this._lootingDuration;
    }

    public get timeEnd(): number {
        return ReplayableEventHandler.currentTime + this._timeToReset;
    }

    public get timeStart(): number {
        return this.timeEnd - this._lootingDuration;
    }

    public get doesQualify(): boolean {
        return getTUTORIAL().hasFinished && Boolean(getGLOBAL().townHall) && getGLOBAL().townHall._lvl.Get() >= 6;
    }

    public exportData(): Record<string, any> | null {
        getGLOBAL().StatSet(this._LAST_LOOT_SCORE_LABEL, this._totalLoot, false);
        getGLOBAL().StatSet(this._LAST_TIER_LABEL, this._tier, false);
        return null;
    }

    public get totalLoot(): number {
        return this._totalLoot;
    }

    public get timeToReset(): number {
        return this._timeToReset;
    }

    public get wins(): number {
        return this._wins;
    }

    public get hasWonPermanantly(): boolean {
        return this._wins >= this.k_CONSECUTIVE_WINS_TO_PERMAKRALLEN;
    }

    public get lootThresholds(): Array<number> {
        return this._lootThresholds;
    }

    public get tier(): number {
        return this._tier;
    }

    public getTier(loot: number): number {
        for (let i = 0; i < this._lootThresholds.length; i++) {
            if (loot >= this._lootThresholds[i]) {
                return this._lootThresholds.length - 1 - i;
            }
        }
        return 0;
    }
}
