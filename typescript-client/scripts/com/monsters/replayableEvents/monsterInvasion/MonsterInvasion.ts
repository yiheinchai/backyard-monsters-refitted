import Event from "openfl/events/Event";

import { ReplayableEvent } from "../ReplayableEvent";
import { AttackDefend } from "../attackDefend/AttackDefend";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }
function getUI2(): any { return require("../../../../UI2").UI2; }
function getWMATTACK(): any { return require("../../../../WMATTACK").WMATTACK; }



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
        const buildings = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (const bld of buildings) {
            if (!((bld as BFOUNDATION)._class === "trap" && (bld as BFOUNDATION)._fired || (bld as BFOUNDATION)._type === 53 && (bld as BFOUNDATION)._expireTime < getGLOBAL().Timestamp())) {
                if ((bld as BFOUNDATION)._class !== "wall") {
                    totalHealth += (bld as BFOUNDATION).health;
                    totalMaxHealth += (bld as BFOUNDATION).maxHealth;
                }
            }
        }
        const damagePercent = 100 - 100 / totalMaxHealth * totalHealth;
        if (damagePercent < 90) {
            getLOGGER().StatB({
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
            getLOGGER().StatB({
                "st1": "ERS",
                "st2": this._name,
                "st3": "Wave_Num_" + this._wavesDestroyed,
                "value": this._numAttempts
            }, "Attack_Failed");
        }
        this.cleanupWave();
        getWMATTACK().CleanUpLite();
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
            getBASE().Save(0, false, true);
        }
        if (this._waitTimer) {
            --this._waitTimer;
        } else {
            this.sendWave();
        }
    }

    protected setupNextWave(): void {
        if (!getWMATTACK()._inProgress && this.progress < 1) {
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
                spawned = spawned.concat(getWMATTACK().SpawnWave(this._curSend[this._internalWaveIndex], this._randDir));
            } else {
                this._waitTimer = this._curSend[this._internalWaveIndex] * 20;
            }
            ++this._internalWaveIndex;
        }
        this._currentAttackers = this._currentAttackers.concat(spawned);
        this.postSend();
    }

    private postSend(): void {
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSOUNDS().PlayMusic("musicipanic");
        } else {
            getSOUNDS().PlayMusic("musicpanic");
        }
        getWMATTACK().AttackB();
        getWMATTACK().AttackC();
        getBASE()._blockSave = false;
        getUI2().Show("surrender");
        if (getUI2()._scareAway) {
            getUI2()._scareAway.addEventListener("scareAway", this.Surrender.bind(this));
        }
        getWMATTACK().setEnd(this.endWave.bind(this));
        getWMATTACK()._isAI = false;
        getWMATTACK()._inProgress = true;
    }

    private cleanupWave(): void {
        this._isActive = false;
        this._curSend = [];
        this._internalWaveIndex = 0;
        this._currentAttackers = [];
        getWMATTACK().setEnd();
    }

    public Surrender(event: Event): void {
        this._retreatAllMonsters = true;
        for (const wave of this._currentAttackers) {
            for (let i = 0; i < wave.length; i++) {
                wave[i].changeModeRetreat();
            }
        }
        this.cleanupWave();
        getWMATTACK().CleanUpLite();
        getLOGGER().StatB({
            "st1": "ERS",
            "st2": this._name,
            "st3": "Wave_Num_" + this._wavesDestroyed,
            "value": this._numAttempts
        }, "Attack_Surrender");
    }

    protected StartRepairs(): void {
        const buildings = getInstanceManager().getInstancesByClass(getBFOUNDATION());
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
        getWMATTACK().enabled = false;
        this._isActive = false;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard) {
            this._buttonCopy = getKEYS().Get("btn_next");
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
        getLOGGER().StatB({
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
