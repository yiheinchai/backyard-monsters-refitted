import DisplayObjectContainer from "openfl/display/DisplayObjectContainer";
import StageDisplayState from "openfl/display/StageDisplayState";

import { BYMChat } from "./BYMChat";
import { ChatBox } from "./ui/ChatBox";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getLOGIN(): any { return require("../../../LOGIN").LOGIN; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }



/**
 * Chat system manager - handles chat initialization and connection.
 */
export class Chat {
    public static _bymChat: BYMChat | null = null;
    public static _chatroomNumber: number = 0;
    public static readonly NUM_CHAT_ROOMS: number = 300;
    public static _chatInited: boolean = false;
    public static _chatEnabled: boolean = true;
    public static _validName: boolean = true;
    public static _chatServers: string[] | null = null;
    public static _chatBlackList: string[] | null = null;
    public static _chatWhiteList: string[] | null = null;
    public static _countryCodeBlackList: string[] | null = null;
    public static _chatServer: string = "";

    constructor() {}

    public static initChat(): void {
        if (Chat._chatInited) {
            if (Chat._bymChat !== null) {
                Chat._bymChat.show();
            }
            if (Chat._bymChat && Chat._bymChat.IsConnected) {
                return;
            }
        }
        
        if (Chat._chatServers === null || Chat._chatServers.length === 0) {
            return;
        }
        
        if (!Chat.flagsShouldChatExist()) {
            if (Chat._bymChat !== null) {
                Chat._bymChat.logout();
                Chat._bymChat.hide();
                Chat._bymChat = null;
                Chat._chatInited = false;
            }
            return;
        }
        
        Chat._chatroomNumber = 0;
        if (!getGLOBAL()._local) {
            if (getMapRoomManager().instance.isInMapRoom3) {
                Chat._chatroomNumber = getMapRoomManager().instance.worldID;
            } else {
                const numChatRooms = (getGLOBAL()._flags !== null && getGLOBAL()._flags.numchatrooms) ? getGLOBAL()._flags.numchatrooms : Chat.NUM_CHAT_ROOMS;
                Chat._chatroomNumber = getLOGIN()._playerID % numChatRooms;
            }
        }
        
        if (!Chat._chatEnabled || Chat._chatServers.length === 0) {
            if (Chat._bymChat !== null) {
                Chat._bymChat.logout();
                Chat._bymChat.hide();
                Chat._bymChat = null;
                Chat._chatInited = false;
            }
            return;
        }
        
        Chat._chatServer = Chat._chatServers[Chat._chatroomNumber % Chat._chatServers.length];
        
        if (Chat._bymChat === null) {
            Chat._bymChat = new BYMChat(new ChatBox(), Chat._chatServer);
            Chat._bymChat.system_message("Connecting to chat");
            Chat._chatInited = true;
            getGLOBAL()._layerUI.addChild(Chat._bymChat);
        }
        
        Chat._bymChat.init();
        
        if (!Chat.chatUserIsInABTest()) {
            Chat._bymChat.disableChat();
            Chat._bymChat.showUnavailableInYourArea();
            return;
        }
        
        if (getTUTORIAL()._stage >= getTUTORIAL()._endstage && Chat.flagsShouldChatExist()) {
            if (Chat._chatEnabled && !Chat._bymChat.IsConnected && Chat._bymChat._open) {
                Chat.connectAndLogin();
            }
        } else {
            Chat._bymChat.disableChat();
        }
    }

    public static connectAndLogin(): void {
        if (!Chat._chatInited) {
            return;
        }
        if (!Chat._validName) {
            return;
        }
        if (Chat._bymChat === null || BYMChat.serverInited || Chat._bymChat.IsConnected || Chat._bymChat.IsJoined) {
            return;
        }
        
        if (Chat._bymChat) {
            const name = Chat.getFirstNameLastInitial();
            if (name === null || name.length === 0) {
                Chat._validName = false;
                Chat._bymChat.showInvalidName();
                return;
            }
            Chat._bymChat.initServer();
            Chat._bymChat.login(name, getLOGIN()._playerID.toString(), getBASE().BaseLevel().level);
            Chat._bymChat.show();
            Chat._bymChat.enter_sector("Sector-" + Chat._chatroomNumber.toString());
        }
    }

    private static getFirstNameLastInitial(): string | null {
        let firstName = getLOGIN()._playerName;
        if (firstName !== null && firstName.length > 0) {
            firstName = firstName.replace(/ /, "_");
            let lastName = getLOGIN()._playerLastName;
            if (lastName !== null && lastName.length > 0) {
                lastName = lastName.substr(0, 1);
                if (lastName.length === 1) {
                    lastName = lastName.toUpperCase();
                    if (lastName !== null && lastName.length === 1) {
                        lastName = lastName.replace(/ /, "_");
                    }
                }
                if (lastName === null || lastName.length !== 1) {
                    return null;
                }
            }
            return firstName + (lastName || "");
        }
        return null;
    }

    public static setChatPosition(parent: DisplayObjectContainer | null = null, x: number = NaN, y: number = NaN): void {
        if (Chat._bymChat !== null) {
            if (!isNaN(x)) {
                Chat._bymChat.x = x;
            }
            if (!isNaN(y)) {
                Chat._bymChat.y = y;
            }
            if (parent !== null) {
                parent.addChild(Chat._bymChat);
            }
            Chat._bymChat.position();
            Chat._bymChat.show();
        }
    }

    public static chatUserIsInABTest(): boolean {
        if (getGLOBAL()._flags) {
            if (getGLOBAL()._flags.hasOwnProperty("chatwhitelist")) {
                Chat._chatWhiteList = String(getGLOBAL()._flags.chatwhitelist).split(",");
            }
            if (getGLOBAL()._flags.hasOwnProperty("chatblacklist")) {
                Chat._chatBlackList = String(getGLOBAL()._flags.chatblacklist).split(",");
            }
            if (getGLOBAL()._flags.hasOwnProperty("countrycodeblacklist")) {
                Chat._countryCodeBlackList = String(getGLOBAL()._flags.countrycodeblacklist).split(",");
            }
        }
        
        if (Chat._chatWhiteList !== null && Chat._chatWhiteList.indexOf(getLOGIN()._playerID.toString()) !== -1) {
            return true;
        }
        if (Chat._chatBlackList !== null && Chat._chatBlackList.indexOf(getLOGIN()._playerID.toString()) !== -1) {
            return false;
        }
        if (Chat._countryCodeBlackList !== null && Chat._countryCodeBlackList.indexOf(getGLOBAL()._countryCode) !== -1) {
            return false;
        }
        if (!Chat._chatEnabled) {
            return false;
        }
        return true;
    }

    public static flagsShouldChatDisplay(): boolean {
        if (getGLOBAL()._flags === null) {
            return false;
        }
        if (!getGLOBAL()._flags.hasOwnProperty("chat")) {
            return false;
        }
        if (getGLOBAL()._flags.chat !== 2) {
            return false;
        }
        if (getMapRoomManager().instance.isInMapRoom2 && getMapRoomManager().instance.isOpen && 
            getGLOBAL()._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN) {
            return false;
        }
        return true;
    }

    public static flagsShouldChatExist(): boolean {
        if (getGLOBAL()._flags === null) {
            return false;
        }
        if (!getGLOBAL()._flags.hasOwnProperty("chat")) {
            return false;
        }
        if (getGLOBAL()._flags.chat <= 0) {
            return false;
        }
        if (!Chat.chatUserIsInABTest()) {
            return false;
        }
        return true;
    }
}
