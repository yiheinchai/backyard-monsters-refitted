import { EventDispatcher } from "openfl/events/EventDispatcher";
import { TimerEvent } from "openfl/events/TimerEvent";
import { Timer } from "openfl/utils/Timer";

import { AdminMessageRequest } from "../../../smartfoxserver/v2/requests/AdminMessageRequest";
import { ExtensionRequest } from "../../../smartfoxserver/v2/requests/ExtensionRequest";
import { JoinRoomRequest } from "../../../smartfoxserver/v2/requests/JoinRoomRequest";
import { LeaveRoomRequest } from "../../../smartfoxserver/v2/requests/LeaveRoomRequest";
import { LoginRequest } from "../../../smartfoxserver/v2/requests/LoginRequest";
import { MessageRecipientMode } from "../../../smartfoxserver/v2/requests/MessageRecipientMode";
import { PrivateMessageRequest } from "../../../smartfoxserver/v2/requests/PrivateMessageRequest";
import { PublicMessageRequest } from "../../../smartfoxserver/v2/requests/PublicMessageRequest";
import { SetUserVariablesRequest } from "../../../smartfoxserver/v2/requests/SetUserVariablesRequest";
import { SFSEvent } from "../../../smartfoxserver/v2/core/SFSEvent";
import { SFSArray } from "../../../smartfoxserver/v2/entities/data/SFSArray";
import { SFSObject } from "../../../smartfoxserver/v2/entities/data/SFSObject";
import { Room } from "../../../smartfoxserver/v2/entities/Room";
import { User } from "../../../smartfoxserver/v2/entities/User";
import { SFSUserVariable } from "../../../smartfoxserver/v2/entities/variables/SFSUserVariable";
import { LoggerEvent } from "../../../smartfoxserver/v2/logging/LoggerEvent";
import { SmartFox } from "../../../smartfoxserver/v2/SmartFox";
import { ClientDisconnectionReason } from "../../../smartfoxserver/v2/util/ClientDisconnectionReason";
import { AS_Login } from "./AS_Login";
import { Channel } from "./Channel";
import { ChatEvent } from "./ChatEvent";
import { IChatSystem } from "./IChatSystem";
import { UserRecord } from "./UserRecord";
import { IAuthenticationSystem } from "./IAuthenticationSystem";

import { LOGGER } from "../../../LOGGER";

/**
 * CS_SmartFoxServer2X - SmartFoxServer2X chat system implementation.
 */
export class CS_SmartFoxServer2X extends EventDispatcher implements IChatSystem {
    public static readonly HOST_LIVE: string = "message5.dc.kixeye.com";
    public static readonly HOST_TEST: string = "message3.dc.kixeye.com";
    public static readonly PORT: number = 9933;
    public static readonly ZONE: string = "Backyard Monsters";
    private static readonly EXT_REQ_STRING: string = "backyardmonsters";

    private m_user: UserRecord | null = null;
    private m_login: AS_Login | null = null;
    private sfs: SmartFox;
    private roomMap: Map<string, Room> = new Map();
    private host: string | null = null;
    private port: number = -1;
    private zone: string | null = null;
    private _isLoggedIn: boolean = false;
    private _isLoggingOut: boolean = false;
    private join_channel: Channel | null = null;
    private keepAliveTimer: Timer | null = null;
    private keepAliveInterval: number = 120000;

    constructor(hostParam: string = "message3.dc.kixeye.com", portParam: number = 9933, zoneParam: string = "Backyard Monsters") {
        super();
        this.host = hostParam;
        this.port = portParam;
        this.zone = zoneParam;
        this.sfs = new SmartFox(true);
        this.sfs.debug = false;
        this.sfs.addEventListener(LoggerEvent.DEBUG, this.onErrorLogged.bind(this));
        this.sfs.addEventListener(LoggerEvent.ERROR, this.onErrorLogged.bind(this));
        this.sfs.addEventListener(LoggerEvent.INFO, this.onErrorLogged.bind(this));
        this.sfs.addEventListener(LoggerEvent.WARNING, this.onErrorLogged.bind(this));
        this.sfs.addEventListener(SFSEvent.EXTENSION_RESPONSE, this.onExtensionResponse.bind(this));
        this.sfs.addEventListener(SFSEvent.ADMIN_MESSAGE, this.onAdminMessage.bind(this));
        this.sfs.addEventListener(SFSEvent.MODERATOR_MESSAGE, this.onModeratorMessage.bind(this));
        this.sfs.addEventListener(SFSEvent.CONFIG_LOAD_SUCCESS, this.onConfigLoadSuccess.bind(this));
        this.sfs.addEventListener(SFSEvent.CONFIG_LOAD_FAILURE, this.onConfigLoadFailure.bind(this));
        this.sfs.addEventListener(SFSEvent.CONNECTION, this.onConnection.bind(this));
        this.sfs.addEventListener(SFSEvent.CONNECTION_LOST, this.onConnectionLost.bind(this));
        this.sfs.addEventListener(SFSEvent.CONNECTION_RESUME, this.onConnectionResume.bind(this));
        this.sfs.addEventListener(SFSEvent.CONNECTION_RETRY, this.onConnectionRetry.bind(this));
        this.sfs.addEventListener(SFSEvent.LOGIN_ERROR, this.onLoginError.bind(this));
        this.sfs.addEventListener(SFSEvent.LOGIN, this.onLogin.bind(this));
        this.sfs.addEventListener(SFSEvent.LOGOUT, this.onLogout.bind(this));
        this.sfs.addEventListener(SFSEvent.ROOM_JOIN_ERROR, this.onRoomJoinError.bind(this));
        this.sfs.addEventListener(SFSEvent.ROOM_JOIN, this.onRoomJoin.bind(this));
        this.sfs.addEventListener(SFSEvent.PUBLIC_MESSAGE, this.onPublicMessage.bind(this));
        this.sfs.addEventListener(SFSEvent.PRIVATE_MESSAGE, this.onPrivateMessage.bind(this));
        this.sfs.addEventListener(SFSEvent.USER_ENTER_ROOM, this.onUserEnterRoom.bind(this));
        this.sfs.addEventListener(SFSEvent.USER_EXIT_ROOM, this.onUserExitRoom.bind(this));
        this.sfs.addEventListener(SFSEvent.USER_VARIABLES_UPDATE, this.onUserVarsUpdate.bind(this));
        this.connect();
    }

    public connect(): boolean {
        let result = false;
        if (!this.sfs.isConnected) {
            try {
                this.sfs.connect(this.host!, this.port);
                result = true;
            } catch (e) {
            }
        }
        return result;
    }

    private onErrorLogged(event: LoggerEvent): void {
        const success = false;
        const params: Record<string, any> = {};
        params["user"] = "Logger";
        params["channel"] = new Channel("World", "system");
        params["message"] = event.params.message;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private onExtensionResponse(event: SFSEvent): void {
        const cmd = String(event.params.cmd);
        const responseParams = event.params.params as SFSObject;
        const command = responseParams.getUtfString("command");
        switch (command) {
            case "room_add":
                this.roomResponse(event, "add");
                break;
            case "room_remove":
                this.roomResponse(event, "remove");
                break;
            case "room":
                this.roomResponse(event);
                break;
            case "ignore":
                this.ignoreResponse(event);
                break;
            case "ignoreerror":
                this.ignoreErrorResponse(event);
                break;
            case "updatename":
                this.updateName(event);
                break;
        }
    }

    private updateName(event: SFSEvent, actionParam: string | null = null): void {
        const responseParams = event.params.params as SFSObject;
        const success = responseParams.getBool("success");
        const command = responseParams.getUtfString("command");
        let action: string | null = null;
        if (actionParam !== null) {
            action = actionParam;
        } else {
            action = responseParams.getUtfString("action");
        }
        switch (action) {
            case "updatedirect":
            case "update":
                const params: Record<string, any> = {};
                params["userid"] = responseParams.getUtfString("userid");
                params["displayname"] = responseParams.getUtfString("displayname");
                this.dispatchEvent(new ChatEvent(ChatEvent.UPDATE_NAME, success, params));
                return;
            default:
                LOGGER.Log("err", "updateName() - unknown action: " + action);
                return;
        }
    }

    private roomResponse(event: SFSEvent, actionParam: string | null = null): void {
        const responseParams = event.params.params as SFSObject;
        const command = responseParams.getUtfString("command");
        let action: string | null = null;
        if (actionParam !== null) {
            action = actionParam;
        } else {
            action = responseParams.getUtfString("action");
        }
        let roomName: string | null = null;
        switch (action) {
            case "add":
                roomName = responseParams.getUtfString("response");
                this.roomMap.set(roomName, this.sfs.getRoomByName(roomName));
                if (roomName === this.join_channel!.Name) {
                    this.join(this.join_channel!);
                }
                break;
            case "remove":
                roomName = responseParams.getUtfString("response");
                this.roomMap.delete(roomName);
                break;
        }
    }

    private ignoreResponse(event: SFSEvent): void {
        const responseParams = event.params.params as SFSObject;
        const command = responseParams.getUtfString("command");
        const action = responseParams.getUtfString("action");
        const success = responseParams.getBool("success");
        const responseArray = responseParams.getSFSArray("response") as SFSArray;
        const ignoreList: Array<any> = [];
        const params: Record<string, any> = {};
        params["command"] = command;
        params["action"] = action;
        if (action === "show") {
            for (let i = 0; i < responseArray.size(); i++) {
                const item = responseArray.getSFSObject(i) as SFSObject;
                const target = item.getUtfString("target");
                const displayname = item.getUtfString("displayname");
                ignoreList.push(item);
            }
            params["ignore_list"] = ignoreList;
        } else {
            params["ignore_list"] = responseArray !== null ? responseArray.toArray() : null;
        }
        if (action === "add" || action === "remove") {
            params["target"] = responseParams.getUtfString("target");
            const displayname = responseParams.getUtfString("displayname");
            if (displayname !== null) {
                params["displayname"] = displayname;
            }
        }
        this.dispatchEvent(new ChatEvent(ChatEvent.IGNORE, success, params));
    }

    private ignoreErrorResponse(event: SFSEvent): void {
        const responseParams = event.params.params as SFSObject;
        const command = responseParams.getUtfString("command");
        const reason = responseParams.getUtfString("reason");
        const success = responseParams.getBool("success");
        const params: Record<string, any> = {};
        params["command"] = command;
        params["reason"] = reason;
        this.dispatchEvent(new ChatEvent(ChatEvent.IGNOREERROR, success, params));
    }

    private onAdminMessage(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["user"] = "Administrator";
        params["channel"] = new Channel(this.m_user!.Name, "private");
        params["message"] = event.params.message;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private onModeratorMessage(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["user"] = "Moderator";
        params["channel"] = new Channel(this.m_user!.Name, "private");
        params["message"] = event.params.message;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private onConfigLoadSuccess(event: SFSEvent): void {
    }

    private onConfigLoadFailure(event: SFSEvent): void {
        const success = false;
        const params: Record<string, any> = {};
        params["reason"] = "config load failure";
        this.dispatchEvent(new ChatEvent(ChatEvent.CONNECT, success, params));
    }

    private onConnection(event: SFSEvent): void {
        const success = Boolean(event.params.success);
        const params: Record<string, any> = {};
        if (!success) {
            params["reason"] = "connection failed";
        }
        this.dispatchEvent(new ChatEvent(ChatEvent.CONNECT, success, params));
    }

    private onConnectionLost(event: SFSEvent): void {
        const success = false;
        const params: Record<string, any> = {};
        switch (event.params.reason) {
            case ClientDisconnectionReason.MANUAL:
                params["reason"] = "client disconnect";
                break;
            case ClientDisconnectionReason.IDLE:
                params["reason"] = "idle timeout";
                break;
            case ClientDisconnectionReason.KICK:
                params["reason"] = "kicked";
                break;
            case ClientDisconnectionReason.BAN:
                params["reason"] = "banned";
                break;
            default:
                params["reason"] = "unknown: " + event.params.reason;
        }
        this.dispatchEvent(new ChatEvent(ChatEvent.CONNECT, success, params));
        if (this._isLoggingOut) {
            this._isLoggedIn = false;
            this.stopKeepAlive();
        }
    }

    private onConnectionResume(event: SFSEvent): void {
    }

    private onConnectionRetry(event: SFSEvent): void {
    }

    public login(authSystem: IAuthenticationSystem): void {
        const loginData = authSystem as AS_Login;
        this.m_login = loginData;
        this.m_user = loginData.User;
        const password = loginData.Password;
        const sfsParams = loginData.Params;
        const request = new LoginRequest(this.m_user.Name, password, this.zone!, sfsParams);
        try {
            this.sfs.send(request);
            this._isLoggingOut = false;
        } catch (e) {
        }
    }

    private onLogin(event: SFSEvent): void {
        this.roomMap = new Map();
        const roomList = this.sfs.roomManager.getRoomList();
        for (const room of roomList) {
            this.roomMap.set(room.name, room);
        }
        const success = true;
        const params: Record<string, any> = {};
        if (!success) {
            params["reason"] = "login failed";
        }
        this.dispatchEvent(new ChatEvent(ChatEvent.LOGIN, success, params));
        this._isLoggedIn = true;
        this.initKeepAlive();
    }

    private onLoginError(event: SFSEvent): void {
        const success = false;
        const params: Record<string, any> = {};
        params["reason"] = "login error";
        this.dispatchEvent(new ChatEvent(ChatEvent.LOGIN, success, params));
        this._isLoggedIn = false;
    }

    public logout(): void {
        this._isLoggedIn = false;
        this.sfs.disconnect();
        this.stopKeepAlive();
    }

    private onLogout(event: SFSEvent): void {
        this._isLoggedIn = false;
        try {
            this.sfs.disconnect();
        } catch (e) {
        }
        if (this._isLoggingOut) {
            this.stopKeepAlive();
            this._isLoggingOut = false;
        }
    }

    public join(channel: Channel, password: string | null = null, createIfNotExist: boolean = true): void {
        this.join_channel = channel;
        if (Boolean(this.roomMap) && this.roomMap.has(this.join_channel.Name)) {
            const roomId = -1;
            const request = new JoinRoomRequest(this.join_channel.Name, "", roomId, false);
            try {
                this.sfs.send(request);
            } catch (e) {
            }
        } else if (createIfNotExist) {
            const sfsParams = new SFSObject();
            sfsParams.putUtfString("command", "create_room");
            sfsParams.putUtfString("name", this.join_channel.Name);
            const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
            try {
                this.sfs.send(request);
            } catch (e) {
            }
        }
    }

    public setDisplayNameUserVar(displayName: string): void {
        const vars: Array<SFSUserVariable> = [];
        vars.push(new SFSUserVariable("displayName", displayName));
        this.sfs.send(new SetUserVariablesRequest(vars));
    }

    private onUserVarsUpdate(event: SFSEvent): void {
        // Comment: Obfuscation
    }

    public updateDisplayName(channel: Channel, userId: string, displayName: string): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "updatename");
        sfsParams.putUtfString("action", "update");
        sfsParams.putUtfString("roomname", channel.Name);
        sfsParams.putUtfString("userid", userId);
        sfsParams.putUtfString("displayname", displayName);
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        try {
            this.sfs.send(request);
        } catch (e) {
            LOGGER.Log("err", "Exception in updateDisplayName.sfs.send(extensionRequest): " + e);
        }
    }

    public updateDisplayNameDirect(channel: Channel, recipientId: string, userId: string, displayName: string): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "updatename");
        sfsParams.putUtfString("action", "updatedirect");
        sfsParams.putUtfString("roomname", channel.Name);
        sfsParams.putUtfString("userid", userId);
        sfsParams.putUtfString("displayname", displayName);
        sfsParams.putUtfString("recipientid", recipientId);
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        try {
            this.sfs.send(request);
        } catch (e) {
            LOGGER.Log("err", "Exception in updateDisplayName.sfs.send(extensionRequest): " + e);
        }
    }

    private onRoomJoin(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["channel"] = this.join_channel;
        this.dispatchEvent(new ChatEvent(ChatEvent.JOIN, success, params));
    }

    private onRoomJoinError(event: SFSEvent): void {
        const success = false;
        const params: Record<string, any> = {};
        params["channel"] = this.join_channel;
        params["reason"] = "error joining room";
        this.dispatchEvent(new ChatEvent(ChatEvent.JOIN, success, params));
    }

    private onRoomAdd(event: SFSEvent): void {
        this.roomMap.set(event.params.room.name, event.params.room);
        if (event.params.room.name === this.join_channel!.Name) {
            this.join(this.join_channel!);
        }
    }

    private onRoomRemove(event: SFSEvent): void {
        this.roomMap.delete(event.params.room.name);
    }

    private onRoomCreationError(event: SFSEvent): void {
    }

    public leave(channel: Channel, autocleanup: boolean = true): void {
        if (this.roomMap === null) {
            return;
        }
        if (!this.roomMap.has(channel.Name)) {
            return;
        }
        const request = new LeaveRoomRequest(this.roomMap.get(channel.Name)!);
        let success = true;
        try {
            this.sfs.send(request);
        } catch (e) {
            success = false;
        }
        const params: Record<string, any> = {};
        params["channel"] = channel;
        this.dispatchEvent(new ChatEvent(ChatEvent.LEAVE, success, params));
    }

    public extension(action: string, data: Map<string, any>): void {
        const sfsParams = new SFSObject();
        switch (action) {
            case "add":
                sfsParams.putInt("n1", data.get("n1") as number);
                sfsParams.putInt("n2", data.get("n2") as number);
                break;
        }
        const request = new ExtensionRequest(action, sfsParams);
        try {
            this.sfs.send(request);
        } catch (e) {
        }
    }

    public adminMessage(message: string): void {
        const recipientMode = new MessageRecipientMode(MessageRecipientMode.TO_ZONE, null);
        const request = new AdminMessageRequest(message, recipientMode, null);
        this.sfs.send(request);
    }

    public say(channel: Channel, message: string): void {
        let msg = message.replace(/&/g, "&amp;");
        msg = msg.replace(/</g, "&lt;");
        msg = msg.replace(/>/g, "&gt;");
        msg = msg.replace(/\n/g, "");
        msg = msg.replace(/\r/g, "");
        msg = msg.replace(/&#10;/g, "");
        msg = msg.replace(/&#13;/g, "");
        msg = msg.replace(/^\s+$/, "");
        msg = msg.replace(/:/g, "&#58;");
        msg = msg.replace(/'/g, "&#39;");
        if (msg === "") {
            return;
        }
        const roomName = channel.Name;
        if (channel.Type === "private") {
            const sfsParams = new SFSObject();
            sfsParams.putUtfString("sender", this.m_user!.Name);
            sfsParams.putUtfString("receiver", roomName);
            const user = this.sfs.userManager.getUserByName(roomName);
            if (user !== null) {
                const request = new PrivateMessageRequest(msg, user.id, sfsParams);
                try {
                    this.sfs.send(request);
                } catch (e) {
                }
            } else {
                this.error(null, "no user found: '" + roomName + "'");
            }
        }
        if (channel.Type === "system") {
            if (this.roomMap === null) {
            }
            if (!this.roomMap.has(channel.Name)) {
                return;
            }
            const request = new PublicMessageRequest(msg, null, this.roomMap.get(roomName)!);
            try {
                this.sfs.send(request);
            } catch (e) {
            }
        }
    }

    private onPrivateMessage(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        const data = event.params.data as SFSObject;
        params["user"] = event.params.sender.name;
        params["channel"] = new Channel(data.getUtfString("receiver"), "private");
        params["message"] = event.params.message;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private onPublicMessage(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["user"] = event.params.sender.name;
        params["channel"] = new Channel(event.params.room.name, "system");
        params["message"] = event.params.message;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private onUserEnterRoom(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["user"] = event.params.user;
        params["room"] = event.params.room;
        this.dispatchEvent(new ChatEvent(ChatEvent.USER_ENTER, success, params));
    }

    private onUserExitRoom(event: SFSEvent): void {
        const success = true;
        const params: Record<string, any> = {};
        params["user"] = event.params.user;
        params["room"] = event.params.room;
        this.dispatchEvent(new ChatEvent(ChatEvent.USER_EXIT, success, params));
    }

    public list(filter: string | null = null): void {
        const success = true;
        const params: Record<string, any> = {};
        params["list"] = [];
        this.dispatchEvent(new ChatEvent(ChatEvent.LIST, success, params));
    }

    public members(channel: Channel): void {
        const success = true;
        const params: Record<string, any> = {};
        params["members"] = [];
        this.dispatchEvent(new ChatEvent(ChatEvent.MEMBERS, success, params));
    }

    public showIgnore(): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "ignore");
        sfsParams.putUtfString("action", "show");
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        this.sfs.send(request);
    }

    public getIgnore(): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "ignore");
        sfsParams.putUtfString("action", "list");
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        this.sfs.send(request);
    }

    public ignore(target: string, displayName: string): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "ignore");
        sfsParams.putUtfString("action", "add");
        sfsParams.putUtfString("target", target);
        sfsParams.putUtfString("displayname", displayName);
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        this.sfs.send(request);
    }

    public unignore(target: string): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "ignore");
        sfsParams.putUtfString("action", "remove");
        sfsParams.putUtfString("target", target);
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        this.sfs.send(request);
    }

    public error(message: string | null, errorMessage: string): void {
        const success = false;
        const params: Record<string, any> = {};
        params["error"] = errorMessage;
        this.dispatchEvent(new ChatEvent(ChatEvent.SAY, success, params));
    }

    private initKeepAlive(): void {
        if (this.keepAliveTimer !== null) {
            this.stopKeepAlive();
        }
        this.keepAliveTimer = new Timer(this.keepAliveInterval);
        this.keepAliveTimer.addEventListener(TimerEvent.TIMER, this.keepAliveListener.bind(this));
        this.keepAliveTimer.start();
    }

    private stopKeepAlive(): void {
        if (this.keepAliveTimer !== null) {
            this.keepAliveTimer.removeEventListener(TimerEvent.TIMER, this.keepAliveListener.bind(this));
            this.keepAliveTimer.stop();
            this.keepAliveTimer = null;
        }
    }

    private keepAliveListener(event: TimerEvent): void {
        const sfsParams = new SFSObject();
        sfsParams.putUtfString("command", "keepalive");
        const request = new ExtensionRequest(CS_SmartFoxServer2X.EXT_REQ_STRING, sfsParams);
        try {
            this.sfs.send(request);
        } catch (e) {
        }
        if (!this.sfs.isConnected && this._isLoggedIn && !this._isLoggingOut) {
            if (!this.connect()) {
                this._isLoggedIn = false;
                this.stopKeepAlive();
            }
        }
        if (this._isLoggingOut || !this._isLoggedIn) {
            this.stopKeepAlive();
        }
    }

    public get roomNames(): Array<string> {
        const names: Array<string> = [];
        for (const [name, room] of this.roomMap) {
            names.push(name);
        }
        return names;
    }

    public get numUsers(): number {
        return this.sfs.userManager.userCount;
    }
}
