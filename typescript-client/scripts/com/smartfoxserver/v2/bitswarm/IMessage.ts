import { ISFSObject } from "../entities/data/ISFSObject";

/**
 * IMessage - Interface for SmartFoxServer messages.
 */
export interface IMessage {
    id: number;
    content: ISFSObject;
    targetController: number;
    isEncrypted: boolean;
    isUDP: boolean;
    packetId: number;
}
