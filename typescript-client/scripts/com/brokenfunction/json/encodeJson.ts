import ByteArray from "openfl/utils/ByteArray";
import Endian from "openfl/utils/Endian";

/**
 * encodeJson - Fast JSON encoder using ByteArray output.
 * Based on brokenfunction's implementation.
 */
let _result: any = null;
let _blockNonFiniteNumbers: boolean = false;
const _tempBytes: ByteArray = new ByteArray();

const charConvert: Array<number> = new Array(256);
let j = 0;
while (j < 10) { charConvert[j] = j + 48 | 808464384; j++; }
while (j < 16) { charConvert[j] = j + 55 | 808464384; j++; }
while (j < 26) { charConvert[j] = j + 32 | 808464640; j++; }
while (j < 32) { charConvert[j] = j + 39 | 808464640; j++; }
while (j < 256) { charConvert[j] = j; j++; }
charConvert[10] = 23662;  // \n
charConvert[13] = 23666;  // \r
charConvert[9] = 23668;   // \t
charConvert[8] = 23650;   // \b
charConvert[12] = 23654;  // \f
charConvert[34] = 23586;  // "
charConvert[92] = 23644;  // \
charConvert[127] = 808466246;

function parseArray(arr: Array<any>): void {
    _result.writeByte(91); // [
    const len = arr.length - 1;
    if (len >= 0) { for (let i = 0; i < len; i++) { parse[typeof arr[i]](arr[i]); _result.writeByte(44); } parse[typeof arr[len]](arr[len]); }
    _result.writeByte(93); // ]
}

function parseString(str: string): void {
    _result.writeByte(34); // "
    _tempBytes.position = 0;
    _tempBytes.length = 0;
    _tempBytes.writeUTFBytes(str);
    let i = 0, strLen = _tempBytes.length;
    for (let jj = 0; jj < strLen; jj++) {
        const char = charConvert[_tempBytes[jj]];
        if (char > 256) {
            if (jj > i) _result.writeBytes(_tempBytes, i, jj - i);
            if (char > 65536) { _result.writeShort(23669); _result.writeUnsignedInt(char); }
            else { _result.writeShort(char); }
            i = jj + 1;
        }
    }
    if (strLen > i) _result.writeBytes(_tempBytes, i, strLen - i);
    _result.writeByte(34); // "
}

const parse: Record<string, (value: any) => void> = {
    "object": function(obj: any): void {
        if (obj) {
            if (Array.isArray(obj)) { parseArray(obj); }
            else {
                _result.writeByte(123); // {
                let first = true;
                for (const key in obj) { if (first) first = false; else _result.writeByte(44); parseString(key); _result.writeByte(58); parse[typeof obj[key]](obj[key]); }
                _result.writeByte(125); // }
            }
        } else { _result.writeUnsignedInt(1853189228); } // null
    },
    "string": parseString,
    "number": function(n: number): void { if (_blockNonFiniteNumbers && !isFinite(n)) throw new Error("Number " + n + " is not encodable"); _result.writeUTFBytes(String(n)); },
    "boolean": function(b: boolean): void { if (b) _result.writeUnsignedInt(1953658213); else { _result.writeByte(102); _result.writeUnsignedInt(1634497381); } },
    "xml": function(xml: any): void { const str = xml.toXMLString ? xml.toXMLString() : null; if (str === null) throw new Error("unserializable XML object encountered"); parseString(str); },
    "undefined": function(_: any): void { _result.writeUnsignedInt(1853189228); }
};

export function encodeJson(input: any, writeTo: any = null, strictNumberSupport: boolean = false): string {
    _blockNonFiniteNumbers = strictNumberSupport;
    try {
        if (writeTo) {
            _result = writeTo;
            _result.endian = Endian.BIG_ENDIAN;
            parse[typeof input](input);
            _result.position = 0;
            return _result.readUTFBytes(_result.length);
        }
        switch (typeof input) {
            case "object": case "string": break;
            case "number": if (_blockNonFiniteNumbers && !isFinite(input as number)) throw new Error("Number " + input + " is not encodable"); return String(input);
            case "boolean": return input ? "true" : "false";
            case "undefined": return "null";
            default: throw new Error("Unexpected type \"" + typeof input + "\" encountered");
        }
        const byteOutput = new ByteArray();
        _result = byteOutput;
        _result.endian = Endian.BIG_ENDIAN;
        parse[typeof input](input);
        byteOutput.position = 0;
        return byteOutput.readUTFBytes(byteOutput.length);
    } catch (e: any) { if (e instanceof TypeError) throw new Error("Unexpected type encountered"); throw e; }
}
