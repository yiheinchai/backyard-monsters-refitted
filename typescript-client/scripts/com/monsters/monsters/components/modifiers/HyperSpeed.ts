import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";
import { DivisionModifier } from "./DivisionModifier";
import { MultiplicationPropertyModifier } from "./MultiplicationPropertyModifier";

/**
 * Hyper speed - modifier constants for speed abilities.
 */
export class HyperSpeed {
    public static readonly k_color: number = 16711680;
    public static readonly k_value: number = 1.5;
    public static readonly k_attackSpeedModifier: IPropertyModifier = new DivisionModifier(HyperSpeed.k_value);
    public static readonly k_moveSpeedModifier: IPropertyModifier = new MultiplicationPropertyModifier(HyperSpeed.k_value);

    constructor() {}
}
