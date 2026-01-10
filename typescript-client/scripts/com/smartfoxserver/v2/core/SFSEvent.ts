import Event from "openfl/events/Event";
import { BaseEvent } from "./BaseEvent";

/**
 * SFSEvent - SmartFoxServer event class with all event type constants.
 */
export class SFSEvent extends BaseEvent {
    public static readonly HANDSHAKE: string = "handshake";
    public static readonly UDP_INIT: string = "udpInit";
    public static readonly CONNECTION: string = "connection";
    public static readonly PING_PONG: string = "pingPong";
    public static readonly SOCKET_ERROR: string = "socketError";
    public static readonly CONNECTION_LOST: string = "connectionLost";
    public static readonly CONNECTION_RETRY: string = "connectionRetry";
    public static readonly CONNECTION_RESUME: string = "connectionResume";
    public static readonly CONNECTION_ATTEMPT_HTTP: string = "connectionAttemptHttp";
    public static readonly CONFIG_LOAD_SUCCESS: string = "configLoadSuccess";
    public static readonly CONFIG_LOAD_FAILURE: string = "configLoadFailure";
    public static readonly LOGIN: string = "login";
    public static readonly LOGIN_ERROR: string = "loginError";
    public static readonly LOGOUT: string = "logout";
    public static readonly ROOM_ADD: string = "roomAdd";
    public static readonly ROOM_REMOVE: string = "roomRemove";
    public static readonly ROOM_CREATION_ERROR: string = "roomCreationError";
    public static readonly ROOM_JOIN: string = "roomJoin";
    public static readonly ROOM_JOIN_ERROR: string = "roomJoinError";
    public static readonly USER_ENTER_ROOM: string = "userEnterRoom";
    public static readonly USER_EXIT_ROOM: string = "userExitRoom";
    public static readonly USER_COUNT_CHANGE: string = "userCountChange";
    public static readonly PUBLIC_MESSAGE: string = "publicMessage";
    public static readonly PRIVATE_MESSAGE: string = "privateMessage";
    public static readonly OBJECT_MESSAGE: string = "objectMessage";
    public static readonly MODERATOR_MESSAGE: string = "moderatorMessage";
    public static readonly ADMIN_MESSAGE: string = "adminMessage";
    public static readonly EXTENSION_RESPONSE: string = "extensionResponse";
    public static readonly ROOM_VARIABLES_UPDATE: string = "roomVariablesUpdate";
    public static readonly USER_VARIABLES_UPDATE: string = "userVariablesUpdate";
    public static readonly ROOM_GROUP_SUBSCRIBE: string = "roomGroupSubscribe";
    public static readonly ROOM_GROUP_SUBSCRIBE_ERROR: string = "roomGroupSubscribeError";
    public static readonly ROOM_GROUP_UNSUBSCRIBE: string = "roomGroupUnsubscribe";
    public static readonly ROOM_GROUP_UNSUBSCRIBE_ERROR: string = "roomGroupUnsubscribeError";
    public static readonly PLAYER_TO_SPECTATOR: string = "playerToSpectator";
    public static readonly PLAYER_TO_SPECTATOR_ERROR: string = "playerToSpectatorError";
    public static readonly SPECTATOR_TO_PLAYER: string = "spectatorToPlayer";
    public static readonly SPECTATOR_TO_PLAYER_ERROR: string = "spectatorToPlayerError";
    public static readonly ROOM_NAME_CHANGE: string = "roomNameChange";
    public static readonly ROOM_NAME_CHANGE_ERROR: string = "roomNameChangeError";
    public static readonly ROOM_PASSWORD_STATE_CHANGE: string = "roomPasswordStateChange";
    public static readonly ROOM_PASSWORD_STATE_CHANGE_ERROR: string = "roomPasswordStateChangeError";
    public static readonly ROOM_CAPACITY_CHANGE: string = "roomCapacityChange";
    public static readonly ROOM_CAPACITY_CHANGE_ERROR: string = "roomCapacityChangeError";
    public static readonly ROOM_FIND_RESULT: string = "roomFindResult";
    public static readonly USER_FIND_RESULT: string = "userFindResult";
    public static readonly INVITATION: string = "invitation";
    public static readonly INVITATION_REPLY: string = "invitationReply";
    public static readonly INVITATION_REPLY_ERROR: string = "invitationReplyError";

    constructor(type: string, params: any) {
        super(type);
        this.params = params;
    }

    public override clone(): Event {
        return new SFSEvent(this.type, this.params);
    }

    public override toString(): string {
        return `[SFSEvent type="${this.type}" bubbles=${this.bubbles} cancelable=${this.cancelable} params=${JSON.stringify(this.params)}]`;
    }
}
