import { Field } from "./Field";
import { Type } from "./Type";

/**
 * Variable - Represents a variable field in a class.
 */
export class Variable extends Field {
    constructor(name: string, type: Type, declaringType: Type, isStatic: boolean) {
        super(name, type, declaringType, isStatic);
    }
}
