/**
 * SFSConstants - Constants used throughout SmartFoxServer.
 */
export class SFSConstants {
    public static readonly DEFAULT_GROUP_ID: string = "default";
    public static readonly REQUEST_UDP_PACKET_ID: string = "$FS_REQUEST_UDP_TIMESTAMP";

    private constructor() {
        throw new Error("This class should not be instantiated");
    }
}
