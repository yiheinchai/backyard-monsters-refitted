import Rectangle from "openfl/geom/Rectangle";
import Event from "openfl/events/Event";

import { SecNum } from "../../cc/utils/SecNum";
import { SiegeBuildingPopup } from "./SiegeBuildingPopup";
import { SiegeWeapons } from "./SiegeWeapons";

import { BFOUNDATION } from "../../../BFOUNDATION";
import { GLOBAL } from "../../../GLOBAL";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { SOUNDS } from "../../../SOUNDS";

// Forward declaration
declare class SiegeWeapon {
    weaponID: string;
}

/**
 * Base class for siege buildings (factory and lab).
 */
export class SiegeBuilding extends BFOUNDATION {
    public static readonly START: string = "siegeBuildingStart";
    public static readonly STOP: string = "siegeBuildingStop";
    public static readonly INSTANT: string = "siegeBuildingInstant";

    private static _popup: SiegeBuildingPopup | null = null;

    public unlockingWeapons: { [key: string]: SecNum } = {};

    constructor() {
        super();
        this.unlockingWeapons = {};
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this._animRandomStart = false;
        this.SetProps();
    }

    public static Show(mode: string, section: string | null = null): void {
        if (!SiegeBuilding._popup) {
            SiegeBuilding._popup = new SiegeBuildingPopup(mode, section);
            GLOBAL.BlockerAdd();
            GLOBAL._layerWindows.addChild(SiegeBuilding._popup);
            POPUPSETTINGS.AlignToCenter(SiegeBuilding._popup);
            POPUPSETTINGS.ScaleUp(SiegeBuilding._popup);
        }
    }

    public static Hide(): void {
        if (SiegeBuilding._popup) {
            GLOBAL.BlockerRemove();
            SOUNDS.Play("close");
            GLOBAL._layerWindows.removeChild(SiegeBuilding._popup);
            SiegeBuilding._popup = null;
        }
    }

    public get upgradingWeapon(): SiegeWeapon | null {
        for (const weaponId in this.unlockingWeapons) {
            return SiegeWeapons.getWeapon(weaponId);
        }
        return null;
    }

    public IsUpgrading(weapon: SiegeWeapon): boolean {
        for (const weaponId in this.unlockingWeapons) {
            if (weapon.weaponID === weaponId) {
                return true;
            }
        }
        return false;
    }

    public UpgradeTimeLeft(weapon: SiegeWeapon): number {
        for (const weaponId in this.unlockingWeapons) {
            if (weapon.weaponID === weaponId) {
                return this.unlockingWeapons[weaponId].Get();
            }
        }
        return -1;
    }

    public get tickLimit(): number {
        let limit = super.tickLimit;
        for (const weaponId in this.unlockingWeapons) {
            limit = Math.min(limit, this.unlockingWeapons[weaponId].Get());
        }
        return limit;
    }

    public Tick(seconds: number): void {
        if (!this._destroyed) {
            for (const weaponId in this.unlockingWeapons) {
                if (this.unlockingWeapons[weaponId].Get() > 0) {
                    this.unlockingWeapons[weaponId].Add(-seconds);
                }
                if (this.unlockingWeapons[weaponId].Get() <= 0) {
                    this.CompleteUpgradingWeapon(weaponId);
                }
            }
        }
        super.Tick(seconds);
    }

    public CompleteUpgradingWeapon(weaponId: string, showBrag: boolean = true): void {
        // Override in subclasses
    }

    public TickFast(event: Event | null = null): void {
        super.TickFast(event);
        if (this.upgradingWeapon) {
            this.AnimFrame();
        }
    }

    public Setup(data: any): void {
        super.Setup(data);
        if (data.unlockingWeapons && !(data.unlockingWeapons instanceof Array)) {
            this.unlockingWeapons = {};
            for (const weaponId in data.unlockingWeapons) {
                this.unlockingWeapons[weaponId] = new SecNum(data.unlockingWeapons[weaponId] - GLOBAL.Timestamp());
            }
        } else if (data.unlockingWeapons2) {
            this.unlockingWeapons = {};
            for (const weaponId in data.unlockingWeapons2) {
                this.unlockingWeapons[weaponId] = new SecNum(data.unlockingWeapons2[weaponId]);
            }
        }
    }

    public Export(): any {
        const data = super.Export();
        if (this.unlockingWeapons) {
            data.unlockingWeapons2 = {};
            for (const weaponId in this.unlockingWeapons) {
                data.unlockingWeapons2[weaponId] = this.unlockingWeapons[weaponId].Get();
            }
        }
        return data;
    }

    protected UpgradeWeapon(weaponId: string): void {
        // Override in subclasses
    }

    protected ShowBragPopup(weaponId: string): void {
        // Override in subclasses
    }
}
