import { SecNum } from "../../cc/utils/SecNum";
import { BaseBuffHandler } from "../baseBuffs/BaseBuffHandler";
import { AutoBankBaseBuff } from "../baseBuffs/buffs/AutoBankBaseBuff";
import { BYMConfig } from "../configs/BYMConfig";
import { InstanceManager } from "../managers/InstanceManager";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BRESOURCE } from "../../../BRESOURCE";
import { GLOBAL } from "../../../GLOBAL";
import { LOGGER } from "../../../LOGGER";
import { OUTPOST_YARD_PROPS } from "../../../OUTPOST_YARD_PROPS";

/**
 * AutoBankManager - static manager for auto-banking resources from outposts.
 */
export class AutoBankManager {
    private static readonly k_OPKEY_TIME: string = "t";
    private static readonly k_OPKEY_BASE: string = "b";
    private static readonly k_OPKEY_TWIGS: string = "r" + BRESOURCE.RESOURCE_TWIGS;
    private static readonly k_OPKEY_PEBBLES: string = "r" + BRESOURCE.RESOURCE_PEBBLES;
    private static readonly k_OPKEY_PUTTY: string = "r" + BRESOURCE.RESOURCE_PUTTY;
    private static readonly k_OPKEY_GOO: string = "r" + BRESOURCE.RESOURCE_GOO;
    private static readonly k_MAX_RESOURCES: number = 5;
    private static s_logCounter: number = 10;

    private constructor() {
        throw new Error("AutoBankManager is a static class not to be instantiated");
    }

    public static get lastMapRoom3Time(): number {
        let lastTime = 0;
        for (const key in BASE.resourceCells) {
            if (parseInt(key) > lastTime) {
                lastTime = parseInt(key);
            }
        }
        return lastTime;
    }

    public static updateSaveData(): Record<string, any> | null {
        const result: Record<string, any> = {};
        AutoBankManager.setLocalGIP(result);
        if (MapRoomManager.instance.isInMapRoom2) {
            return AutoBankManager.updateBuildingResources(result);
        }
        if (MapRoomManager.instance.isInMapRoom3) {
            return BASE.resourceCells;
        }
        return null;
    }

    public static updateLoadData(data: Record<string, any>, gip: Record<string, any>, processedGIP: Record<string, any>, serverTime: number, lastProcessedTime: number): number {
        AutoBankManager.s_logCounter = 10;
        if (data) {
            if (data[AutoBankManager.k_OPKEY_BASE + GLOBAL._homeBaseID]) {
                delete data[AutoBankManager.k_OPKEY_BASE + GLOBAL._homeBaseID];
            }
            if (Boolean(data[AutoBankManager.k_OPKEY_TIME]) && (GLOBAL.mode !== GLOBAL.e_BASE_MODE.ATTACK || BYMConfig.instance.AUTOBANK_FIX)) {
                lastProcessedTime = Number(data[AutoBankManager.k_OPKEY_TIME]);
                delete data[AutoBankManager.k_OPKEY_TIME];
            } else {
                lastProcessedTime = serverTime;
            }
            if (GLOBAL.Timestamp() - lastProcessedTime > 3600 * 24 * 2) {
                lastProcessedTime = GLOBAL.Timestamp() - 3600 * 24 * 2;
            }
            if (GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD || GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK) {
                for (const key in data) {
                    const cellData = data[key];
                    if (key === AutoBankManager.k_OPKEY_TIME) {
                        lastProcessedTime = Number(data[key]);
                    } else {
                        if (typeof cellData === "string") {
                            break;
                        }
                        if (cellData[AutoBankManager.k_OPKEY_TWIGS] !== undefined) {
                            processedGIP[key] = {
                                "r1": new SecNum(cellData[AutoBankManager.k_OPKEY_TWIGS]),
                                "r2": new SecNum(cellData[AutoBankManager.k_OPKEY_PEBBLES]),
                                "r3": new SecNum(cellData[AutoBankManager.k_OPKEY_PUTTY]),
                                "r4": new SecNum(cellData[AutoBankManager.k_OPKEY_GOO])
                            };
                        } else {
                            let height = data[key]["height"];
                            if (height) {
                                delete cellData["height"];
                            } else {
                                height = 100;
                            }
                            processedGIP[key] = {
                                "r1": new SecNum(0),
                                "r2": new SecNum(0),
                                "r3": new SecNum(0),
                                "r4": new SecNum(0)
                            };
                            for (const buildingKey in cellData) {
                                const building = cellData[buildingKey];
                                if (building.t >= 1 && building.t < AutoBankManager.k_MAX_RESOURCES) {
                                    let produce = 0;
                                    if (building.l) {
                                        produce = OUTPOST_YARD_PROPS._outpostProps[building.t - 1].produce[building.l - 1];
                                    } else {
                                        produce = OUTPOST_YARD_PROPS._outpostProps[building.t - 1].produce[0];
                                    }
                                    produce = Math.max(Math.floor(produce * GLOBAL._averageAltitude.Get() / height), 1);
                                    processedGIP[key]["r" + building.t].Add(produce);
                                }
                            }
                            data[key] = {
                                "r1": processedGIP[key].r1.Get(),
                                "r2": processedGIP[key].r2.Get(),
                                "r3": processedGIP[key].r3.Get(),
                                "r4": processedGIP[key].r4.Get()
                            };
                        }
                        gip[AutoBankManager.k_OPKEY_TWIGS].Add(processedGIP[key][AutoBankManager.k_OPKEY_TWIGS].Get());
                        gip[AutoBankManager.k_OPKEY_PEBBLES].Add(processedGIP[key][AutoBankManager.k_OPKEY_PEBBLES].Get());
                        gip[AutoBankManager.k_OPKEY_PUTTY].Add(processedGIP[key][AutoBankManager.k_OPKEY_PUTTY].Get());
                        gip[AutoBankManager.k_OPKEY_GOO].Add(processedGIP[key][AutoBankManager.k_OPKEY_GOO].Get());
                    }
                }
                processedGIP[AutoBankManager.k_OPKEY_TIME] = lastProcessedTime;
            }
        }
        return lastProcessedTime;
    }

    public static setLocalGIP(result: Record<string, any>): void {
        const processedGIP = BASE._processedGIP;
        if (!MapRoomManager.instance.isInMapRoom3) {
            for (const key in processedGIP) {
                if (key === AutoBankManager.k_OPKEY_TIME) {
                    if (BYMConfig.instance.AUTOBANK_FIX && GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK && BASE.isOutpost) {
                        result[key] = BASE._lastProcessedGIP;
                    } else if (!BASE.isMainYardInfernoOnly) {
                        result[key] = GLOBAL.Timestamp();
                    } else {
                        result[key] = BASE._lastProcessedGIP;
                    }
                } else {
                    result[key] = {
                        "r1": BASE._processedGIP[key][AutoBankManager.k_OPKEY_TWIGS].Get(),
                        "r2": BASE._processedGIP[key][AutoBankManager.k_OPKEY_PEBBLES].Get(),
                        "r3": BASE._processedGIP[key][AutoBankManager.k_OPKEY_PUTTY].Get(),
                        "r4": BASE._processedGIP[key][AutoBankManager.k_OPKEY_GOO].Get()
                    };
                }
            }
        } else {
            for (const key in processedGIP) {
                if (key === AutoBankManager.k_OPKEY_TIME) {
                    result[key] = GLOBAL.Timestamp();
                }
            }
        }
    }

    public static updateBuildingResources(result: Record<string, any>): Record<string, any> {
        if (BASE.isOutpost) {
            const resources: Record<string, number> = { "r1": 0, "r2": 0, "r3": 0, "r4": 0 };
            const buildings = InstanceManager.getInstancesByClass(BRESOURCE);
            for (const building of buildings) {
                const b = building as BFOUNDATION;
                if (b._type >= 1 && b._type <= 4) {
                    if (b.health > 0) {
                        let level = b._lvl.Get();
                        if (b._countdownUpgrade.Get() > 0) {
                            level++;
                        }
                        let produce = b._buildingProps.produce[level - 1];
                        produce = Math.max(Math.floor(produce * GLOBAL._averageAltitude.Get() / GLOBAL._currentCell.cellHeight), 1);
                        resources["r" + b._type] += produce;
                    }
                }
            }
            if (BASE._processedGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID]) {
                for (let i = 1; i < AutoBankManager.k_MAX_RESOURCES; i++) {
                    BASE._GIP["r" + i].Add(-BASE._processedGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID]["r" + i].Get());
                    BASE._processedGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID]["r" + i].Set(resources["r" + i]);
                    BASE._rawGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID]["r" + i] = resources["r" + i];
                }
            } else {
                BASE._processedGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID] = {
                    "r1": new SecNum(resources[AutoBankManager.k_OPKEY_TWIGS]),
                    "r2": new SecNum(resources[AutoBankManager.k_OPKEY_PEBBLES]),
                    "r3": new SecNum(resources[AutoBankManager.k_OPKEY_PUTTY]),
                    "r4": new SecNum(resources[AutoBankManager.k_OPKEY_GOO])
                };
                BASE._rawGIP[AutoBankManager.k_OPKEY_BASE + BASE._baseID] = {
                    "r1": resources[AutoBankManager.k_OPKEY_TWIGS],
                    "r2": resources[AutoBankManager.k_OPKEY_PEBBLES],
                    "r3": resources[AutoBankManager.k_OPKEY_PUTTY],
                    "r4": resources[AutoBankManager.k_OPKEY_GOO]
                };
            }
            for (let i = 1; i < AutoBankManager.k_MAX_RESOURCES; i++) {
                BASE._GIP["r" + i].Add(resources["r" + i]);
            }
            result[AutoBankManager.k_OPKEY_BASE + BASE._baseID] = resources;
        }
        return result;
    }

    public static autobank(ticks: number = 10, forceLog: boolean = false): void {
        if (MapRoomManager.instance.isInMapRoom2) {
            const gip = BASE._GIP;
            if (!gip) {
                return;
            }
            const totalFunded = new SecNum(0);
            const funded = [new SecNum(0), new SecNum(0), new SecNum(0), new SecNum(0)];
            let overdrivePower: SecNum;
            if (GLOBAL._harvesterOverdrive >= GLOBAL.Timestamp() && Boolean(GLOBAL._harvesterOverdrivePower.Get())) {
                overdrivePower = GLOBAL._harvesterOverdrivePower;
            } else {
                overdrivePower = new SecNum(1);
            }
            for (let i = 1; i < AutoBankManager.k_MAX_RESOURCES; i++) {
                if (Boolean(gip["r" + i]) && Boolean(gip["r" + i].Get())) {
                    funded[i - 1].Set(BASE.Fund(i, gip["r" + i].Get() * overdrivePower.Get() * ticks / 10, false, null, false, false));
                    totalFunded.Add(funded[i - 1].Get());
                }
                if (ticks > 10 || AutoBankManager.s_logCounter === 0) {
                    if (funded[i - 1].Get() > 0) {
                        LOGGER.Stat([96, i, funded[i - 1].Get() * (ticks > 10 ? 1 : 10)]);
                    }
                    AutoBankManager.s_logCounter = 10;
                }
            }
            BASE.PointsAdd(Math.ceil(totalFunded.Get() * 0.375));
        } else if (MapRoomManager.instance.isInMapRoom3) {
            const buff = BaseBuffHandler.instance.getBuffByName(AutoBankBaseBuff.k_NAME) as AutoBankBaseBuff;
            if (buff) {
                AutoBankManager.fundAllResources(buff.value * Math.max(0, ticks), forceLog || AutoBankManager.s_logCounter === 0);
            }
        }
        --AutoBankManager.s_logCounter;
    }

    private static sortKeys(a: string, b: string): number {
        return parseInt(a) - parseInt(b);
    }

    private static fundAllResources(amount: number, doLog: boolean): void {
        for (let i = 1; i < AutoBankManager.k_MAX_RESOURCES; i++) {
            BASE.Fund(i, amount, false, null, false, false);
            if (doLog && Boolean(amount)) {
                LOGGER.Stat([96, i, amount]);
            }
        }
        if (doLog) {
            AutoBankManager.s_logCounter = 10;
        }
    }
}
