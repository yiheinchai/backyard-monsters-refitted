import { Field } from "./Field";
import { Type } from "./Type";

/**
 * Constant - Represents a constant field in a class.
 */
export class Constant extends Field {
    constructor(name: string, type: Type, declaringType: Type, isStatic: boolean) {
        super(name, type, declaringType, isStatic);
    }
}
