import Event from "openfl/events/Event";

import { InstanceManager } from "../../managers/InstanceManager";
import { ReplayableEvent } from "../ReplayableEvent";
import { AttackDefend } from "../attackDefend/AttackDefend";

import { BASE } from "../../../../BASE";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { LOGGER } from "../../../../LOGGER";
import { SOUNDS } from "../../../../SOUNDS";
import { UI2 } from "../../../../UI2";
import { WMATTACK } from "../../../../WMATTACK";

/**
 * MonsterInvasion - base class for wave-based monster invasion events.
 */
export class MonsterInvasion extends ReplayableEvent {
    protected static readonly TYPE_CREEP: number = 0;
    protected static readonly TYPE_GUARDIAN: number = 1;

    protected _currentAttackers: Array<any> = [];
    protected _retreatAllMonsters: boolean = false;
    protected _randDir: number = 0;
    protected _wavesTotal: number = 0;
    protected _wavesDestroyed: number = 0;
    protected _waitTimer: number = 0;
    protected _internalWaveIndex: number = 0;
    protected _curSend: Array<any> = [];
    protected _isActive: boolean = false;
    protected _numAttempts: number = 0;
    private _saveTimer: number = 0;

    constructor(wavesTotal: number = 0) {
        super();
        this._currentAttackers = [];
        this._curSend = [];
        this._wavesTotal = wavesTotal;
    }

    public override set score(value: number) {
        super.score = value;
        this._wavesDestroyed = value;
        this.progress = this._wavesDestroyed / this._wavesTotal;
    }

    protected set wavesDestroyed(value: number) {
        this._wavesDestroyed = value;
        this.progress = this._wavesDestroyed / this._wavesTotal;
    }

    protected endWave(): void {
        let totalHealth = 0;
        let totalMaxHealth = 0;
        const buildings = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const bld of buildings) {
            if (!((bld as BFOUNDATION)._class === "trap" && (bld as BFOUNDATION)._fired || (bld as BFOUNDATION)._type === 53 && (bld as BFOUNDATION)._expireTime < GLOBAL.Timestamp())) {
                if ((bld as BFOUNDATION)._class !== "wall") {
                    totalHealth += (bld as BFOUNDATION).health;
                    totalMaxHealth += (bld as BFOUNDATION).maxHealth;
                }
            }
        }
        const damagePercent = 100 - 100 / totalMaxHealth * totalHealth;
        if (damagePercent < 90) {
            LOGGER.StatB({
                "st1": "ERS",
                "st2": this._name,
                "st3": "Wave_Num_" + this._wavesDestroyed,
                "value": this._numAttempts
            }, "Attack_Success");
            if (this._score < 0) {
                this._score = 0;
            }
            this.score = this._score + 1;
            this._numAttempts = 0;
        } else {
            LOGGER.StatB({
                "st1": "ERS",
                "st2": this._name,
                "st3": "Wave_Num_" + this._wavesDestroyed,
                "value": this._numAttempts
            }, "Attack_Failed");
        }
        this.cleanupWave();
        WMATTACK.CleanUpLite();
    }

    public override exportData(): Record<string, any> {
        const data = super.exportData();
        data["_wavesDestroyed"] = this._wavesDestroyed;
        data["_numAttempts"] = this._numAttempts;
        return data;
    }

    public override importData(data: Record<string, any>): void {
        super.importData(data);
        this.wavesDestroyed = data["_wavesDestroyed"];
        this._numAttempts = data["_numAttempts"];
    }

    public override update(): void {
        if (!this._isActive) {
            return;
        }
        ++this._saveTimer;
        if (!(this._saveTimer % 120)) {
            BASE.Save(0, false, true);
        }
        if (this._waitTimer) {
            --this._waitTimer;
        } else {
            this.sendWave();
        }
    }

    protected setupNextWave(): void {
        if (!WMATTACK._inProgress && this.progress < 1) {
            this._isActive = true;
            const waveArray = this.getWaveArray();
            this._curSend = waveArray![this._wavesDestroyed % waveArray!.length];
            this._internalWaveIndex = 0;
            this._randDir = Math.random() * 360;
            this._currentAttackers = [];
        }
    }

    protected sendWave(): void {
        if (this._internalWaveIndex >= this._curSend.length) {
            return;
        }
        let spawned: Array<any> = [];
        while (this._internalWaveIndex < this._curSend.length && !this._waitTimer) {
            if (!(typeof this._curSend[this._internalWaveIndex] === "number")) {
                spawned = spawned.concat(WMATTACK.SpawnWave(this._curSend[this._internalWaveIndex], this._randDir));
            } else {
                this._waitTimer = this._curSend[this._internalWaveIndex] * 20;
            }
            ++this._internalWaveIndex;
        }
        this._currentAttackers = this._currentAttackers.concat(spawned);
        this.postSend();
    }

    private postSend(): void {
        if (BASE.isInfernoMainYardOrOutpost) {
            SOUNDS.PlayMusic("musicipanic");
        } else {
            SOUNDS.PlayMusic("musicpanic");
        }
        WMATTACK.AttackB();
        WMATTACK.AttackC();
        BASE._blockSave = false;
        UI2.Show("surrender");
        if (UI2._scareAway) {
            UI2._scareAway.addEventListener("scareAway", this.Surrender.bind(this));
        }
        WMATTACK.setEnd(this.endWave.bind(this));
        WMATTACK._isAI = false;
        WMATTACK._inProgress = true;
    }

    private cleanupWave(): void {
        this._isActive = false;
        this._curSend = [];
        this._internalWaveIndex = 0;
        this._currentAttackers = [];
        WMATTACK.setEnd();
    }

    public Surrender(event: Event): void {
        this._retreatAllMonsters = true;
        for (const wave of this._currentAttackers) {
            for (let i = 0; i < wave.length; i++) {
                wave[i].changeModeRetreat();
            }
        }
        this.cleanupWave();
        WMATTACK.CleanUpLite();
        LOGGER.StatB({
            "st1": "ERS",
            "st2": this._name,
            "st3": "Wave_Num_" + this._wavesDestroyed,
            "value": this._numAttempts
        }, "Attack_Surrender");
    }

    protected StartRepairs(): void {
        const buildings = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const bld of buildings) {
            if ((bld as BFOUNDATION).health < (bld as BFOUNDATION).maxHealth && (bld as BFOUNDATION)._repairing === 0) {
                (bld as BFOUNDATION).Repair();
            }
        }
    }

    protected override onInitialize(): void {
        super.onInitialize();
        if (!(this instanceof AttackDefend)) {
            this.score = this._wavesDestroyed;
        }
        WMATTACK.enabled = false;
        this._isActive = false;
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD && BASE.isMainYard) {
            this._buttonCopy = KEYS.Get("btn_next");
        } else {
            this._buttonCopy = null;
        }
    }

    protected getWaveArray(): Array<any> | null {
        return null;
    }

    public override pressedActionButton(): void {
        this.setupNextWave();
        ++this._numAttempts;
        LOGGER.StatB({
            "st1": "ERS",
            "st2": this._name,
            "st3": "Wave_Num_" + this._wavesDestroyed,
            "value": this._numAttempts
        }, "Attack_Start");
    }

    protected override onEventComplete(): void {
    }

    public override reset(): void {
        super.reset();
        this._numAttempts = 0;
        this._wavesDestroyed = 0;
    }
}
