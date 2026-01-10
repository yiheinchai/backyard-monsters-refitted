import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Rectangle from "openfl/geom/Rectangle";
import Keyboard from "openfl/ui/Keyboard";
import Timer from "openfl/utils/Timer";
import { TweenLite } from "gs/TweenLite";

import { ChatBox } from "./ui/ChatBox";
import { Channel } from "./Channel";
import { ChatEvent } from "./ChatEvent";
import { Chat } from "./Chat";
import { CS_SmartFoxServer2X } from "./CS_SmartFoxServer2X";
import { AS_Login } from "./AS_Login";
import { UserRecord } from "./UserRecord";
import { ProfanityFilter } from "./ProfanityFilter";
import { User, Room, SFSObject } from "../../smartfoxserver/v2/entities";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";

/**
 * BYMChat - Main chat system for Backyard Monsters.
 */
export class BYMChat extends Sprite {
    private static _chat: CS_SmartFoxServer2X | null = null;
    public static _userRecord: UserRecord | null = null;
    public static readonly WIDTH: number = 380;
    private static _serverInited: boolean = false;
    private static _displayNameMap: Map<string, string> = new Map();

    public readonly GLOBAL_CHANNEL: Channel = new Channel("World", "system");
    public readonly IGNORE_LIST_CHANNEL: Channel = new Channel("IgnoreList", "system");

    private _auth: AS_Login | null = null;
    private _joinAttempts: number = 0;
    private readonly DELAY_INITIAL: number = 1000;
    private readonly DELAY_INCREASE: number = 500;
    private readonly DELAY_DECREASE: number = 500;
    private readonly DELAY_DECREASE_TIME: number = 1000;
    private delay: number = 1000;
    public initialized: boolean = false;
    private _sectorBaseName: string | null = null;
    private readonly MESSAGE_QUEUE_SIZE: number = 2;
    private messageQueue: Array<string>;
    public sector_channel: Channel | null = null;
    private default_chat_channel: string = "sector";
    private _ignore_list: Array<string> | null = null;
    public isLoggingOut: boolean = false;
    private isLoggingOutTimer: number = 5;
    public chatBox: ChatBox;
    private _chatHost: string;
    private _chatPort: number;
    private _isConnected: boolean = false;
    private _isJoined: boolean = false;
    private _hideX: number = 0;
    private _hideY: number = 0;
    private _showX: number = 0;
    private _showY: number = 0;
    public _open: boolean = true;
    private globalChatTimer: Timer | null = null;
    private globalChatLastSent: Date | null = null;
    private overheat: boolean = false;
    private messageQueueTimer: Timer | null = null;
    private messageQueueLastCheck: Date | null = null;

    constructor(chatBox: ChatBox, host: string) {
        this.messageQueue = [];
        super();
        this.chatBox = chatBox;
        this.addChild(chatBox as MovieClip);
        chatBox.addEventListener(KeyboardEvent.KEY_DOWN, this.keyboardEventHandler.bind(this));
        let hostStr = host === null || host === "" ? CS_SmartFoxServer2X.HOST_TEST : host;
        let port = CS_SmartFoxServer2X.PORT;
        const parts = hostStr.split(":");
        if (parts.length > 1) {
            hostStr = String(parts[0]);
            port = parseInt(parts[1]);
        }
        this._chatHost = hostStr;
        this._chatPort = port;
        if (GLOBAL.StatGet("chatmin") === 1) {
            this._open = false;
        } else {
            this._open = true;
        }
    }

    public static get serverInited(): boolean {
        return BYMChat._serverInited;
    }

    public get IsAnimating(): boolean {
        return this.chatBox._animating;
    }

    public get IsConnected(): boolean {
        return this._isConnected;
    }

    public get IsJoined(): boolean {
        return this._isJoined;
    }

    public initServer(): void {
        try {
            BYMChat._chat = new CS_SmartFoxServer2X(this._chatHost, this._chatPort);
            BYMChat._chat.addEventListener(ChatEvent.CONNECT, this.onConnect.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.LOGIN, this.onLogin.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.JOIN, this.onJoin.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.LEAVE, this.onLeave.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.SAY, this.onSay.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.LIST, this.onList.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.MEMBERS, this.onMembers.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.IGNORE, this.onIgnore.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.IGNOREERROR, this.onIgnoreError.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.UPDATE_NAME, this.onUpdateName.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.USER_ENTER, this.onUserEnter.bind(this));
            BYMChat._chat.addEventListener(ChatEvent.USER_EXIT, this.onUserExit.bind(this));
            BYMChat._serverInited = true;
        } catch (e: any) {
            this.displayUnavailable("init failed");
        }
    }

    public init(): void {
        this.chatBox.init();
        this.toggleVisibleB();
        this.initialized = true;
    }

    private keyboardEventHandler(event: KeyboardEvent): void {
        if (event.keyCode === Keyboard.ENTER) {
            this.processInput();
        }
    }

    public broadcastDisplayNameUpdate(level: number): void {
        if (this.sector_channel === null) {
            return;
        }
        if (BYMChat._userRecord === null) {
            return;
        }
        BYMChat._chat!.setDisplayNameUserVar("[" + level + "] " + BYMChat._userRecord.Id);
        BYMChat._chat!.updateDisplayName(this.sector_channel, BYMChat._userRecord.Name, "[" + level + "] " + BYMChat._userRecord.Id);
    }

    private clearChat(): void {
        this.chatBox.clearChat();
    }

    public SendMessage(): void {
        this.processInput();
    }

    private processInput(): void {
        let input = this.chatBox.inputText;
        if (input.length > 0) {
            input = input.replace(/\s+/g, " ");
            let command: string | null = null;
            if (input.charAt(0) === "/") {
                const spaceIndex = input.search(/\s+/);
                if (spaceIndex === -1) {
                    command = input;
                    input = "";
                } else {
                    command = input.substring(0, spaceIndex);
                    input = input.slice(spaceIndex + 1);
                    input = input.replace(/^\s+/, "");
                }
                switch (command) {
                    case "/entersector":
                        this.clearChat();
                        this.enter_sector(input, true);
                        break;
                    case "/l":
                    case "/list":
                    case "/ignored":
                    case "/listignored":
                    case "/igd":
                        BYMChat._chat!.showIgnore();
                        break;
                    case "/?":
                    case "/h":
                    case "/help":
                        this.system_message("<b>- Commands -</b>\n" + "To list ignored users: /list");
                        break;
                    default:
                        this.default_chat(input);
                }
            } else {
                this.default_chat(input);
            }
        }
        this.chatBox.clearInputText();
    }

    public connect(): void {
        if (!this._isConnected) {
            BYMChat._chat!.connect();
        }
    }

    public login(name: string, id: string, level: number): void {
        BYMChat._userRecord = new UserRecord(name, id);
        this._auth = new AS_Login(BYMChat._userRecord);
        this._auth.authenticate();
        if (this._isConnected) {
            BYMChat._chat!.login(this._auth);
        }
    }

    public logout(): void {
        if (BYMChat._chat) {
            BYMChat._chat.logout();
            this.isLoggingOut = true;
            TweenLite.delayedCall(3, this.logoutDelayCB.bind(this));
        }
    }

    public logoutDelayCB(): void {
        this.isLoggingOut = false;
    }

    public disableChat(): void {
        this._joinAttempts = 0;
        BYMChat._serverInited = false;
        this._isConnected = false;
        this._isJoined = false;
        this.logout();
        this.clearChat();
        this.chatBox.EnableInput(false);
        this.system_message("Chat is currently disconnected.");
    }

    public system_message(message: string): void {
        this.showChatMessage(null, null, message);
    }

    public default_chat(message: string): void {
        if (!this._isConnected) {
            return;
        }
        switch (this.default_chat_channel) {
            case "sector":
            case "combat":
                this.sector_chat(message);
                break;
            default:
                this.sector_chat(message);
        }
    }

    public global_chat(message: string): void {
        if (!this._isConnected) {
            LOGGER.Log("err", "BYMChat.global_chat(): not connected");
            return;
        }
        if (this.globalChatTimer === null) {
            BYMChat._chat!.say(this.GLOBAL_CHANNEL, message);
            this.delay += this.DELAY_INCREASE;
            this.globalChatLastSent = new Date();
            this.globalChatTimer = new Timer(250);
            this.globalChatTimer.addEventListener(TimerEvent.TIMER, this.globalChatListener.bind(this));
            this.globalChatTimer.start();
        } else if (this.messageQueue.length < this.MESSAGE_QUEUE_SIZE) {
            let isDuplicate = false;
            for (const msg of this.messageQueue) {
                if (msg === message) {
                    isDuplicate = true;
                }
            }
            if (!isDuplicate) {
                this.messageQueue.push(message);
            }
        } else {
            this.system_message("<font color=\"#FF0000\">Your comlink is overheating.</font>");
            this.overheat = true;
        }
        if (this.messageQueueTimer !== null) {
            this.messageQueueTimer.stop();
            this.messageQueueTimer = null;
        }
    }

    private globalChatListener(event: TimerEvent): void {
        const now = new Date();
        const elapsed = now.getTime() - this.globalChatLastSent!.getTime();
        if (elapsed > this.delay) {
            if (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift() as string;
                BYMChat._chat!.say(this.GLOBAL_CHANNEL, msg);
                this.globalChatLastSent = new Date();
                this.delay += this.DELAY_INCREASE;
                if (this.messageQueue.length === 0) {
                    if (this.messageQueueTimer !== null) {
                        this.messageQueueTimer.stop();
                        this.messageQueueTimer = null;
                    }
                    this.messageQueueLastCheck = new Date();
                    this.messageQueueTimer = new Timer(250);
                    this.messageQueueTimer.addEventListener(TimerEvent.TIMER, this.messageQueueListener.bind(this));
                    this.messageQueueTimer.start();
                    if (this.globalChatTimer !== null) {
                        this.globalChatTimer.stop();
                        this.globalChatTimer = null;
                    }
                }
            } else if (this.globalChatTimer !== null) {
                this.globalChatTimer.stop();
                this.globalChatTimer = null;
            }
        }
    }

    private messageQueueListener(event: TimerEvent): void {
        const now = new Date();
        const elapsed = now.getTime() - this.messageQueueLastCheck!.getTime();
        if (elapsed > this.DELAY_DECREASE_TIME) {
            this.messageQueueLastCheck = new Date();
            this.delay -= this.DELAY_DECREASE;
            if (this.delay <= this.DELAY_INITIAL) {
                if (this.messageQueueTimer !== null) {
                    this.messageQueueTimer.stop();
                    this.messageQueueTimer = null;
                    if (this.overheat) {
                        this.system_message("<font color=\"0x00FFFF\">Your comlink cools down.</font>");
                        this.overheat = false;
                    }
                }
            }
        }
    }

    public enter_sector(sectorName: string, force: boolean = false): void {
        if (!force) {
            if (this._joinAttempts >= 10) {
                LOGGER.Log("err", "BYMChat.enter_sector: failed to connect to 10 chat rooms; giving up");
                this.displayUnavailable("unable to find open chat room");
                return;
            }
            const parts = sectorName.split(/(\d+)/);
            if (parts.length === 0) {
                LOGGER.Log("err", "BYMChat.enter_sector(): invalid sectorName");
                this.displayUnavailable("invalid chat room");
                return;
            }
            this._sectorBaseName = parts[0];
            let sectorNum = parseInt(parts[1]);
            if (this._joinAttempts > 0) {
                sectorNum++;
            }
            ++this._joinAttempts;
            sectorNum %= Chat.NUM_CHAT_ROOMS;
            sectorName = this._sectorBaseName + sectorNum.toString();
        }
        if (this.sector_channel !== null && this.sector_channel.Name === sectorName) {
            return;
        }
        if (this._isConnected) {
            if (this.sector_channel !== null) {
                BYMChat._chat!.leave(this.sector_channel);
            }
        }
        this.sector_channel = new Channel(sectorName, "system");
        if (this._isConnected) {
            this.joinSector();
        }
    }

    private clearDisplayNameMap(): void {
        BYMChat._displayNameMap = new Map();
    }

    public sector_chat(message: string): void {
        if (!this._isConnected) {
            LOGGER.Log("err", "BYMChat.sector_chat(): not connected");
            return;
        }
        if (this.sector_channel !== null) {
            BYMChat._chat!.say(this.sector_channel, message);
        } else {
            BYMChat._chat!.error(ChatEvent.SAY, "Not in a sector channel.");
        }
    }

    public private_chat(userId: string, message: string): void {
        if (!this._isConnected) {
            LOGGER.Log("err", "BYMChat.private_chat(): not connected");
            return;
        }
        if (this.userIsIgnored(userId)) {
            return;
        }
        const channel = new Channel(userId, "private");
        BYMChat._chat!.say(channel, message);
    }

    private onConnect(event: ChatEvent): void {
        try {
            this._isConnected = event.Success;
            if (!this._isConnected) {
                const reason = event.Get("reason") as string;
                this.displayUnavailable(reason !== null ? reason : "connection failed");
            } else if (this._auth !== null && BYMChat._chat !== null) {
                BYMChat._chat.login(this._auth);
            } else {
                this.displayUnavailable();
            }
        } catch (e: any) {
            const reason = event.Get("reason") as string;
            this.displayUnavailable(reason !== null ? reason : "connect failed");
            LOGGER.Log("err", "BYMChat.onConnect: " + e.message);
        }
    }

    private onLogin(event: ChatEvent): void {
        if (event.Success) {
            this.joinSector();
            BYMChat._chat!.getIgnore();
        } else {
            const reason = event.Get("reason") as string;
            this.displayUnavailable(reason !== null ? reason : "login failed");
            LOGGER.Log("err", "onLogin() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    public joinGlobal(): void {
        this.clearChat();
        BYMChat._chat!.join(this.GLOBAL_CHANNEL);
    }

    public joinSector(): void {
        if (this.sector_channel !== null) {
            this.clearDisplayNameMap();
            BYMChat._chat!.join(this.sector_channel);
            this.default_chat_channel = "sector";
        }
    }

    private onJoin(event: ChatEvent): void {
        if (event.Success) {
            const channel = event.Get("channel") as Channel;
            this.clearChat();
            this.system_message("Joined channel " + channel.Name + ".");
            this.system_message("Type /h for help.");
            BYMChat._chat!.setDisplayNameUserVar("[" + BASE.BaseLevel().level + "] " + BYMChat._userRecord!.Id);
            BYMChat._chat!.updateDisplayName(channel, BYMChat._userRecord!.Name, "[" + BASE.BaseLevel().level + "] " + BYMChat._userRecord!.Id);
            this.chatBox.EnableInput(true);
            this._isJoined = true;
        } else {
            this.clearChat();
            this.system_message("Join attempt " + this._joinAttempts + " failed. Trying again.");
            this.enter_sector(this._sectorBaseName!);
        }
    }

    private onLeave(event: ChatEvent): void {
        if (!event.Success) {
            LOGGER.Log("err", "BYMChat.onLeave() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    private onSay(event: ChatEvent): void {
        if (event.Success) {
            const channel = event.Get("channel") as Channel;
            const user = event.Get("user") as string;
            const message = event.Get("message") as string;
            if (this.userIsIgnored(user)) {
                return;
            }
            this.showChatMessage(channel, user, message);
        } else {
            LOGGER.Log("err", "BYMChat.onSay() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    private onList(event: ChatEvent): void {
        if (!event.Success) {
            LOGGER.Log("err", "BYMChat.onList() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    private onMembers(event: ChatEvent): void {
        if (!event.Success) {
            LOGGER.Log("err", "BYMChat.onMembers() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    private onIgnore(event: ChatEvent): void {
        if (event.Success) {
            const action = event.Get("action") as string;
            const target = event.Get("target") as string;
            let displayname = event.Get("displayname") as string;
            if (action !== "show") {
                this._ignore_list = event.Get("ignore_list") as Array<string>;
            }
            if (displayname === null) {
                displayname = this.fetchDisplayName(target);
            }
            if (action === "add") {
                this.system_message("'" + displayname + "' (id: " + target + ") is now being ignored.");
            } else if (action === "remove") {
                this.system_message("'" + displayname + "' (id: " + target + ") is no longer ignored.");
            } else if (action === "show") {
                const ignoreList = event.Get("ignore_list") as Array<any>;
                if (ignoreList.length === 0) {
                    this.system_message("You are not ignoring any users.");
                } else {
                    this.system_message("<b><font color=\"#0000FF\">List of ignored users:</font></b>");
                    for (const item of ignoreList) {
                        const userId = String(item.getUtfString("target"));
                        let dname = item.getUtfString("displayname");
                        if (dname === null || dname.length === 0) {
                            dname = this.fetchDisplayName(userId);
                        }
                        if (dname !== null) {
                            this.showIgnoreListMessage(userId, dname);
                        } else {
                            this.showIgnoreListMessage(userId, "");
                        }
                    }
                }
            }
        } else {
            LOGGER.Log("err", "BYMChat.onIgnore() " + event.Success + ": '" + event.Get("error") + "'");
        }
    }

    private onIgnoreError(event: ChatEvent): void {
        const reason = event.Get("reason") as string;
        if (reason === "ignorelistfull") {
            this.system_message("Ignore list full. You must remove someone from your list before adding another.");
        }
    }

    private onUpdateName(event: ChatEvent): void {
        const userid = event.Get("userid") as string;
        const displayname = event.Get("displayname") as string;
        BYMChat._displayNameMap.set(userid, displayname);
    }

    private onUserEnter(event: ChatEvent): void {
        const user = event.Get("user") as User;
        const room = event.Get("room") as Room;
        if (this.sector_channel === null) {
            LOGGER.Log("err", "BYMChat.onUserEnter(): No sector has been joined yet");
            return;
        }
        if (BYMChat._userRecord === null) {
            LOGGER.Log("err", "BYMChat.onUserEnter(): No user record available");
            return;
        }
        if (user.name === BYMChat._userRecord.Name) {
            return;
        }
        BYMChat._chat!.updateDisplayNameDirect(this.sector_channel, user.name, BYMChat._userRecord.Name, "[" + BASE.BaseLevel().level + "] " + BYMChat._userRecord.Id);
    }

    private onUserExit(event: ChatEvent): void {
        const user = event.Get("user") as User;
        const room = event.Get("room") as Room;
        BYMChat._displayNameMap.delete(user.name);
    }

    public toggleVisible(): void {
        this._open = !this._open;
        this.toggleVisibleB();
        GLOBAL.StatSet("chatvis", this._open ? 1 : 0);
    }

    public toggleVisibleB(): void {
        this.position();
        this.chatBox.update();
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = true;
    }

    public showUnavailableInYourArea(): void {
        this.chatBox.disableChatBoxForAB();
        this.system_message("Chat is currently unavailable in your area.");
    }

    public showInvalidName(): void {
        this.chatBox.disableChatBoxForAB();
        this.system_message("Chat is currently unavailable. (EC:13)");
    }

    public fetchDisplayName(userId: string): string {
        return BYMChat._displayNameMap.get(userId) || "";
    }

    public toggleMinimizedStat(minimized: boolean = true): void {
        if (minimized === true) {
            if (GLOBAL.StatGet("chatmin") !== 1) {
                GLOBAL.StatSet("chatmin", 1);
            }
        } else if (GLOBAL.StatGet("chatmin") !== 0) {
            GLOBAL.StatSet("chatmin", 0);
        }
    }

    private showIgnoreListMessage(userId: string, displayName: string): void {
        const msg = "<i>'" + displayName + "' (id: " + userId + ")</i>";
        this.chatBox.push(msg, displayName, userId, "IgnoreList");
    }

    private showChatMessage(channel: Channel | null, user: string | null, message: string): void {
        if (message === "") {
            return;
        }
        message = ProfanityFilter.filterMessage(message);
        let formattedMsg: string;
        let nameHtml: string | null = null;
        let style: string;
        if (user === null) {
            formattedMsg = "<i>" + message + "</i>";
            style = "System";
        } else {
            const displayName = this.fetchDisplayName(user);
            if (displayName === null) {
                return;
            }
            if (user === "Administrator") {
                formattedMsg = "<b><font color=\"#FF0000\">Admin: </font></b>";
                nameHtml = "<b><font color=\"#FF0000\">Admin: </font></b>";
                style = "Administrator";
            } else if (user === "Moderator") {
                formattedMsg = "<b><font color=\"#FF0000\">Mod: </font></b>";
                nameHtml = "<b><font color=\"#FF0000\">Mod: </font></b>";
                style = "Moderator";
            } else if (channel!.Type === "private") {
                formattedMsg = "<b><font color=\"#076bbf\">";
                nameHtml = "<b><font color=\"#076bbf\">";
                if (BYMChat._userRecord!.Name === user) {
                    formattedMsg += "to " + displayName + ": ";
                    nameHtml += "to " + displayName + ": ";
                } else {
                    formattedMsg += displayName + ": ";
                    nameHtml += displayName + ": ";
                }
                formattedMsg += "</font></b>";
                nameHtml += "</font></b>";
                style = "Private";
            } else {
                formattedMsg = "<font color=\"#000000\">";
                nameHtml = "<font color=\"#000000\">";
                formattedMsg += "<b>" + displayName + ":</b> ";
                nameHtml += "<b>" + displayName + ":</b> ";
                formattedMsg += "</font>";
                nameHtml += "</font>";
                style = "Default";
            }
            formattedMsg += message;
        }
        this.chatBox.push(formattedMsg, nameHtml, user, style);
    }

    public ignoreUser(userId: string | null = null, displayName: string | null = null): void {
        if (userId !== null) {
            GLOBAL.Message(KEYS.Get("chat_ignore") + " '" + displayName + "' (id: " + userId + ")<br><br>" + KEYS.Get("chat_ignore_confirm"), KEYS.Get("btn_yes"), BYMChat._chat!.ignore.bind(BYMChat._chat), [userId, displayName]);
        }
    }

    public unignoreUser(userId: string): void {
        if (userId !== null) {
            BYMChat._chat!.unignore(userId);
        }
    }

    public position(): void {
        const stageWidth = GLOBAL._ROOT.stage.stageWidth;
        const stageHeight = GLOBAL._ROOT.stage.stageHeight;
        const offsetX = 0;
        const offsetY = 0;
        const bounds = new Rectangle(0 - (stageWidth - GLOBAL._SCREENINIT.width) / 2 + 0, 0 - (stageHeight - GLOBAL._SCREENINIT.height) / 2 + offsetY, stageWidth, stageHeight);
        this._hideX = bounds.x;
        this._showX = bounds.x;
        this._showY = GLOBAL._SCREENINIT.height + (stageHeight - GLOBAL._SCREENINIT.height) / 2 - 30;
        this._hideY = GLOBAL._SCREENINIT.height + (stageHeight - GLOBAL._SCREENINIT.height) / 2 - 30;
        this._hideX += offsetX;
        this._showX += offsetX;
        this._showY += offsetY;
        this._hideY += offsetY;
        let posX: number;
        let posY: number;
        if (this._open) {
            posX = this._showX;
            posY = this._showY;
        } else {
            posX = this._hideX;
            posY = this._hideY;
        }
        this.x = posX;
        this.y = posY;
        this.chatBox.update();
    }

    public fetchIDFromDisplayName(displayName: string, partial: boolean): string {
        if (displayName === null || displayName.length === 0) {
            return "";
        }
        for (const [key, value] of BYMChat._displayNameMap) {
            if (value === displayName) {
                return key;
            }
        }
        if (partial) {
            for (const [key, value] of BYMChat._displayNameMap) {
                if (value.indexOf(displayName) !== -1) {
                    return key;
                }
            }
        }
        return "";
    }

    public userIsIgnored(userId: string): boolean {
        if (this._ignore_list === null) {
            return false;
        }
        if (this._ignore_list.indexOf(userId) === -1) {
            return false;
        }
        return true;
    }

    public displayUnavailable(reason: string | null = null): void {
        this.clearChat();
        if (reason !== null) {
            this.system_message("Chat is currently unavailable. Reason: " + reason);
        } else {
            this.system_message("Chat is currently unavailable.");
        }
    }

    public get roomNames(): Array<string> {
        if (BYMChat._chat !== null) {
            return BYMChat._chat.roomNames;
        }
        return [];
    }

    public chatInputHasFocus(): boolean {
        if (Boolean(this.stage) && Boolean(this.chatBox)) {
            return this.stage.focus === this.chatBox.input;
        }
        return false;
    }
}
