import { Console } from "../../../debug/Console";
import { MultiplicationPropertyModifier } from "./MultiplicationPropertyModifier";

/**
 * Armor property modifier - reduces damage taken by a percentage.
 */
export class ArmorPropertyModifier extends MultiplicationPropertyModifier {
    constructor(armorValue: number) {
        if (armorValue > 1 || armorValue <= 0) {
            Console.warning("you are trying to add an armor multiplier of an invalid value (" + armorValue + ")");
            armorValue = 1;
        }
        super(armorValue);
    }

    public override modify(input: number): number {
        if (!input) {
            return this.multiple;
        }
        return super.modify(input);
    }
}
