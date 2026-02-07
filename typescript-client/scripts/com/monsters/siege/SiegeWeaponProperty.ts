import { SiegeWeapon } from "./weapons/SiegeWeapon";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../KEYS").KEYS; }


/**
 * Siege weapon property - defines a leveled property of siege weapons.
 */
export class SiegeWeaponProperty {
    public label: string = "";
    public order: number = 0;
    public descriptionKey: string = "";
    private _values: any[];

    constructor(values: any[], order: number = 0) {
        this._values = values;
        this.order = order;
    }

    public get values(): any[] {
        return this._values;
    }

    public getDescription(level: number): string {
        return getKEYS().Get(this.descriptionKey, { v1: this.getValueForLevel(level) });
    }

    public getValueForLevel(level: number): any {
        return this._values[Math.max(0, Math.min(level, SiegeWeapon.MAX_LEVEL)) - 1];
    }

    public getProgressForLevel(level: number): number {
        return this._values[Math.max(0, Math.min(level, SiegeWeapon.MAX_LEVEL)) - 1] / this._values[SiegeWeapon.MAX_LEVEL - 1];
    }
}
