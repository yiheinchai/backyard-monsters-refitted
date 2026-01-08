import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";

/**
 * Division modifier - divides a property by a value.
 */
export class DivisionModifier implements IPropertyModifier {
    public divisor: number;

    constructor(divisor: number) {
        this.divisor = divisor;
    }

    public modify(input: number): number {
        return input / this.divisor;
    }
}
