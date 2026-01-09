import { ByteArray } from "openfl/utils/ByteArray";
import { BitSwarmClient } from "../bitswarm/BitSwarmClient";
import { IMessage } from "../bitswarm/IMessage";
import { IoHandler } from "../bitswarm/IoHandler";
import { PacketReadState } from "../bitswarm/PacketReadState";
import { PendingPacket } from "../bitswarm/PendingPacket";
import { SFSCodecError } from "../exceptions/SFSCodecError";
import { SFSError } from "../exceptions/SFSError";
import { Logger } from "../logging/Logger";
import { IProtocolCodec } from "../protocol/IProtocolCodec";
import { DefaultObjectDumpFormatter } from "../protocol/serialization/DefaultObjectDumpFormatter";
import { PacketHeader } from "./PacketHeader";
import { SFSProtocolCodec } from "./SFSProtocolCodec";

/**
 * SFSIOHandler - Handles reading and writing of SFS protocol data.
 */
export class SFSIOHandler implements IoHandler {
    public static readonly SHORT_BYTE_SIZE: number = 2;
    public static readonly INT_BYTE_SIZE: number = 4;

    private bitSwarm: BitSwarmClient;
    private log: Logger;
    private readState: number;
    private pendingPacket: PendingPacket | null = null;
    private protocolCodec: IProtocolCodec;
    private readonly EMPTY_BUFFER: ByteArray = new ByteArray();

    constructor(bitSwarm: BitSwarmClient) {
        this.bitSwarm = bitSwarm;
        this.log = Logger.getInstance();
        this.readState = PacketReadState.WAIT_NEW_PACKET;
        this.protocolCodec = new SFSProtocolCodec(this, bitSwarm);
    }

    public get codec(): IProtocolCodec {
        return this.protocolCodec;
    }

    public set codec(value: IProtocolCodec) {
        this.protocolCodec = value;
    }

    public onDataRead(data: ByteArray): void {
        if (data.length === 0) {
            throw new SFSError("Unexpected empty packet data: no readable bytes available!");
        }
        if (this.bitSwarm !== null && this.bitSwarm.sfs.debug) {
            if (data.length > 1024) {
                this.log.info("Data Read: Size > 1024, dump omitted");
            } else {
                this.log.info("Data Read: " + DefaultObjectDumpFormatter.hexDump(data));
            }
        }
        data.position = 0;
        while (data.length > 0) {
            if (this.readState === PacketReadState.WAIT_NEW_PACKET) {
                data = this.handleNewPacket(data);
            }
            if (this.readState === PacketReadState.WAIT_DATA_SIZE) {
                data = this.handleDataSize(data);
            }
            if (this.readState === PacketReadState.WAIT_DATA_SIZE_FRAGMENT) {
                data = this.handleDataSizeFragment(data);
            }
            if (this.readState === PacketReadState.WAIT_DATA) {
                data = this.handlePacketData(data);
            }
        }
    }

    private handleNewPacket(data: ByteArray): ByteArray {
        this.log.debug("Handling New Packet");
        const headerByte = data.readByte();
        if (!((headerByte & 128) > 0)) {
            throw new SFSError("Unexpected header byte: " + headerByte + "\n" + DefaultObjectDumpFormatter.hexDump(data));
        }
        const header = PacketHeader.fromBinary(headerByte);
        this.pendingPacket = new PendingPacket(header);
        this.readState = PacketReadState.WAIT_DATA_SIZE;
        return this.resizeByteArray(data, 1, data.length - 1);
    }

    private handleDataSize(data: ByteArray): ByteArray {
        this.log.debug("Handling Header Size. Size: " + data.length + " (" + (this.pendingPacket!.header.bigSized ? "big" : "small") + ")");
        let dataSize = -1;
        let sizeBytes = 2;
        if (this.pendingPacket!.header.bigSized) {
            if (data.length >= 4) {
                dataSize = data.readUnsignedInt();
            }
            sizeBytes = 4;
        } else if (data.length >= 2) {
            dataSize = data.readUnsignedShort();
        }
        if (dataSize !== -1) {
            this.pendingPacket!.header.expectedLen = dataSize;
            data = this.resizeByteArray(data, sizeBytes, data.length - sizeBytes);
            this.readState = PacketReadState.WAIT_DATA;
        } else {
            this.readState = PacketReadState.WAIT_DATA_SIZE_FRAGMENT;
            this.pendingPacket!.buffer.writeBytes(data);
            data = this.EMPTY_BUFFER;
        }
        return data;
    }

    private handleDataSizeFragment(data: ByteArray): ByteArray {
        this.log.debug("Handling Size fragment. Data: " + data.length);
        const remaining = this.pendingPacket!.header.bigSized 
            ? 4 - this.pendingPacket!.buffer.position 
            : 2 - this.pendingPacket!.buffer.position;
        
        if (data.length >= remaining) {
            this.pendingPacket!.buffer.writeBytes(data, 0, remaining);
            this.pendingPacket!.buffer.position = 0;
            const dataSize = this.pendingPacket!.header.bigSized 
                ? this.pendingPacket!.buffer.readInt() 
                : this.pendingPacket!.buffer.readShort();
            this.log.debug("DataSize is ready:", dataSize, "bytes");
            this.pendingPacket!.header.expectedLen = dataSize;
            this.pendingPacket!.buffer = new ByteArray();
            this.readState = PacketReadState.WAIT_DATA;
            if (data.length > remaining) {
                data = this.resizeByteArray(data, remaining, data.length - remaining);
            } else {
                data = this.EMPTY_BUFFER;
            }
        } else {
            this.pendingPacket!.buffer.writeBytes(data);
            data = this.EMPTY_BUFFER;
        }
        return data;
    }

    private handlePacketData(data: ByteArray): ByteArray {
        const remaining = this.pendingPacket!.header.expectedLen - this.pendingPacket!.buffer.length;
        const hasMoreData = data.length > remaining;
        this.log.debug("Handling Data: " + data.length + ", previous state: " + this.pendingPacket!.buffer.length + "/" + this.pendingPacket!.header.expectedLen);
        
        if (data.length >= remaining) {
            this.pendingPacket!.buffer.writeBytes(data, 0, remaining);
            this.log.debug("<<< Packet Complete >>>");
            if (this.pendingPacket!.header.compressed) {
                this.pendingPacket!.buffer.uncompress();
            }
            this.protocolCodec.onPacketRead(this.pendingPacket!.buffer);
            this.readState = PacketReadState.WAIT_NEW_PACKET;
        } else {
            this.pendingPacket!.buffer.writeBytes(data);
        }
        
        if (hasMoreData) {
            data = this.resizeByteArray(data, remaining, data.length - remaining);
        } else {
            data = this.EMPTY_BUFFER;
        }
        return data;
    }

    private resizeByteArray(data: ByteArray, offset: number, length: number): ByteArray {
        const newBuffer = new ByteArray();
        newBuffer.writeBytes(data, offset, length);
        newBuffer.position = 0;
        return newBuffer;
    }

    public onDataWrite(message: IMessage): void {
        const writeBuffer = new ByteArray();
        let dataBuffer = message.content.toBinary();
        let compressed = false;
        
        if (dataBuffer.length > this.bitSwarm.compressionThreshold) {
            dataBuffer.compress();
            compressed = true;
        }
        
        if (dataBuffer.length > this.bitSwarm.maxMessageSize) {
            throw new SFSCodecError("Message size is too big: " + dataBuffer.length + ", the server limit is: " + this.bitSwarm.maxMessageSize);
        }
        
        let sizeBytes = SFSIOHandler.SHORT_BYTE_SIZE;
        if (dataBuffer.length > 65535) {
            sizeBytes = SFSIOHandler.INT_BYTE_SIZE;
        }
        
        const header = new PacketHeader(message.isEncrypted, compressed, false, sizeBytes === SFSIOHandler.INT_BYTE_SIZE);
        writeBuffer.writeByte(header.encode());
        
        if (sizeBytes > SFSIOHandler.SHORT_BYTE_SIZE) {
            writeBuffer.writeInt(dataBuffer.length);
        } else {
            writeBuffer.writeShort(dataBuffer.length);
        }
        writeBuffer.writeBytes(dataBuffer);
        
        if (this.bitSwarm.useBlueBox) {
            this.bitSwarm.httpSocket.send(writeBuffer);
        } else if (this.bitSwarm.socket.connected) {
            if (message.isUDP) {
                this.writeUDP(message, writeBuffer);
            } else {
                this.writeTCP(message, writeBuffer);
            }
        }
    }

    private writeTCP(message: IMessage, writeBuffer: ByteArray): void {
        try {
            this.bitSwarm.socket.writeBytes(writeBuffer);
            this.bitSwarm.socket.flush();
            if (this.bitSwarm.sfs.debug) {
                this.log.info("Data written: " + message.content.getHexDump());
            }
        } catch (error: any) {
            this.log.warn("WriteTCP operation failed due to I/O Error: " + error.toString());
        }
    }

    private writeUDP(message: IMessage, writeBuffer: ByteArray): void {
        this.bitSwarm.udpManager.send(writeBuffer);
    }
}
