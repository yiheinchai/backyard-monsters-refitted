import ByteArray from "openfl/utils/ByteArray";
import { IProtocolCodec } from "../protocol/IProtocolCodec";
import { IMessage } from "./IMessage";

/**
 * IoHandler - Interface for SmartFoxServer I/O handling.
 */
export interface IoHandler {
    readonly codec: IProtocolCodec;
    onDataRead(data: ByteArray): void;
    onDataWrite(message: IMessage): void;
}
