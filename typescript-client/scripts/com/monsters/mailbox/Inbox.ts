import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import { TweenLite } from "gs/TweenLite";

import { ThreadData } from "./model/ThreadData";
import { Inbox_CLIP } from "../../../Inbox_CLIP";
import { InboxMessage } from "./InboxMessage";
import { MailBox } from "./MailBox";
import { Message } from "./Message";
import { Thread } from "./Thread";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGIN } from "../../../LOGIN";
import { MAILBOX } from "../../../MAILBOX";
import { SOUNDS } from "../../../SOUNDS";
import { URLLoaderApi } from "../../../URLLoaderApi";

/**
 * Inbox - mailbox inbox view.
 */
export class Inbox extends Inbox_CLIP {
    public static sent: Array<InboxMessage> = [];
    public static recd: Array<InboxMessage> = [];
    public static all: Array<InboxMessage> = [];
    public static _instance: Inbox | null = null;

    public config: Array<any> = [];
    private currentConfig: number = -1;
    public activeBox: Array<InboxMessage> = [];
    private rowsPerPage: number = 6;
    private shell: Sprite | null = null;
    public currentPage: number = 0;
    public pageLimit: number = 0;
    private currentSorter: MovieClip | null = null;
    private currentSort: string = "";
    private reversed: boolean = false;
    public _sorters: Sprite | null = null;
    private firstLoaded: boolean = false;

    constructor() {
        super();
        (this.mcFrame as any).Setup(true, MailBox.Hide);
        this.newBtn.SetupKey("btn_compose");
        this.newBtn.addEventListener(MouseEvent.CLICK, this.onNewDown.bind(this));
        this._sorters = new Sprite();
        this.addChild(this._sorters);
        this.bPrevious.Trigger();
        this.bNext.Trigger();
        this.bNext.visible = this.bPrevious.visible = false;
        this.bPrevious.buttonMode = this.bNext.buttonMode = true;
        const sorterBtns = [this.fromBtn, this.subjectBtn, this.dateBtn, this.unreadBtn];
        for (const btn of sorterBtns) {
            btn.addEventListener(MouseEvent.MOUSE_DOWN, this.sortHandler.bind(this));
            btn.mouseChildren = false;
            btn.buttonMode = true;
            btn.useHandCursor = true;
            (btn as any).sorter_mc.gotoAndStop(1);
            this.removeChild(btn);
        }
        this.noMessages_btn.visible = false;
        this.noMessages_btn.addEventListener(MouseEvent.MOUSE_DOWN, this.onNewDown.bind(this));
        this.noMessages_btn.useHandCursor = true;
        this.noMessages_btn.buttonMode = true;
        this.noMessages_btn.mouseChildren = false;
        this.config = [
            { "controls": [this.fromBtn, this.subjectBtn, this.dateBtn, this.unreadBtn], "button": this.inBtn, "itemMode": "inbox", "defaultSorter": this.dateBtn },
            { "controls": [this.subjectBtn, this.dateBtn], "button": this.outBtn, "itemMode": "outbox", "defaultSorter": this.dateBtn },
            { "controls": [this.fromBtn, this.subjectBtn, this.dateBtn, this.unreadBtn], "button": this.outBtn, "itemMode": "all", "defaultSorter": this.dateBtn }
        ];
        this.inBtn.SetupKey("btn_inbox");
        this.outBtn.SetupKey("btn_outbox");
        this.removeChild(this.inBtn);
        this.removeChild(this.outBtn);
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.title_txt.htmlText = KEYS.Get("mail_title");
        (this.noMessages_btn as any).label_txt.htmlText = "<b>" + KEYS.Get("mail_nomessages") + "</b>";
        Inbox._instance = this;
    }

    public static openThread(thread: ThreadData): void {
        const threadView = new Thread();
        threadView._mc = threadView;
        threadView.Setup(thread);
        MailBox.ShowThread(threadView);
    }

    private static onThreadOpen(event: Event): void {
        const threadData = (event.target as InboxMessage).data;
        Inbox.openThread(threadData);
    }

    public static pushNewMessage(thread: ThreadData): void {
        const message = new InboxMessage();
        message.Setup(thread);
        message.addEventListener("open", Inbox.onThreadOpen);
        if (thread.targetid === LOGIN._playerID || thread.messagecount > 1) {
            Inbox.recd.push(message);
        } else {
            Inbox.sent.push(message);
        }
        Inbox.all.push(message);
    }

    private onAdd(event: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
    }

    public showIn(...args: any[]): void {
        this.inBtn.Highlight = true;
        this.outBtn.Highlight = false;
        this.activeBox = Inbox.all;
        this.configureForObjectIndex(2);
    }

    public showOut(...args: any[]): void {
        this.inBtn.Highlight = false;
        this.outBtn.Highlight = true;
        this.configureForObjectIndex(2);
    }

    public configureForObjectIndex(index: number = 0): void {
        const config = this.config[index];
        if (this.currentConfig >= 0) {
            for (const btn of this.config[this.currentConfig].controls) {
                if (this._sorters!.contains(btn)) {
                    this._sorters!.removeChild(btn);
                }
            }
        }
        for (const btn of config.controls) {
            this._sorters!.addChild(btn);
        }
        this.currentConfig = index;
        this.currentSort = "";
        this.reversed = true;
        config.defaultSorter.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
    }

    public Setup(): void {
        this.shell = new Sprite();
        this.addChild(this.shell);
        this.shell.mask = this.mask_mc;
        Inbox.sent = [];
        Inbox.recd = [];
        Inbox.all = [];
        this.Tick();
    }

    public Tick(...args: any[]): void {
        const r = new URLLoaderApi();
        r.load(GLOBAL._apiURL + "player/getmessagethreads", [], this.handleLoadSuccessful.bind(this), this.handleLoadError.bind(this));
    }

    private handleLoadSuccessful(response: Record<string, any>): void {
        let changed = false;
        for (const key in response.threads) {
            let found = false;
            for (let i = 0; i < Inbox.all.length; i++) {
                if (Inbox.all[i].data.threadid === response.threads[key].threadid) {
                    found = true;
                    const threadData = Inbox.all[i].data;
                    const oldTime = threadData.sendtime;
                    threadData.Setup(response.threads[key]);
                    if (oldTime !== threadData.sendtime) {
                        threadData.Changed();
                    }
                }
            }
            if (!found) {
                const newThread = new ThreadData(response.threads[key]);
                newThread.addEventListener(Event.CHANGE, this.listenForFlagging.bind(this));
                Inbox.pushNewMessage(newThread);
                changed = true;
            }
        }
        if (!this.firstLoaded) {
            this.firstLoaded = true;
            this.inBtn.addEventListener(MouseEvent.CLICK, this.showIn.bind(this));
            this.outBtn.addEventListener(MouseEvent.CLICK, this.showOut.bind(this));
            this.dispatchEvent(new Event(Event.COMPLETE));
            this.showIn();
            this.showInB();
        } else if (changed) {
            this.showIn();
        }
    }

    public showInB(): void {
        if (MAILBOX._threadidToOpen !== -1) {
            for (let i = 0; i < Inbox.all.length; i++) {
                if (Inbox.all[i].data.threadid === MAILBOX._threadidToOpen) {
                    Inbox.openThread(Inbox.all[i].data);
                    break;
                }
            }
        }
        MAILBOX._threadidToOpen = -1;
    }

    public listenForFlagging(event: Event): void {
        const threadData = event.target as ThreadData;
        if (threadData.flagged) {
            this.displayArray(Inbox.all);
            this.scrollToPage(0);
        }
    }

    public displayArray(arr: Array<InboxMessage>): void {
        const filtered: Array<InboxMessage> = [];
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].data.flagged) {
                filtered.push(arr[i]);
            }
        }
        this.cleanup();
        if (filtered.length === 0) {
            this.noMessages_btn.visible = true;
            this._sorters!.visible = false;
            this.shell!.visible = false;
        } else {
            this.shell!.visible = true;
            this.noMessages_btn.visible = false;
            this._sorters!.visible = true;
        }
        if (filtered.length > this.rowsPerPage) {
            this.bNext.addEventListener(MouseEvent.MOUSE_DOWN, this.nextDown.bind(this));
            this.bPrevious.addEventListener(MouseEvent.MOUSE_DOWN, this.prevDown.bind(this));
            this.pageLimit = Math.floor((filtered.length - 1) / this.rowsPerPage);
            this.bNext.visible = true;
            this.bPrevious.visible = true;
        } else {
            this.bNext.visible = false;
            this.bPrevious.visible = false;
        }
        const rowHeight = 50;
        for (let i = 0; i < filtered.length; i++) {
            const msg = filtered[i];
            this.shell!.addChild(msg);
            msg.x = 76 + this.mask_mc.width * Math.floor(i / this.rowsPerPage);
            msg.y = 126 + i * rowHeight - this.rowsPerPage * rowHeight * Math.floor(i / this.rowsPerPage);
        }
    }

    private nextDown(event: MouseEvent): void {
        SOUNDS.Play("click1");
        if (this.currentPage < this.pageLimit) {
            this.scrollToPage(this.currentPage + 1);
        }
    }

    private prevDown(event: MouseEvent): void {
        SOUNDS.Play("click1");
        if (this.currentPage > 0) {
            this.scrollToPage(this.currentPage - 1);
        }
    }

    public scrollToPage(page: number = 0): void {
        this.currentPage = page;
        TweenLite.to(this.shell, 0.3, { "x": -page * this.mask_mc.width });
        const end = (page + 1) * this.rowsPerPage > this.activeBox.length ? this.activeBox.length : (page + 1) * this.rowsPerPage;
        for (let i = page * this.rowsPerPage; i < end; i++) {
            this.activeBox[i].shouldLoadImage();
        }
        if (this.currentPage > 0) {
            this.bPrevious.Trigger(true);
        } else {
            this.bPrevious.Trigger(false);
        }
        if (this.currentPage < this.pageLimit) {
            this.bNext.Trigger(true);
        } else {
            this.bNext.Trigger(false);
        }
    }

    private cleanup(): void {
        const children: Array<any> = [];
        for (let i = 0; i < this.shell!.numChildren; i++) {
            children.push(this.shell!.getChildAt(i));
        }
        for (let i = 0; i < children.length; i++) {
            children[i].parent.removeChild(children[i]);
        }
    }

    private handleLoadError(event: IOErrorEvent): void {
    }

    private onNewDown(event: MouseEvent): void {
        SOUNDS.Play("click1");
        const mess = new Message();
        mess.addEventListener(Event.COMPLETE, this.showOut.bind(this));
        GLOBAL.BlockerAdd();
        GLOBAL._layerWindows.addChild(mess);
        mess.init();
        mess.successHandler = (data: Record<string, any>): void => {
            const newThread = new ThreadData({
                "sendtime": GLOBAL.Timestamp(),
                "threadid": data.threadid,
                "userid": LOGIN._playerID,
                "targetid": mess.picker.getCurrentData().userid,
                "messagetype": "message",
                "unread": 0,
                "messageid": data.messageid,
                "truceid": 0,
                "subject": mess.subject_txt.text,
                "messagecount": 1
            });
            Inbox.pushNewMessage(newThread);
            this.reversed = false;
            this.currentSorter = null;
            this.currentSort = "";
            this.dateBtn.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN));
        };
    }

    private sortHandler(event: MouseEvent): void {
        if (this.currentSorter) {
            (this.currentSorter as any).sorter_mc.gotoAndStop(1);
            this.currentSorter.gotoAndStop(1);
        }
        let sortField = "";
        switch (event.target) {
            case this.fromBtn:
                sortField = "firstname";
                break;
            case this.subjectBtn:
                sortField = "subject";
                break;
            case this.dateBtn:
                sortField = "sendtime";
                break;
            case this.unreadBtn:
                sortField = "unread";
                break;
        }
        const isString = sortField === "firstname" || sortField === "subject";
        if (this.currentSort === sortField) {
            this.reversed = !this.reversed;
        } else {
            this.reversed = false;
        }
        // Custom sorting
        const sorted = [...this.activeBox].sort((a, b) => {
            let valA = a.data[sortField];
            let valB = b.data[sortField];
            if (isString) {
                valA = String(valA).toLowerCase();
                valB = String(valB).toLowerCase();
            }
            let result = 0;
            if (valA < valB) result = -1;
            else if (valA > valB) result = 1;
            if (!isString) result = -result; // descending for numeric by default
            if (this.reversed) result = -result;
            return result;
        });
        if (this.reversed) {
            (event.target as any).sorter_mc.gotoAndStop(3);
        } else {
            (event.target as any).sorter_mc.gotoAndStop(2);
        }
        this.currentSort = sortField;
        this.currentSorter = event.target as MovieClip;
        this.currentSorter.gotoAndStop(2);
        this.displayArray(sorted);
        this.scrollToPage(0);
    }

    public Resize(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
    }
}
