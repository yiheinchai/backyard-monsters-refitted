import { TRIBES } from "../../ai/TRIBES";
import { AttackEvent } from "../../events/AttackEvent";
import { ReplayableEventHandler } from "../ReplayableEventHandler";
import { ReplayableEventQuota } from "../ReplayableEventQuota";
import { MonsterInvasion } from "../monsterInvasion/MonsterInvasion";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getCREATURES(): any { return require("../../../../CREATURES").CREATURES; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("../../../../HOUSING").HOUSING; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }
function getLOGIN(): any { return require("../../../../LOGIN").LOGIN; }



/**
 * AttackDefend - replayable event combining wave defense and base attacks.
 */
export class AttackDefend extends MonsterInvasion {
    public static readonly SCORE_PER_WAVE: number = 1;
    public static readonly SCORE_PER_YARD: number = 1000;

    protected _yardsToDestroy: number = 0;
    protected _yardsDestroyed: number = 0;
    protected _intactBaseList: Array<Record<string, any>> = [];
    protected _wavesBeforeAttack: number = 0;
    protected _maxWaves: number = 0;

    constructor(id: number = 0) {
        super(id);
    }

    protected override set wavesDestroyed(value: number) {
       // Empty setter override
    }

    protected set yardsDestroyed(value: number) {
        // Empty setter override
    }

    public override set score(value: number) {
        if (this._score >= 0 && value - this._score > 0) {
            ReplayableEventHandler.callServerMethod("updatescore", [["eventid", this._id], ["delta", value - this._score]], this.verifyScoreFromServer.bind(this));
        }
        this._score = value;
        if (!this.m_mustBeInsideBase || (this.m_mustBeInsideBase && getGLOBAL().isAtHome() === true)) {
            const quotaLen = this._quotas.length;
            for (let i = 0; i < quotaLen; i++) {
                const quota = this._quotas[i];
                if (this._score >= quota.quota && !quota.hasBeenAwarded) {
                    quota.metQuota();
                }
            }
        }
        this._yardsDestroyed = Math.floor(Math.max(this._score, 0) / AttackDefend.SCORE_PER_YARD);
        this._wavesDestroyed = Math.max(this._score, 0) % AttackDefend.SCORE_PER_YARD;
        this.progress = (this._wavesDestroyed + this._yardsDestroyed) / (this._wavesTotal + this._yardsToDestroy);
    }

    protected override onInitialize(): void {
        super.onInitialize();
        ReplayableEventHandler.callServerMethod("loadbases", [["eventid", this._id]], this.loadedBaseList.bind(this));
    }

    public override pressedActionButton(): void {
        if (!this.readyToAttackNextYard()) {
            this.setupNextWave();
            ++this._numAttempts;
            getLOGGER().StatB({
                "st1": "ERS",
                "st2": this._name,
                "st3": "Wave_Num_" + this._wavesDestroyed,
                "value": this._numAttempts
            }, "Attack_Start");
        } else if (Boolean(this._intactBaseList) && this._intactBaseList.length > 0) {
            const hasMonsters = getHOUSING()._housingUsed.Get() > 0 || getCREATURES()._guardian !== null;
            if (!getGLOBAL()._bMap || !getGLOBAL()._bFlinger || !getGLOBAL()._bFlinger._canFunction || !getGLOBAL()._bHousing || !hasMonsters) {
                getGLOBAL().Message("You need a working Maproom, Flinger, Housing and some monsters to participate in this next phase.");
                return;
            }
            let baseUrl: string = "";
            if (getMapRoomManager().instance.isInMapRoom2or3) {
                getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_1;
                baseUrl = getGLOBAL()._infBaseURL;
            }
            const baseId = this._intactBaseList[this._yardsDestroyed].id;
            if (this._intactBaseList[this._yardsDestroyed].destroyed === true) {
                // Base already destroyed
            }
            getLOGGER().StatB({
                "st1": "ERS",
                "st2": this._name,
                "st3": "Attack_Num_" + baseId,
                "value": baseId
            }, "Attack_Start");
            getGLOBAL().eventDispatcher.addEventListener(AttackEvent.ATTACK_OVER, this.finishedAttack.bind(this));
            getBASE().LoadBase(baseUrl, getLOGIN()._playerID, baseId, "wmattack");
        } else if (this._wavesDestroyed >= this._maxWaves && this._yardsDestroyed >= this._yardsToDestroy) {
            this.progress = 1;
        }
    }

    protected finishedAttack(event: AttackEvent): void {
        getGLOBAL().eventDispatcher.removeEventListener(AttackEvent.ATTACK_OVER, this.finishedAttack.bind(this));
        if (event.wasBaseDestroyed) {
            this.score = this._score + AttackDefend.SCORE_PER_YARD;
        }
    }

    protected override onEventComplete(): void {
        // Empty override
    }

    public override importData(data: Record<string, any>): void {
        super.importData(data);
        this.yardsDestroyed = data["_yardsDestroyed"];
        if (this._isActive) {
            ReplayableEventHandler.callServerMethod("geteventscore", [["eventid", this._id]], this.serverScoreCallback.bind(this));
        }
    }

    public override exportData(): Record<string, any> {
        const data = super.exportData();
        data["_yardsDestroyed"] = this._yardsDestroyed;
        return data;
    }

    protected serverScoreCallback(result: Record<string, any>): void {
        const score = result.score;
        if (score) {
            this._score = score;
            this.score = score;
        }
    }

    public override reset(): void {
        super.reset();
        this._numAttempts = 0;
        this._wavesDestroyed = 0;
    }

    protected loadedBaseList(result: Record<string, any>): void {
        this._intactBaseList = [];
        for (const key in result) {
            const base = result[key];
            if (!(typeof base === "number")) {
                this._intactBaseList.push(base);
                getBASE().addEventBaseException(base.id);
                TRIBES.B_IDS.push(base.id);
            }
        }
    }

    protected override verifyScoreFromServer(result: Record<string, any>): void {
        super.verifyScoreFromServer(result);
        const serverScore = result.score as number;
        if (this._score !== serverScore && (typeof result.score === "number")) {
            let delta = 0;
            const serverYards = Math.floor(serverScore / AttackDefend.SCORE_PER_YARD);
            const localYards = Math.floor(this._score / AttackDefend.SCORE_PER_YARD);
            const wavePhase = Math.floor(this._wavesDestroyed / this._wavesBeforeAttack);
            if (serverYards < this._yardsDestroyed && localYards === this._yardsDestroyed && localYards >= wavePhase - 1) {
                delta += AttackDefend.SCORE_PER_YARD * (localYards - serverYards);
            }
            const serverWaves = serverScore % AttackDefend.SCORE_PER_YARD;
            const localWaves = this._score % AttackDefend.SCORE_PER_YARD;
            if (localWaves > serverWaves) {
                delta += localWaves - serverWaves;
            }
            if (delta > 0) {
                ReplayableEventHandler.callServerMethod("updatescore", [["eventid", this._id], ["delta", delta]], this.verifyScoreFromServer.bind(this));
            }
        }
    }

    protected readyToAttackNextYard(): boolean {
        return Math.floor(this._wavesDestroyed / this._wavesBeforeAttack) > this._yardsDestroyed;
    }
}
