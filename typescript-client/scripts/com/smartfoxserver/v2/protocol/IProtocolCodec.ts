import { IMessage } from "../bitswarm/IMessage";
import { IoHandler } from "../bitswarm/IoHandler";

/**
 * IProtocolCodec - Interface for protocol encoding/decoding.
 */
export interface IProtocolCodec {
    ioHandler: IoHandler;
    onPacketRead(data: any): void;
    onPacketWrite(message: IMessage): void;
}
