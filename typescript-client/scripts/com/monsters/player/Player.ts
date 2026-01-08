import { SecNum } from "../../cc/utils/SecNum";
import { BaseBuffHandler } from "../baseBuffs/BaseBuffHandler";
import { IHandler } from "../interfaces/IHandler";
import { IPlayerHandler } from "../interfaces/IPlayerHandler";
import { ITickable } from "../interfaces/ITickable";
import { KOTHHandler } from "../kingOfTheHill/KOTHHandler";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { MonsterBase } from "../monsters/MonsterBase";
import { ReplayableEventHandler } from "../replayableEvents/ReplayableEventHandler";
import { RewardHandler } from "../rewarding/RewardHandler";
import { SubscriptionHandler } from "../subscriptions/SubscriptionHandler";
import { CreepInfo } from "./CreepInfo";
import { MonsterData } from "./MonsterData";

import { BASE } from "../../../BASE";
import { CREATURES } from "../../../CREATURES";
import { GLOBAL } from "../../../GLOBAL";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";

/**
 * Player class managing player data, monster lists, upgrades, and handlers.
 */
export class Player {
    private static readonly HANDLER_REWARD: number = 0;
    private static readonly HANDLER_KOTH: number = 1;
    private static readonly HANDLER_SUBSCRIPTIONS: number = 2;

    public ID!: number;
    public name!: string;
    public lastName!: string;
    public picture!: string;
    public timePlayed!: number;
    public level!: number;
    public townHallLevel!: number;
    public email!: string;
    public proxyMail!: string;
    public isAttacking!: boolean;

    private _handlers: IHandler[];
    public m_upgrades: { [key: string]: any };
    private m_monsterList: MonsterData[];
    private m_iMonsterList: MonsterData[];
    private m_monsterIndexList: { [key: string]: number };
    private m_healQueue: string[];
    private m_iHealQueue: string[];

    constructor() {
        this._handlers = [
            RewardHandler.instance,
            KOTHHandler.instance,
            SubscriptionHandler.instance,
            BaseBuffHandler.instance
        ];
        this.m_upgrades = {};
        this.m_monsterList = [];
        this.m_monsterIndexList = {};
        this.m_iMonsterList = [];
        this.m_healQueue = [];
        this.m_iHealQueue = [];
    }

    public initialize(): void {}

    public clear(): void {
        const list = this.monsterList;
        for (const data of list) {
            data.clear();
        }
    }

    public set monsterList(value: MonsterData[]) {
        if (BASE.isInfernoMainYardOrOutpost && !MAPROOM_DESCENT._inDescent) {
            this.m_iMonsterList = value;
        } else {
            this.m_monsterList = value;
        }
    }

    public get monsterList(): MonsterData[] {
        if (BASE.isInfernoMainYardOrOutpost && !MAPROOM_DESCENT._inDescent) {
            return this.m_iMonsterList;
        }
        return this.m_monsterList;
    }

    public get healQueue(): string[] {
        if (BASE.isInfernoMainYardOrOutpost) {
            return this.m_iHealQueue;
        }
        return this.m_healQueue;
    }

    public monsterListByID(id: string): MonsterData | null {
        if (id.substr(0, 1) === "B") {
            console.error("ERROR. ERROR. tried to get monsterListByID of a bunker.");
        }
        const list = this.monsterList;
        if (this.m_monsterIndexList[id]) {
            return list[this.m_monsterIndexList[id] - 1];
        }
        return null;
    }

    public numCreepsByID(id: string): number {
        if (id.substr(0, 1) === "B") {
            return this.numCreepsInBunker(parseInt(id.substr(1)));
        }
        const data = this.monsterListByID(id);
        return data ? data.numHousedCreeps : 0;
    }

    public totalHealthByID(id: string): number {
        const list = this.monsterList;
        if (id.substr(0, 1) === "B") {
            let total = 0;
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                total += data.totalOwnedHealth(bunkerID);
            }
            return total;
        }
        const data = this.monsterListByID(id);
        return data ? data.totalHealth : 0;
    }

    public curHealthByID(id: string): number {
        const list = this.monsterList;
        if (id.substr(0, 1) === "B") {
            let total = 0;
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                total += data.curHealth(bunkerID);
            }
            return total;
        }
        const data = this.monsterListByID(id);
        return data ? data.curHealth() : 0;
    }

    public getStorageByID(id: string): number {
        if (id.substr(0, 1) === "B") {
            return this.getBunkerStorage(parseInt(id.substr(1)));
        }
        return this.numCreepsByID(id) * CREATURES.GetProperty(id, "cStorage");
    }

    public importAcademyData(data: any): void {
        this.m_upgrades = {};
        for (const key in data) {
            if ((key.substr(0, 1) === "C" || key.substr(0, 2) === "IC") && data[key]) {
                this.m_upgrades[key] = {};
                if (data[key].time) {
                    if (data[key].time <= 60 * 60 * 162) {
                        this.m_upgrades[key].time = new SecNum(data[key].time + GLOBAL.Timestamp());
                    } else {
                        this.m_upgrades[key].time = new SecNum(data[key].time);
                    }
                }
                if (data[key].duration) {
                    this.m_upgrades[key].duration = data[key].duration;
                }
                if (data[key].powerup) {
                    this.m_upgrades[key].powerup = data[key].powerup;
                }
                this.m_upgrades[key].level = data[key].level;
            }
        }
        if (this.m_upgrades.C100) {
            this.m_upgrades.C12 = this.m_upgrades.C100;
            delete this.m_upgrades.C100;
        }
    }

    public exportAcademyData(): any {
        const result: any = {};
        for (const key in this.m_upgrades) {
            if (this.m_upgrades[key]) {
                result[key] = {};
                result[key].level = this.m_upgrades[key].level;
                if (this.m_upgrades[key].time) {
                    result[key].time = this.m_upgrades[key].time.Get();
                }
                if (this.m_upgrades[key].duration) {
                    result[key].duration = this.m_upgrades[key].duration;
                }
                if (this.m_upgrades[key].powerup) {
                    result[key].powerup = this.m_upgrades[key].powerup;
                }
            }
        }
        return result;
    }

    public upgradeHealthData(id: string): void {
        const monsterData = this.monsterListByID(id);
        if (!monsterData) return;
        
        const creeps = monsterData.m_creeps;
        const healthDiff = CREATURES.GetProperty(id, "health", this.m_upgrades[id].level) - monsterData.maxHealth;
        monsterData.level = this.m_upgrades[id].level;
        
        for (const creep of creeps) {
            creep.health += healthDiff;
            if (creep.self) {
                creep.self.setHealth(creep.self.health + healthDiff);
            }
        }
    }

    public addMonster(id: string, monster: MonsterBase | null = null): void {
        const list = this.monsterList;
        let data = this.monsterListByID(id);
        
        if (data) {
            data.add(1, monster);
        } else {
            data = new MonsterData();
            data.m_creatureID = id;
            data.add(1, monster);
            if (this.m_upgrades[id] != null) {
                data.level = this.m_upgrades[id].level;
            }
            list.push(data);
            this.m_monsterIndexList[id] = list.length;
        }
    }

    public fillMonsterData(data: any): void {
        const list = this.monsterList;
        const queue = this.healQueue;
        list.length = 0;
        this.m_monsterIndexList = {};
        let hasDetailedData = false;
        
        for (let key in data) {
            if (key.substr(0, 1) === "C" || key.substr(0, 2) === "IC") {
                if (!hasDetailedData && !(typeof data[key] === "number")) {
                    hasDetailedData = true;
                }
                
                let count = hasDetailedData ? data[key].length : data[key];
                
                if (count) {
                    if (key === "C100") key = "C12";
                    
                    const monsterData = new MonsterData();
                    monsterData.m_creatureID = key;
                    monsterData.add(count);
                    
                    for (let i = 0; i < count; i++) {
                        if (hasDetailedData) {
                            monsterData.m_creeps[i].health = data[key][i].health > 0 ? data[key][i].health : 1;
                            monsterData.m_creeps[i].ownerID = data[key][i].ownerID;
                            monsterData.m_creeps[i].queued = data[key][i].q ? data[key][i].q : 0;
                        } else {
                            monsterData.m_creeps[i].health = Number.MAX_VALUE;
                        }
                        if (this.m_upgrades[key] != null) {
                            monsterData.level = this.m_upgrades[key].level;
                        }
                    }
                    
                    list.push(monsterData);
                    if (!this.m_monsterIndexList[key]) {
                        this.m_monsterIndexList[key] = list.length;
                    }
                }
            }
        }
        
        if (data["Q"]) {
            for (let i = 0; i < data["Q"].length; i++) {
                queue[i] = data["Q"][i];
            }
        }
    }

    public exportMonsters(): any {
        const list = this.monsterList;
        const queue = this.healQueue;
        const result: any = {};
        
        if (MapRoomManager.instance.isInMapRoom3) {
            for (const monsterData of list) {
                const count = monsterData.numCreeps;
                const arr: any[] = [];
                
                for (let j = 0; j < count; j++) {
                    const creep = monsterData.m_creeps[j];
                    if (creep.self) {
                        if (creep.self.health < Math.floor(creep.health)) {
                            creep.queued = 0;
                        }
                        creep.health = creep.self.health || 1;
                    }
                    arr[j] = {
                        health: creep.health,
                        ownerID: creep.ownerID,
                        q: creep.queued
                    };
                }
                result[monsterData.m_creatureID] = arr;
            }
            
            if (queue.length) {
                result["Q"] = [...queue];
            }
        } else {
            for (const monsterData of list) {
                result[monsterData.m_creatureID] = monsterData.numCreeps;
            }
        }
        
        return result;
    }

    public get monsterHealQueue(): string[] {
        return this.healQueue;
    }

    public queueHeal(id: string, allowDuplicate: boolean = false): void {
        const queue = this.healQueue;
        let shouldPush = true;
        
        for (const item of queue) {
            if (item === id) {
                if (!allowDuplicate) return;
                shouldPush = false;
                break;
            }
        }
        
        this.setQueueByID(id, true);
        if (shouldPush) {
            queue.push(id);
        }
    }

    public queuePartialHeal(id: string, amount: number): void {
        const queue = this.healQueue;
        for (const item of queue) {
            if (item === id) return;
        }
        this.setQueueByID(id, true, amount);
        queue.push(id);
    }

    public queueRemove(id: string): void {
        const queue = this.healQueue;
        const idx = queue.indexOf(id);
        if (idx === -1) return;
        
        this.setQueueByID(id, false);
        queue.splice(idx, 1);
        BASE.SaveB();
    }

    private setQueueByID(id: string, queued: boolean, amount: number = 0): void {
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            const list = this.monsterList;
            for (const data of list) {
                data.setQueued(queued, bunkerID, amount);
            }
        } else {
            const data = this.monsterListByID(id);
            if (data) data.setQueued(queued, 0, amount);
        }
    }

    public checkQueued(id: string): boolean {
        return this.healQueue.includes(id);
    }

    public checkForNonQueuedCreepsByID(id: string): boolean {
        const list = this.monsterList;
        if (id.substr(0, 1) !== "B") {
            const data = this.monsterListByID(id);
            return data ? data.checkForNonQueuedCreeps() : false;
        }
        
        const bunkerID = parseInt(id.substr(1));
        for (const data of list) {
            if (data.checkForNonQueuedCreeps(bunkerID)) return true;
        }
        return false;
    }

    public getHighestTimeHealingUsingNumberOfHousing(id: string): number {
        let totalTime = 0;
        
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            const list = this.monsterList;
            for (const data of list) {
                totalTime += data.getHighestTimeWithHousingSplit(bunkerID);
            }
        } else {
            const data = this.monsterListByID(id);
            totalTime = data ? data.getHighestTimeWithHousingSplit() : 0;
        }
        return totalTime;
    }

    public refundResources(id: string, includeQueued: boolean = false): void {
        const cost = GLOBAL.player.getResourceCostByID(id, includeQueued);
        const isInferno = id.substr(0, 1) === "I";
        BASE.Fund(4, cost, true, null, isInferno, true);
    }

    public tickHeal(ticks: number): void {
        const queue = this.healQueue;
        while (ticks > 0) {
            if (queue.length) {
                if (this.healByID(queue[0])) {
                    queue.shift();
                }
            }
            ticks--;
        }
    }

    private healByID(id: string): boolean {
        const list = this.monsterList;
        let allHealed = true;
        
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                if (!data.heal(bunkerID)) {
                    allHealed = false;
                }
            }
        } else {
            const data = this.monsterListByID(id);
            if (data) return data.heal();
        }
        return allHealed;
    }

    public healInstantSingleByID(id: string): void {
        const list = this.monsterList;
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                data.healInstant(bunkerID);
            }
        } else {
            const data = this.monsterListByID(id);
            if (data) data.healInstant();
        }
        this.queueRemove(id);
    }

    public healInstantAll(): void {
        const list = this.monsterList;
        for (const data of list) {
            data.healInstant(0, true);
            this.queueRemove(data.m_creatureID);
        }
    }

    public getSecsTillDoneByID(id: string, includeQueued: boolean = false): number {
        const list = this.monsterList;
        let time = 0;
        
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                const count = data.numCreepsByHouse(bunkerID, !includeQueued);
                if (count) {
                    const creatureID = data.m_creatureID;
                    const healTime = CREATURES.GetProperty(creatureID, "hTime");
                    const maxHealth = CREATURES.GetProperty(creatureID, "health");
                    time += (count * maxHealth - data.curHealth(bunkerID)) / (maxHealth / healTime);
                }
            }
        } else {
            const healTime = CREATURES.GetProperty(id, "hTime");
            const maxHealth = CREATURES.GetProperty(id, "health");
            const data = GLOBAL.player.monsterListByID(id);
            if (data) {
                const count = data.numCreepsByHouse(0, !includeQueued);
                time = (count * maxHealth - data.curHealth(0, !includeQueued)) / (maxHealth / healTime);
            }
        }
        return time;
    }

    public getNumDamagedCreeps(): number {
        const list = this.monsterList;
        let count = 0;
        for (const data of list) {
            count += data.numCreeps - data.numTotalHealthyCreeps;
        }
        return count;
    }

    public getNumQueuedCreepsByID(id: string): number {
        const list = this.monsterList;
        let count = 0;
        
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                count += data.numHealingCreeps(bunkerID);
            }
        } else {
            const data = this.monsterListByID(id);
            if (data) count += data.numHealingCreeps();
        }
        return count;
    }

    public getResourceCostByID(id: string, includeQueued: boolean = false): number {
        const list = this.monsterList;
        let cost = 0;
        
        if (id.substr(0, 1) === "B") {
            const bunkerID = parseInt(id.substr(1));
            for (const data of list) {
                const creatureID = data.m_creatureID;
                const count = data.numCreepsByHouse(bunkerID, includeQueued);
                if (count) {
                    const maxHealth = CREATURES.GetProperty(creatureID, "health");
                    const damagedRatio = count - count * (data.curHealth(bunkerID, includeQueued) / (maxHealth * count));
                    cost += CREATURES.GetProperty(creatureID, "hResource") * damagedRatio;
                }
            }
        } else {
            const maxHealth = CREATURES.GetProperty(id, "health");
            const data = GLOBAL.player.monsterListByID(id);
            if (data) {
                const count = data.numCreepsByHouse(0, includeQueued);
                const curHealth = data.curHealth(0, includeQueued);
                const damagedRatio = count - count * (curHealth / (maxHealth * count));
                cost = CREATURES.GetProperty(id, "hResource") * damagedRatio;
            }
        }
        return cost;
    }

    public getResourceCostInShinyByID(id: string): number {
        const resoCost = this.getResourceCostByID(id);
        return GLOBAL.getShinyCostFromResourceAmt(resoCost);
    }

    public numCreepsInBunker(bunkerID: number): number {
        const list = this.monsterList;
        let count = 0;
        for (const data of list) {
            count += data.numCreepsByHouse(bunkerID);
        }
        return count;
    }

    public getBunkerStorage(bunkerID: number): number {
        const list = this.monsterList;
        let storage = 0;
        for (const data of list) {
            storage += data.numCreepsByHouse(bunkerID) * CREATURES.GetProperty(data.m_creatureID, "cStorage");
        }
        return storage;
    }

    public initializeHandlers(data: any): void {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            handler.initialize(data[handler.name]);
            if (i === 0) {
                ReplayableEventHandler.initialize(data["events"]);
            }
        }
    }

    private getPlayerDataFromLoadObject(data: any): any {
        if (!this.isAttacking) {
            if (data["defendingplayer"]) return data["defendingplayer"];
            if (data["player"]) return data["player"];
        } else {
            if (data["attackingplayer"]) return data["attackingplayer"];
        }
        return null;
    }

    public importPlayerSpecificHandlers(data: any): void {
        const playerData = this.getPlayerDataFromLoadObject(data);
        if (!playerData) return;
        
        for (const handler of this.handlers) {
            if ((handler as any).player !== undefined) {
                (handler as IPlayerHandler).player = this;
                if (playerData.hasOwnProperty(handler.name)) {
                    handler.importData(playerData[handler.name]);
                }
            }
        }
    }

    public get rewards(): RewardHandler {
        return this._handlers[Player.HANDLER_REWARD] as RewardHandler;
    }

    public get handlers(): IHandler[] {
        return this._handlers;
    }

    public set handlers(value: IHandler[]) {
        this._handlers = value;
    }

    public tick(): void {
        for (const handler of this.handlers) {
            if ((handler as any).tick) {
                (handler as ITickable).tick();
            }
        }
    }
}
