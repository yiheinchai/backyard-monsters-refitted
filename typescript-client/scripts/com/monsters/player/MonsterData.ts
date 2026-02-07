import { CreepInfo } from "./CreepInfo";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../monsters/MonsterBase").MonsterBase; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getCREATURES(): any { return require("../../../CREATURES").CREATURES; }


/**
 * Data container for a monster type, managing creep instances, health, and healing.
 */
export class MonsterData {
    public static readonly kHealID: number = 1;

    public m_creeps: CreepInfo[] = [];
    public m_creatureID: string = "";
    private m_level: number = 0;
    private m_maxHealth: number = 0;

    constructor() {
        this.m_creatureID = "";
        this.m_creeps = [];
        this.m_level = 0;
        this.m_maxHealth = 0;
    }

    public get maxHealth(): number {
        return this.m_maxHealth;
    }

    public get level(): number {
        return this.m_level;
    }

    public set level(value: number) {
        this.m_level = value;
        this.m_maxHealth = getCREATURES().GetProperty(this.m_creatureID, "health", this.m_level);
    }

    public get numCreeps(): number {
        return this.m_creeps.length;
    }

    public get numBunkeredCreeps(): number {
        let count = this.m_creeps.length;
        for (const creep of this.m_creeps) {
            if (creep.ownerID === 0) count--;
        }
        return count;
    }

    public get numHousedCreeps(): number {
        return this.numCreeps - this.numBunkeredCreeps;
    }

    public numCreepsByHouse(ownerID: number = 0, queuedOnly: boolean = false): number {
        let count = this.m_creeps.length;
        for (let i = count - 1; i >= 0; i--) {
            if (this.m_creeps[i].ownerID !== ownerID || (queuedOnly && !this.m_creeps[i].queued)) {
                count--;
            }
        }
        return count;
    }

    public get numHealthyHousedCreeps(): number {
        let count = this.m_creeps.length;
        for (const creep of this.m_creeps) {
            if (creep.health < this.m_maxHealth || creep.ownerID !== 0) {
                count--;
            }
        }
        return count;
    }

    public get numTotalHealthyCreeps(): number {
        let count = this.m_creeps.length;
        for (const creep of this.m_creeps) {
            if (creep.health < this.m_maxHealth) {
                count--;
            }
        }
        return count;
    }

    public numHealingCreeps(ownerID: number = 0): number {
        let count = this.m_creeps.length;
        for (let i = count - 1; i >= 0; i--) {
            const creep = this.m_creeps[i];
            if (creep.ownerID !== ownerID || !creep.queued || creep.health >= this.m_maxHealth) {
                count--;
            }
        }
        return count;
    }

    public getNumCreepsCanHealWithSpecificResourceAmount(resourceAmt: number, ownerID: number = 0): { num: number; resoLeft: number } {
        const healTime = getCREATURES().GetProperty(this.m_creatureID, "hTime", this.m_level);
        const hResource = getCREATURES().GetProperty(this.m_creatureID, "hResource", this.m_level);
        this.m_creeps.sort(this.healthSort.bind(this));
        
        let num = 0;
        for (const creep of this.m_creeps) {
            const cost = (1 - creep.health / this.m_maxHealth) * hResource;
            if (cost <= resourceAmt && creep.ownerID === ownerID) {
                resourceAmt -= cost;
                num++;
            } else {
                break;
            }
        }
        
        return { num, resoLeft: resourceAmt };
    }

    public getHighestTimeWithHousingSplit(ownerID: number = 0): number {
        const numHeals = getBASE().getNumHousingHealsPerTick();
        const times: number[] = new Array(numHeals).fill(0);
        this.m_creeps.sort(this.healthSort.bind(this));
        
        let idx = 0;
        for (const creep of this.m_creeps) {
            if (creep.health < this.m_maxHealth && creep.ownerID === ownerID && creep.queued) {
                times[idx] += this.timeLeftToHealCreep(creep);
                idx = (idx + 1) % numHeals;
            }
        }
        
        return Math.max(...times);
    }

    private timeLeftToHealCreep(creep: CreepInfo): number {
        const healTime = getCREATURES().GetProperty(this.m_creatureID, "hTime", this.m_level);
        return (this.m_maxHealth - creep.health) / (this.m_maxHealth / healTime);
    }

    private healthSort(a: CreepInfo, b: CreepInfo): number {
        if (a.health === b.health) return 0;
        if (a.health >= this.m_maxHealth) return 1;
        if (b.health >= this.m_maxHealth) return -1;
        if (a.health < b.health) return 1;
        if (a.health > b.health) return -1;
        return 0;
    }

    public get totalHealth(): number {
        return this.numHousedCreeps * this.m_maxHealth;
    }

    public totalOwnedHealth(ownerID: number = 0, queuedOnly: boolean = false): number {
        return this.numCreepsByHouse(ownerID, queuedOnly) * this.m_maxHealth;
    }

    public curHealth(ownerID: number = 0, queuedOnly: boolean = false): number {
        let total = 0;
        for (const creep of this.m_creeps) {
            if (creep.ownerID === ownerID && (!queuedOnly || creep.queued)) {
                total += Math.min(creep.health, this.m_maxHealth);
            }
        }
        return total;
    }

    public needsHeals(): boolean {
        for (const creep of this.m_creeps) {
            if (creep.health < this.m_maxHealth && !creep.queued) {
                return true;
            }
        }
        return false;
    }

    public heal(ownerID: number = 0): boolean {
        const healTime = getCREATURES().GetProperty(this.m_creatureID, "hTime", this.m_level);
        const healPerTick = this.m_maxHealth / healTime;
        const numHealsPerTick = getBASE().getNumHousingHealsPerTick();
        const toHeal: CreepInfo[] = [];
        
        for (let i = 0; i < numHealsPerTick; i++) {
            let best: CreepInfo | null = null;
            let bestHealth = -1;
            
            for (const creep of this.m_creeps) {
                if (creep.ownerID === ownerID && creep.queued) {
                    if (creep.health < this.m_maxHealth && !toHeal.includes(creep)) {
                        if (creep.health > bestHealth) {
                            bestHealth = creep.health;
                            best = creep;
                        }
                    }
                    if (creep.health > this.m_maxHealth) {
                        creep.health = this.m_maxHealth;
                        creep.queued = 0;
                    }
                }
            }
            
            if (best) toHeal.push(best);
        }
        
        for (const creep of toHeal) {
            creep.health += healPerTick;
            if (creep.self) {
                const healthDiff = creep.health - creep.self.health;
                creep.self.modifyHealth(healthDiff);
            }
        }
        
        return toHeal.length === 0;
    }

    public healInstant(ownerID: number = 0, all: boolean = false): void {
        for (const creep of this.m_creeps) {
            if (creep.ownerID === ownerID || all) {
                creep.health = this.m_maxHealth;
                creep.queued = 0;
                if (creep.self) {
                    creep.self.modifyHealth(this.m_maxHealth);
                }
            }
        }
    }

    public setQueued(queued: boolean, ownerID: number = 0, amount: number = 0): void {
        const queuedVal = queued ? 1 : 0;
        const count = amount || this.m_creeps.length;
        
        for (let i = 0; i < count && i < this.m_creeps.length; i++) {
            if (this.m_creeps[i].ownerID === ownerID) {
                if (!queuedVal || this.m_creeps[i].health < this.m_maxHealth) {
                    this.m_creeps[i].queued = queuedVal;
                }
            }
        }
    }

    public checkForNonQueuedCreeps(ownerID: number = 0): boolean {
        for (const creep of this.m_creeps) {
            if (creep.ownerID === ownerID && !creep.queued) {
                return true;
            }
        }
        return false;
    }

    public add(count: number, monster: MonsterBase | null = null, fromBunker: boolean = false): void {
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                this.m_creeps.push(new CreepInfo(0, Number.MAX_VALUE, monster));
            }
        } else {
            count = Math.abs(count);
            for (let i = this.m_creeps.length - 1; i >= 0 && count > 0; i--) {
                if (fromBunker || !this.m_creeps[i].ownerID) {
                    this.m_creeps.splice(i, 1);
                    count--;
                }
            }
        }
    }

    public juiceCreep(): void {
        let bestHealth = 0;
        let bestIndex = -1;
        
        for (let i = 0; i < this.m_creeps.length; i++) {
            if (!this.m_creeps[i].ownerID && this.m_creeps[i].health > bestHealth) {
                bestHealth = this.m_creeps[i].health;
                bestIndex = i;
            }
        }
        
        if (bestIndex >= 0) {
            if (this.m_creeps[bestIndex].self) {
                this.m_creeps[bestIndex].self!.changeModeJuice();
            }
            this.m_creeps.splice(bestIndex, 1);
        }
    }

    public setNum(count: number): void {
        // Placeholder
    }

    public getOwnedCreeps(ownerID: number = 0): CreepInfo[] {
        if (ownerID === 0) {
            console.log("lol, you silly person. You can't do this with housing... for no good reason");
        }
        return this.m_creeps.filter(c => c.ownerID === ownerID);
    }

    public linkCreepToData(monster: MonsterBase, ownerID: number = 0): void {
        for (const creep of this.m_creeps) {
            if (!creep.self && (creep.ownerID === ownerID || (!creep.ownerID && creep.health >= this.m_maxHealth))) {
                creep.self = monster;
                return;
            }
        }
        console.error("linkCreepToData: tried to assign creep past available count");
    }

    public unlinkCreepFromData(monster: MonsterBase): void {
        for (const creep of this.m_creeps) {
            if (creep.self === monster) {
                creep.health = monster.health;
                creep.self = null;
            }
        }
    }

    public clear(): void {
        for (const creep of this.m_creeps) {
            creep.self = null;
        }
    }

    public reserve(ownerID: number): CreepInfo | null {
        for (const creep of this.m_creeps) {
            if (creep.ownerID === 0 && creep.health >= this.m_maxHealth) {
                creep.ownerID = ownerID;
                return creep;
            }
        }
        return null;
    }

    public release(ownerID: number): CreepInfo | null {
        for (const creep of this.m_creeps) {
            if (creep.ownerID === ownerID && creep.health >= this.m_maxHealth) {
                creep.ownerID = 0;
                return creep;
            }
        }
        return null;
    }
}
