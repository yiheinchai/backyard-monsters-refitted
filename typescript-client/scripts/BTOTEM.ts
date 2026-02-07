import { SecNum } from './com/cc/utils/SecNum';
import { EnumInvasionType } from './com/monsters/enums/EnumInvasionType';
import { BDECORATION } from './BDECORATION';

// Lazy imports to break circular dependency chains
function getInventoryManager(): any { return require("./com/monsters/inventory/InventoryManager").InventoryManager; }
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBUILDINGS(): any { return require("./BUILDINGS").BUILDINGS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }


/**
 * BTOTEM - Totem decoration building class
 * Extends BDECORATION for World Monster Invasion totem buildings
 */
export class BTOTEM extends BDECORATION {
    public static readonly BTOTEM_WMI1: number = 121;
    public static readonly BTOTEM_WMI2: number = 131;

    constructor(type: number) {
        super(type);
        if (getBASE()._buildingsStored["b" + this._type] && getBASE()._buildingsStored["bl" + this._type]) {
            this._lvl = new SecNum(getBASE()._buildingsStored["bl" + this._type].Get());
            this._hpLvl = this._lvl.Get();
        }
    }

    public static HasTotemPlaced(wmi1: boolean = false, wmi2: boolean = false): boolean {
        const decorations: any[] = getInstanceManager().getInstancesByClass(BDECORATION);
        for (const building of decorations) {
            if (wmi1 && building._type === BTOTEM.BTOTEM_WMI1) return true;
            if (wmi2 && building._type === BTOTEM.BTOTEM_WMI2) return true;
        }
        return false;
    }

    public static TotemReward(): void {
        if (getGLOBAL()._flags.activeInvasion === EnumInvasionType.WMI1) {
            if (BTOTEM.HasTotemPlaced(true, false)) return;
            BTOTEM.RemoveAllFromStorage(true, false);
            BTOTEM.RemoveAllFromYard(true, false);
            getInventoryManager().buildingStorageAdd(BTOTEM.BTOTEM_WMI1, 1);
        } else {
            if (BTOTEM.HasTotemPlaced(false, true)) return;
            BTOTEM.RemoveAllFromStorage(false, true);
            BTOTEM.RemoveAllFromYard(false, true);
            getInventoryManager().buildingStorageAdd(BTOTEM.BTOTEM_WMI2, 1);
        }
    }

    public static TotemPlace(): void {
        let totemType: number;
        if (getGLOBAL()._flags.activeInvasion === EnumInvasionType.WMI1) {
            totemType = BTOTEM.BTOTEM_WMI1;
        } else {
            totemType = BTOTEM.BTOTEM_WMI2;
        }
        
        if (!getBASE()._buildingsStored["b" + totemType] || getBASE()._buildingsStored["b" + totemType].Get() <= 0) {
            return;
        }
        
        getBUILDINGS()._buildingID = totemType;
        getBUILDINGS().Show();
        getBUILDINGS()._mc.SwitchB(4, 4, 0);
    }

    public static UpgradeTotem(): void {
        const decorations: any[] = getInstanceManager().getInstancesByClass(BDECORATION);
        for (const building of decorations) {
            if (building._type === BTOTEM.BTOTEM_WMI1 || building._type === BTOTEM.BTOTEM_WMI2) {
                (building as BFOUNDATION).Upgraded();
            }
        }
        
        if (getGLOBAL()._flags.activeInvasion === EnumInvasionType.WMI1) {
            if (getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI1]) {
                getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI1].Set(BTOTEM.EarnedTotemLevel());
            }
        } else {
            if (getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI2]) {
                getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI2].Set(BTOTEM.EarnedTotemLevel2());
            }
        }
    }

    public static RemoveAllFromStorage(wmi1: boolean = false, wmi2: boolean = false): void {
        if (wmi1) {
            delete getBASE()._buildingsStored["b" + BTOTEM.BTOTEM_WMI1];
            delete getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI1];
        }
        if (wmi2) {
            delete getBASE()._buildingsStored["b" + BTOTEM.BTOTEM_WMI2];
            delete getBASE()._buildingsStored["bl" + BTOTEM.BTOTEM_WMI2];
        }
    }

    public static RemoveAllFromYard(wmi1: boolean = false, wmi2: boolean = false): void {
        const decorations: any[] = getInstanceManager().getInstancesByClass(BDECORATION);
        for (const building of decorations) {
            if (wmi1 && building._type === BTOTEM.BTOTEM_WMI1) {
                building.GridCost(false);
                building.clear();
            }
            if (wmi2 && building._type === BTOTEM.BTOTEM_WMI2) {
                building.GridCost(false);
                building.clear();
            }
        }
    }

    public static EarnedTotemLevel(): number {
        const wmi_wave: number = getGLOBAL().StatGet("wmi_wave");
        const storedLevel: number = getGLOBAL().StatGet("wmi1_totem_level");
        let currentLevel: number;
        
        if (wmi_wave === 0) currentLevel = 0;
        else if (wmi_wave >= 1 && wmi_wave <= 9) currentLevel = 1;
        else if (wmi_wave >= 10 && wmi_wave <= 19) currentLevel = 2;
        else if (wmi_wave >= 20 && wmi_wave <= 29) currentLevel = 3;
        else if (wmi_wave === 30) currentLevel = 4;
        else if (wmi_wave === 31) currentLevel = 5;
        else currentLevel = 6;
        
        if (currentLevel > storedLevel) {
            getGLOBAL().StatSet("wmi1_totem_level", currentLevel);
            return currentLevel;
        }
        return storedLevel;
    }

    private static EarnedTotemLevel2(): number {
        const wmi2_wave: number = getGLOBAL().StatGet("wmi2_wave");
        const storedLevel: number = getGLOBAL().StatGet("wmi2_totem_level");
        let currentLevel: number;
        
        if (wmi2_wave === 100) currentLevel = 0;
        else if (wmi2_wave >= 101 && wmi2_wave <= 109) currentLevel = 1;
        else if (wmi2_wave >= 110 && wmi2_wave <= 119) currentLevel = 2;
        else if (wmi2_wave >= 120 && wmi2_wave <= 129) currentLevel = 3;
        else if (wmi2_wave === 130) currentLevel = 4;
        else if (wmi2_wave === 131) currentLevel = 5;
        else currentLevel = 6;
        
        if (currentLevel > storedLevel) {
            getGLOBAL().StatSet("wmi2_totem_level", currentLevel);
            return currentLevel;
        }
        return storedLevel;
    }

    public static IsTotem(type: number): boolean {
        return type === BTOTEM.BTOTEM_WMI1;
    }

    public static IsTotem2(type: number): boolean {
        return type === BTOTEM.BTOTEM_WMI2;
    }

    public override Tick(seconds: number): void {
        super.Tick(seconds);
        
        let earnedLevel: number;
        if (this._type === BTOTEM.BTOTEM_WMI1) {
            earnedLevel = BTOTEM.EarnedTotemLevel();
        } else if (this._type === BTOTEM.BTOTEM_WMI2) {
            earnedLevel = BTOTEM.EarnedTotemLevel2();
        } else {
            return;
        }
        
        if (this._lvl.Get() !== earnedLevel) {
            this._lvl.Set(earnedLevel);
            this._hpLvl = earnedLevel;
        }
    }
}
