import { BaseEvent } from "../../core/BaseEvent";

/**
 * BBEvent - BlueBox event class for HTTP tunneling.
 */
export class BBEvent extends BaseEvent {
    public static readonly CONNECT: string = "bb-connect";
    public static readonly DISCONNECT: string = "bb-disconnect";
    public static readonly DATA: string = "bb-data";
    public static readonly IO_ERROR: string = "bb-ioError";
    public static readonly SECURITY_ERROR: string = "bb-securityError";

    constructor(type: string, params: any = null) {
        super(type);
        this.params = params;
    }
}
