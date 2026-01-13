import ByteArray from "openfl/utils/ByteArray";
import { ISFSArray } from "../../entities/data/ISFSArray";
import { ISFSObject } from "../../entities/data/ISFSObject";
import { SFSArray } from "../../entities/data/SFSArray";
import { SFSDataType } from "../../entities/data/SFSDataType";
import { SFSDataWrapper } from "../../entities/data/SFSDataWrapper";
import { SFSObject } from "../../entities/data/SFSObject";
import { SFSCodecError } from "../../exceptions/SFSCodecError";
import { ISFSDataSerializer } from "./ISFSDataSerializer";

// Note: SerializableSFSType interface not available in TypeScript
// Class serialization features are simplified

/**
 * DefaultSFSDataSerializer - Singleton serializer for SFS data.
 */
export class DefaultSFSDataSerializer implements ISFSDataSerializer {
    private static readonly CLASS_MARKER_KEY: string = "$C";
    private static readonly CLASS_FIELDS_KEY: string = "$F";
    private static readonly FIELD_NAME_KEY: string = "N";
    private static readonly FIELD_VALUE_KEY: string = "V";

    private static _instance: DefaultSFSDataSerializer | null = null;

    private constructor() {}

    public static getInstance(): DefaultSFSDataSerializer {
        if (DefaultSFSDataSerializer._instance === null) {
            DefaultSFSDataSerializer._instance = new DefaultSFSDataSerializer();
        }
        return DefaultSFSDataSerializer._instance;
    }

    public object2binary(obj: ISFSObject): ByteArray {
        const buffer = new ByteArray();
        buffer.writeByte(SFSDataType.SFS_OBJECT);
        buffer.writeShort(obj.size());
        return this.obj2bin(obj, buffer);
    }

    private obj2bin(obj: ISFSObject, buffer: ByteArray): ByteArray {
        const keys = obj.getKeys();
        for (const key of keys) {
            const wrapper = obj.getData(key);
            this.encodeSFSObjectKey(buffer, key);
            this.encodeObject(buffer, wrapper.type, wrapper.data);
        }
        return buffer;
    }

    public array2binary(arr: ISFSArray): ByteArray {
        const buffer = new ByteArray();
        buffer.writeByte(SFSDataType.SFS_ARRAY);
        buffer.writeShort(arr.size());
        return this.arr2bin(arr, buffer);
    }

    private arr2bin(arr: ISFSArray, buffer: ByteArray): ByteArray {
        for (let i = 0; i < arr.size(); i++) {
            const wrapper = arr.getWrappedElementAt(i);
            this.encodeObject(buffer, wrapper.type, wrapper.data);
        }
        return buffer;
    }

    public binary2object(data: ByteArray): ISFSObject {
        if (data.length < 3) {
            throw new SFSCodecError("Can't decode an SFSObject. Byte data is insufficient. Size: " + data.length + " byte(s)");
        }
        data.position = 0;
        return this.decodeSFSObject(data);
    }

    private decodeSFSObject(buffer: ByteArray): ISFSObject {
        const sfsObject = SFSObject.newInstance();
        const headerByte = buffer.readByte();
        if (headerByte !== SFSDataType.SFS_OBJECT) {
            throw new SFSCodecError("Invalid SFSDataType. Expected: " + SFSDataType.SFS_OBJECT + ", found: " + headerByte);
        }
        const size = buffer.readShort();
        if (size < 0) {
            throw new SFSCodecError("Can't decode SFSObject. Size is negative: " + size);
        }
        for (let i = 0; i < size; i++) {
            const key = buffer.readUTF();
            const decodedObject = this.decodeObject(buffer);
            if (decodedObject === null) {
                throw new SFSCodecError("Could not decode value for SFSObject with key: " + key);
            }
            sfsObject.put(key, decodedObject);
        }
        return sfsObject;
    }

    public binary2array(data: ByteArray): ISFSArray {
        if (data.length < 3) {
            throw new SFSCodecError("Can't decode an SFSArray. Byte data is insufficient. Size: " + data.length + " byte(s)");
        }
        data.position = 0;
        return this.decodeSFSArray(data);
    }

    private decodeSFSArray(buffer: ByteArray): ISFSArray {
        const sfsArray = SFSArray.newInstance();
        const headerByte = buffer.readByte();
        if (headerByte !== SFSDataType.SFS_ARRAY) {
            throw new SFSCodecError("Invalid SFSDataType. Expected: " + SFSDataType.SFS_ARRAY + ", found: " + headerByte);
        }
        const size = buffer.readShort();
        if (size < 0) {
            throw new SFSCodecError("Can't decode SFSArray. Size is negative: " + size);
        }
        for (let i = 0; i < size; i++) {
            const decodedObject = this.decodeObject(buffer);
            if (decodedObject === null) {
                throw new SFSCodecError("Could not decode SFSArray item at index: " + i);
            }
            sfsArray.add(decodedObject);
        }
        return sfsArray;
    }

    private decodeObject(buffer: ByteArray): SFSDataWrapper | null {
        let wrapper: SFSDataWrapper | null = null;
        const typeId = buffer.readByte();

        if (typeId === SFSDataType.NULL) {
            wrapper = this.binDecode_NULL(buffer);
        } else if (typeId === SFSDataType.BOOL) {
            wrapper = this.binDecode_BOOL(buffer);
        } else if (typeId === SFSDataType.BOOL_ARRAY) {
            wrapper = this.binDecode_BOOL_ARRAY(buffer);
        } else if (typeId === SFSDataType.BYTE) {
            wrapper = this.binDecode_BYTE(buffer);
        } else if (typeId === SFSDataType.BYTE_ARRAY) {
            wrapper = this.binDecode_BYTE_ARRAY(buffer);
        } else if (typeId === SFSDataType.SHORT) {
            wrapper = this.binDecode_SHORT(buffer);
        } else if (typeId === SFSDataType.SHORT_ARRAY) {
            wrapper = this.binDecode_SHORT_ARRAY(buffer);
        } else if (typeId === SFSDataType.INT) {
            wrapper = this.binDecode_INT(buffer);
        } else if (typeId === SFSDataType.INT_ARRAY) {
            wrapper = this.binDecode_INT_ARRAY(buffer);
        } else if (typeId === SFSDataType.LONG) {
            wrapper = this.binDecode_LONG(buffer);
        } else if (typeId === SFSDataType.LONG_ARRAY) {
            wrapper = this.binDecode_LONG_ARRAY(buffer);
        } else if (typeId === SFSDataType.FLOAT) {
            wrapper = this.binDecode_FLOAT(buffer);
        } else if (typeId === SFSDataType.FLOAT_ARRAY) {
            wrapper = this.binDecode_FLOAT_ARRAY(buffer);
        } else if (typeId === SFSDataType.DOUBLE) {
            wrapper = this.binDecode_DOUBLE(buffer);
        } else if (typeId === SFSDataType.DOUBLE_ARRAY) {
            wrapper = this.binDecode_DOUBLE_ARRAY(buffer);
        } else if (typeId === SFSDataType.UTF_STRING) {
            wrapper = this.binDecode_UTF_STRING(buffer);
        } else if (typeId === SFSDataType.UTF_STRING_ARRAY) {
            wrapper = this.binDecode_UTF_STRING_ARRAY(buffer);
        } else if (typeId === SFSDataType.SFS_ARRAY) {
            buffer.position--;
            wrapper = new SFSDataWrapper(SFSDataType.SFS_ARRAY, this.decodeSFSArray(buffer));
        } else if (typeId === SFSDataType.SFS_OBJECT) {
            buffer.position--;
            const sfsObj = this.decodeSFSObject(buffer);
            let dataType = SFSDataType.SFS_OBJECT;
            let data: any = sfsObj;
            // Class marker handling simplified - direct object returned
            if (sfsObj.containsKey(DefaultSFSDataSerializer.CLASS_MARKER_KEY) && 
                sfsObj.containsKey(DefaultSFSDataSerializer.CLASS_FIELDS_KEY)) {
                dataType = SFSDataType.CLASS;
                data = this.sfsObjectToGenericObject(sfsObj);
            }
            wrapper = new SFSDataWrapper(dataType, data);
        } else {
            throw new Error("Unknown SFSDataType ID: " + typeId);
        }
        return wrapper;
    }

    private encodeObject(buffer: ByteArray, typeId: number, data: any): ByteArray {
        switch (typeId) {
            case SFSDataType.NULL:
                return this.binEncode_NULL(buffer);
            case SFSDataType.BOOL:
                return this.binEncode_BOOL(buffer, data as boolean);
            case SFSDataType.BYTE:
                return this.binEncode_BYTE(buffer, data as number);
            case SFSDataType.SHORT:
                return this.binEncode_SHORT(buffer, data as number);
            case SFSDataType.INT:
                return this.binEncode_INT(buffer, data as number);
            case SFSDataType.LONG:
                return this.binEncode_LONG(buffer, data as number);
            case SFSDataType.FLOAT:
                return this.binEncode_FLOAT(buffer, data as number);
            case SFSDataType.DOUBLE:
                return this.binEncode_DOUBLE(buffer, data as number);
            case SFSDataType.UTF_STRING:
                return this.binEncode_UTF_STRING(buffer, data as string);
            case SFSDataType.BOOL_ARRAY:
                return this.binEncode_BOOL_ARRAY(buffer, data as Array<boolean>);
            case SFSDataType.BYTE_ARRAY:
                return this.binEncode_BYTE_ARRAY(buffer, data as ByteArray);
            case SFSDataType.SHORT_ARRAY:
                return this.binEncode_SHORT_ARRAY(buffer, data as Array<number>);
            case SFSDataType.INT_ARRAY:
                return this.binEncode_INT_ARRAY(buffer, data as Array<number>);
            case SFSDataType.LONG_ARRAY:
                return this.binEncode_LONG_ARRAY(buffer, data as Array<number>);
            case SFSDataType.FLOAT_ARRAY:
                return this.binEncode_FLOAT_ARRAY(buffer, data as Array<number>);
            case SFSDataType.DOUBLE_ARRAY:
                return this.binEncode_DOUBLE_ARRAY(buffer, data as Array<number>);
            case SFSDataType.UTF_STRING_ARRAY:
                return this.binEncode_UTF_STRING_ARRAY(buffer, data as Array<string>);
            case SFSDataType.SFS_ARRAY:
                return this.addData(buffer, this.array2binary(data as SFSArray));
            case SFSDataType.SFS_OBJECT:
                return this.addData(buffer, this.object2binary(data as SFSObject));
            case SFSDataType.CLASS:
                return this.addData(buffer, this.object2binary(this.genericObjectToSFSObject(data)));
            default:
                throw new SFSCodecError("Unrecognized type in SFSObject serialization: " + typeId);
        }
    }

    // Decode methods
    private binDecode_NULL(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.NULL, null);
    }

    private binDecode_BOOL(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.BOOL, buffer.readBoolean());
    }

    private binDecode_BYTE(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.BYTE, buffer.readByte());
    }

    private binDecode_SHORT(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.SHORT, buffer.readShort());
    }

    private binDecode_INT(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.INT, buffer.readInt());
    }

    private binDecode_LONG(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.LONG, this.decodeLongValue(buffer));
    }

    private decodeLongValue(buffer: ByteArray): number {
        const high = buffer.readInt();
        const low = buffer.readUnsignedInt();
        return high * Math.pow(2, 32) + low;
    }

    private encodeLongValue(value: number, buffer: ByteArray): void {
        let high = 0;
        let low = 0;
        if (value > -1) {
            high = Math.floor(value / Math.pow(2, 32));
            low = value % Math.pow(2, 32);
        } else {
            const absVal = Math.abs(value);
            const adjusted = absVal - 1;
            high = ~Math.floor(adjusted / Math.pow(2, 32));
            low = ~(adjusted % Math.pow(2, 32));
        }
        buffer.writeUnsignedInt(high);
        buffer.writeUnsignedInt(low);
    }

    private binDecode_FLOAT(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.FLOAT, buffer.readFloat());
    }

    private binDecode_DOUBLE(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.DOUBLE, buffer.readDouble());
    }

    private binDecode_UTF_STRING(buffer: ByteArray): SFSDataWrapper {
        return new SFSDataWrapper(SFSDataType.UTF_STRING, buffer.readUTF());
    }

    private binDecode_BOOL_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<boolean> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readBoolean());
        }
        return new SFSDataWrapper(SFSDataType.BOOL_ARRAY, arr);
    }

    private binDecode_BYTE_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = buffer.readInt();
        if (size < 0) {
            throw new SFSCodecError("Array negative size: " + size);
        }
        const arr = new ByteArray();
        buffer.readBytes(arr, 0, size);
        return new SFSDataWrapper(SFSDataType.BYTE_ARRAY, arr);
    }

    private binDecode_SHORT_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<number> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readShort());
        }
        return new SFSDataWrapper(SFSDataType.SHORT_ARRAY, arr);
    }

    private binDecode_INT_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<number> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readInt());
        }
        return new SFSDataWrapper(SFSDataType.INT_ARRAY, arr);
    }

    private binDecode_LONG_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<number> = [];
        for (let i = 0; i < size; i++) {
            arr.push(this.decodeLongValue(buffer));
        }
        return new SFSDataWrapper(SFSDataType.LONG_ARRAY, arr);
    }

    private binDecode_FLOAT_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<number> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readFloat());
        }
        return new SFSDataWrapper(SFSDataType.FLOAT_ARRAY, arr);
    }

    private binDecode_DOUBLE_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<number> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readDouble());
        }
        return new SFSDataWrapper(SFSDataType.DOUBLE_ARRAY, arr);
    }

    private binDecode_UTF_STRING_ARRAY(buffer: ByteArray): SFSDataWrapper {
        const size = this.getTypedArraySize(buffer);
        const arr: Array<string> = [];
        for (let i = 0; i < size; i++) {
            arr.push(buffer.readUTF());
        }
        return new SFSDataWrapper(SFSDataType.UTF_STRING_ARRAY, arr);
    }

    private getTypedArraySize(buffer: ByteArray): number {
        const size = buffer.readShort();
        if (size < 0) {
            throw new SFSCodecError("Array negative size: " + size);
        }
        return size;
    }

    // Encode methods
    private binEncode_NULL(buffer: ByteArray): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(0);
        return this.addData(buffer, temp);
    }

    private binEncode_BOOL(buffer: ByteArray, value: boolean): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.BOOL);
        temp.writeBoolean(value);
        return this.addData(buffer, temp);
    }

    private binEncode_BYTE(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.BYTE);
        temp.writeByte(value);
        return this.addData(buffer, temp);
    }

    private binEncode_SHORT(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.SHORT);
        temp.writeShort(value);
        return this.addData(buffer, temp);
    }

    private binEncode_INT(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.INT);
        temp.writeInt(value);
        return this.addData(buffer, temp);
    }

    private binEncode_LONG(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.LONG);
        this.encodeLongValue(value, temp);
        return this.addData(buffer, temp);
    }

    private binEncode_FLOAT(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.FLOAT);
        temp.writeFloat(value);
        return this.addData(buffer, temp);
    }

    private binEncode_DOUBLE(buffer: ByteArray, value: number): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.DOUBLE);
        temp.writeDouble(value);
        return this.addData(buffer, temp);
    }

    private binEncode_UTF_STRING(buffer: ByteArray, value: string): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.UTF_STRING);
        temp.writeUTF(value);
        return this.addData(buffer, temp);
    }

    private binEncode_BOOL_ARRAY(buffer: ByteArray, arr: Array<boolean>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.BOOL_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeBoolean(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_BYTE_ARRAY(buffer: ByteArray, arr: ByteArray): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.BYTE_ARRAY);
        temp.writeInt(arr.length);
        temp.writeBytes(arr, 0, arr.length);
        return this.addData(buffer, temp);
    }

    private binEncode_SHORT_ARRAY(buffer: ByteArray, arr: Array<number>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.SHORT_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeShort(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_INT_ARRAY(buffer: ByteArray, arr: Array<number>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.INT_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeInt(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_LONG_ARRAY(buffer: ByteArray, arr: Array<number>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.LONG_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            this.encodeLongValue(arr[i], temp);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_FLOAT_ARRAY(buffer: ByteArray, arr: Array<number>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.FLOAT_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeFloat(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_DOUBLE_ARRAY(buffer: ByteArray, arr: Array<number>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.DOUBLE_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeDouble(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private binEncode_UTF_STRING_ARRAY(buffer: ByteArray, arr: Array<string>): ByteArray {
        const temp = new ByteArray();
        temp.writeByte(SFSDataType.UTF_STRING_ARRAY);
        temp.writeShort(arr.length);
        for (let i = 0; i < arr.length; i++) {
            temp.writeUTF(arr[i]);
        }
        return this.addData(buffer, temp);
    }

    private encodeSFSObjectKey(buffer: ByteArray, key: string): ByteArray {
        buffer.writeUTF(key);
        return buffer;
    }

    private addData(buffer: ByteArray, data: ByteArray): ByteArray {
        buffer.writeBytes(data, 0, data.length);
        return buffer;
    }

    // Generic object conversion methods
    public genericObjectToSFSObject(obj: Object, treatIntAsDouble: boolean = false): SFSObject {
        const sfsObj = new SFSObject();
        this._scanGenericObject(obj, sfsObj, treatIntAsDouble);
        return sfsObj;
    }

    private _scanGenericObject(obj: any, sfsObj: ISFSObject, treatIntAsDouble: boolean = false): void {
        for (const key in obj) {
            const value = obj[key];
            if (value === null || value === undefined) {
                sfsObj.putNull(key);
            } else if (typeof value === "object" && !Array.isArray(value)) {
                const nestedObj = new SFSObject();
                sfsObj.putSFSObject(key, nestedObj);
                this._scanGenericObject(value, nestedObj, treatIntAsDouble);
            } else if (Array.isArray(value)) {
                sfsObj.putSFSArray(key, this.genericArrayToSFSArray(value, treatIntAsDouble));
            } else if (typeof value === "boolean") {
                sfsObj.putBool(key, value);
            } else if (typeof value === "number") {
                if (Number.isInteger(value) && !treatIntAsDouble) {
                    sfsObj.putInt(key, value);
                } else {
                    sfsObj.putDouble(key, value);
                }
            } else if (typeof value === "string") {
                sfsObj.putUtfString(key, value);
            }
        }
    }

    public sfsObjectToGenericObject(sfsObj: ISFSObject): Object {
        const obj: any = {};
        this._scanSFSObject(sfsObj, obj);
        return obj;
    }

    private _scanSFSObject(sfsObj: ISFSObject, obj: any): void {
        const keys = sfsObj.getKeys();
        for (const key of keys) {
            const wrapper = sfsObj.getData(key);
            if (wrapper.type === SFSDataType.NULL) {
                obj[key] = null;
            } else if (wrapper.type === SFSDataType.SFS_OBJECT) {
                const nested: any = {};
                obj[key] = nested;
                this._scanSFSObject(wrapper.data as ISFSObject, nested);
            } else if (wrapper.type === SFSDataType.SFS_ARRAY) {
                obj[key] = (wrapper.data as SFSArray).toArray();
            } else if (wrapper.type !== SFSDataType.CLASS) {
                obj[key] = wrapper.data;
            }
        }
    }

    public genericArrayToSFSArray(arr: Array<any>, treatIntAsDouble: boolean = false): SFSArray {
        const sfsArr = new SFSArray();
        this._scanGenericArray(arr, sfsArr, treatIntAsDouble);
        return sfsArr;
    }

    private _scanGenericArray(arr: Array<any>, sfsArr: ISFSArray, treatIntAsDouble: boolean = false): void {
        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];
            if (value === null || value === undefined) {
                sfsArr.addNull();
            } else if (typeof value === "object" && !Array.isArray(value)) {
                sfsArr.addSFSObject(this.genericObjectToSFSObject(value, treatIntAsDouble));
            } else if (Array.isArray(value)) {
                const nested = new SFSArray();
                sfsArr.addSFSArray(nested);
                this._scanGenericArray(value, nested, treatIntAsDouble);
            } else if (typeof value === "boolean") {
                sfsArr.addBool(value);
            } else if (typeof value === "number") {
                if (Number.isInteger(value) && !treatIntAsDouble) {
                    sfsArr.addInt(value);
                } else {
                    sfsArr.addDouble(value);
                }
            } else if (typeof value === "string") {
                sfsArr.addUtfString(value);
            }
        }
    }

    public sfsArrayToGenericArray(sfsArr: ISFSArray): Array<any> {
        const arr: Array<any> = [];
        this._scanSFSArray(sfsArr, arr);
        return arr;
    }

    private _scanSFSArray(sfsArr: ISFSArray, arr: Array<any>): void {
        for (let i = 0; i < sfsArr.size(); i++) {
            const wrapper = sfsArr.getWrappedElementAt(i);
            if (wrapper.type === SFSDataType.NULL) {
                arr[i] = null;
            } else if (wrapper.type === SFSDataType.SFS_OBJECT) {
                arr[i] = (wrapper.data as SFSObject).toObject();
            } else if (wrapper.type === SFSDataType.SFS_ARRAY) {
                const nested: Array<any> = [];
                arr[i] = nested;
                this._scanSFSArray(wrapper.data as ISFSArray, nested);
            } else if (wrapper.type !== SFSDataType.CLASS) {
                arr[i] = wrapper.data;
            }
        }
    }
}
