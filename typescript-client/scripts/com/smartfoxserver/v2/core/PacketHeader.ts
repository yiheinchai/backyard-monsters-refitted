/**
 * PacketHeader - Protocol packet header for SmartFoxServer.
 */
export class PacketHeader {
    private _expectedLen: number = -1;
    private _binary: boolean = true;
    private _compressed: boolean;
    private _encrypted: boolean;
    private _blueBoxed: boolean;
    private _bigSized: boolean;

    constructor(encrypted: boolean, compressed: boolean = false, blueBoxed: boolean = false, bigSized: boolean = false) {
        this._expectedLen = -1;
        this._binary = true;
        this._compressed = compressed;
        this._encrypted = encrypted;
        this._blueBoxed = blueBoxed;
        this._bigSized = bigSized;
    }

    public static fromBinary(headerByte: number): PacketHeader {
        return new PacketHeader(
            (headerByte & 64) > 0,
            (headerByte & 32) > 0,
            (headerByte & 16) > 0,
            (headerByte & 8) > 0
        );
    }

    public get expectedLen(): number {
        return this._expectedLen;
    }

    public set expectedLen(value: number) {
        this._expectedLen = value;
    }

    public get binary(): boolean {
        return this._binary;
    }

    public set binary(value: boolean) {
        this._binary = value;
    }

    public get compressed(): boolean {
        return this._compressed;
    }

    public set compressed(value: boolean) {
        this._compressed = value;
    }

    public get encrypted(): boolean {
        return this._encrypted;
    }

    public set encrypted(value: boolean) {
        this._encrypted = value;
    }

    public get blueBoxed(): boolean {
        return this._blueBoxed;
    }

    public set blueBoxed(value: boolean) {
        this._blueBoxed = value;
    }

    public get bigSized(): boolean {
        return this._bigSized;
    }

    public set bigSized(value: boolean) {
        this._bigSized = value;
    }

    public encode(): number {
        let result = 0;
        if (this.binary) {
            result += 128;
        }
        if (this.encrypted) {
            result += 64;
        }
        if (this.compressed) {
            result += 32;
        }
        if (this.blueBoxed) {
            result += 16;
        }
        if (this.bigSized) {
            result += 8;
        }
        return result;
    }

    public toString(): string {
        let s = "";
        s += "---------------------------------------------\n";
        s += "Binary:  \t" + this.binary + "\n";
        s += "Compressed:\t" + this.compressed + "\n";
        s += "Encrypted:\t" + this.encrypted + "\n";
        s += "BlueBoxed:\t" + this.blueBoxed + "\n";
        s += "BigSized:\t" + this.bigSized + "\n";
        s += "---------------------------------------------\n";
        return s;
    }
}
