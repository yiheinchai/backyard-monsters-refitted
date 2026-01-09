import { ByteArray } from "openfl/utils/ByteArray";
import { BitSwarmClient } from "../bitswarm/BitSwarmClient";
import { IController } from "../bitswarm/IController";
import { IMessage } from "../bitswarm/IMessage";
import { IoHandler } from "../bitswarm/IoHandler";
import { Message } from "../bitswarm/Message";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSObject } from "../entities/data/SFSObject";
import { SFSCodecError } from "../exceptions/SFSCodecError";
import { SFSError } from "../exceptions/SFSError";
import { Logger } from "../logging/Logger";
import { IProtocolCodec } from "../protocol/IProtocolCodec";

/**
 * SFSProtocolCodec - Protocol codec for SmartFoxServer.
 */
export class SFSProtocolCodec implements IProtocolCodec {
    private static readonly CONTROLLER_ID: string = "c";
    private static readonly ACTION_ID: string = "a";
    private static readonly PARAM_ID: string = "p";
    private static readonly USER_ID: string = "u";
    private static readonly UDP_PACKET_ID: string = "i";

    private _ioHandler: IoHandler;
    private log: Logger;
    private bitSwarm: BitSwarmClient;

    constructor(ioHandler: IoHandler, bitSwarm: BitSwarmClient) {
        this._ioHandler = ioHandler;
        this.log = Logger.getInstance();
        this.bitSwarm = bitSwarm;
    }

    public onPacketRead(data: any): void {
        let sfsObj: ISFSObject;
        if (data instanceof ByteArray) {
            sfsObj = SFSObject.newFromBinaryData(data);
        } else {
            sfsObj = data as ISFSObject;
        }
        this.dispatchRequest(sfsObj);
    }

    public onPacketWrite(message: IMessage): void {
        let sfsObj: ISFSObject;
        if (message.isUDP) {
            sfsObj = this.prepareUDPPacket(message);
        } else {
            sfsObj = this.prepareTCPPacket(message);
        }
        message.content = sfsObj;
        if (this.bitSwarm.sfs.debug) {
            this.log.info("Object going out: " + message.content.getDump());
        }
        this.ioHandler.onDataWrite(message);
    }

    private prepareTCPPacket(message: IMessage): ISFSObject {
        const sfsObj = new SFSObject();
        sfsObj.putByte(SFSProtocolCodec.CONTROLLER_ID, message.targetController);
        sfsObj.putShort(SFSProtocolCodec.ACTION_ID, message.id);
        sfsObj.putSFSObject(SFSProtocolCodec.PARAM_ID, message.content);
        return sfsObj;
    }

    private prepareUDPPacket(message: IMessage): ISFSObject {
        const sfsObj = new SFSObject();
        sfsObj.putByte(SFSProtocolCodec.CONTROLLER_ID, message.targetController);
        sfsObj.putInt(SFSProtocolCodec.USER_ID, this.bitSwarm.sfs.mySelf !== null ? this.bitSwarm.sfs.mySelf.id : -1);
        sfsObj.putLong(SFSProtocolCodec.UDP_PACKET_ID, this.bitSwarm.nextUdpPacketId());
        sfsObj.putSFSObject(SFSProtocolCodec.PARAM_ID, message.content);
        return sfsObj;
    }

    public get ioHandler(): IoHandler {
        return this._ioHandler;
    }

    public set ioHandler(value: IoHandler) {
        if (this._ioHandler !== null) {
            throw new SFSError("IOHandler is already defined for thir ProtocolHandler instance: " + this);
        }
        this._ioHandler = value;
    }

    private dispatchRequest(sfsObj: ISFSObject): void {
        const message: IMessage = new Message();
        if (sfsObj.isNull(SFSProtocolCodec.CONTROLLER_ID)) {
            throw new SFSCodecError("Request rejected: No Controller ID in request!");
        }
        if (sfsObj.isNull(SFSProtocolCodec.ACTION_ID)) {
            throw new SFSCodecError("Request rejected: No Action ID in request!");
        }
        message.id = sfsObj.getByte(SFSProtocolCodec.ACTION_ID);
        message.content = sfsObj.getSFSObject(SFSProtocolCodec.PARAM_ID);
        message.isUDP = sfsObj.containsKey(SFSProtocolCodec.UDP_PACKET_ID);
        if (message.isUDP) {
            message.packetId = sfsObj.getLong(SFSProtocolCodec.UDP_PACKET_ID);
        }
        const controllerId = sfsObj.getByte(SFSProtocolCodec.CONTROLLER_ID);
        const controller: IController | null = this.bitSwarm.getController(controllerId);
        if (controller === null) {
            throw new SFSError("Cannot handle server response. Unknown controller, id: " + controllerId);
        }
        controller.handleMessage(message);
    }
}
