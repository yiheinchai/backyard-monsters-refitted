import Capabilities from "openfl/system/Capabilities";
import { BaseRequest } from "./BaseRequest";

/**
 * HandshakeRequest - Initial handshake request to server.
 */
export class HandshakeRequest extends BaseRequest {
    public static readonly KEY_SESSION_TOKEN: string = "tk";
    public static readonly KEY_API: string = "api";
    public static readonly KEY_COMPRESSION_THRESHOLD: string = "ct";
    public static readonly KEY_RECONNECTION_TOKEN: string = "rt";
    public static readonly KEY_CLIENT_TYPE: string = "cl";
    public static readonly KEY_MAX_MESSAGE_SIZE: string = "ms";

    constructor(apiVersion: string, reconnectionToken: string | null = null) {
        super(BaseRequest.Handshake);
        this._sfso.putUtfString(HandshakeRequest.KEY_API, apiVersion);
        const clientType = "FlashPlayer:" + Capabilities.playerType + ":" + Capabilities.version;
        this._sfso.putUtfString(HandshakeRequest.KEY_CLIENT_TYPE, clientType);
        if (reconnectionToken !== null) {
            this._sfso.putUtfString(HandshakeRequest.KEY_RECONNECTION_TOKEN, reconnectionToken);
        }
    }
}
