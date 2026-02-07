import { SecNum } from './com/cc/utils/SecNum';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { HatcheryBase } from './HatcheryBase';
import { HATCHERYCC } from './HATCHERYCC';

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBUILDING13(): any { return require("./BUILDING13").BUILDING13; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getResourcePackages(): any { return require("./ResourcePackages").ResourcePackages; }
function getSTORE(): any { return require("./STORE").STORE; }


/**
 * BUILDING16 - Hatchery Control Center
 * Extends HatcheryBase for centralized monster queue management
 */
export class BUILDING16 extends HatcheryBase {
    constructor() {
        super();
        this._type = 16;
        this._spoutPoint = new Point(0, -5);
        this._spoutHeight = 55;
        this.SetProps();
    }

    public override PlaceB(): void {
        super.PlaceB();
    }

    public override Destroyed(byAttacker: boolean = true): void {
        const resourceRefunds: SecNum[] = [new SecNum(0), new SecNum(0)];
        
        if (this._monsterQueue.length > 0) {
            for (const queueItem of this._monsterQueue) {
                if (getBASE().isInfernoCreep(queueItem[0])) {
                    resourceRefunds[1].Add(getCREATURES().GetProperty(queueItem[0], "cResource") * queueItem[1]);
                } else {
                    resourceRefunds[0].Add(getCREATURES().GetProperty(queueItem[0], "cResource") * queueItem[1]);
                }
            }
            this._monsterQueue = [];
        }
        
        for (let i = 0; i < resourceRefunds.length; i++) {
            getBASE().Fund(4, Math.ceil(resourceRefunds[i].Get() * 0.75), false, this, !!i);
            let packageCount: number = 0;
            const amount = resourceRefunds[i].Get();
            if (amount > 20000) packageCount = 12;
            else if (amount > 10000) packageCount = 9;
            else if (amount > 5000) packageCount = 7;
            else if (amount > 1000) packageCount = 5;
            else if (amount > 400) packageCount = 4;
            else if (amount > 200) packageCount = 3;
            else if (amount > 100) packageCount = 2;
            else if (amount > 0) packageCount = 1;
            
            for (let j = 0; j < packageCount; j++) {
                getResourcePackages().Spawn(this, getGLOBAL().townHall, getBASE().isInfernoMainYardOrOutpost || !!i ? 8 : 4, j);
            }
        }
        super.Destroyed(byAttacker);
    }

    public ResetProduction(): void {
        if (this._inProduction === "") {
            this._productionStage.Set(0);
        } else {
            this._productionStage.Set(3);
            this._countdownProduce.Set(0);
            this._hpCountdownProduce = 0;
        }
    }

    public override Tick(seconds: number): void {
        super.Tick(seconds);
        let housingSpace: number = getHOUSING()._housingSpace.Get();
        let totalTime: number = 0;
        this._finishQueue = {};
        this._finishAll = true;
        
        if (this._countdownBuild.Get() === 0 && this.health > 10) {
            this._canFunction = true;
            const hatcheries: any[] = getInstanceManager().getInstancesByClass(BUILDING13);
            
            for (const hatchery of hatcheries) {
                if (hatchery._canFunction) {
                    if (hatchery._inProduction !== "" && housingSpace >= getCREATURES().GetProperty(hatchery._inProduction, "cStorage")) {
                        housingSpace -= getCREATURES().GetProperty(hatchery._inProduction, "cStorage");
                        if (this._finishQueue[hatchery._inProduction]) {
                            ++this._finishQueue[hatchery._inProduction];
                        } else {
                            this._finishQueue[hatchery._inProduction] = 1;
                        }
                        totalTime += hatchery._countdownProduce.Get();
                    } else if (this._monsterQueue.length > 0) {
                        if (hatchery._canFunction && hatchery._inProduction === "") {
                            hatchery._inProduction = this._monsterQueue[0][0];
                            --this._monsterQueue[0][1];
                            if (this._monsterQueue[0][1] <= 0) {
                                this._monsterQueue.splice(0, 1);
                            }
                            hatchery._productionStage.Set(3);
                            hatchery.Tick(1);
                            HATCHERYCC.Tick();
                            if (this._monsterQueue.length === 0) return;
                        }
                    }
                }
            }
            
            if (this._monsterQueue.length > 0 && housingSpace >= 10) {
                for (const queueItem of this._monsterQueue) {
                    const creatureId: string = queueItem[0];
                    const storage: number = getCREATURES().GetProperty(creatureId, "cStorage");
                    if (housingSpace >= storage * queueItem[1]) {
                        totalTime += getCREATURES().GetProperty(creatureId, "cTime") * queueItem[1];
                        housingSpace -= storage * queueItem[1];
                        if (this._finishQueue[creatureId]) {
                            this._finishQueue[creatureId] += queueItem[1];
                        } else {
                            this._finishQueue[creatureId] = queueItem[1];
                        }
                    } else if (housingSpace >= storage) {
                        totalTime += getCREATURES().GetProperty(creatureId, "cTime") * Math.floor(housingSpace / storage);
                        if (this._finishQueue[creatureId]) {
                            this._finishQueue[creatureId] += Math.floor(housingSpace / storage);
                        } else {
                            this._finishQueue[creatureId] = Math.floor(housingSpace / storage);
                        }
                        this._finishAll = false;
                        break;
                    }
                }
            }
        } else {
            this._canFunction = false;
        }
        
        if (this._canFunction && totalTime > 0) {
            this._finishCost.Set(getSTORE().GetTimeCost(totalTime, false) * 4);
        } else {
            this._finishCost.Set(0);
        }
    }

    public FinishNow(): void {
        if (!this._canFunction) {
            getGLOBAL().Message(getKEYS().Get("building_hcc_cantfunction"));
            return;
        }
        if (getBASE()._credits.Get() >= this._finishCost.Get()) {
            const hatcheryList: any[] = [];
            let housingSpace: number = getHOUSING()._housingSpace.Get();
            const hatcheries: any[] = getInstanceManager().getInstancesByClass(BUILDING13);
            
            for (const hatchery of hatcheries) {
                if (hatchery._canFunction) {
                    hatcheryList.push(hatchery);
                    if (hatchery._inProduction !== "" && housingSpace >= getCREATURES().GetProperty(hatchery._inProduction, "cStorage")) {
                        const pos: Point = new Point(hatchery._mc.x - 10 + Math.random() * 20, hatchery._mc.y - 10 + Math.random() * 20);
                        getHOUSING().HousingStore(hatchery._inProduction, pos);
                        housingSpace -= getCREATURES().GetProperty(hatchery._inProduction, "cStorage");
                        hatchery._inProduction = "";
                        hatchery._productionStage.Set(0);
                    }
                }
            }
            
            while (this._monsterQueue.length > 0 && housingSpace > 0) {
                const creatureId: string = this._monsterQueue[0][0];
                const storage: number = getCREATURES().GetProperty(creatureId, "cStorage");
                while (this._monsterQueue[0][1] > 0 && housingSpace >= storage) {
                    const idx: number = Math.floor(Math.random() * hatcheryList.length);
                    const pos: Point = new Point(hatcheryList[idx]._mc.x - 10 + Math.random() * 20, hatcheryList[idx]._mc.y - 10 + Math.random() * 20);
                    --this._monsterQueue[0][1];
                    housingSpace -= storage;
                    getHOUSING().HousingStore(creatureId, pos);
                }
                if (this._monsterQueue[0][1] <= 0) {
                    this._monsterQueue.shift();
                } else if (housingSpace < storage) {
                    break;
                }
            }
            getBASE().Purchase("FQ", this._finishCost.Get(), "BUILDING16.FinishNow");
        } else {
            getPOPUPS().DisplayGetShiny();
        }
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bHatcheryCC = this;
        const hatcheries: any[] = getInstanceManager().getInstancesByClass(BUILDING13);
        for (const hatchery of hatcheries) {
            for (const queueItem of hatchery._monsterQueue) {
                getBASE().Fund(4, queueItem[1] * getCREATURES().GetProperty(queueItem[0], "cResource"));
            }
            hatchery._monsterQueue = [];
        }
    }

    public override RecycleC(): void {
        getGLOBAL()._bHatcheryCC = null;
        super.RecycleC();
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override Setup(building: any): void {
        this._monsterQueue = [];
        if (building.mq) {
            this._monsterQueue = building.mq;
        }
        for (const queueItem of this._monsterQueue) {
            if (queueItem[0] === "C100") {
                queueItem[0] = "C12";
            }
        }
        super.Setup(building);
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bHatcheryCC = this;
        }
    }

    public override Export(): any {
        const data: any = super.Export();
        if (this._monsterQueue.length > 0) {
            data.mq = this._monsterQueue;
        }
        return data;
    }
}
