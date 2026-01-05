import Sprite from 'openfl/display/Sprite';
import { SOUNDS } from '../../../SOUNDS';
import { GLOBAL } from '../../../GLOBAL';
import { MAILBOX } from '../../../MAILBOX';

// Stub Model Classes
class Contact {
    constructor(id: string, data: any, flag: boolean = false) {}
    public picClass: any;
}
class Inbox extends Sprite {
    public Tick(): void {}
    public Setup(): void {}
}
class Thread extends Sprite {
    public prepareForKill(): void {}
}

// Stub URLLoaderApi
class URLLoaderApi {
    public load(url: string, vars: any, onSuccess: Function, onFail: Function): void {
        console.log("URLLoaderApi stub load: " + url);
        // Simulate success or fail?
    }
}

// Stub LOGIN
class LOGIN {
    public static _playerID: number = 0;
    public static _playerPic: string = "";
}

export class MailBox extends Sprite {
    public static contacts: Array<any> = [];
    private static instance: MailBox;
    public static currentThread: Thread | null = null;
    public inbox: Inbox | null = null;
    private system_message: any; // Stub for class reference

    constructor() {
        super();
        MailBox.instance = this;
    }

    public static Hide(param1: any = null): void {
        if (MailBox.currentThread) {
            MailBox.currentThread.prepareForKill();
        }
        MailBox.currentThread = null;
        MAILBOX.Hide();
    }

    public static ShowInbox(...rest: any[]): void {
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

    public static ShowThread(param1: Thread): void {
        GLOBAL.BlockerAdd();
        // GLOBAL._layerWindows.addChild(param1); // Need to typecast or ensure _layerWindows is accessible
        (GLOBAL as any)._layerWindows.addChild(param1);
        param1.x = 100;
        param1.y = -15;
        MailBox.currentThread = param1;
    }

    public Setup(): void {
        MailBox.contacts = [];
        let _loc1_: Contact = new Contact(String(LOGIN._playerID), {
            "first_name": "Me",
            "last_name": "",
            "pic_square": LOGIN._playerPic
        }, true);
        let _loc2_: Contact = new Contact("0", {
            "first_name": "D.A.V.E.",
            "last_name": "",
            "pic_square": ""
        }, true);
        // _loc2_.picClass = this.system_message; 

        let _loc3_: URLLoaderApi = new URLLoaderApi();
        // _loc3_.load(GLOBAL._apiURL + "player/getmessagetargets", null, this.onTargetsSuccess.bind(this), this.onTargetsFail.bind(this));
    }

    public Tick(): void {
        if (this.inbox) {
            this.inbox.Tick();
        }
    }

    private onTargetsSuccess(param1: any): void {
        // Logic to populate contacts
        this.inbox = new Inbox();
        // this.inbox.addEventListener(Event.COMPLETE, this.onInboxInit.bind(this));
        this.inbox.Setup();
        MailBox.ShowInbox();
    }

    private onInboxInit(param1: any): void {
    }

    private onTargetsFail(param1: any): void {
        MailBox.Hide();
    }

    public Resize(): void {
        this.x = 0;
        this.y = 0;
    }
}
