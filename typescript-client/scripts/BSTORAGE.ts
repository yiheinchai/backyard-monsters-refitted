import { SecNum } from './com/cc/utils/SecNum';
import { EnumYardType } from './com/monsters/enums/EnumYardType';
import { ILootable } from './com/monsters/interfaces/ILootable';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }


/**
 * BSTORAGE - Storage building class
 * Extends BFOUNDATION for storage buildings (Town Hall, Silo, etc.)
 */
export class BSTORAGE extends BFOUNDATION implements ILootable {
    private static _LOOT_MAX_TH: number = 10000000;
    private static _LOOT_MAX_OUTPOST: number = 10000000;
    private static _LOOT_MAX_SILO: number = 4000000;
    private static _LOOT_MAX_WM_TH: number = 2000000;
    private static _LOOT_MAX_WM_SILO: number = 500000;
    private static _LOOT_PCT_TH: number = 0.1;
    private static _LOOT_PCT_OUTPOST: number = 0.05;
    private static _LOOT_PCT_BASE: number = 0.04;
    private static _LOOT_GOO_LIMITER: number = 0.5;

    constructor() {
        super();
    }

    public override Loot(amount: number): number {
        let looted: number = 0;
        const resources: any[] = [];
        
        if (getBASE()._resources.r1.Get() > 0) resources.push({ id: 1, quantity: getBASE()._resources.r1.Get() });
        if (getBASE()._resources.r2.Get() > 0) resources.push({ id: 2, quantity: getBASE()._resources.r2.Get() });
        if (getBASE()._resources.r3.Get() > 0) resources.push({ id: 3, quantity: getBASE()._resources.r3.Get() });
        if (getBASE()._resources.r4.Get() > 0) resources.push({ id: 4, quantity: getBASE()._resources.r4.Get() });
        
        if (resources.length > 0) {
            const selected: any = resources[Math.floor(Math.random() * resources.length)];
            looted = selected.quantity >= Math.ceil(amount) ? Math.ceil(amount) : selected.quantity;
            
            getBASE()._resources["r" + selected.id].Add(-looted);
            getBASE()._hpResources["r" + selected.id] -= looted;
            
            if (getBASE()._deltaResources["r" + selected.id]) {
                getBASE()._deltaResources["r" + selected.id].Add(-looted);
                getBASE()._hpDeltaResources["r" + selected.id] -= looted;
            } else {
                getBASE()._deltaResources["r" + selected.id] = new SecNum(-looted);
                getBASE()._hpDeltaResources["r" + selected.id] = -looted;
            }
            getBASE()._deltaResources.dirty = true;
            getBASE()._hpDeltaResources.dirty = true;
            
            if (getMapRoomManager().instance.isInMapRoom2 && getGLOBAL()._currentCell?.baseType === EnumYardType.OUTPOST) {
                looted *= 0.5;
            } else {
                looted *= 0.9;
            }
            if (getGLOBAL().mode === "wmattack") {
                looted = Math.floor(looted / 5);
            }
            getATTACK().Loot(selected.id, looted, this._mc!.x, this._mc!.y, 9, this);
        }
        return super.Loot(looted);
    }

    public override Destroyed(byAttacker: boolean = true): void {
        if (byAttacker && !this._destroyed) {
            let lootPct: number = BSTORAGE._LOOT_PCT_BASE;
            if (this._type === 14) lootPct = BSTORAGE._LOOT_PCT_TH;
            if (this._type === 112) lootPct = BSTORAGE._LOOT_PCT_OUTPOST;
            
            for (let i = 1; i < 5; i++) {
                let lootAmount: number = Math.floor(getBASE()._resources["r" + i].Get() * lootPct);
                
                if (this._type === 6) {
                    lootAmount = Math.min(lootAmount, BSTORAGE._LOOT_MAX_SILO);
                    if (getMapRoomManager().instance.isInMapRoom2 && getGLOBAL()._currentCell?.baseType === EnumYardType.OUTPOST) {
                        lootAmount = Math.min(lootAmount, BSTORAGE._LOOT_MAX_WM_SILO);
                    }
                }
                if (this._type === 14) {
                    lootAmount = Math.min(lootAmount, BSTORAGE._LOOT_MAX_TH);
                    if (getMapRoomManager().instance.isInMapRoom2 && getGLOBAL()._currentCell?.baseType === EnumYardType.OUTPOST) {
                        lootAmount = Math.min(lootAmount, BSTORAGE._LOOT_MAX_WM_TH);
                    }
                }
                if (this._type === 112) {
                    lootAmount = Math.min(lootAmount, BSTORAGE._LOOT_MAX_OUTPOST);
                }
                if (i === 4 && !getMapRoomManager().instance.isInMapRoom3) {
                    lootAmount = Math.ceil(lootAmount * BSTORAGE._LOOT_GOO_LIMITER);
                }
                
                if (lootAmount > 0) {
                    getBASE()._resources["r" + i].Add(-lootAmount);
                    getBASE()._hpResources["r" + i] -= lootAmount;
                    if (getBASE()._deltaResources["r" + i]) {
                        getBASE()._deltaResources["r" + i].Add(-lootAmount);
                        getBASE()._hpDeltaResources["r" + i] -= lootAmount;
                    } else {
                        getBASE()._deltaResources["r" + i] = new SecNum(-lootAmount);
                        getBASE()._hpDeltaResources["r" + i] = -lootAmount;
                    }
                    getBASE()._deltaResources.dirty = true;
                    getBASE()._hpDeltaResources.dirty = true;
                    getATTACK().Loot(i, lootAmount, this._mc!.x, this._mc!.y + 20 - i * 10, 12);
                }
            }
            getATTACK().Log("b" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_downedlooted", {
                v1: this._lvl.Get(),
                v2: this._buildingProps.name,
                v3: Math.floor(100 * lootPct)
            })}</font>`);
        } else {
            getATTACK().Log("b" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_downed", {
                v1: this._lvl.Get(),
                v2: this._buildingProps.name
            })}</font>`);
        }
        super.Destroyed(byAttacker);
    }
}
