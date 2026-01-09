import { ByteArray } from "openfl/utils/ByteArray";
import { SmartFox } from "../SmartFox";
import { Logger } from "../logging/Logger";
import { IUDPManager } from "./IUDPManager";

/**
 * DefaultUDPManager - Default UDP manager implementation (stub for non-AIR).
 */
export class DefaultUDPManager implements IUDPManager {
    private _sfs: SmartFox;
    private _log: Logger;

    constructor(sfs: SmartFox) {
        this._sfs = sfs;
        this._log = Logger.getInstance();
    }

    public initialize(udpAddr: string, udpPort: number): void {
        this.logUsageError();
    }

    public nextUdpPacketId(): number {
        return -1;
    }

    public send(data: ByteArray): void {
        this.logUsageError();
    }

    public get inited(): boolean {
        return false;
    }

    public set sfs(value: SmartFox) {
        // No-op
    }

    public reset(): void {
        // No-op
    }

    private logUsageError(): void {
        if (this._sfs.udpAvailable) {
            this._log.warn("UDP protocol is not initialized yet. Pleas use the initUDP() method. If you have any doubts please refer to the documentation of initUDP()");
        } else {
            this._log.warn("You are not currently enabled to use UDP protocol. UDP is available only for Air 2 runtime and higher.");
        }
    }
}
