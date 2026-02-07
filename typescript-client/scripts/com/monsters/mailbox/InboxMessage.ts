import Loader from "openfl/display/Loader";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";

import { Contact } from "./model/Contact";
import { ThreadData } from "./model/ThreadData";
import { InboxMessage_CLIP } from "../../../InboxMessage_CLIP";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGIN(): any { return require("../../../LOGIN").LOGIN; }
function getSOUNDS(): any { return require("../../../SOUNDS").SOUNDS; }



/**
 * InboxMessage - displays a single thread preview in the mailbox inbox.
 */
export class InboxMessage extends InboxMessage_CLIP {
    public firstname: string = "";
    public sendtime: number = 0;
    public subject: string = "";
    public unread: number = 0;
    public image: any = null;
    public data: ThreadData | null = null;
    public isAdmin: boolean = false;

    constructor() {
        super();
        this.b1.SetupKey("mail_open_btn");
        this.b1.addEventListener(MouseEvent.CLICK, this.openDown.bind(this));
    }

    private openDown(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        this.dispatchEvent(new Event("open"));
    }

    public Setup(threadData: ThreadData): void {
        this.data = threadData;
        this.isAdmin = threadData.userid === 0;
        this.data.addEventListener(Event.CHANGE, this.displayData.bind(this));
        this.displayData();
    }

    public displayData(...rest: any[]): void {
        let contact: Contact | null = null;
        let lastInitial = "";
        if (this.data!.userid === getLOGIN()._playerID) {
            contact = Contact.contactWithUserId(this.data!.targetid);
        } else {
            contact = Contact.contactWithUserId(this.data!.userid);
        }
        if (this.isAdmin) {
            contact = Contact.contactWithUserId(this.data!.userid, true);
        }
        if (contact) {
            this.firstname = contact.firstname;
            lastInitial = contact.lastname.length > 1 ? " " + contact.lastname.charAt(0).toUpperCase() + "." : "";
            this.sender_txt.htmlText += contact.firstname + lastInitial;
        } else {
            this.firstname = "";
        }
        this.bg_mc.gotoAndStop("white");
        if (this.isAdmin) {
            this.bg_mc.gotoAndStop("admin");
        } else if (this.data!.trucestate) {
            if (this.data!.trucestate === "requested") {
                this.subjectType_txt.htmlText = "<b>" + getKEYS().Get("inbox_trucerequested");
                this.bg_mc.gotoAndStop("blue");
            } else if (this.data!.trucestate === "rejected") {
                this.subjectType_txt.htmlText = "<b>" + getKEYS().Get("inbox_trucerejected");
                this.bg_mc.gotoAndStop("red");
            } else if (this.data!.trucestate === "accepted") {
                this.subjectType_txt.htmlText = "<b>" + getKEYS().Get("inbox_truceaccepted");
                this.bg_mc.gotoAndStop("green");
            }
        }
        if (this.data!.unread) {
            this.subject_txt.htmlText = "<b>" + this.data!.subject;
            this.sender_txt.htmlText = "<b>" + this.firstname + lastInitial;
            this.sent_txt.htmlText = "<b>" + this.getTimeDistanceString(this.data!.sendtime);
            this.unread = 1;
            this.dot_mc.visible = true;
        } else {
            this.subject_txt.htmlText = this.data!.subject;
            this.sender_txt.htmlText = this.firstname + lastInitial;
            this.sent_txt.htmlText = this.getTimeDistanceString(this.data!.sendtime);
            this.unread = 0;
            this.dot_mc.visible = false;
        }
        this.sendtime = this.data!.sendtime;
        this.subject = this.data!.subject;
        this.userid_txt.htmlText = getKEYS().Get("label_userid", { "v1": this.data!.userid });
        this.replies_txt.htmlText = getKEYS().Get("mail_numreplies", { "v1": this.data!.messagecount - 1 });
    }

    public shouldLoadImage(): void {
        if (!this.image && !this.isAdmin) {
            this.image = new Loader();
            this.image.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImgComplete.bind(this));
            this.image.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.onErr.bind(this));
            let contact: Contact | null;
            if (this.data!.userid === getLOGIN()._playerID) {
                contact = Contact.contactWithUserId(this.data!.targetid, true);
            } else {
                contact = Contact.contactWithUserId(this.data!.userid, true);
            }
            if (contact) {
                try {
                    this.image.load(new URLRequest(contact.pic), new LoaderContext(true));
                } catch (e: any) {
                }
            }
        } else if (this.isAdmin && !this.image) {
            const PicClass = Contact.contactWithUserId(this.data!.userid, true)!.picClass;
            this.image = new PicClass();
            this.onImgComplete();
        }
    }

    private onErr(event: IOErrorEvent): void {
    }

    private onImgComplete(event: Event | null = null): void {
        this.addChildAt(this.image, 0);
        this.image.x = this.placeholder.x;
        this.image.y = this.placeholder.y;
        this.image.width = this.image.height = 50;
        if (this.contains(this.placeholder)) {
            this.removeChild(this.placeholder);
        }
    }

    public getTimeDistanceString(timestamp: number): string {
        const now = getGLOBAL().Timestamp();
        const diff = now - timestamp;
        let value = 0;
        let key = "";
        if (diff < 60) {
            value = diff;
            key = value === 1 ? "mail_time_second" : "mail_time_seconds";
        } else if (diff < 60 * 60) {
            value = Math.floor(diff / 60);
            key = value === 1 ? "mail_time_minute" : "mail_time_minutes";
        } else if (diff < 60 * 60 * 24) {
            value = Math.floor(diff / 60 / 60);
            key = value === 1 ? "mail_time_hour" : "mail_time_hours";
        } else if (diff < 60 * 60 * 24 * 7) {
            value = Math.floor(diff / 60 / 60 / 24);
            key = value === 1 ? "mail_time_day" : "mail_time_days";
        } else if (diff < 60 * 60 * 24 * 7 * 31) {
            value = Math.floor(diff / 60 / 60 / 24 / 7);
            key = value === 1 ? "mail_time_week" : "mail_time_weeks";
        } else {
            value = Math.floor(diff / 60 / 60 / 24 / 7 / 31);
            key = value === 1 ? "mail_time_month" : "mail_time_months";
        }
        return getKEYS().Get("mail_time_ago", {
            "v1": value,
            "v2": getKEYS().Get(key)
        });
    }
}
