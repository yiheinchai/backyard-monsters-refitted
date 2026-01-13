import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";
import { ArmorPropertyModifier } from "./ArmorPropertyModifier";

/**
 * Beast mode - combat modifier for beast mode ability.
 */
export class BeastMode {
    public static readonly k_color: number = 255;
    public static readonly k_value: number = 0.3;
    public static readonly k_armorModifier: IPropertyModifier = new ArmorPropertyModifier(BeastMode.k_value);

    constructor() {}
}
