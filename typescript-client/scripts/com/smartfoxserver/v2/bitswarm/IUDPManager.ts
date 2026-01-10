import ByteArray from "openfl/utils/ByteArray";
import { SmartFox } from "../SmartFox";

/**
 * IUDPManager - Interface for UDP connection management.
 */
export interface IUDPManager {
    readonly inited: boolean;
    sfs: SmartFox;
    initialize(udpAddr: string, udpPort: number): void;
    nextUdpPacketId(): number;
    send(data: ByteArray): void;
    reset(): void;
}
