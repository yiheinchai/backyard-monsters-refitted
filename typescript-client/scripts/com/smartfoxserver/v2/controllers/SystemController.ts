import { SmartFox } from "../SmartFox";
import { BaseController } from "../bitswarm/BaseController";
import { BitSwarmClient } from "../bitswarm/BitSwarmClient";
import { IMessage } from "../bitswarm/IMessage";
import { SFSBuddyEvent } from "../core/SFSBuddyEvent";
import { SFSEvent } from "../core/SFSEvent";
import { Buddy } from "../entities/Buddy";
import { Room } from "../entities/Room";
import { SFSBuddy } from "../entities/SFSBuddy";
import { SFSRoom } from "../entities/SFSRoom";
import { SFSUser } from "../entities/SFSUser";
import { User } from "../entities/User";
import { ISFSArray } from "../entities/data/ISFSArray";
import { ISFSObject } from "../entities/data/ISFSObject";
import { SFSInvitation } from "../entities/invitation/SFSInvitation";
import { IRoomManager } from "../entities/managers/IRoomManager";
import { IUserManager } from "../entities/managers/IUserManager";
import { BuddyVariable } from "../entities/variables/BuddyVariable";
import { ReservedBuddyVariables } from "../entities/variables/ReservedBuddyVariables";
import { RoomVariable } from "../entities/variables/RoomVariable";
import { SFSBuddyVariable } from "../entities/variables/SFSBuddyVariable";
import { SFSRoomVariable } from "../entities/variables/SFSRoomVariable";
import { SFSUserVariable } from "../entities/variables/SFSUserVariable";
import { UserVariable } from "../entities/variables/UserVariable";
import { BaseRequest } from "../requests/BaseRequest";
import { ChangeRoomCapacityRequest } from "../requests/ChangeRoomCapacityRequest";
import { ChangeRoomNameRequest } from "../requests/ChangeRoomNameRequest";
import { ChangeRoomPasswordStateRequest } from "../requests/ChangeRoomPasswordStateRequest";
import { CreateRoomRequest } from "../requests/CreateRoomRequest";
import { FindRoomsRequest } from "../requests/FindRoomsRequest";
import { FindUsersRequest } from "../requests/FindUsersRequest";
import { GenericMessageRequest } from "../requests/GenericMessageRequest";
import { GenericMessageType } from "../requests/GenericMessageType";
import { JoinRoomRequest } from "../requests/JoinRoomRequest";
import { LoginRequest } from "../requests/LoginRequest";
import { LogoutRequest } from "../requests/LogoutRequest";
import { PlayerToSpectatorRequest } from "../requests/PlayerToSpectatorRequest";
import { SetRoomVariablesRequest } from "../requests/SetRoomVariablesRequest";
import { SetUserVariablesRequest } from "../requests/SetUserVariablesRequest";
import { SpectatorToPlayerRequest } from "../requests/SpectatorToPlayerRequest";
import { SubscribeRoomGroupRequest } from "../requests/SubscribeRoomGroupRequest";
import { AddBuddyRequest } from "../requests/buddylist/AddBuddyRequest";
import { BlockBuddyRequest } from "../requests/buddylist/BlockBuddyRequest";
import { GoOnlineRequest } from "../requests/buddylist/GoOnlineRequest";
import { InitBuddyListRequest } from "../requests/buddylist/InitBuddyListRequest";
import { RemoveBuddyRequest } from "../requests/buddylist/RemoveBuddyRequest";
import { SetBuddyVariablesRequest } from "../requests/buddylist/SetBuddyVariablesRequest";
import { InviteUsersRequest } from "../requests/game/InviteUsersRequest";
import { BuddyOnlineState } from "../util/BuddyOnlineState";
import { ClientDisconnectionReason } from "../util/ClientDisconnectionReason";
import { SFSErrorCodes } from "../util/SFSErrorCodes";

/**
 * SystemController - Handles all system-level SFS2X responses.
 */
export class SystemController extends BaseController {
    private sfs: SmartFox;
    private bitSwarm: BitSwarmClient;
    private requestHandlers: { [key: number]: string };

    constructor(bitSwarm: BitSwarmClient) {
        super();
        this.bitSwarm = bitSwarm;
        this.sfs = bitSwarm.sfs;
        this.requestHandlers = {};
        this.initRequestHandlers();
    }

    private initRequestHandlers(): void {
        this.requestHandlers[BaseRequest.Handshake] = "fnHandshake";
        this.requestHandlers[BaseRequest.Login] = "fnLogin";
        this.requestHandlers[BaseRequest.Logout] = "fnLogout";
        this.requestHandlers[BaseRequest.JoinRoom] = "fnJoinRoom";
        this.requestHandlers[BaseRequest.CreateRoom] = "fnCreateRoom";
        this.requestHandlers[BaseRequest.GenericMessage] = "fnGenericMessage";
        this.requestHandlers[BaseRequest.ChangeRoomName] = "fnChangeRoomName";
        this.requestHandlers[BaseRequest.ChangeRoomPassword] = "fnChangeRoomPassword";
        this.requestHandlers[BaseRequest.ChangeRoomCapacity] = "fnChangeRoomCapacity";
        this.requestHandlers[BaseRequest.ObjectMessage] = "fnSendObject";
        this.requestHandlers[BaseRequest.SetRoomVariables] = "fnSetRoomVariables";
        this.requestHandlers[BaseRequest.SetUserVariables] = "fnSetUserVariables";
        this.requestHandlers[BaseRequest.CallExtension] = "fnCallExtension";
        this.requestHandlers[BaseRequest.SubscribeRoomGroup] = "fnSubscribeRoomGroup";
        this.requestHandlers[BaseRequest.UnsubscribeRoomGroup] = "fnUnsubscribeRoomGroup";
        this.requestHandlers[BaseRequest.SpectatorToPlayer] = "fnSpectatorToPlayer";
        this.requestHandlers[BaseRequest.PlayerToSpectator] = "fnPlayerToSpectator";
        this.requestHandlers[BaseRequest.InitBuddyList] = "fnInitBuddyList";
        this.requestHandlers[BaseRequest.AddBuddy] = "fnAddBuddy";
        this.requestHandlers[BaseRequest.RemoveBuddy] = "fnRemoveBuddy";
        this.requestHandlers[BaseRequest.BlockBuddy] = "fnBlockBuddy";
        this.requestHandlers[BaseRequest.GoOnline] = "fnGoOnline";
        this.requestHandlers[BaseRequest.SetBuddyVariables] = "fnSetBuddyVariables";
        this.requestHandlers[BaseRequest.FindRooms] = "fnFindRooms";
        this.requestHandlers[BaseRequest.FindUsers] = "fnFindUsers";
        this.requestHandlers[BaseRequest.InviteUser] = "fnInviteUsers";
        this.requestHandlers[BaseRequest.InvitationReply] = "fnInvitationReply";
        this.requestHandlers[BaseRequest.QuickJoinGame] = "fnQuickJoinGame";
        this.requestHandlers[BaseRequest.PingPong] = "fnPingPong";
        this.requestHandlers[1000] = "fnUserEnterRoom";
        this.requestHandlers[1001] = "fnUserCountChange";
        this.requestHandlers[1002] = "fnUserLost";
        this.requestHandlers[1003] = "fnRoomLost";
        this.requestHandlers[1004] = "fnUserExitRoom";
        this.requestHandlers[1005] = "fnClientDisconnection";
    }

    public override handleMessage(msg: IMessage): void {
        if (this.sfs.debug) {
            this.log.info(this.getEvtName(msg.id), msg);
        }
        const handlerName = this.requestHandlers[msg.id];
        if (handlerName !== undefined) {
            (this as any)[handlerName](msg);
        } else {
            this.log.warn("Unknown message id: " + msg.id);
        }
    }

    private getEvtName(id: number): string {
        const name = this.requestHandlers[id];
        return name ? name.substr(2) : "Unknown";
    }

    private fnHandshake(msg: IMessage): void {
        const params = { message: msg };
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.HANDSHAKE, params));
    }

    private fnLogin(msg: IMessage): void {
        const content = msg.content;
        const params: any = {};
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            this.populateRoomList(content.getSFSArray(LoginRequest.KEY_ROOMLIST)!);
            this.sfs.mySelf = new SFSUser(content.getInt(LoginRequest.KEY_ID), content.getUtfString(LoginRequest.KEY_USER_NAME), true);
            this.sfs.mySelf!.userManager = this.sfs.userManager;
            this.sfs.mySelf!.privilegeId = content.getShort(LoginRequest.KEY_PRIVILEGE_ID);
            this.sfs.userManager.addUser(this.sfs.mySelf!);
            this.sfs.setReconnectionSeconds(content.getShort(LoginRequest.KEY_RECONNECTION_SECONDS));
            params.zone = content.getUtfString(LoginRequest.KEY_ZONE_NAME);
            params.user = this.sfs.mySelf;
            params.data = content.getSFSObject(LoginRequest.KEY_PARAMS);
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.LOGIN, params));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.LOGIN_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnCreateRoom(msg: IMessage): void {
        const content = msg.content;
        const params: any = {};
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomManager = this.sfs.roomManager;
            const room = SFSRoom.fromSFSArray(content.getSFSArray(CreateRoomRequest.KEY_ROOM)!);
            room.roomManager = this.sfs.roomManager;
            roomManager.addRoom(room);
            params.room = room;
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_ADD, params));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_CREATION_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnJoinRoom(msg: IMessage): void {
        const roomManager = this.sfs.roomManager;
        const content = msg.content;
        this.sfs.isJoining = false;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomArr = content.getSFSArray(JoinRoomRequest.KEY_ROOM)!;
            const userList = content.getSFSArray(JoinRoomRequest.KEY_USER_LIST)!;
            let room = SFSRoom.fromSFSArray(roomArr);
            room.roomManager = this.sfs.roomManager;
            room = roomManager.replaceRoom(room, roomManager.containsGroup(room.groupId));
            for (let i = 0; i < userList.size(); i++) {
                const userArr = userList.getSFSArray(i)!;
                const user = this.getOrCreateUser(userArr, true, room);
                user.setPlayerId(userArr.getShort(3), room);
                room.addUser(user);
            }
            room.isJoined = true;
            this.sfs.lastJoinedRoom = room;
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_JOIN, { room: room }));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_JOIN_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnUserEnterRoom(msg: IMessage): void {
        const content = msg.content;
        const room = this.sfs.roomManager.getRoomById(content.getInt("r"));
        if (room !== null) {
            const userArr = content.getSFSArray("u")!;
            const user = this.getOrCreateUser(userArr, true, room);
            room.addUser(user);
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_ENTER_ROOM, { user: user, room: room }));
        }
    }

    private fnUserCountChange(msg: IMessage): void {
        const content = msg.content;
        const room = this.sfs.roomManager.getRoomById(content.getInt("r"));
        if (room !== null) {
            const uCount = content.getShort("uc");
            let sCount = 0;
            if (content.containsKey("sc")) {
                sCount = content.getShort("sc");
            }
            room.userCount = uCount;
            room.spectatorCount = sCount;
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_COUNT_CHANGE, { room: room, uCount: uCount, sCount: sCount }));
        }
    }

    private fnUserLost(msg: IMessage): void {
        const content = msg.content;
        const userId = content.getInt("u");
        const user = this.sfs.userManager.getUserById(userId);
        if (user !== null) {
            const rooms = this.sfs.roomManager.getUserRooms(user);
            this.sfs.roomManager.removeUser(user);
            this.sfs.userManager.removeUser(user);
            for (const room of rooms) {
                this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_EXIT_ROOM, { user: user, room: room }));
            }
        }
    }

    private fnRoomLost(msg: IMessage): void {
        const content = msg.content;
        const roomId = content.getInt("r");
        const room = this.sfs.roomManager.getRoomById(roomId);
        const userManager = this.sfs.userManager;
        if (room !== null) {
            this.sfs.roomManager.removeRoom(room);
            for (const user of room.userList) {
                userManager.removeUser(user);
            }
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_REMOVE, { room: room }));
        }
    }

    private fnGenericMessage(msg: IMessage): void {
        const content = msg.content;
        const msgType = content.getByte(GenericMessageRequest.KEY_MESSAGE_TYPE);
        switch (msgType) {
            case GenericMessageType.PUBLIC_MSG:
                this.handlePublicMessage(content);
                break;
            case GenericMessageType.PRIVATE_MSG:
                this.handlePrivateMessage(content);
                break;
            case GenericMessageType.BUDDY_MSG:
                this.handleBuddyMessage(content);
                break;
            case GenericMessageType.MODERATOR_MSG:
                this.handleModMessage(content);
                break;
            case GenericMessageType.ADMING_MSG:
                this.handleAdminMessage(content);
                break;
            case GenericMessageType.OBJECT_MSG:
                this.handleObjectMessage(content);
                break;
        }
    }

    private handlePublicMessage(content: ISFSObject): void {
        const roomId = content.getInt(GenericMessageRequest.KEY_ROOM_ID);
        const room = this.sfs.roomManager.getRoomById(roomId);
        if (room !== null) {
            const params = {
                room: room,
                sender: this.sfs.userManager.getUserById(content.getInt(GenericMessageRequest.KEY_USER_ID)),
                message: content.getUtfString(GenericMessageRequest.KEY_MESSAGE),
                data: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
            };
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.PUBLIC_MESSAGE, params));
        } else {
            this.log.warn("Unexpected, PublicMessage target room doesn't exist. RoomId: " + roomId);
        }
    }

    public handlePrivateMessage(content: ISFSObject): void {
        const userId = content.getInt(GenericMessageRequest.KEY_USER_ID);
        let user = this.sfs.userManager.getUserById(userId);
        if (user === null) {
            if (!content.containsKey(GenericMessageRequest.KEY_SENDER_DATA)) {
                this.log.warn("Unexpected. Private message has no Sender details!");
                return;
            }
            user = SFSUser.fromSFSArray(content.getSFSArray(GenericMessageRequest.KEY_SENDER_DATA)!);
        }
        const params = {
            sender: user,
            message: content.getUtfString(GenericMessageRequest.KEY_MESSAGE),
            data: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
        };
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.PRIVATE_MESSAGE, params));
    }

    public handleBuddyMessage(content: ISFSObject): void {
        const userId = content.getInt(GenericMessageRequest.KEY_USER_ID);
        const buddy = this.sfs.buddyManager.getBuddyById(userId);
        const params = {
            isItMe: this.sfs.mySelf!.id === userId,
            buddy: buddy,
            message: content.getUtfString(GenericMessageRequest.KEY_MESSAGE),
            data: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
        };
        this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_MESSAGE, params));
    }

    public handleModMessage(content: ISFSObject): void {
        const params = {
            sender: SFSUser.fromSFSArray(content.getSFSArray(GenericMessageRequest.KEY_SENDER_DATA)!),
            message: content.getUtfString(GenericMessageRequest.KEY_MESSAGE),
            data: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
        };
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.MODERATOR_MESSAGE, params));
    }

    public handleAdminMessage(content: ISFSObject): void {
        const params = {
            sender: SFSUser.fromSFSArray(content.getSFSArray(GenericMessageRequest.KEY_SENDER_DATA)!),
            message: content.getUtfString(GenericMessageRequest.KEY_MESSAGE),
            data: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
        };
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ADMIN_MESSAGE, params));
    }

    public handleObjectMessage(content: ISFSObject): void {
        const userId = content.getInt(GenericMessageRequest.KEY_USER_ID);
        const params = {
            sender: this.sfs.userManager.getUserById(userId),
            message: content.getSFSObject(GenericMessageRequest.KEY_XTRA_PARAMS)
        };
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.OBJECT_MESSAGE, params));
    }

    private fnUserExitRoom(msg: IMessage): void {
        const content = msg.content;
        const roomId = content.getInt("r");
        const userId = content.getInt("u");
        const room = this.sfs.roomManager.getRoomById(roomId);
        const user = this.sfs.userManager.getUserById(userId);
        if (room !== null && user !== null) {
            room.removeUser(user);
            this.sfs.userManager.removeUser(user);
            if (user.isItMe && room.isJoined) {
                room.isJoined = false;
                if (this.sfs.joinedRooms.length === 0) {
                    this.sfs.lastJoinedRoom = null;
                }
                if (!room.isManaged) {
                    this.sfs.roomManager.removeRoom(room);
                }
            }
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_EXIT_ROOM, { user: user, room: room }));
        } else {
            this.log.debug("Failed to handle UserExit event. Room: " + room + ", User: " + user);
        }
    }

    private fnClientDisconnection(msg: IMessage): void {
        const content = msg.content;
        const reasonId = content.getByte("dr");
        this.sfs.handleClientDisconnection(ClientDisconnectionReason.getReason(reasonId));
    }

    private fnSetRoomVariables(msg: IMessage): void {
        const content = msg.content;
        const roomId = content.getInt(SetRoomVariablesRequest.KEY_VAR_ROOM);
        const varList = content.getSFSArray(SetRoomVariablesRequest.KEY_VAR_LIST)!;
        const room = this.sfs.roomManager.getRoomById(roomId);
        const changedVars: Array<string> = [];
        if (room !== null) {
            for (let i = 0; i < varList.size(); i++) {
                const roomVar = SFSRoomVariable.fromSFSArray(varList.getSFSArray(i)!);
                room.setVariable(roomVar);
                changedVars.push(roomVar.name);
            }
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_VARIABLES_UPDATE, { changedVars: changedVars, room: room }));
        } else {
            this.log.warn("RoomVariablesUpdate, unknown Room id = " + roomId);
        }
    }

    private fnSetUserVariables(msg: IMessage): void {
        const content = msg.content;
        const userId = content.getInt(SetUserVariablesRequest.KEY_USER);
        const varList = content.getSFSArray(SetUserVariablesRequest.KEY_VAR_LIST)!;
        const user = this.sfs.userManager.getUserById(userId);
        const changedVars: Array<string> = [];
        if (user !== null) {
            for (let i = 0; i < varList.size(); i++) {
                const userVar = SFSUserVariable.fromSFSArray(varList.getSFSArray(i)!);
                user.setVariable(userVar);
                changedVars.push(userVar.name);
            }
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_VARIABLES_UPDATE, { changedVars: changedVars, user: user }));
        } else {
            this.log.warn("UserVariablesUpdate: unknown user id = " + userId);
        }
    }

    private fnSubscribeRoomGroup(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const groupId = content.getUtfString(SubscribeRoomGroupRequest.KEY_GROUP_ID);
            const roomList = content.getSFSArray(SubscribeRoomGroupRequest.KEY_ROOM_LIST)!;
            if (this.sfs.roomManager.containsGroup(groupId)) {
                this.log.warn("SubscribeGroup Error. Group:", groupId, "already subscribed!");
            }
            this.populateRoomList(roomList);
            const params = {
                groupId: groupId,
                newRooms: this.sfs.roomManager.getRoomListFromGroup(groupId)
            };
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_GROUP_SUBSCRIBE, params));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_GROUP_SUBSCRIBE_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnUnsubscribeRoomGroup(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const groupId = content.getUtfString(SubscribeRoomGroupRequest.KEY_GROUP_ID);
            if (!this.sfs.roomManager.containsGroup(groupId)) {
                this.log.warn("UnsubscribeGroup Error. Group:", groupId, "is not subscribed!");
            }
            this.sfs.roomManager.removeGroup(groupId);
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_GROUP_UNSUBSCRIBE, { groupId: groupId }));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_GROUP_UNSUBSCRIBE_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnChangeRoomName(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomId = content.getInt(ChangeRoomNameRequest.KEY_ROOM);
            const room = this.sfs.roomManager.getRoomById(roomId);
            if (room !== null) {
                const oldName = room.name;
                this.sfs.roomManager.changeRoomName(room, content.getUtfString(ChangeRoomNameRequest.KEY_NAME));
                this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_NAME_CHANGE, { oldName: oldName, room: room }));
            } else {
                this.log.warn("Room not found, ID:", roomId, ", Room name change failed.");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_NAME_CHANGE_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnChangeRoomPassword(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomId = content.getInt(ChangeRoomPasswordStateRequest.KEY_ROOM);
            const room = this.sfs.roomManager.getRoomById(roomId);
            if (room !== null) {
                this.sfs.roomManager.changeRoomPasswordState(room, content.getBool(ChangeRoomPasswordStateRequest.KEY_PASS));
                this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_PASSWORD_STATE_CHANGE, { room: room }));
            } else {
                this.log.warn("Room not found, ID:", roomId, ", Room password change failed.");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_PASSWORD_STATE_CHANGE_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnChangeRoomCapacity(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomId = content.getInt(ChangeRoomCapacityRequest.KEY_ROOM);
            const room = this.sfs.roomManager.getRoomById(roomId);
            if (room !== null) {
                this.sfs.roomManager.changeRoomCapacity(room, content.getInt(ChangeRoomCapacityRequest.KEY_USER_SIZE), content.getInt(ChangeRoomCapacityRequest.KEY_SPEC_SIZE));
                this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_CAPACITY_CHANGE, { room: room }));
            } else {
                this.log.warn("Room not found, ID:", roomId, ", Room capacity change failed.");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_CAPACITY_CHANGE_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnLogout(msg: IMessage): void {
        this.sfs.handleLogout();
        const content = msg.content;
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.LOGOUT, { zoneName: content.getUtfString(LogoutRequest.KEY_ZONE_NAME) }));
    }

    private fnSpectatorToPlayer(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomId = content.getInt(SpectatorToPlayerRequest.KEY_ROOM_ID);
            const userId = content.getInt(SpectatorToPlayerRequest.KEY_USER_ID);
            const playerId = content.getShort(SpectatorToPlayerRequest.KEY_PLAYER_ID);
            const user = this.sfs.userManager.getUserById(userId);
            const room = this.sfs.roomManager.getRoomById(roomId);
            if (room !== null) {
                if (user !== null) {
                    if (user.isJoinedInRoom(room)) {
                        user.setPlayerId(playerId, room);
                        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.SPECTATOR_TO_PLAYER, { room: room, user: user, playerId: playerId }));
                    } else {
                        this.log.warn("User: " + user + " not joined in Room: ", room, ", SpectatorToPlayer failed.");
                    }
                } else {
                    this.log.warn("User not found, ID:", userId, ", SpectatorToPlayer failed.");
                }
            } else {
                this.log.warn("Room not found, ID:", roomId, ", SpectatorToPlayer failed.");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.SPECTATOR_TO_PLAYER_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnPlayerToSpectator(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const roomId = content.getInt(PlayerToSpectatorRequest.KEY_ROOM_ID);
            const userId = content.getInt(PlayerToSpectatorRequest.KEY_USER_ID);
            const user = this.sfs.userManager.getUserById(userId);
            const room = this.sfs.roomManager.getRoomById(roomId);
            if (room !== null) {
                if (user !== null) {
                    if (user.isJoinedInRoom(room)) {
                        user.setPlayerId(-1, room);
                        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.PLAYER_TO_SPECTATOR, { room: room, user: user }));
                    } else {
                        this.log.warn("User: " + user + " not joined in Room: ", room, ", PlayerToSpectator failed.");
                    }
                } else {
                    this.log.warn("User not found, ID:", userId, ", PlayerToSpectator failed.");
                }
            } else {
                this.log.warn("Room not found, ID:", roomId, ", PlayerToSpectator failed.");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.PLAYER_TO_SPECTATOR_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnInitBuddyList(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddyList = content.getSFSArray(InitBuddyListRequest.KEY_BLIST)!;
            const myVars = content.getSFSArray(InitBuddyListRequest.KEY_MY_VARS)!;
            const buddyStates = content.getUtfStringArray(InitBuddyListRequest.KEY_BUDDY_STATES);
            this.sfs.buddyManager.clearAll();
            for (let i = 0; i < buddyList.size(); i++) {
                const buddy = SFSBuddy.fromSFSArray(buddyList.getSFSArray(i)!);
                this.sfs.buddyManager.addBuddy(buddy);
            }
            if (buddyStates !== null) {
                this.sfs.buddyManager.setBuddyStates(buddyStates);
            }
            const myVariables: Array<BuddyVariable> = [];
            for (let i = 0; i < myVars.size(); i++) {
                myVariables.push(SFSBuddyVariable.fromSFSArray(myVars.getSFSArray(i)!));
            }
            this.sfs.buddyManager.setMyVariables(myVariables);
            this.sfs.buddyManager.setInited();
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_LIST_INIT, { buddyList: this.sfs.buddyManager.buddyList, myVariables: this.sfs.buddyManager.myVariables }));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnAddBuddy(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddy = SFSBuddy.fromSFSArray(content.getSFSArray(AddBuddyRequest.KEY_BUDDY_NAME)!);
            this.sfs.buddyManager.addBuddy(buddy);
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ADD, { buddy: buddy }));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnRemoveBuddy(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddyName = content.getUtfString(RemoveBuddyRequest.KEY_BUDDY_NAME);
            const buddy = this.sfs.buddyManager.removeBuddyByName(buddyName);
            if (buddy !== null) {
                this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_REMOVE, { buddy: buddy }));
            } else {
                this.log.warn("RemoveBuddy failed, buddy not found: " + buddyName);
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnBlockBuddy(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddyName = content.getUtfString(BlockBuddyRequest.KEY_BUDDY_NAME);
            const buddy = this.sfs.buddyManager.getBuddyByName(buddyName);
            if (buddy !== null) {
                buddy.setBlocked(content.getBool(BlockBuddyRequest.KEY_BUDDY_BLOCK_STATE));
                this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_BLOCK, { buddy: buddy }));
            } else {
                this.log.warn("BlockBuddy failed, buddy not found: " + buddyName + ", in local BuddyList");
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnGoOnline(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddyName = content.getUtfString(GoOnlineRequest.KEY_BUDDY_NAME);
            const buddy = this.sfs.buddyManager.getBuddyByName(buddyName);
            const isItMe = buddyName === this.sfs.mySelf!.name;
            const state = content.getByte(GoOnlineRequest.KEY_ONLINE);
            const isOnline = state === BuddyOnlineState.ONLINE;
            let dispatchEvent = true;
            if (isItMe) {
                if (this.sfs.buddyManager.myOnlineState !== isOnline) {
                    this.log.warn("Unexpected: MyOnlineState is not in synch with the server. Resynching: " + isOnline);
                    this.sfs.buddyManager.setMyOnlineState(isOnline);
                }
            } else {
                if (buddy === null) {
                    this.log.warn("GoOnline error, buddy not found: " + buddyName + ", in local BuddyList.");
                    return;
                }
                buddy.setId(content.getInt(GoOnlineRequest.KEY_BUDDY_ID));
                buddy.setVariable(new SFSBuddyVariable(ReservedBuddyVariables.BV_ONLINE, isOnline));
                if (state === BuddyOnlineState.LEFT_THE_SERVER) {
                    buddy.clearVolatileVariables();
                }
                dispatchEvent = this.sfs.buddyManager.myOnlineState;
            }
            if (dispatchEvent) {
                this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ONLINE_STATE_UPDATE, { buddy: buddy, isItMe: isItMe }));
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnSetBuddyVariables(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            const buddyName = content.getUtfString(SetBuddyVariablesRequest.KEY_BUDDY_NAME);
            const varList = content.getSFSArray(SetBuddyVariablesRequest.KEY_BUDDY_VARS)!;
            const buddy = this.sfs.buddyManager.getBuddyByName(buddyName);
            const isItMe = buddyName === this.sfs.mySelf!.name;
            const changedVars: Array<string> = [];
            const variables: Array<BuddyVariable> = [];
            let dispatchEvent = true;
            for (let i = 0; i < varList.size(); i++) {
                const buddyVar = SFSBuddyVariable.fromSFSArray(varList.getSFSArray(i)!);
                variables.push(buddyVar);
                changedVars.push(buddyVar.name);
            }
            if (isItMe) {
                this.sfs.buddyManager.setMyVariables(variables);
            } else {
                if (buddy === null) {
                    this.log.warn("Unexpected. Target of BuddyVariables update not found: " + buddyName);
                    return;
                }
                buddy.setVariables(variables);
                dispatchEvent = this.sfs.buddyManager.myOnlineState;
            }
            if (dispatchEvent) {
                this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, { isItMe: isItMe, changedVars: changedVars, buddy: buddy }));
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSBuddyEvent(SFSBuddyEvent.BUDDY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnFindRooms(msg: IMessage): void {
        const content = msg.content;
        const roomList = content.getSFSArray(FindRoomsRequest.KEY_FILTERED_ROOMS)!;
        const rooms: Array<Room> = [];
        for (let i = 0; i < roomList.size(); i++) {
            rooms.push(SFSRoom.fromSFSArray(roomList.getSFSArray(i)!));
        }
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_FIND_RESULT, { rooms: rooms }));
    }

    private fnFindUsers(msg: IMessage): void {
        const content = msg.content;
        const userList = content.getSFSArray(FindUsersRequest.KEY_FILTERED_USERS)!;
        const users: Array<User> = [];
        const mySelf = this.sfs.mySelf!;
        for (let i = 0; i < userList.size(); i++) {
            let user = SFSUser.fromSFSArray(userList.getSFSArray(i)!);
            if (user.id === mySelf.id) {
                user = mySelf;
            }
            users.push(user);
        }
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.USER_FIND_RESULT, { users: users }));
    }

    private fnInviteUsers(msg: IMessage): void {
        const content = msg.content;
        let user: User | null = null;
        if (content.containsKey(InviteUsersRequest.KEY_USER_ID)) {
            user = this.sfs.userManager.getUserById(content.getInt(InviteUsersRequest.KEY_USER_ID));
        } else {
            user = SFSUser.fromSFSArray(content.getSFSArray(InviteUsersRequest.KEY_USER)!);
        }
        const seconds = content.getShort(InviteUsersRequest.KEY_TIME);
        const invitationId = content.getInt(InviteUsersRequest.KEY_INVITATION_ID);
        const invParams = content.getSFSObject(InviteUsersRequest.KEY_PARAMS);
        const invitation = new SFSInvitation(user!, this.sfs.mySelf!, seconds, invParams);
        invitation.id = invitationId;
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.INVITATION, { invitation: invitation }));
    }

    private fnInvitationReply(msg: IMessage): void {
        const content = msg.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            let user: User | null = null;
            if (content.containsKey(InviteUsersRequest.KEY_USER_ID)) {
                user = this.sfs.userManager.getUserById(content.getInt(InviteUsersRequest.KEY_USER_ID));
            } else {
                user = SFSUser.fromSFSArray(content.getSFSArray(InviteUsersRequest.KEY_USER)!);
            }
            const replyId = content.getUnsignedByte(InviteUsersRequest.KEY_REPLY_ID);
            const replyParams = content.getSFSObject(InviteUsersRequest.KEY_PARAMS);
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.INVITATION_REPLY, { invitee: user, reply: replyId, data: replyParams }));
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.INVITATION_REPLY_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnQuickJoinGame(msg: IMessage): void {
        const content = msg.content;
        if (content.containsKey(BaseRequest.KEY_ERROR_CODE)) {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            this.sfs.dispatchEvent(new SFSEvent(SFSEvent.ROOM_JOIN_ERROR, { errorMessage: errorMsg, errorCode: errorCode }));
        }
    }

    private fnPingPong(msg: IMessage): void {
        const lagValue = this.sfs.lagMonitor!.onPingPong();
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.PING_PONG, { lagValue: lagValue }));
    }

    private fnCallExtension(msg: IMessage): void {
        // Handled by ExtensionController
    }

    private fnSendObject(msg: IMessage): void {
        // Handled by fnGenericMessage -> handleObjectMessage
    }

    private populateRoomList(roomListData: ISFSArray): void {
        const roomManager = this.sfs.roomManager;
        for (let i = 0; i < roomListData.size(); i++) {
            const roomArr = roomListData.getSFSArray(i)!;
            const room = SFSRoom.fromSFSArray(roomArr);
            roomManager.replaceRoom(room);
        }
    }

    private getOrCreateUser(userData: ISFSArray, addToManager: boolean = false, room: Room | null = null): User {
        const userId = userData.getInt(0);
        let user = this.sfs.userManager.getUserById(userId);
        if (user === null) {
            user = SFSUser.fromSFSArray(userData, room);
            user.userManager = this.sfs.userManager;
        } else if (room !== null) {
            user.setPlayerId(userData.getShort(3), room);
            const varList = userData.getSFSArray(4)!;
            for (let i = 0; i < varList.size(); i++) {
                user.setVariable(SFSUserVariable.fromSFSArray(varList.getSFSArray(i)!));
            }
        }
        if (addToManager) {
            this.sfs.userManager.addUser(user);
        }
        return user;
    }
}
