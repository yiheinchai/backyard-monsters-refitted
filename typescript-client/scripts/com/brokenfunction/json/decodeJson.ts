import ByteArray from "openfl/utils/ByteArray";

/**
 * decodeJson - Fast JSON decoder using ByteArray parsing.
 * Based on brokenfunction's implementation.
 */
let _position: number = 0;
let _byteInput: ByteArray | null = null;

const charConvert: Array<number> = new Array(256).fill(0);
charConvert[34] = 34;   // "
charConvert[92] = 92;   // \
charConvert[47] = 47;   // /
charConvert[98] = 8;    // b -> backspace
charConvert[102] = 12;  // f -> form feed
charConvert[110] = 10;  // n -> newline
charConvert[114] = 13;  // r -> carriage return
charConvert[116] = 9;   // t -> tab

const isNumberChar: Array<number> = new Array(256).fill(0);
[43, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 69, 101].forEach(c => isNumberChar[c] = 1);

const stringHelper: Array<number> = new Array(256).fill(1);
stringHelper[34] = 0; // "
stringHelper[92] = 0; // \

const isWhitespace: Array<number> = new Array(256).fill(0);
isWhitespace[9] = 1;  // tab
isWhitespace[10] = 1; // newline
isWhitespace[13] = 1; // carriage return
isWhitespace[32] = 1; // space

function parseNumber(): number {
    if (_position === 1) { _byteInput!.position = 0; return parseFloat(_byteInput!.readUTFBytes(_byteInput!.length)); }
    _byteInput!.position = _position - 1;
    while (isNumberChar[_byteInput![_position++]]) { }
    return Number(_byteInput!.readUTFBytes(_position-- - _byteInput!.position - 1));
}

function parseWhitespace(): any {
    while (isWhitespace[_byteInput![_position]]) _position++;
    return parse[_byteInput![_position++]]();
}

function parseStringEscaped(str: string): string {
    let char: number;
    while (true) {
        char = _byteInput![_position++];
        if (char === 117) { // u - unicode
            _byteInput!.position = _position;
            char = parseInt(_byteInput!.readUTFBytes(4), 16);
            _position += 4;
        } else {
            if (!(char = charConvert[char])) break;
            _byteInput!.position = _position;
        }
        str = str + String.fromCharCode(char);
        while (stringHelper[_byteInput![_position++]]) { }
        if (_position - 1 > _byteInput!.position) str = str + _byteInput!.readUTFBytes(_position - 1 - _byteInput!.position);
        if (_byteInput![_position - 1] !== 92) return str;
    }
    throw new Error("Unknown escaped character encountered at position " + (_position - 1));
}

const parse: Record<number, () => any> = {
    34: function(): string { // "
        if (stringHelper[_byteInput![_position++]]) {
            _byteInput!.position = _position - 1;
            while (stringHelper[_byteInput![_position++]]) { }
            if (_byteInput![_position - 1] === 92) return parseStringEscaped(_byteInput!.readUTFBytes(_position - 1 - _byteInput!.position));
            return _byteInput!.readUTFBytes(_position - 1 - _byteInput!.position);
        }
        if (_byteInput![_position - 1] === 92) return parseStringEscaped("");
        return "";
    },
    123: function(): any { // {
        while (isWhitespace[_byteInput![_position]]) _position++;
        if (_byteInput![_position] === 125) { _position++; return {}; }
        const obj: Record<string, any> = {};
        while (true) {
            let key: string;
            do {
                key = parse[_byteInput![_position++]]();
                if (_byteInput![_position] !== 58) { while (isWhitespace[_byteInput![_position]]) _position++; if (_byteInput![_position++] !== 58) throw new Error("Expected : at " + (_position - 1)); }
                else _position++;
                obj[key] = parse[_byteInput![_position++]]();
            } while (_byteInput![_position++] === 44);
            if (_byteInput![_position - 1] === 125) break;
            while (isWhitespace[_byteInput![_position]]) _position++;
            if (_byteInput![_position++] !== 44) { if (_byteInput![_position - 1] !== 125) throw new Error("Expected , or } at " + (_position - 1)); return obj; }
        }
        return obj;
    },
    91: function(): any { // [
        while (isWhitespace[_byteInput![_position]]) _position++;
        if (_byteInput![_position] === 93) { _position++; return []; }
        const arr: Array<any> = [];
        while (true) {
            do { arr[arr.length] = parse[_byteInput![_position++]](); } while (_byteInput![_position++] === 44);
            if (_byteInput![_position - 1] === 93) break;
            _position--;
            while (isWhitespace[_byteInput![_position]]) _position++;
            if (_byteInput![_position++] !== 44) { if (_byteInput![_position - 1] !== 93) throw new Error("Expected , or ] at " + (_position - 1)); return arr; }
        }
        return arr;
    },
    116: function(): boolean { if (_byteInput![_position] === 114 && _byteInput![_position + 1] === 117 && _byteInput![_position + 2] === 101) { _position += 3; return true; } throw new Error("Expected \"true\" at position " + _position); },
    102: function(): boolean { if (_byteInput![_position] === 97 && _byteInput![_position + 1] === 108 && _byteInput![_position + 2] === 115 && _byteInput![_position + 3] === 101) { _position += 4; return false; } throw new Error("Expected \"false\" at position " + (_position - 1)); },
    110: function(): null { if (_byteInput![_position] === 117 && _byteInput![_position + 1] === 108 && _byteInput![_position + 2] === 108) { _position += 3; return null; } throw new Error("Expected \"null\" at position " + _position); },
    93: function(): void { throw new Error("Unexpected end of array at " + _position); },
    125: function(): void { throw new Error("Unexpected end of object at " + _position); },
    44: function(): void { throw new Error("Unexpected comma at " + _position); },
    45: parseNumber, 48: parseNumber, 49: parseNumber, 50: parseNumber, 51: parseNumber, 52: parseNumber, 53: parseNumber, 54: parseNumber, 55: parseNumber, 56: parseNumber, 57: parseNumber,
    13: parseWhitespace, 10: parseWhitespace, 9: parseWhitespace, 32: parseWhitespace
};

export function decodeJson(input: any): any {
    if (typeof input === "string") { _byteInput = new ByteArray(); _byteInput.writeUTFBytes(input); }
    else if (input instanceof ByteArray) { _byteInput = input; }
    else { throw new Error("Unexpected input <" + input + ">"); }
    _position = 0;
    try { return parse[_byteInput![_position++]](); }
    catch (e: any) {
        if (e instanceof TypeError && _position - 1 < _byteInput!.length) {
            e.message = "Unexpected character " + String.fromCharCode(_byteInput![_position - 1]) + " (0x" + _byteInput![_position - 1].toString(16) + ")" + " at position " + (_position - 1) + " (" + e.message + ")";
        }
        throw e;
    }
}
