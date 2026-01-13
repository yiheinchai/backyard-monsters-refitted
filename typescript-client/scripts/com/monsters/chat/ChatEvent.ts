import Event from "openfl/events/Event";

/**
 * Chat event for various chat system actions.
 */
export class ChatEvent extends Event {
    public static readonly CONNECT: string = "connect";
    public static readonly LOGIN: string = "login";
    public static readonly JOIN: string = "join";
    public static readonly LEAVE: string = "leave";
    public static readonly SAY: string = "say";
    public static readonly LIST: string = "list";
    public static readonly MEMBERS: string = "members";
    public static readonly IGNORE: string = "ignore";
    public static readonly IGNOREERROR: string = "ignoreerror";
    public static readonly UPDATE_NAME: string = "update_name";
    public static readonly USER_ENTER: string = "user_enter";
    public static readonly USER_EXIT: string = "user_exit";

    private map: Record<string, any>;

    constructor(type: string, success: boolean = true, data: Record<string, any> | null = null, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
        
        if (data === null) {
            this.map = {};
        } else {
            this.map = data;
        }
        this.map["success"] = success;
    }

    public get Success(): boolean {
        if (this.map === null) {
            return false;
        }
        if ("success" in this.map) {
            return this.map["success"];
        }
        return false;
    }

    public Get(key: string): any {
        if (this.map === null) {
            return null;
        }
        if (key in this.map) {
            return this.map[key];
        }
        return null;
    }
}
