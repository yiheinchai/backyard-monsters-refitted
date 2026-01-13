import { IPropertyModifier } from "../../interfaces/IPropertyModifier";
import { CProperty } from "./CProperty";

/**
 * Property with modifier support and value caching for performance.
 */
export class CModifiableProperty extends CProperty {
    protected _modifiers: IPropertyModifier[] = [];
    
    // Performance optimization: Cache calculated values
    private _cachedValue: number = NaN;
    private _isDirty: boolean = true;

    constructor(maximum: number = Number.MAX_VALUE, minimum: number = -Number.MAX_VALUE, value: number = -1) {
        super(maximum, minimum, value);
        this._modifiers = [];
    }

    public override get value(): number {
        // Use cached value if available and not dirty
        if (!this._isDirty && !isNaN(this._cachedValue)) {
            return this._cachedValue;
        }
        
        let result = this._value;
        for (const modifier of this._modifiers) {
            result = modifier.modify(result);
        }
        
        // Cache the calculated value
        this._cachedValue = result;
        this._isDirty = false;
        
        return result;
    }

    public override set value(val: number) {
        super.value = val;
        this._isDirty = true;
    }

    public get modifiers(): IPropertyModifier[] {
        return this._modifiers;
    }

    public addModifier(modifier: IPropertyModifier, priority: number = 0): void {
        this._modifiers.push(modifier);
        this._isDirty = true;
    }

    public removeModifier(modifier: IPropertyModifier): void {
        const idx = this._modifiers.indexOf(modifier);
        if (idx >= 0) {
            this._modifiers.splice(idx, 1);
            this._isDirty = true;
        }
    }

    public getModifierByType<T extends IPropertyModifier>(modifierClass: new (...args: any[]) => T): T | null {
        for (const modifier of this._modifiers) {
            if (modifier instanceof modifierClass) {
                return modifier as T;
            }
        }
        return null;
    }

    public getModifier(modifier: IPropertyModifier): IPropertyModifier | null {
        const idx = this._modifiers.indexOf(modifier);
        return idx !== -1 ? this._modifiers[idx] : null;
    }
}
