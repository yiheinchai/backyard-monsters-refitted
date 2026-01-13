import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";

/**
 * Multiplication property modifier - multiplies a property by a value.
 */
export class MultiplicationPropertyModifier implements IPropertyModifier {
    public multiple: number;

    constructor(multiple: number) {
        this.multiple = multiple;
    }

    public modify(input: number): number {
        return input * this.multiple;
    }
}
