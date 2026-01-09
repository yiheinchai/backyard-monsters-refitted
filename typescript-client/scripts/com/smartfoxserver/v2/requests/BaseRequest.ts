import { SmartFox } from "../SmartFox";
import { IMessage } from "../bitswarm/IMessage";
import { Message } from "../bitswarm/Message";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSObject } from "../entities/data/SFSObject";
import { IRequest } from "./IRequest";

/**
 * BaseRequest - Base class for all SmartFoxServer requests.
 */
export class BaseRequest implements IRequest {
    public static readonly Handshake: number = 0;
    public static readonly Login: number = 1;
    public static readonly Logout: number = 2;
    public static readonly GetRoomList: number = 3;
    public static readonly JoinRoom: number = 4;
    public static readonly AutoJoin: number = 5;
    public static readonly CreateRoom: number = 6;
    public static readonly GenericMessage: number = 7;
    public static readonly ChangeRoomName: number = 8;
    public static readonly ChangeRoomPassword: number = 9;
    public static readonly ObjectMessage: number = 10;
    public static readonly SetRoomVariables: number = 11;
    public static readonly SetUserVariables: number = 12;
    public static readonly CallExtension: number = 13;
    public static readonly LeaveRoom: number = 14;
    public static readonly SubscribeRoomGroup: number = 15;
    public static readonly UnsubscribeRoomGroup: number = 16;
    public static readonly SpectatorToPlayer: number = 17;
    public static readonly PlayerToSpectator: number = 18;
    public static readonly ChangeRoomCapacity: number = 19;
    public static readonly PublicMessage: number = 20;
    public static readonly PrivateMessage: number = 21;
    public static readonly ModeratorMessage: number = 22;
    public static readonly AdminMessage: number = 23;
    public static readonly KickUser: number = 24;
    public static readonly BanUser: number = 25;
    public static readonly ManualDisconnection: number = 26;
    public static readonly FindRooms: number = 27;
    public static readonly FindUsers: number = 28;
    public static readonly PingPong: number = 29;
    public static readonly InitBuddyList: number = 200;
    public static readonly AddBuddy: number = 201;
    public static readonly BlockBuddy: number = 202;
    public static readonly RemoveBuddy: number = 203;
    public static readonly SetBuddyVariables: number = 204;
    public static readonly GoOnline: number = 205;
    public static readonly InviteUser: number = 300;
    public static readonly InvitationReply: number = 301;
    public static readonly CreateSFSGame: number = 302;
    public static readonly QuickJoinGame: number = 303;
    public static readonly KEY_ERROR_CODE: string = "ec";
    public static readonly KEY_ERROR_PARAMS: string = "ep";

    protected _sfso: ISFSObject;
    private _id: number;
    protected _targetController: number;
    private _isEncrypted: boolean;

    constructor(id: number) {
        this._sfso = SFSObject.newInstance();
        this._targetController = 0;
        this._isEncrypted = false;
        this._id = id;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public getMessage(): IMessage {
        const msg: IMessage = new Message();
        msg.id = this._id;
        msg.isEncrypted = this._isEncrypted;
        msg.targetController = this._targetController;
        msg.content = this._sfso;
        // Check for ExtensionRequest with dynamic import to avoid circular dependency
        if ((this as any).useUDP !== undefined) {
            msg.isUDP = (this as any).useUDP;
        }
        return msg;
    }

    public get targetController(): number {
        return this._targetController;
    }

    public set targetController(value: number) {
        this._targetController = value;
    }

    public get isEncrypted(): boolean {
        return this._isEncrypted;
    }

    public set isEncrypted(value: boolean) {
        this._isEncrypted = value;
    }

    public validate(sfs: SmartFox): void {
        // Override in subclasses
    }

    public execute(sfs: SmartFox): void {
        // Override in subclasses
    }
}
