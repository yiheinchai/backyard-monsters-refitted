import Sprite from "openfl/display/Sprite";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import FocusEvent from "openfl/events/FocusEvent";
import FullScreenEvent from "openfl/events/FullScreenEvent";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

import { ALLIANCES } from "../alliances/ALLIANCES";
import { ScrollSet } from "../display/ScrollSet";
import { Contact } from "./model/Contact";
import { ThreadData } from "./model/ThreadData";
import { MapRoom } from "../maproom_advanced/MapRoom";
import { MailBox } from "./MailBox";
import { Message } from "./Message";
import { Thread_CLIP } from "../../../Thread_CLIP";
import { ThreadMember } from "./ThreadMember";

import { frame } from "../../../frame";
import { MAPROOM } from "../../../MAPROOM";
import { popup_report } from "../../../popup_report";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getLOGIN(): any { return require("../../../LOGIN").LOGIN; }
function getSOUNDS(): any { return require("../../../SOUNDS").SOUNDS; }
function getUI2(): any { return require("../../../UI2").UI2; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }


/**
 * Thread - Message thread view.
 */
export class Thread extends Thread_CLIP {
    public static readonly NARROW: number = 473;
    public static readonly WIDE: number = 487;

    public data: ThreadData | null = null;
    public members: Array<ThreadMember> = [];
    private shell: Sprite | null = null;
    public scroller: ScrollSet | null = null;
    public _wide: boolean = false;
    public subject: string = "";
    public messageState: Record<string, number>;
    public truceState: Record<string, number>;
    public editMode: Record<string, any>;
    public viewMode: Record<string, any>;
    public timer: Timer | null = null;
    private spammy: boolean = false;
    private sending: boolean = false;
    private firstLoaded: boolean = false;
    public _mc: any;

    constructor() {
        super();
        this.messageState = {
            "boxWidth": 300,
            "textWidth": 300
        };
        this.truceState = {
            "boxWidth": 230,
            "textWidth": 230
        };
        this.editMode = {
            "inputBoxHeight": 190,
            "inputBoxY": 270,
            "textHeight": 176,
            "textY": 279,
            "outlineY": 268,
            "outlineHeight": 176,
            "largeOutlineVisible": true,
            "maskHeight": 168,
            "smallOutlineVisible": false
        };
        this.viewMode = {
            "inputBoxHeight": 60,
            "inputBoxY": 401,
            "textHeight": 48,
            "textY": 410,
            "outlineY": 410,
            "outlineHeight": 48,
            "largeOutlineVisible": false,
            "maskHeight": 300,
            "smallOutlineVisible": true
        };
        this.mask_mc.visible = false;
        this.removeChild(this.sendBtn);
        this.removeChild(this.acceptBtn);
        this.removeChild(this.denyBtn);
        this.removeChild(this.fsWarning);
        this.removeChild(this.viewBtn);
        this.largeOutline_mc.visible = false;
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdd.bind(this));
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.onRemoved.bind(this));
        this.scroller = new ScrollSet();
        this.scroller.x = 498;
        this.scroller.y = 81;
        this.addChild(this.scroller);
    }

    public Setup(threadData: ThreadData): void {
        this.shell = new Sprite();
        this.shell.mask = this.mask_mc;
        this.shell.x = 86;
        this.shell.y = 106;
        this.addChild(this.shell);
        this.members = [];
        (this.mcFrame as frame).Setup(true, MailBox.ShowInbox);
        if (!threadData.threadLoaded) {
            threadData.addEventListener(Event.COMPLETE, this.threadLoadComplete.bind(this));
            threadData.addEventListener(Event.CHANGE, this.onThreadChanged.bind(this));
            this.spinner.visible = true;
            threadData.loadThread();
        }
        this._mc.subject_txt.htmlText = threadData.subject.length > 30 ? threadData.subject.substr(0, 30) + "..." : threadData.subject;
        this.scroller!.visible = false;
        this.data = threadData;
        this.Display(false);
        if (!threadData.reported) {
            this._mc.reportBtn.addEventListener(MouseEvent.MOUSE_DOWN, this.reportThread.bind(this));
            this._mc.reportBtn.label_txt.htmlText = getKEYS().Get("mail_ignoreplayer_btn");
            this._mc.reportBtn.buttonMode = true;
            this._mc.reportBtn.mouseChildren = false;
        } else {
            this.removeChild(this.reportBtn);
        }
    }

    public prepareForKill(): void {
        if (this.stage) {
            this.stage.removeEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        }
    }

    private onThreadChanged(event: Event): void {
        this.data!.loadThread();
    }

    public Validate(event: TimerEvent | null = null): boolean {
        let valid = true;
        if (Message.getNotWS(this.msg_txt.text).length < 2) {
            valid = false;
        }
        this.sendBtn.Enabled = valid && !this.spammy && !this.sending;
        if (valid && !this.spammy && !this.sending) {
            this.sendBtn.addEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        } else {
            this.sendBtn.removeEventListener(MouseEvent.CLICK, this.sendDown.bind(this));
        }
        return valid && !this.spammy && !this.sending;
    }

    private reportThread(...args: any[]): void {
        getSOUNDS().Play("click1");
        const popup = new popup_report();
        popup.tTitle.htmlText = getKEYS().Get("report_title");
        popup.tDesc.htmlText = getKEYS().Get("report_desc");
        popup.Resize = (): void => {
            popup.x = this.mcFrame.x + this.mcFrame.width * 0.5 + 100;
            popup.y = this.mcFrame.y + this.mcFrame.height * 0.5;
        };
        popup.sendBtn.SetupKey("btn_send");
        popup.mcFrame.Setup(true, (): void => {
            getSOUNDS().Play("close");
            getGLOBAL().BlockerRemove();
            popup.parent.removeChild(popup);
        });
        popup.x = this.mcFrame.x + this.mcFrame.width * 0.5 + 100;
        popup.y = this.mcFrame.y + this.mcFrame.height * 0.5;
        const onSuccessfulReport = (response: any): void => {
            if (response.error !== undefined && response.error !== 0) {
                getLOGGER().Log("err", "message error in reporting thread- " + response.error);
            }
            this.data!.flagged = true;
            this.data!.Changed();
            getSOUNDS().Play("close");
            getGLOBAL().BlockerRemove();
            popup.parent.removeChild(popup);
            MailBox.ShowInbox();
        };
        const reportSendDown = (e: MouseEvent): void => {
            const vars = [["threadid", this.data!.threadid], ["reason", "block"]];
            const loader = new (getURLLoaderApi())();
            loader.load(getGLOBAL()._apiURL + "player/reportmessagethread", vars, onSuccessfulReport, this.onFail.bind(this));
            popup.sendBtn.removeEventListener(MouseEvent.CLICK, reportSendDown);
            popup.sendBtn.Enabled = false;
        };
        popup.sendBtn.addEventListener(MouseEvent.CLICK, reportSendDown);
        getGLOBAL().BlockerAdd();
        getGLOBAL()._layerWindows.addChild(popup);
    }

    private onAdd(event: Event): void {
        this.Display();
        this.addEventListener(KeyboardEvent.KEY_DOWN, this.onEscapeListener.bind(this));
        this.stage.addEventListener(FullScreenEvent.FULL_SCREEN, this.detectFS.bind(this));
        this.detectFS();
    }

    private detectFS(event: FullScreenEvent | null = null): void {
        if (Boolean(this.stage) && this.stage.displayState === StageDisplayState.FULL_SCREEN) {
            this.fsWarning.tBody.htmlText = getKEYS().Get("fswarning");
            this.addChild(this.fsWarning);
            this.setChildIndex(this.fsWarning, this.numChildren - 1);
        } else if (this.contains(this.fsWarning)) {
            this.removeChild(this.fsWarning);
        }
    }

    private onMsgFocusIn(event: FocusEvent | null = null): void {
        const mode = this.editMode;
        this.outline_mc.visible = mode["smallOutlineVisible"];
        this.largeOutline_mc.visible = mode["largeOutlineVisible"];
        this.msg_txt.height = mode["textHeight"];
        this.msg_txt.y = mode["textY"];
        this.inputBox.y = mode["inputBoxY"];
        this.inputBox.height = mode["inputBoxHeight"];
        this.mask_mc.height = mode["maskHeight"];
        this.scroller!.ScrollTo(1);
        if (this.contains(this.inputBox)) {
            this.setChildIndex(this.inputBox, this.numChildren - 1);
        }
        if (this.contains(this.largeOutline_mc)) {
            this.setChildIndex(this.largeOutline_mc, this.numChildren - 1);
        }
        if (this.contains(this.msg_txt)) {
            this.setChildIndex(this.msg_txt, this.numChildren - 1);
        }
        if (this.contains(this.sendBtn)) {
            this.setChildIndex(this.sendBtn, this.numChildren - 1);
        }
        if (this.contains(this.acceptBtn)) {
            this.setChildIndex(this.acceptBtn, this.numChildren - 1);
        }
        if (this.contains(this.denyBtn)) {
            this.setChildIndex(this.denyBtn, this.numChildren - 1);
        }
        if (this.contains(this.viewBtn)) {
            this.setChildIndex(this.viewBtn, this.numChildren - 1);
        }
        const wasWide = this._wide;
        if (this.shell!.height > this.mask_mc.height) {
            this._wide = true;
        } else {
            this._wide = false;
        }
        if (wasWide !== this._wide) {
            this.Display();
        }
    }

    private onMsgFocusOut(event: FocusEvent | null = null): void {
        const mode = this.viewMode;
        this.outline_mc.visible = mode["smallOutlineVisible"];
        this.largeOutline_mc.visible = mode["largeOutlineVisible"];
        this.msg_txt.height = mode["textHeight"];
        this.msg_txt.y = mode["textY"];
        this.inputBox.y = mode["inputBoxY"];
        this.inputBox.height = mode["inputBoxHeight"];
        this.mask_mc.height = mode["maskHeight"];
        if (this.contains(this.inputBox)) {
            this.setChildIndex(this.inputBox, this.numChildren - 1);
        }
        if (this.contains(this.outline_mc)) {
            this.setChildIndex(this.outline_mc, this.numChildren - 1);
        }
        if (this.contains(this.msg_txt)) {
            this.setChildIndex(this.msg_txt, this.numChildren - 1);
        }
        if (this.contains(this.sendBtn)) {
            this.setChildIndex(this.sendBtn, this.numChildren - 1);
        }
        if (this.contains(this.acceptBtn)) {
            this.setChildIndex(this.acceptBtn, this.numChildren - 1);
        }
        if (this.contains(this.denyBtn)) {
            this.setChildIndex(this.denyBtn, this.numChildren - 1);
        }
        if (this.contains(this.viewBtn)) {
            this.setChildIndex(this.viewBtn, this.numChildren - 1);
        }
        const wasWide = this._wide;
        if (this.shell!.height > this.mask_mc.height) {
            this._wide = true;
        } else {
            this._wide = false;
        }
        if (wasWide !== this._wide) {
            this.Display();
        }
        if (!this._wide) {
            this.scroller!.visible = false;
            this.scroller!.ScrollTo(0, false);
        } else {
            this.scroller!.ScrollTo(1);
        }
    }

    private onRemoved(event: Event): void {
        this.removeEventListener(KeyboardEvent.KEY_DOWN, this.onEscapeListener.bind(this));
        this.data!.removeEventListener(Event.CHANGE, this.onThreadChanged.bind(this));
        this.data!.removeEventListener(Event.COMPLETE, this.threadLoadComplete.bind(this));
        if (this.timer) {
            this.timer.stop();
        }
    }

    private onEscapeListener(event: KeyboardEvent): void {
        if (event.charCode === 27) {
            // Handle escape key
        }
    }

    public threadLoadComplete(event: Event): void {
        this.sendBtn.SetupKey("btn_send");
        this.outline_mc.width = 300;
        this.largeOutline_mc.width = 300;
        this.msg_txt.width = 300;
        this.addChild(this.sendBtn);
        if (this.data!.trucestate === "requested") {
            if (this.data!.convo[0].targetid === getLOGIN()._playerID) {
                this.acceptBtn.SetupKey("btn_truceaccept");
                this.acceptBtn.addEventListener(MouseEvent.CLICK, this.truceAccept.bind(this));
                this.denyBtn.SetupKey("btn_trucereject");
                this.denyBtn.addEventListener(MouseEvent.CLICK, this.truceReject.bind(this));
                this.outline_mc.width = 230;
                this.largeOutline_mc.width = 230;
                this.msg_txt.width = 230;
                this.addChild(this.acceptBtn);
                this.addChild(this.denyBtn);
            }
        }
        if (this.data!.migratestate === "requested") {
            if (this.data!.convo[0].targetid === getLOGIN()._playerID) {
                this.acceptBtn.SetupKey("btn_truceaccept");
                this.acceptBtn.addEventListener(MouseEvent.CLICK, this.migrateAccept.bind(this));
                this.denyBtn.SetupKey("invite_decline");
                this.denyBtn.addEventListener(MouseEvent.CLICK, this.migrateReject.bind(this));
                this.viewBtn.SetupKey("map_view_btn");
                this.viewBtn.addEventListener(MouseEvent.CLICK, this.migrateView.bind(this));
                this.outline_mc.width = 230;
                this.largeOutline_mc.width = 230;
                this.msg_txt.width = 230;
                this.addChild(this.acceptBtn);
                this.addChild(this.denyBtn);
                this.addChild(this.viewBtn);
            } else if (this.data!.convo[0].userid === getLOGIN()._playerID) {
                this.denyBtn.SetupKey("btn_revoke");
                this.denyBtn.addEventListener(MouseEvent.CLICK, this.migrateRevoke.bind(this));
                this.addChild(this.denyBtn);
            }
        }
        this.acceptBtn.Enabled = this.denyBtn.Enabled = this.sendBtn.Enabled = this.viewBtn.Enabled = false;
        this.msg_txt.htmlText = "";
        this.timer = new Timer(500);
        this.timer.addEventListener(TimerEvent.TIMER, this.Validate.bind(this));
        this.timer.start();
        this.spinner.visible = false;
        if (this.contains(this.spinner)) {
            this.removeChild(this.spinner);
        }
        this.acceptBtn.Enabled = this.denyBtn.Enabled = true;
        if (this.data!.migratestate === "requested") {
            this.viewBtn.Enabled = true;
        }
        let isSentByMe = false;
        if (this.data!.convo.length >= 1) {
            const lastMessage = this.data!.convo[this.data!.convo.length - 1];
            isSentByMe = lastMessage.userid === getLOGIN()._playerID;
        }
        if (!isSentByMe) {
            this.msg_txt.addEventListener(FocusEvent.FOCUS_IN, this.onMsgFocusIn.bind(this));
            this.msg_txt.addEventListener(FocusEvent.FOCUS_OUT, this.onMsgFocusOut.bind(this));
            this.addChild(this.msg_txt);
            this.msg_txt.visible = true;
        } else {
            this.msg_txt.visible = false;
        }
        this.spammy = isSentByMe;
        if (this.data!.unread) {
            --getGLOBAL()._unreadMessages;
            getUI2()._top.Update();
            this.data!.unread = false;
            this.data!.Changed();
        }
        this.subject = this.data!.subject;
        let lastMember: ThreadMember | null = null;
        if (this.members.length > 1) {
            lastMember = this.members[this.members.length - 1];
        }
        for (let i = 0; i < this.data!.convo.length; i++) {
            let found = false;
            for (const member of this.members) {
                if (this.data!.convo[i].messageid === member.data.messageid) {
                    found = true;
                    lastMember = member;
                }
            }
            if (!found) {
                const newMember = new ThreadMember();
                newMember.Setup(this.data!.convo[i]);
                newMember.shouldLoadImage();
                this.shell!.addChild(newMember);
                if (lastMember) {
                    newMember.y = lastMember.y + lastMember.getVisibleHeight() + 6;
                } else {
                    newMember.y = 0;
                }
                this.members.push(newMember);
                lastMember = newMember;
                if (this.data!.convo[i].userid !== getLOGIN()._playerID) {
                    newMember.setOrientation("right");
                }
            }
        }
        if (this.shell!.height > this.mask_mc.height) {
            this._wide = true;
        } else {
            this._wide = false;
        }
        this.Display();
        this.onMsgFocusOut();
        this.detectFS();
        if (!this.firstLoaded) {
            this.firstLoaded = true;
        }
        if (this._wide) {
            this.scroller!.ScrollTo(1, false);
        }
    }

    public Display(...args: any[]): void {
        if (this._wide) {
            this.scroller!.Init(this.shell!, this.mask_mc, 0, 106, 319);
            this.scroller!.BottomPadding = 20;
            this.scroller!.visible = true;
            this.scroller!.ScrollTo(1);
            this.mcFrame.width = Thread.WIDE;
        } else {
            this.mcFrame.width = Thread.NARROW;
        }
        this.mcFrame.Setup(true, MailBox.ShowInbox);
    }

    private truceAccept(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        const targetId = this.data!.userid;
        let message = getKEYS().Get("mail_defaulttruceaccept");
        if (Message.getNotWS(this.msg_txt.text).length > 1) {
            message = this.msg_txt.text;
        }
        const vars = [["threadid", this.data!.threadid], ["targetid", targetId], ["targetbaseid", 0], ["type", "truceaccept"], ["subject", this.subject], ["message", message]];
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._apiURL + "player/sendmessage", vars, this.onTruceAcceptSuccess.bind(this), this.onFail.bind(this));
        this.acceptBtn.Enabled = this.denyBtn.Enabled = this.sendBtn.Enabled = false;
        this.acceptBtn.removeEventListener(MouseEvent.CLICK, this.truceAccept.bind(this));
        this.denyBtn.removeEventListener(MouseEvent.CLICK, this.truceReject.bind(this));
        this.onMsgFocusOut();
        this.sending = true;
        this.Validate();
    }

    private truceReject(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        const targetId = this.data!.userid;
        let message = getKEYS().Get("mail_defaulttrucereject");
        if (Message.getNotWS(this.msg_txt.text).length > 1) {
            message = this.msg_txt.text;
        }
        const vars = [["threadid", this.data!.threadid], ["targetid", targetId], ["targetbaseid", 0], ["type", "trucereject"], ["subject", this.subject], ["message", message]];
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._apiURL + "player/sendmessage", vars, this.onTruceRejectSuccess.bind(this), this.onFail.bind(this));
        this.sending = true;
        this.Validate();
        this.acceptBtn.Enabled = this.denyBtn.Enabled = this.sendBtn.Enabled = this.viewBtn.Enabled = false;
        this.onMsgFocusOut();
    }

    private migrateAccept(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        if (getMapRoomManager().instance.isInMapRoom3) {
            getGLOBAL().Message(getKEYS().Get("msg_invalid_mr2_invitation_in_mr3"));
            return;
        }
        MapRoom.inviteBaseID = this.data!.baseID;
        MapRoom.migrateThread = this;
        MapRoom.PreAcceptInvitation(this.parent);
    }

    private migrateReject(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        if (getMapRoomManager().instance.isInMapRoom3) {
            return;
        }
        MapRoom.inviteBaseID = this.data!.baseID;
        MapRoom.migrateThread = this;
        MapRoom.RejectInvitation(event);
    }

    private migrateRevoke(event: MouseEvent): void {
        getSOUNDS().Play("click1");
        const targetId = this.data!.userid;
        const contact = Contact.contactWithUserId(this.data!.convo[0].userid, true);
        const firstName = contact.firstname;
        const message = getKEYS().Get("invite_revoke", { "v1": firstName });
        const vars = [["threadid", this.data!.threadid], ["targetid", targetId], ["targetbaseid", 0], ["type", "migraterevoke"], ["subject", this.subject], ["message", message]];
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._apiURL + "player/sendmessage", vars, this.onMigrateRevokeSuccess.bind(this), this.onFail.bind(this));
        this.sending = true;
        this.Validate();
        this.acceptBtn.Enabled = this.denyBtn.Enabled = this.sendBtn.Enabled = this.viewBtn.Enabled = false;
        this.onMsgFocusOut();
    }

    private migrateView(event: MouseEvent): void {
        if (getMapRoomManager().instance.isInMapRoom3) {
            getGLOBAL().Message(getKEYS().Get("msg_invalid_mr2_invitation_in_mr3"));
            return;
        }
        if (ALLIANCES._myAlliance) {
            getGLOBAL().Message(getKEYS().Get("msg_mustleavealliance"));
            return;
        }
        getSOUNDS().Play("click1");
        getGLOBAL()._currentCell = null;
        MapRoom._Setup(this.data!.coords, this.data!.worldID, this.data!.baseID, true, this);
        getMapRoomManager().instance.Show();
    }

    private onMigrateAcceptSuccess(response: any): void {
        if (response.error !== undefined && response.error !== 0) {
            getLOGGER().Log("err", "error on migrate accept " + response.error);
            return;
        }
        this.data!.migratestate = "accepted";
        this.data!.Changed();
        MailBox.ShowInbox();
        const firstName = Contact.contactWithUserId(this.data!.convo[0].userid).firstname;
        this.sending = false;
    }

    private onMigrateRejectSuccess(response: any): void {
        if (response.error !== 0) {
            return;
        }
        this.data!.migratestate = "rejected";
        this.data!.Changed();
        MailBox.ShowInbox();
        this.sending = false;
    }

    private onMigrateRevokeSuccess(response: any): void {
        if (response.error !== 0) {
            return;
        }
        this.data!.migratestate = "revoked";
        this.data!.Changed();
        MailBox.ShowInbox();
        this.sending = false;
    }

    private sendDown(event: MouseEvent): void {
        if (!this.Validate()) {
            return;
        }
        const targetId = this.data!.targetid;
        this.stage.focus = null;
        const message = this.msg_txt.text;
        const vars = [["threadid", this.data!.threadid], ["targetid", targetId], ["targetbaseid", 0], ["type", "message"], ["subject", this.subject], ["message", message]];
        const loader = new (getURLLoaderApi())();
        loader.load(getGLOBAL()._apiURL + "player/sendmessage", vars, this.onSuccess.bind(this), this.onFail.bind(this));
        this.sending = true;
        this.Validate();
    }

    private onTruceAcceptSuccess(response: any): void {
        if (response.error !== undefined && response.error !== 0) {
            getLOGGER().Log("err", "error on truce accept " + response.error);
            return;
        }
        this.data!.trucestate = "accepted";
        this.data!.Changed();
        MailBox.ShowInbox();
        const firstName = Contact.contactWithUserId(this.data!.convo[0].userid).firstname;
        MAPROOM.TruceAccepted(firstName, "");
        this.sending = false;
    }

    private onTruceRejectSuccess(response: any): void {
        if (response.error !== 0) {
            return;
        }
        this.data!.trucestate = "rejected";
        this.data!.Changed();
        MailBox.ShowInbox();
        this.sending = false;
    }

    private onSuccess(response: any): void {
        if (response.error !== undefined && response.error !== 0) {
            getLOGGER().Log("err", "message error - " + response.error);
        }
        ++this.data!.messagecount;
        this.data!.Changed();
        this.sending = false;
    }

    private onFail(event: IOErrorEvent): void {
        this.sending = false;
    }

    public scrollToMember(member: ThreadMember): void {
    }

    public heightForThread(): number {
        return 100;
    }
}
