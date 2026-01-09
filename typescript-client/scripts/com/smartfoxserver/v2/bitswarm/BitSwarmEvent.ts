import { BaseEvent } from "../core/BaseEvent";

/**
 * BitSwarmEvent - BitSwarm connection events.
 */
export class BitSwarmEvent extends BaseEvent {
    public static readonly CONNECT: string = "connect";
    public static readonly DISCONNECT: string = "disconnect";
    public static readonly RECONNECTION_TRY: string = "reconnectionTry";
    public static readonly IO_ERROR: string = "ioError";
    public static readonly SECURITY_ERROR: string = "securityError";
    public static readonly DATA_ERROR: string = "dataError";

    constructor(type: string, params: any = null) {
        super(type);
        this.params = params;
    }
}
