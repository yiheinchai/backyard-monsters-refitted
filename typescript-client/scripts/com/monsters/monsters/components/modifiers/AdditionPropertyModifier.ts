import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";

/**
 * Addition property modifier - adds a value to a property.
 */
export class AdditionPropertyModifier implements IPropertyModifier {
    public value: number;

    constructor(value: number = 0) {
        this.value = value;
    }

    public modify(input: number): number {
        return input + this.value;
    }
}
