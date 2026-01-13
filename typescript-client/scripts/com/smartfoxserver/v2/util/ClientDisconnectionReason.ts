/**
 * ClientDisconnectionReason - Constants for client disconnection reasons.
 */
export class ClientDisconnectionReason {
    public static readonly IDLE: string = "idle";
    public static readonly KICK: string = "kick";
    public static readonly BAN: string = "ban";
    public static readonly MANUAL: string = "manual";
    public static readonly UNKNOWN: string = "unknown";

    private static reasons: Array<string> = ["idle", "kick", "ban"];

    constructor() { }

    public static getReason(reasonId: number): string {
        return ClientDisconnectionReason.reasons[reasonId];
    }
}
