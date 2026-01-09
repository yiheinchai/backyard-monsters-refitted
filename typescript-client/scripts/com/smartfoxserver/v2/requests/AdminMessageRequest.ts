import { ISFSObject } from "../entities/data/ISFSObject";
import { GenericMessageRequest } from "./GenericMessageRequest";
import { GenericMessageType } from "./GenericMessageType";
import { MessageRecipientMode } from "./MessageRecipientMode";

/**
 * AdminMessageRequest - Request for sending admin messages.
 */
export class AdminMessageRequest extends GenericMessageRequest {
    constructor(message: string, recipientMode: MessageRecipientMode, params: ISFSObject | null = null) {
        super();
        if (recipientMode === null) {
            throw new Error("RecipientMode cannot be null!");
        }
        this._type = GenericMessageType.ADMING_MSG;
        this._message = message;
        this._params = params;
        this._recipient = recipientMode.target;
        this._sendMode = recipientMode.mode;
    }
}
