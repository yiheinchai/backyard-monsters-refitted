import ByteArray from "openfl/utils/ByteArray";
import { SFSError } from "../../exceptions/SFSError";
import { DefaultObjectDumpFormatter } from "../../protocol/serialization/DefaultObjectDumpFormatter";
import { DefaultSFSDataSerializer } from "../../protocol/serialization/DefaultSFSDataSerializer";
import { ISFSDataSerializer } from "../../protocol/serialization/ISFSDataSerializer";
import { ISFSArray } from "./ISFSArray";
import { ISFSObject } from "./ISFSObject";
import { SFSDataType } from "./SFSDataType";
import { SFSDataWrapper } from "./SFSDataWrapper";
import { SFSObject } from "./SFSObject";

/**
 * SFSArray - Implementation of ISFSArray for ordered data storage.
 */
export class SFSArray implements ISFSArray {
    private serializer: ISFSDataSerializer;
    private dataHolder: Array<SFSDataWrapper>;

    constructor() {
        this.dataHolder = [];
        this.serializer = DefaultSFSDataSerializer.getInstance();
    }

    public static newFromArray(arr: Array<any>, recursive: boolean = false): SFSArray {
        return DefaultSFSDataSerializer.getInstance().genericArrayToSFSArray(arr, recursive);
    }

    public static newFromBinaryData(data: ByteArray): SFSArray {
        return DefaultSFSDataSerializer.getInstance().binary2array(data) as SFSArray;
    }

    public static newInstance(): SFSArray {
        return new SFSArray();
    }

    public contains(value: any): boolean {
        if (value && (typeof value.size === 'function' || typeof value.getKeys === 'function')) {
            throw new SFSError("ISFSArray and ISFSObject are not supported by this method.");
        }
        for (let i = 0; i < this.size(); i++) {
            const element = this.getElementAt(i);
            if (element !== null && element === value) {
                return true;
            }
        }
        return false;
    }

    public getWrappedElementAt(index: number): SFSDataWrapper {
        return this.dataHolder[index];
    }

    public getElementAt(index: number): any {
        if (this.dataHolder[index] !== undefined) {
            return this.dataHolder[index].data;
        }
        return null;
    }

    public removeElementAt(index: number): any {
        return this.dataHolder.splice(index, 1);
    }

    public size(): number {
        return this.dataHolder.length;
    }

    public toBinary(): ByteArray {
        return this.serializer.array2binary(this);
    }

    public toArray(): Array<any> {
        return DefaultSFSDataSerializer.getInstance().sfsArrayToGenericArray(this);
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
        for (let i = 0; i < this.dataHolder.length; i++) {
            const wrapper = this.dataHolder[i];
            const type = wrapper.type;
            let value: any;
            if (type === SFSDataType.SFS_OBJECT) {
                value = (wrapper.data as SFSObject).getDump(false);
            } else if (type === SFSDataType.SFS_ARRAY) {
                value = (wrapper.data as SFSArray).getDump(false);
            } else if (type > SFSDataType.UTF_STRING && type < SFSDataType.CLASS) {
                value = "[" + wrapper.data + "]";
            } else if (type === SFSDataType.BYTE_ARRAY) {
                value = DefaultObjectDumpFormatter.prettyPrintByteArray(wrapper.data as ByteArray);
            } else {
                value = wrapper.data;
            }
            output += "(" + SFSDataType.fromId(wrapper.type).toLowerCase() + ") ";
            output += value;
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

    public addNull(): void {
        this.addObject(null, SFSDataType.NULL);
    }

    public addBool(value: boolean): void {
        this.addObject(value, SFSDataType.BOOL);
    }

    public addByte(value: number): void {
        this.addObject(value, SFSDataType.BYTE);
    }

    public addShort(value: number): void {
        this.addObject(value, SFSDataType.SHORT);
    }

    public addInt(value: number): void {
        this.addObject(value, SFSDataType.INT);
    }

    public addLong(value: number): void {
        this.addObject(value, SFSDataType.LONG);
    }

    public addFloat(value: number): void {
        this.addObject(value, SFSDataType.FLOAT);
    }

    public addDouble(value: number): void {
        this.addObject(value, SFSDataType.DOUBLE);
    }

    public addUtfString(value: string): void {
        this.addObject(value, SFSDataType.UTF_STRING);
    }

    public addBoolArray(value: Array<boolean>): void {
        this.addObject(value, SFSDataType.BOOL_ARRAY);
    }

    public addByteArray(value: ByteArray): void {
        this.addObject(value, SFSDataType.BYTE_ARRAY);
    }

    public addShortArray(value: Array<number>): void {
        this.addObject(value, SFSDataType.SHORT_ARRAY);
    }

    public addIntArray(value: Array<number>): void {
        this.addObject(value, SFSDataType.INT_ARRAY);
    }

    public addLongArray(value: Array<number>): void {
        this.addObject(value, SFSDataType.LONG_ARRAY);
    }

    public addFloatArray(value: Array<number>): void {
        this.addObject(value, SFSDataType.FLOAT_ARRAY);
    }

    public addDoubleArray(value: Array<number>): void {
        this.addObject(value, SFSDataType.DOUBLE_ARRAY);
    }

    public addUtfStringArray(value: Array<string>): void {
        this.addObject(value, SFSDataType.UTF_STRING_ARRAY);
    }

    public addSFSArray(value: ISFSArray): void {
        this.addObject(value, SFSDataType.SFS_ARRAY);
    }

    public addSFSObject(value: ISFSObject): void {
        this.addObject(value, SFSDataType.SFS_OBJECT);
    }

    public addClass(value: any): void {
        this.addObject(value, SFSDataType.CLASS);
    }

    public add(wrapper: SFSDataWrapper): void {
        this.dataHolder.push(wrapper);
    }

    private addObject(value: any, type: number): void {
        this.add(new SFSDataWrapper(type, value));
    }

    public isNull(index: number): boolean {
        const wrapper = this.dataHolder[index];
        if (wrapper === undefined || wrapper.type === SFSDataType.NULL) {
            return true;
        }
        return false;
    }

    public getBool(index: number): boolean {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as boolean : false;
    }

    public getByte(index: number): number {
        return this.getInt(index);
    }

    public getUnsignedByte(index: number): number {
        return this.getInt(index) & 0xFF;
    }

    public getShort(index: number): number {
        return this.getInt(index);
    }

    public getInt(index: number): number {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as number : 0;
    }

    public getLong(index: number): number {
        return this.getDouble(index);
    }

    public getFloat(index: number): number {
        return this.getDouble(index);
    }

    public getDouble(index: number): number {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as number : 0;
    }

    public getUtfString(index: number): string {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as string : "";
    }

    private getArray(index: number): Array<any> | null {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as Array<any> : null;
    }

    public getBoolArray(index: number): Array<boolean> | null {
        return this.getArray(index) as Array<boolean> | null;
    }

    public getByteArray(index: number): ByteArray | null {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as ByteArray : null;
    }

    public getUnsignedByteArray(index: number): Array<number> | null {
        const byteArr = this.getByteArray(index);
        if (byteArr === null) {
            return null;
        }
        const result: Array<number> = [];
        byteArr.position = 0;
        for (let i = 0; i < byteArr.length; i++) {
            result.push(byteArr.readByte() & 0xFF);
        }
        return result;
    }

    public getShortArray(index: number): Array<number> | null {
        return this.getArray(index) as Array<number> | null;
    }

    public getIntArray(index: number): Array<number> | null {
        return this.getArray(index) as Array<number> | null;
    }

    public getLongArray(index: number): Array<number> | null {
        return this.getArray(index) as Array<number> | null;
    }

    public getFloatArray(index: number): Array<number> | null {
        return this.getArray(index) as Array<number> | null;
    }

    public getDoubleArray(index: number): Array<number> | null {
        return this.getArray(index) as Array<number> | null;
    }

    public getUtfStringArray(index: number): Array<string> | null {
        return this.getArray(index) as Array<string> | null;
    }

    public getSFSArray(index: number): ISFSArray | null {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as ISFSArray : null;
    }

    public getClass(index: number): any {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data : null;
    }

    public getSFSObject(index: number): ISFSObject | null {
        const wrapper = this.dataHolder[index];
        return wrapper !== undefined ? wrapper.data as ISFSObject : null;
    }
}
