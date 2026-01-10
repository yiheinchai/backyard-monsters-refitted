import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import EventDispatcher from "openfl/events/EventDispatcher";
import Point from "openfl/geom/Point";

import { MailBox } from "../MailBox";
import { URLLoaderApi } from "../../URLLoaderApi";

import { GLOBAL } from "../../../../GLOBAL";
import { LOGGER } from "../../../../LOGGER";

/**
 * Thread data - represents a mail thread conversation.
 */
export class ThreadData extends EventDispatcher {
    public convo: Array<any> = [];
    public sendtime: number = 0;
    public userid: number = 0;
    public targetid: number = 0;
    public threadid: number = 0;
    public messagetype: string = "";
    public unread: boolean = false;
    public messageid: number = 0;
    public truceid: number = 0;
    public subject: string = "";
    public messagecount: number = 0;
    public reported: boolean = false;
    public threadLoaded: boolean = false;
    public trucestate: string = "";
    public flagged: boolean = false;
    public migratestate: string = "";
    public coords: Point | null = null;
    public worldID: number = 0;
    public baseID: number = 0;

    constructor(data: Record<string, any>) {
        super();
        this.Setup(data);
    }

    public Setup(data: Record<string, any>): void {
        this.sendtime = data.updatetime;
        this.userid = data.userid;
        this.targetid = data.targetid;
        this.threadid = data.threadid;
        this.messagetype = data.messagetype;
        this.flagged = false;
        if (data.trucestate !== undefined) {
            this.trucestate = data.trucestate;
        }
        if (data.migratestate !== undefined) {
            this.migratestate = data.migratestate;
            if (Boolean(data.coords) && data.coords.length > 1) {
                this.coords = new Point(data.coords[0], data.coords[1]);
            }
            if (data.worldid) {
                this.worldID = data.worldid;
            }
            if (data.baseid) {
                this.baseID = data.baseid;
            }
        }
        this.unread = data.unread === 1;
        this.reported = data.reportid > 0;
        this.messageid = data.messageid;
        this.truceid = data.truceid;
        this.subject = data.subject;
        this.messagecount = data.messagecount;
        this.convo = [];
    }

    public loadThread(): void {
        const loader: URLLoaderApi = new URLLoaderApi();
        const params: Array<any> = [["threadid", this.threadid]];
        loader.load(GLOBAL._apiURL + "player/getmessagethread", params, this.handleLoadSuccessful.bind(this), this.handleLoadError.bind(this));
    }

    private handleLoadSuccessful(data: Record<string, any>): void {
        if (data.error !== 0) {
            MailBox.ShowInbox();
        } else {
            this.convo = [];
            for (const key in data.thread) {
                if (data.thread[key].message) {
                    const msg: Record<string, any> = data.thread[key];
                    this.convo.push(msg);
                }
            }
            this.dispatchEvent(new Event(Event.COMPLETE));
        }
    }

    public Changed(): void {
        this.dispatchEvent(new Event(Event.CHANGE));
    }

    private handleLoadError(event: IOErrorEvent): void {
        LOGGER.Log("err", "IOError opening threadid " + this.threadid);
    }

    public override toString(): string {
        return "[object ThreadData subject: " + this.subject + " threadLoaded: " + this.threadLoaded + " userid: " + this.userid + " targetid: " + this.targetid + " ]";
    }
}
