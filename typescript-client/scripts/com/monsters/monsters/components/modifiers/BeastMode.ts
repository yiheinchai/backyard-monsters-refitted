import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";
import { ArmorPropertyModifier } from "./ArmorPropertyModifier";

/**
 * Beast mode - combat modifier for beast mode ability.
 */
export class BeastMode {
    public static readonly k_color: number = 255;
    public static readonly k_value: number = 0.3;
    private static _armorModifier: IPropertyModifier | null = null;

    public static get k_armorModifier(): IPropertyModifier {
        if (!BeastMode._armorModifier) {
            BeastMode._armorModifier = new ArmorPropertyModifier(BeastMode.k_value);
        }
        return BeastMode._armorModifier;
    }

    constructor() {}
}
