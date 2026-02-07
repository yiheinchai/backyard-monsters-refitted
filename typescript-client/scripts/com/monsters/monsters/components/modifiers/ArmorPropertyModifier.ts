import { MultiplicationPropertyModifier } from "./MultiplicationPropertyModifier";

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("../../../debug/Console").Console; }


/**
 * Armor property modifier - reduces damage taken by a percentage.
 */
export class ArmorPropertyModifier extends MultiplicationPropertyModifier {
    constructor(armorValue: number) {
        if (armorValue > 1 || armorValue <= 0) {
            getConsole().warning("you are trying to add an armor multiplier of an invalid value (" + armorValue + ")");
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
