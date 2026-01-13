import Timer from "openfl/utils/Timer";
import TimerEvent from "openfl/events/TimerEvent";

import { Decoy } from "./weapons/Decoy";
import { Vacuum } from "./weapons/Vacuum";
import { Jars } from "./weapons/Jars";
import { SiegeWeapon } from "./weapons/SiegeWeapon";

import { ATTACK } from "../../../ATTACK";
import { LOGGER } from "../../../LOGGER";

import { md5 } from "../../../md5";

declare const JSON: { encode(obj: any): string };

/**
 * Siege weapons management - contains all available siege weapons and their state.
 */
export class SiegeWeapons {
    public static weapons: { [key: string]: SiegeWeapon } = {};
    public static activeWeaponID: string | null = null;
    public static didActivatWeapon: boolean = false;
    public static activeWeaponTimer: Timer | null = null;
    
    private static _weaponsList: { [key: string]: SiegeWeapon } = {};

    // Static initialization block moved to static method
    public static initialize(): void {
        SiegeWeapons._weaponsList[Decoy.ID] = new Decoy();
        SiegeWeapons._weaponsList[Vacuum.ID] = new Vacuum();
        SiegeWeapons._weaponsList[Jars.ID] = new Jars();
    }

    constructor() {}

    public static getTimeRemaingOnActiveWeapon(): number {
        if (!SiegeWeapons.activeWeapon) {
            return -1;
        }
        if (SiegeWeapons.activeWeaponTimer) {
            return SiegeWeapons.activeWeaponTimer.repeatCount - SiegeWeapons.activeWeaponTimer.currentCount;
        }
        return -1;
    }

    public static get activeWeapon(): SiegeWeapon | null {
        if (!SiegeWeapons.activeWeaponID) return null;
        return SiegeWeapons.getWeapon(SiegeWeapons.activeWeaponID);
    }

    public static addCurrentWeapons(list: Array<SiegeWeapon>): void {
        for (const weaponId in SiegeWeapons._weaponsList) {
            list.push(SiegeWeapons._weaponsList[weaponId]);
        }
    }

    public static activateWeapon(weaponId: string, x: number = 0, y: number = 0): boolean {
        const weapon = SiegeWeapons.getWeapon(weaponId);
        if (!weapon || !weapon.activate(x, y)) {
            return false;
        }
        
        SiegeWeapons.activeWeaponID = weaponId;
        ATTACK.Log("siegeWeaponActivation", '<font color="#0000FF">' + weapon.logMessage + '</font>');
        
        if (weapon.duration > 0) {
            SiegeWeapons.activeWeaponTimer = new Timer(1000, weapon.duration);
            SiegeWeapons.activeWeaponTimer.addEventListener(TimerEvent.TIMER_COMPLETE, SiegeWeapons.onDurationTimerComplete);
            SiegeWeapons.activeWeaponTimer.start();
        }
        
        weapon.quantity--;
        SiegeWeapons.didActivatWeapon = true;
        LOGGER.Stat([93, weaponId, weapon.level]);
        return true;
    }

    public static onDurationTimerComplete(event: TimerEvent): void {
        SiegeWeapons.deactivateWeapon();
    }

    public static deactivateWeapon(): void {
        if (!SiegeWeapons.activeWeapon) {
            return;
        }
        
        if (SiegeWeapons.activeWeaponTimer) {
            SiegeWeapons.activeWeaponTimer.removeEventListener(TimerEvent.TIMER_COMPLETE, SiegeWeapons.onDurationTimerComplete);
            SiegeWeapons.activeWeaponTimer.stop();
            SiegeWeapons.activeWeaponTimer.reset();
            SiegeWeapons.activeWeaponTimer = null;
        }
        
        SiegeWeapons.activeWeapon.deactivate();
        SiegeWeapons.activeWeaponID = null;
    }

    public static importWeapons(data: any): void {
        for (const weaponId in SiegeWeapons._weaponsList) {
            const weapon = SiegeWeapons.getWeapon(weaponId);
            SiegeWeapons.weapons[weaponId] = weapon;
            if (data) {
                const weaponData = data[weaponId];
                if (weaponData) {
                    weapon.importVariables(weaponData);
                }
            } else {
                weapon.level = 0;
            }
        }
    }

    public static exportWeapons(): any {
        let result: any = null;
        for (const weaponId in SiegeWeapons.weapons) {
            const weapon = SiegeWeapons.weapons[weaponId];
            if (weapon.level > 0) {
                if (!result) {
                    result = {};
                }
                result[weapon.weaponID] = weapon.exportVariables();
            }
        }
        return result;
    }

    public static getWeapon(weaponId: string): SiegeWeapon {
        return SiegeWeapons._weaponsList[weaponId];
    }

    public static get availableWeapon(): SiegeWeapon | null {
        for (const weaponId in SiegeWeapons.weapons) {
            const weapon = SiegeWeapons.weapons[weaponId];
            if (weapon.quantity > 0) {
                return weapon;
            }
        }
        return null;
    }

    public static Check(): string {
        const list: any[] = [];
        for (let i = 0; i < 10; i++) {
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r1);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r2);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r3);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r4);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(Decoy.DAMAGE).values[i]);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.RANGE).values[i]);
            list.push(SiegeWeapons.getWeapon(Decoy.ID).getProperty(SiegeWeapon.DURATION).values[i]);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r1);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r2);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r3);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r4);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.DURATION).values[i]);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(SiegeWeapon.DURABILITY).values[i]);
            list.push(SiegeWeapons.getWeapon(Vacuum.ID).getProperty(Vacuum.LOOT_BONUS).values[i]);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r1);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r2);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r3);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.UPGRADE_COSTS).values[i].r4);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.RANGE).values[i]);
            list.push(SiegeWeapons.getWeapon(Jars.ID).getProperty(SiegeWeapon.DURABILITY).values[i]);
        }
        return md5(JSON.encode(list));
    }
}

// Call initialize when module loads
SiegeWeapons.initialize();
