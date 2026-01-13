import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";

import { Contact } from "./model/Contact";
import { Inbox } from "./Inbox";
import { Thread } from "./Thread";

import { GLOBAL } from "../../../GLOBAL";
import { LOGIN } from "../../../LOGIN";
import { MAILBOX } from "../../../MAILBOX";
import { SOUNDS } from "../../../SOUNDS";
import { URLLoaderApi } from "../../../URLLoaderApi";
import { system_message } from "../../../system_message";

/**
 * MailBox - main mailbox system for player communication.
 */
export class MailBox extends Sprite {
    public static contacts: Contact[] = [];
    private static instance: MailBox | null = null;
    public static currentThread: Thread | null = null;

    public inbox: Inbox | null = null;

    constructor() {
        super();
        MailBox.instance = this;
    }

    public static Hide(e: MouseEvent | null = null): void {
        if (MailBox.currentThread) {
            MailBox.currentThread.prepareForKill();
        }
        MailBox.currentThread = null;
        MAILBOX.Hide();
    }

    public static ShowInbox(...args: any[]): void {
        if (MailBox.currentThread) {
            SOUNDS.Play("close");
            MailBox.currentThread.prepareForKill();
            GLOBAL.BlockerRemove();
            if (MailBox.currentThread.parent) {
                MailBox.currentThread.parent.removeChild(MailBox.currentThread);
            }
            MailBox.currentThread = null;
        }
        if (MailBox.instance && MailBox.instance.inbox) {
            MailBox.instance.addChild(MailBox.instance.inbox);
        }
    }

    public static ShowThread(thread: Thread): void {
        GLOBAL.BlockerAdd();
        GLOBAL._layerWindows.addChild(thread);
        thread.x = 100;
        thread.y = -15;
        MailBox.currentThread = thread;
    }

    public Setup(): void {
        MailBox.contacts = [];
        
        const selfContact = new Contact(String(LOGIN._playerID), {
            first_name: "Me",
            last_name: "",
            pic_square: LOGIN._playerPic
        }, true);
        
        const daveContact = new Contact("0", {
            first_name: "D.A.V.E.",
            last_name: "",
            pic_square: ""
        }, true);
        (daveContact as any).picClass = system_message;
        
        const urlLoader = new URLLoaderApi();
        urlLoader.load(GLOBAL._apiURL + "player/getmessagetargets", null, this.onTargetsSuccess.bind(this), this.onTargetsFail.bind(this));
    }

    public Tick(): void {
        if (this.inbox) {
            this.inbox.Tick();
        }
    }

    private onTargetsSuccess(data: any): void {
        for (const userId in data.targets) {
            const contact = new Contact(userId, data.targets[userId]);
            MailBox.contacts.push(contact);
        }
        
        this.inbox = new Inbox();
        this.inbox.addEventListener(Event.COMPLETE, this.onInboxInit.bind(this));
        this.inbox.Setup();
        MailBox.ShowInbox();
    }

    private onInboxInit(e: Event): void {
        // Inbox initialized
    }

    private onTargetsFail(e: IOErrorEvent): void {
        MailBox.Hide();
    }

    public Resize(): void {
        this.x = 0;
        this.y = 0;
    }
}
