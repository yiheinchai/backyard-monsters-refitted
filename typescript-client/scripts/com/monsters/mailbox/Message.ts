import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import FullScreenEvent from "openfl/events/FullScreenEvent";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

import { MapRoom } from "../maproom_advanced/MapRoom";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { FriendPicker } from "./FriendPicker";
import { Message_CLIPB } from "../../../Message_CLIPB";
import { URLLoaderApi } from "../../../URLLoaderApi";
import { frame } from "../../../frame";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { SOUNDS } from "../../../SOUNDS";

/**
 * Message - compose and send messages to friends.
 */
export class Message extends Message_CLIPB {
    public static readonly GRAY: number = 6710886;
    public static readonly BLACK: number = 0;

    public requestType: string = "message";
    public sendHandler: Function | null = null;
    public successHandler: Function | null = null;
    public truceShareHandler: Function | null = null;
    private timer: Timer;
    public picker: FriendPicker;
    public baseID: number = 0;

    constructor(filter: string = "all") {
        super();
        (this.mcFrame as frame).Setup(true, this.closeDown.bind(this));
        this.picker = new FriendPicker(filter);
        this.picker.x = 238;
        this.picker.y = 65;
        this.baseID = 0;
        this.addChild(this.picker);
        this.sendBtn.SetupKey("btn_send");
        this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        this.status_txt.htmlText = "";
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemoved.bind(this));
        this.timer = new Timer(100);
        this.timer.addEventListener(TimerEvent.TIMER, this.Validate.bind(this));
        this.timer.start();
        this.tolabel_txt.htmlText = KEYS.Get("mail_new_to");
        this.subjectlabel_txt.htmlText = KEYS.Get("mail_new_subject");
        this.messagelabel_txt.htmlText = KEYS.Get("mail_new_message");
    }

    public static getNotWS(str: string): string {
        str = str.split("\r").join("");
        str = str.split("\t").join("");
        str = str.split("\n").join("");
        return str.split(" ").join("");
    }

    public static cleanText(str: string): string {
        const parts: Array<string> = str.split("\r");
        if (parts.length > 1) {
            let result = parts[0];
            for (let i = 1; i < parts.length; i++) {
                result += " " + parts[i];
            }
            return result;
        }
        return str;
    }

    private onAdd(event: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.y = -15;
        this.addEventListener(KeyboardEvent.KEY_DOWN, this.onEscapeListener.bind(this));
        this.stage.addEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        this.detectFS();
    }

    private detectFS(event: FullScreenEvent | null = null): void {
        if (Boolean(this.stage) && this.stage.displayState === StageDisplayState.FULL_SCREEN) {
            this.fsWarning.tBody.htmlText = KEYS.Get("fswarning");
            this.addChild(this.fsWarning);
        } else if (this.contains(this.fsWarning)) {
            this.removeChild(this.fsWarning);
        }
    }

    private onEscapeListener(event: KeyboardEvent): void {
        if (event.charCode === 27) {
            this.closeDown();
        }
    }

    public init(): void {
        this.body_txt.htmlText = "";
        this.subject_txt.textColor = Message.GRAY;
        this.subject_txt.htmlText = "<b>";
        this.subject_txt.addEventListener(MouseEvent.MOUSE_DOWN, this.subjectDown.bind(this));
    }

    private subjectDown(event: MouseEvent): void {
        this.subject_txt.textColor = Message.BLACK;
        this.subject_txt.text = "";
        this.subject_txt.removeEventListener(MouseEvent.MOUSE_DOWN, this.subjectDown.bind(this));
        this.addEventListener(KeyboardEvent.KEY_DOWN, this.onKey.bind(this));
    }

    private onKey(event: KeyboardEvent): void {
        if (event.keyCode === 13) {
            if (this.stage.focus === this.subject_txt) {
                this.stage.focus = this.body_txt;
                this.body_txt.text = "";
            }
        }
    }

    public Validate(...rest: any[]): void {
        let valid: boolean = true;
        if (!this.picker.currentSelection) {
            valid = false;
        }
        if (Message.getNotWS(this.subject_txt.text).length === 0 || this.subject_txt.text === "Subject") {
            valid = false;
        }
        if (Message.getNotWS(this.body_txt.text).length < 2) {
            valid = false;
        }
        if (valid) {
            this.sendBtn.Enabled = true;
            this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        } else {
            this.sendBtn.Enabled = false;
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        }
    }

    private sendDown(event: MouseEvent): void {
        const body = this.body_txt.text;
        const targetId = this.picker.getCurrentData().userid;
        const params: Array<any> = [
            ["threadid", 0],
            ["targetid", targetId],
            ["targetbaseid", 0],
            ["type", this.requestType],
            ["subject", this.subject_txt.text],
            ["message", body]
        ];
        const loader = new URLLoaderApi();
        if (this.requestType === "migraterequest" && this.baseID !== 0) {
            params.push(["baseid", this.baseID]);
        }
        loader.load(GLOBAL._apiURL + "player/sendmessage", params, this.onSuccess.bind(this), this.onFail.bind(this));
        this.sendBtn.Enabled = false;
        this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
    }

    private onSuccess(data: Record<string, any>): void {
        if (data.error !== undefined && data.error !== 0) {
            try {
                LOGGER.Log("err", "mailbox-" + data.error);
            } catch (e: any) {
            }
            this.displayError();
        } else {
            if (this.requestType === "trucerequest") {
                try {
                    this.truceShareHandler!(this.picker.getCurrentData().firstname, "");
                } catch (e: any) {
                }
            }
            this.closeDown();
            this.dispatchEvent(new Event(Event.COMPLETE));
            if (this.requestType === "migraterequest" && MapRoomManager.instance.isInMapRoom2) {
                MapRoom.SetPendingInvitation();
                MapRoom.HideInfoMine();
            }
            try {
                this.successHandler!(data);
            } catch (e: any) {
            }
        }
    }

    private onFail(event: IOErrorEvent): void {
        this.displayError();
    }

    public displayError(): void {
        if (this.requestType === "migraterequest") {
            this.status_txt.htmlText = KEYS.Get("mailbox_invitepending");
        } else {
            this.status_txt.htmlText = KEYS.Get("mail_messagefailed");
        }
        this.sendBtn.Enabled = true;
        this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
    }

    private closeDown(event: MouseEvent | null = null): void {
        this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        this.parent.removeChild(this);
        SOUNDS.Play("close");
    }

    public Resize(): void {
    }

    private onRemoved(event: Event): void {
        GLOBAL.BlockerRemove();
        this.removeEventListener(KeyboardEvent.KEY_DOWN, this.onEscapeListener.bind(this));
        this.removeEventListener(Event.REMOVED_FROM_STAGE, this.onRemoved.bind(this));
        this.timer.stop();
    }
}
