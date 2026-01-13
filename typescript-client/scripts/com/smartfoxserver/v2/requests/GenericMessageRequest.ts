import { SmartFox } from "../SmartFox";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSError } from "../exceptions/SFSError";
import { SFSValidationError } from "../exceptions/SFSValidationError";
import { Logger } from "../logging/Logger";
import { BaseRequest } from "./BaseRequest";
import { GenericMessageType } from "./GenericMessageType";
import { MessageRecipientMode } from "./MessageRecipientMode";

/**
 * GenericMessageRequest - Base request for all message types.
 */
export class GenericMessageRequest extends BaseRequest {
    public static readonly KEY_ROOM_ID: string = "r";
    public static readonly KEY_USER_ID: string = "u";
    public static readonly KEY_MESSAGE: string = "m";
    public static readonly KEY_MESSAGE_TYPE: string = "t";
    public static readonly KEY_RECIPIENT: string = "rc";
    public static readonly KEY_RECIPIENT_MODE: string = "rm";
    public static readonly KEY_XTRA_PARAMS: string = "p";
    public static readonly KEY_SENDER_DATA: string = "sd";

    protected _type: number = -1;
    protected _room: Room | null = null;
    protected _user: User | null = null;
    protected _message: string = "";
    protected _params: ISFSObject | null = null;
    protected _recipient: any = null;
    protected _sendMode: number = -1;
    protected _log: Logger;

    constructor() {
        super(BaseRequest.GenericMessage);
        this._log = Logger.getInstance();
    }

    public override validate(sfs: SmartFox): void {
        if (this._type < 0) {
            throw new SFSValidationError("PublicMessage request error", ["Unsupported message type: " + this._type]);
        }
        const errors: Array<string> = [];
        switch (this._type) {
            case GenericMessageType.PUBLIC_MSG:
                this.validatePublicMessage(sfs, errors);
                break;
            case GenericMessageType.PRIVATE_MSG:
                this.validatePrivateMessage(sfs, errors);
                break;
            case GenericMessageType.OBJECT_MSG:
                this.validateObjectMessage(sfs, errors);
                break;
            case GenericMessageType.BUDDY_MSG:
                this.validateBuddyMessage(sfs, errors);
                break;
            default:
                this.validateSuperUserMessage(sfs, errors);
        }
        if (errors.length > 0) {
            throw new SFSValidationError("Request error - ", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        this._sfso.putByte(GenericMessageRequest.KEY_MESSAGE_TYPE, this._type);
        switch (this._type) {
            case GenericMessageType.PUBLIC_MSG:
                this.executePublicMessage(sfs);
                break;
            case GenericMessageType.PRIVATE_MSG:
                this.executePrivateMessage(sfs);
                break;
            case GenericMessageType.OBJECT_MSG:
                this.executeObjectMessage(sfs);
                break;
            case GenericMessageType.BUDDY_MSG:
                this.executeBuddyMessage(sfs);
                break;
            default:
                this.executeSuperUserMessage(sfs);
        }
    }

    private validatePublicMessage(sfs: SmartFox, errors: Array<string>): void {
        if (this._message === null || this._message.length === 0) {
            errors.push("Public message is empty!");
        }
        if (this._room !== null && !sfs.mySelf!.isJoinedInRoom(this._room)) {
            errors.push("You are not joined in the target Room: " + this._room);
        }
    }

    private validatePrivateMessage(sfs: SmartFox, errors: Array<string>): void {
        if (this._message === null || this._message.length === 0) {
            errors.push("Private message is empty!");
        }
        if (this._recipient < 0) {
            errors.push("Invalid recipient id: " + this._recipient);
        }
    }

    private validateObjectMessage(sfs: SmartFox, errors: Array<string>): void {
        if (this._params === null) {
            errors.push("Object message is null!");
        }
    }

    private validateBuddyMessage(sfs: SmartFox, errors: Array<string>): void {
        if (!sfs.buddyManager.isInited) {
            errors.push("BuddyList is not inited. Please send an InitBuddyRequest first.");
        }
        if (sfs.buddyManager.myOnlineState === false) {
            errors.push("Can't send messages while off-line");
        }
        if (this._message === null || this._message.length === 0) {
            errors.push("Buddy message is empty!");
        }
        const recipientId: number = Number(this._recipient);
        if (recipientId < 0) {
            errors.push("Recipient is not online or not in your buddy list");
        }
    }

    private validateSuperUserMessage(sfs: SmartFox, errors: Array<string>): void {
        if (this._message === null || this._message.length === 0) {
            errors.push("Moderator message is empty!");
        }
        switch (this._sendMode) {
            case MessageRecipientMode.TO_USER:
                if (!(this._recipient && typeof this._recipient.id === 'number')) {
                    errors.push("TO_USER expects a User object as recipient");
                }
                break;
            case MessageRecipientMode.TO_ROOM:
                if (!(this._recipient && typeof this._recipient.id === 'number')) {
                    errors.push("TO_ROOM expects a Room object as recipient");
                }
                break;
            case MessageRecipientMode.TO_GROUP:
                if (typeof this._recipient !== 'string') {
                    errors.push("TO_GROUP expects a String object (the groupId) as recipient");
                }
                break;
        }
    }

    private executePublicMessage(sfs: SmartFox): void {
        if (this._room === null) {
            this._room = sfs.lastJoinedRoom;
        }
        if (this._room === null) {
            throw new SFSError("User should be joined in a room in order to send a public message");
        }
        this._sfso.putInt(GenericMessageRequest.KEY_ROOM_ID, this._room.id);
        this._sfso.putInt(GenericMessageRequest.KEY_USER_ID, sfs.mySelf!.id);
        this._sfso.putUtfString(GenericMessageRequest.KEY_MESSAGE, this._message);
        if (this._params !== null) {
            this._sfso.putSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS, this._params);
        }
    }

    private executePrivateMessage(sfs: SmartFox): void {
        this._sfso.putInt(GenericMessageRequest.KEY_RECIPIENT, this._recipient as number);
        this._sfso.putUtfString(GenericMessageRequest.KEY_MESSAGE, this._message);
        if (this._params !== null) {
            this._sfso.putSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS, this._params);
        }
    }

    private executeBuddyMessage(sfs: SmartFox): void {
        this._sfso.putInt(GenericMessageRequest.KEY_RECIPIENT, this._recipient as number);
        this._sfso.putUtfString(GenericMessageRequest.KEY_MESSAGE, this._message);
        if (this._params !== null) {
            this._sfso.putSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS, this._params);
        }
    }

    private executeSuperUserMessage(sfs: SmartFox): void {
        this._sfso.putUtfString(GenericMessageRequest.KEY_MESSAGE, this._message);
        if (this._params !== null) {
            this._sfso.putSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS, this._params);
        }
        this._sfso.putInt(GenericMessageRequest.KEY_RECIPIENT_MODE, this._sendMode);
        switch (this._sendMode) {
            case MessageRecipientMode.TO_USER:
                this._sfso.putInt(GenericMessageRequest.KEY_RECIPIENT, this._recipient.id);
                break;
            case MessageRecipientMode.TO_ROOM:
                this._sfso.putInt(GenericMessageRequest.KEY_RECIPIENT, this._recipient.id);
                break;
            case MessageRecipientMode.TO_GROUP:
                this._sfso.putUtfString(GenericMessageRequest.KEY_RECIPIENT, this._recipient);
                break;
        }
    }

    private executeObjectMessage(sfs: SmartFox): void {
        if (this._room === null) {
            this._room = sfs.lastJoinedRoom;
        }
        
        // Using Set instead of HashSet (which was obfuscated)
        const recipientIds: Set<number> = new Set<number>();
        
        if (Array.isArray(this._recipient)) {
            const recipients: Array<any> = this._recipient;
            if (recipients.length > this._room!.capacity) {
                throw new Error("The number of recipients is bigger than the target Room capacity: " + recipients.length);
            }
            for (const item of recipients) {
                if (item && typeof item.id === 'number') {
                    recipientIds.add(item.id);
                } else {
                    this._log.warn("Bad recipient in ObjectMessage recipient list: " + typeof item + ", expected type: User");
                }
            }
        }
        
        this._sfso.putInt(GenericMessageRequest.KEY_ROOM_ID, this._room!.id);
        this._sfso.putSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS, this._params!);
        if (recipientIds.size > 0) {
            this._sfso.putIntArray(GenericMessageRequest.KEY_RECIPIENT, Array.from(recipientIds));
        }
    }
}
