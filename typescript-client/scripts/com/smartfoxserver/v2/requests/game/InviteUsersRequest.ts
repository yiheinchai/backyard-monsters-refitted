import { SmartFox } from "../../SmartFox";
import { Buddy } from "../../entities/Buddy";
import { User } from "../../entities/User";
import { ISFSObject } from "../../entities/data/ISFSObject";
import { SFSValidationError } from "../../exceptions/SFSValidationError";
import { BaseRequest } from "../BaseRequest";

/**
 * InviteUsersRequest - Request to invite users to a game.
 */
export class InviteUsersRequest extends BaseRequest {
    public static readonly KEY_USER: string = "u";
    public static readonly KEY_USER_ID: string = "ui";
    public static readonly KEY_INVITATION_ID: string = "ii";
    public static readonly KEY_TIME: string = "t";
    public static readonly KEY_PARAMS: string = "p";
    public static readonly KEY_INVITEE_ID: string = "ee";
    public static readonly KEY_INVITED_USERS: string = "iu";
    public static readonly KEY_REPLY_ID: string = "ri";
    public static readonly MAX_INVITATIONS_FROM_CLIENT_SIDE: number = 8;
    public static readonly MIN_EXPIRY_TIME: number = 5;
    public static readonly MAX_EXPIRY_TIME: number = 300;

    private _invitedUsers: Array<any>;
    private _secondsForAnswer: number;
    private _params: ISFSObject;

    constructor(invitedUsers: Array<any>, secondsForAnswer: number, params: ISFSObject) {
        super(BaseRequest.InviteUser);
        this._invitedUsers = invitedUsers;
        this._secondsForAnswer = secondsForAnswer;
        this._params = params;
    }

    public override validate(sfs: SmartFox): void {
        const errors: Array<string> = [];
        if (this._invitedUsers === null || this._invitedUsers.length < 1) {
            errors.push("No invitation(s) to send");
        }
        if (this._invitedUsers.length > InviteUsersRequest.MAX_INVITATIONS_FROM_CLIENT_SIDE) {
            errors.push("Too many invitations. Max allowed from client side is: " + InviteUsersRequest.MAX_INVITATIONS_FROM_CLIENT_SIDE);
        }
        if (this._secondsForAnswer < 5 || this._secondsForAnswer > 300) {
            errors.push("SecondsForAnswer value is out of range (" + InviteUsersRequest.MIN_EXPIRY_TIME + "-" + InviteUsersRequest.MAX_EXPIRY_TIME + ")");
        }
        if (errors.length > 0) {
            throw new SFSValidationError("InvitationReply request error", errors);
        }
    }

    public override execute(sfs: SmartFox): void {
        const userIds: Array<number> = [];
        for (const invited of this._invitedUsers) {
            if (invited !== sfs.mySelf) {
                userIds.push(invited.id);
            }
        }
        this._sfso.putIntArray(InviteUsersRequest.KEY_INVITED_USERS, userIds);
        this._sfso.putShort(InviteUsersRequest.KEY_TIME, this._secondsForAnswer);
        if (this._params !== null) {
            this._sfso.putSFSObject(InviteUsersRequest.KEY_PARAMS, this._params);
        }
    }
}
