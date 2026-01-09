import { ISFSObject } from "../entities/data/ISFSObject";
import { GenericMessageRequest } from "./GenericMessageRequest";
import { GenericMessageType } from "./GenericMessageType";

/**
 * PrivateMessageRequest - Request for sending a private message to a user.
 */
export class PrivateMessageRequest extends GenericMessageRequest {
    constructor(message: string, recipientId: number, params: ISFSObject | null = null) {
        super();
        this._type = GenericMessageType.PRIVATE_MSG;
        this._message = message;
        this._recipient = recipientId;
        this._params = params;
    }
}
