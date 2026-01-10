import ByteArray from "openfl/utils/ByteArray";
import { ISFSArray } from "./ISFSArray";
import { SFSDataWrapper } from "./SFSDataWrapper";

/**
 * ISFSObject - Interface for SmartFoxServer object data.
 */
export interface ISFSObject {
    isNull(key: string): boolean;
    containsKey(key: string): boolean;
    removeElement(key: string): void;
    getKeys(): Array<string>;
    size(): number;
    toBinary(): ByteArray;
    toObject(): any;
    getDump(prettyPrint?: boolean): string;
    getHexDump(): string;
    getData(key: string): SFSDataWrapper;

    getBool(key: string): boolean;
    getByte(key: string): number;
    getUnsignedByte(key: string): number;
    getShort(key: string): number;
    getInt(key: string): number;
    getLong(key: string): number;
    getFloat(key: string): number;
    getDouble(key: string): number;
    getUtfString(key: string): string;
    getBoolArray(key: string): Array<boolean>;
    getByteArray(key: string): ByteArray;
    getUnsignedByteArray(key: string): Array<number>;
    getShortArray(key: string): Array<number>;
    getIntArray(key: string): Array<number>;
    getLongArray(key: string): Array<number>;
    getFloatArray(key: string): Array<number>;
    getDoubleArray(key: string): Array<number>;
    getUtfStringArray(key: string): Array<string>;
    getSFSArray(key: string): ISFSArray;
    getSFSObject(key: string): ISFSObject;
    getClass(key: string): any;

    putNull(key: string): void;
    putBool(key: string, value: boolean): void;
    putByte(key: string, value: number): void;
    putShort(key: string, value: number): void;
    putInt(key: string, value: number): void;
    putLong(key: string, value: number): void;
    putFloat(key: string, value: number): void;
    putDouble(key: string, value: number): void;
    putUtfString(key: string, value: string): void;
    putBoolArray(key: string, value: Array<boolean>): void;
    putByteArray(key: string, value: ByteArray): void;
    putShortArray(key: string, value: Array<number>): void;
    putIntArray(key: string, value: Array<number>): void;
    putLongArray(key: string, value: Array<number>): void;
    putFloatArray(key: string, value: Array<number>): void;
    putDoubleArray(key: string, value: Array<number>): void;
    putUtfStringArray(key: string, value: Array<string>): void;
    putSFSArray(key: string, value: ISFSArray): void;
    putSFSObject(key: string, value: ISFSObject): void;
    putClass(key: string, value: any): void;
    put(key: string, wrapper: SFSDataWrapper): void;
}
