import { Room } from "../entities/Room";
import { ISFSObject } from "../entities/data/ISFSObject";
import { GenericMessageRequest } from "./GenericMessageRequest";
import { GenericMessageType } from "./GenericMessageType";

/**
 * PublicMessageRequest - Request for sending a public message to a room.
 */
export class PublicMessageRequest extends GenericMessageRequest {
    constructor(message: string, params: ISFSObject | null = null, room: Room | null = null) {
        super();
        this._type = GenericMessageType.PUBLIC_MSG;
        this._message = message;
        this._room = room;
        this._params = params;
    }
}
