import { AbstractMember } from "./AbstractMember";
import { MetaData } from "./MetaData";
import { Type } from "./Type";

/**
 * Field - Represents a field (property) in a class.
 */
export class Field extends AbstractMember {
    constructor(name: string, type: Type, declaringType: Type, isStatic: boolean, metaData: Array<MetaData> | null = null) {
        super(name, type, declaringType, isStatic, metaData);
    }

    public getValue(target: any = null): any {
        if (!target) {
            target = this.declaringType.clazz;
        }
        return target[this.name];
    }
}
