import { ByteArray } from "openfl/utils/ByteArray";
import { DefaultObjectDumpFormatter } from "../../protocol/serialization/DefaultObjectDumpFormatter";
import { DefaultSFSDataSerializer } from "../../protocol/serialization/DefaultSFSDataSerializer";
import { ISFSDataSerializer } from "../../protocol/serialization/ISFSDataSerializer";
import { ISFSArray } from "./ISFSArray";
import { ISFSObject } from "./ISFSObject";
import { SFSDataType } from "./SFSDataType";
import { SFSDataWrapper } from "./SFSDataWrapper";

/**
 * SFSObject - Implementation of ISFSObject for structured data storage.
 */
export class SFSObject implements ISFSObject {
    private dataHolder: { [key: string]: SFSDataWrapper };
    private serializer: ISFSDataSerializer;

    constructor() {
        this.dataHolder = {};
        this.serializer = DefaultSFSDataSerializer.getInstance();
    }

    public static newFromObject(obj: Object, recursive: boolean = false): SFSObject {
        return DefaultSFSDataSerializer.getInstance().genericObjectToSFSObject(obj, recursive);
    }

    public static newFromBinaryData(data: ByteArray): SFSObject {
        return DefaultSFSDataSerializer.getInstance().binary2object(data) as SFSObject;
    }

    public static newInstance(): SFSObject {
        return new SFSObject();
    }

    public isNull(key: string): boolean {
        const wrapper = this.dataHolder[key];
        if (wrapper === undefined) {
            return true;
        }
        return wrapper.data === null;
    }

    public containsKey(key: string): boolean {
        return this.dataHolder.hasOwnProperty(key);
    }

    public removeElement(key: string): void {
        delete this.dataHolder[key];
    }

    public getKeys(): Array<string> {
        const keys: Array<string> = [];
        for (const key in this.dataHolder) {
            keys.push(key);
        }
        return keys;
    }

    public size(): number {
        let count = 0;
        for (const key in this.dataHolder) {
            count++;
        }
        return count;
    }

    public toBinary(): ByteArray {
        return this.serializer.object2binary(this);
    }

    public toObject(): Object {
        return DefaultSFSDataSerializer.getInstance().sfsObjectToGenericObject(this);
    }

    public getDump(format: boolean = true): string {
        if (!format) {
            return this.dump();
        }
        try {
            return DefaultObjectDumpFormatter.prettyPrintDump(this.dump());
        } catch (err) {
            return "Unable to provide a dump of this object";
        }
    }

    private dump(): string {
        let output = DefaultObjectDumpFormatter.TOKEN_INDENT_OPEN;
        for (const key in this.dataHolder) {
            const wrapper = this.getData(key);
            const type = wrapper.type;
            output += "(" + SFSDataType.fromId(wrapper.type).toLowerCase() + ")";
            output += " " + key + ": ";
            if (type === SFSDataType.SFS_OBJECT) {
                output += (wrapper.data as SFSObject).getDump(false);
            } else if (type === SFSDataType.SFS_ARRAY) {
                output += (wrapper.data as ISFSArray).getDump(false);
            } else if (type === SFSDataType.BYTE_ARRAY) {
                output += DefaultObjectDumpFormatter.prettyPrintByteArray(wrapper.data as ByteArray);
            } else if (type > SFSDataType.UTF_STRING && type < SFSDataType.CLASS) {
                output += "[" + wrapper.data + "]";
            } else {
                output += wrapper.data;
            }
            output += DefaultObjectDumpFormatter.TOKEN_DIVIDER;
        }
        if (this.size() > 0) {
            output = output.slice(0, output.length - 1);
        }
        return output + DefaultObjectDumpFormatter.TOKEN_INDENT_CLOSE;
    }

    public getHexDump(): string {
        return DefaultObjectDumpFormatter.hexDump(this.toBinary());
    }

    public getData(key: string): SFSDataWrapper {
        return this.dataHolder[key];
    }

    public getBool(key: string): boolean {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as boolean;
        }
        return false;
    }

    public getByte(key: string): number {
        return this.getInt(key);
    }

    public getUnsignedByte(key: string): number {
        return this.getInt(key) & 0xFF;
    }

    public getShort(key: string): number {
        return this.getInt(key);
    }

    public getInt(key: string): number {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as number;
        }
        return 0;
    }

    public getLong(key: string): number {
        return this.getDouble(key);
    }

    public getFloat(key: string): number {
        return this.getDouble(key);
    }

    public getDouble(key: string): number {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as number;
        }
        return 0;
    }

    public getUtfString(key: string): string {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as string;
        }
        return "";
    }

    private getArray(key: string): Array<any> | null {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as Array<any>;
        }
        return null;
    }

    public getBoolArray(key: string): Array<boolean> | null {
        return this.getArray(key) as Array<boolean> | null;
    }

    public getByteArray(key: string): ByteArray | null {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as ByteArray;
        }
        return null;
    }

    public getUnsignedByteArray(key: string): Array<number> | null {
        const byteArr = this.getByteArray(key);
        if (byteArr === null) {
            return null;
        }
        byteArr.position = 0;
        const result: Array<number> = [];
        for (let i = 0; i < byteArr.length; i++) {
            result.push(byteArr.readByte() & 0xFF);
        }
        return result;
    }

    public getShortArray(key: string): Array<number> | null {
        return this.getArray(key) as Array<number> | null;
    }

    public getIntArray(key: string): Array<number> | null {
        return this.getArray(key) as Array<number> | null;
    }

    public getLongArray(key: string): Array<number> | null {
        return this.getArray(key) as Array<number> | null;
    }

    public getFloatArray(key: string): Array<number> | null {
        return this.getArray(key) as Array<number> | null;
    }

    public getDoubleArray(key: string): Array<number> | null {
        return this.getArray(key) as Array<number> | null;
    }

    public getUtfStringArray(key: string): Array<string> | null {
        return this.getArray(key) as Array<string> | null;
    }

    public getSFSArray(key: string): ISFSArray | null {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as ISFSArray;
        }
        return null;
    }

    public getSFSObject(key: string): ISFSObject | null {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data as ISFSObject;
        }
        return null;
    }

    public getClass(key: string): any {
        const wrapper = this.dataHolder[key];
        if (wrapper !== undefined) {
            return wrapper.data;
        }
        return null;
    }

    public putNull(key: string): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.NULL, null);
    }

    public putBool(key: string, value: boolean): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.BOOL, value);
    }

    public putByte(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.BYTE, value);
    }

    public putShort(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.SHORT, value);
    }

    public putInt(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.INT, value);
    }

    public putLong(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.LONG, value);
    }

    public putFloat(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.FLOAT, value);
    }

    public putDouble(key: string, value: number): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.DOUBLE, value);
    }

    public putUtfString(key: string, value: string): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.UTF_STRING, value);
    }

    public putBoolArray(key: string, value: Array<boolean>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.BOOL_ARRAY, value);
    }

    public putByteArray(key: string, value: ByteArray): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.BYTE_ARRAY, value);
    }

    public putShortArray(key: string, value: Array<number>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.SHORT_ARRAY, value);
    }

    public putIntArray(key: string, value: Array<number>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.INT_ARRAY, value);
    }

    public putLongArray(key: string, value: Array<number>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.LONG_ARRAY, value);
    }

    public putFloatArray(key: string, value: Array<number>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.FLOAT_ARRAY, value);
    }

    public putDoubleArray(key: string, value: Array<number>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.DOUBLE_ARRAY, value);
    }

    public putUtfStringArray(key: string, value: Array<string>): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.UTF_STRING_ARRAY, value);
    }

    public putSFSArray(key: string, value: ISFSArray): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.SFS_ARRAY, value);
    }

    public putSFSObject(key: string, value: ISFSObject): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.SFS_OBJECT, value);
    }

    public putClass(key: string, value: any): void {
        this.dataHolder[key] = new SFSDataWrapper(SFSDataType.CLASS, value);
    }

    public put(key: string, value: SFSDataWrapper): void {
        this.dataHolder[key] = value;
    }
}
