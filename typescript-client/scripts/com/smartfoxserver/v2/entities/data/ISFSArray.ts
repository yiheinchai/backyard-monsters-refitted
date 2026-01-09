import { ByteArray } from "openfl/utils/ByteArray";
import { ISFSObject } from "./ISFSObject";
import { SFSDataWrapper } from "./SFSDataWrapper";

/**
 * ISFSArray - Interface for SmartFoxServer array data.
 */
export interface ISFSArray {
    contains(value: any): boolean;
    getElementAt(index: number): any;
    getWrappedElementAt(index: number): SFSDataWrapper;
    removeElementAt(index: number): any;
    size(): number;
    toBinary(): ByteArray;
    getDump(prettyPrint?: boolean): string;
    getHexDump(): string;

    addNull(): void;
    addBool(value: boolean): void;
    addByte(value: number): void;
    addShort(value: number): void;
    addInt(value: number): void;
    addLong(value: number): void;
    addFloat(value: number): void;
    addDouble(value: number): void;
    addUtfString(value: string): void;
    addBoolArray(value: Array<boolean>): void;
    addByteArray(value: ByteArray): void;
    addShortArray(value: Array<number>): void;
    addIntArray(value: Array<number>): void;
    addLongArray(value: Array<number>): void;
    addFloatArray(value: Array<number>): void;
    addDoubleArray(value: Array<number>): void;
    addUtfStringArray(value: Array<string>): void;
    addSFSArray(value: ISFSArray): void;
    addSFSObject(value: ISFSObject): void;
    addClass(value: any): void;
    add(wrapper: SFSDataWrapper): void;

    isNull(index: number): boolean;
    getBool(index: number): boolean;
    getByte(index: number): number;
    getUnsignedByte(index: number): number;
    getShort(index: number): number;
    getInt(index: number): number;
    getLong(index: number): number;
    getFloat(index: number): number;
    getDouble(index: number): number;
    getUtfString(index: number): string;
    getBoolArray(index: number): Array<boolean>;
    getByteArray(index: number): ByteArray;
    getUnsignedByteArray(index: number): Array<number>;
    getShortArray(index: number): Array<number>;
    getIntArray(index: number): Array<number>;
    getLongArray(index: number): Array<number>;
    getFloatArray(index: number): Array<number>;
    getDoubleArray(index: number): Array<number>;
    getUtfStringArray(index: number): Array<string>;
    getSFSArray(index: number): ISFSArray;
    getSFSObject(index: number): ISFSObject;
    getClass(index: number): any;
}
