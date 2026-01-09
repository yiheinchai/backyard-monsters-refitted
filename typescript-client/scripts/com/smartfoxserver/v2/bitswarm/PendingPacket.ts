import { ByteArray } from "openfl/utils/ByteArray";
import { PacketHeader } from "../core/PacketHeader";

/**
 * PendingPacket - Represents a packet being assembled from fragments.
 */
export class PendingPacket {
    private _header: PacketHeader;
    private _buffer: ByteArray;

    constructor(header: PacketHeader) {
        this._header = header;
        this._buffer = new ByteArray();
    }

    public get header(): PacketHeader {
        return this._header;
    }

    public get buffer(): ByteArray {
        return this._buffer;
    }

    public set buffer(value: ByteArray) {
        this._buffer = value;
    }
}
