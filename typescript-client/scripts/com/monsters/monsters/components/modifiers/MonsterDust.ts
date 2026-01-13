import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";
import { MultiplicationPropertyModifier } from "./MultiplicationPropertyModifier";

/**
 * Monster Dust - modifier constants for monster dust power-up.
 */
export class MonsterDust {
    public static readonly k_titleKey: string = "str_code_mod_title";
    public static readonly k_descriptionKey: string = "str_code_mod_body";
    public static readonly k_storeKey: string = "MOD";
    public static readonly k_color: number = 13421568;
    public static readonly k_value: number = 1.25;
    public static readonly k_damageModifier: IPropertyModifier = new MultiplicationPropertyModifier(MonsterDust.k_value);

    constructor() {}
}
