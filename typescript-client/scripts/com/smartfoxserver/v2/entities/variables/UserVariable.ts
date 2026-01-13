import { ISFSArray } from "../data/ISFSArray";
import { ISFSObject } from "../data/ISFSObject";

/**
 * UserVariable - Interface for user variables.
 */
export interface UserVariable {
    readonly name: string;
    readonly type: string;
    getValue(): any;
    getBoolValue(): boolean;
    getIntValue(): number;
    getDoubleValue(): number;
    getStringValue(): string;
    getSFSObjectValue(): ISFSObject;
    getSFSArrayValue(): ISFSArray;
    isNull(): boolean;
    toSFSArray(): ISFSArray;
}
