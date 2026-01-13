import Loader from "openfl/display/Loader";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";
import { TweenLite } from "../../../gs/TweenLite";

import { ScrollSet } from "../display/ScrollSet";
import { Contact } from "./model/Contact";
import { FriendPicker_CLIP } from "./FriendPicker_CLIP";
import { FriendPickerItem } from "./FriendPickerItem";
import { URLLoaderApi } from "../../../URLLoaderApi";
import { system_message } from "../../system_message";

import { GLOBAL } from "../../../GLOBAL";
import { LOGIN } from "../../../LOGIN";

/**
 * FriendPicker - selectable dropdown list of friend contacts.
 */
export class FriendPicker extends FriendPicker_CLIP {
    private static _contacts: Array<Contact> = [];

    public pool: Array<FriendPickerItem> | null = null;
    private currentPage: number = 0;
    public loader: Loader | null = null;
    public currentSelection: FriendPickerItem | null = null;
    public isOpen: boolean = false;
    private shell: Sprite;
    public scroller: ScrollSet;

    constructor(filter: string = "all") {
        super();
        this.scroller = new ScrollSet();
        this.scroller.x = 292;
        this.scroller.y = 63;
        this.addChild(this.scroller);
        if (filter === "map2friends") {
            this.hitBtn.addEventListener(MouseEvent.CLICK, this.openMap2Friends.bind(this));
        } else {
            this.hitBtn.addEventListener(MouseEvent.CLICK, this.open.bind(this));
        }
        this.shell = new Sprite();
        this.shell.mask = this.mask_mc;
        this.shell.x = this.mask_mc.x;
        this.shell.y = this.mask_mc.y;
        this.scroller.visible = false;
        this.bg_mc.visible = false;
        this.name_txt.htmlText = "";
        this.photoRing.visible = false;
        this.arrowBtn.gotoAndStop(2);
        this.placeholder.visible = false;
    }

    public static ClearContacts(): void {
        FriendPicker._contacts = [];
    }

    private open(...rest: any[]): void {
        if (this.isOpen) {
            this.close();
            return;
        }
        this.scroller.visible = true;
        this.arrowBtn.gotoAndStop(1);
        if (!this.pool) {
            const contacts = Contact.contacts;
            const count = contacts.length;
            this.pool = [];
            for (let i = 0; i < count; i++) {
                const item = new FriendPickerItem(contacts[i]);
                item.addEventListener(MouseEvent.MOUSE_OVER, this.onItemOver.bind(this));
                item.addEventListener(MouseEvent.MOUSE_OUT, this.onItemOut.bind(this));
                item.addEventListener(MouseEvent.MOUSE_DOWN, this.onItemDown.bind(this));
                item.shouldLoadImage();
                item.mouseChildren = false;
                item.useHandCursor = true;
                item.buttonMode = true;
                this.pool.push(item);
            }
            this.pool.sort((a: FriendPickerItem, b: FriendPickerItem) => a.name_str.toLowerCase().localeCompare(b.name_str.toLowerCase()));
            for (let i = 0; i < this.pool.length; i++) {
                const item = this.pool[i];
                this.shell.addChild(item);
                item.x = 0;
                item.y = i * 60;
            }
            this.scroller.Init(this.shell, this.mask_mc, 0, this.mask_mc.y, this.mask_mc.height - 4, 60);
        }
        if (this.currentSelection) {
            this.shell.addChild(this.currentSelection);
        }
        this.bg_mc.visible = true;
        this.addChild(this.shell);
        this.isOpen = true;
        this.scroller.ScrollTo(0);
        this.scroller.Show();
        this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.onKey.bind(this));
    }

    private openMap2Friends(...rest: any[]): void {
        if (this.isOpen) {
            this.close();
            return;
        }
        if (FriendPicker._contacts.length === 0) {
            FriendPicker._contacts = [];
            const meContact = new Contact(String(LOGIN._playerID), {
                "first_name": "Me",
                "last_name": "",
                "pic_square": LOGIN._playerPic
            }, true);
            const daveContact = new Contact("0", {
                "first_name": "D.A.V.E.",
                "last_name": "",
                "pic_square": ""
            }, true);
            daveContact.picClass = system_message;
            const loader = new URLLoaderApi();
            loader.load(GLOBAL._apiURL + "player/getmessagetargets", null, this.onTargetsSuccess.bind(this));
        } else {
            this._openMap2Friends();
        }
    }

    private onTargetsSuccess(data: Record<string, any>): void {
        for (const key in data.targets) {
            const contact = new Contact(key, data.targets[key]);
            if (Boolean(data.targets[key].friend) && data.targets[key].mapver === 2) {
                FriendPicker._contacts.push(contact);
            }
        }
        this._openMap2Friends();
    }

    private _openMap2Friends(): void {
        this.scroller.visible = true;
        this.arrowBtn.gotoAndStop(1);
        if (!this.pool) {
            const contacts = FriendPicker._contacts;
            const count = contacts.length;
            this.pool = [];
            for (let i = 0; i < count; i++) {
                const item = new FriendPickerItem(contacts[i]);
                item.addEventListener(MouseEvent.MOUSE_OVER, this.onItemOver.bind(this));
                item.addEventListener(MouseEvent.MOUSE_OUT, this.onItemOut.bind(this));
                item.addEventListener(MouseEvent.MOUSE_DOWN, this.onItemDown.bind(this));
                item.shouldLoadImage();
                item.mouseChildren = false;
                item.useHandCursor = true;
                item.buttonMode = true;
                this.pool.push(item);
            }
            this.pool.sort((a: FriendPickerItem, b: FriendPickerItem) => a.name_str.toLowerCase().localeCompare(b.name_str.toLowerCase()));
            for (let i = 0; i < this.pool.length; i++) {
                const item = this.pool[i];
                this.shell.addChild(item);
                item.x = 0;
                item.y = i * 60;
            }
            this.scroller.Init(this.shell, this.mask_mc, 0, this.mask_mc.y, this.mask_mc.height - 4, 60);
        }
        if (this.currentSelection) {
            this.shell.addChild(this.currentSelection);
        }
        this.bg_mc.visible = true;
        this.addChild(this.shell);
        this.isOpen = true;
        this.scroller.ScrollTo(0);
        this.scroller.Show();
        this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.onKey.bind(this));
    }

    private onKey(event: KeyboardEvent): void {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const keyCodes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
        const keyMap: Record<number, string> = {};
        for (let i = 0; i < keyCodes.length; i++) {
            keyMap[keyCodes[i]] = alphabet.charAt(i);
        }
        const char = keyMap[event.keyCode];
        for (let i = 0; i < this.pool!.length; i++) {
            if (this.pool![i].name_str.toLowerCase().charAt(0) === char) {
                let scrollPos = this.pool![i].y / (this.shell.height - this.mask_mc.height);
                if (scrollPos > 1) {
                    scrollPos = 1;
                }
                if (scrollPos < 0) {
                    scrollPos = 0;
                }
                this.scroller.ScrollTo(scrollPos);
                return;
            }
        }
    }

    public preloadSelection(contact: Contact): void {
        const item = new FriendPickerItem(contact);
        this.setData(item);
        this.removeChild(this.hitBtn);
        this.removeChild(this.arrowBtn);
        this.removeChild(this.arrowLine);
    }

    public getCurrentData(): Contact {
        return this.currentSelection!.data;
    }

    public onItemOver(event: MouseEvent): void {
    }

    public onItemOut(event: MouseEvent): void {
    }

    public onItemDown(event: MouseEvent): void {
        this.setData(event.target as FriendPickerItem);
    }

    public setData(item: FriendPickerItem): void {
        const onErr = (event: IOErrorEvent): void => {
        };
        const onImgComplete = (event: Event): void => {
            this.photoRing.visible = true;
            this.loader!.width = this.loader!.height = 50;
            this.setChildIndex(this.photoRing, this.numChildren - 1);
        };
        this.currentSelection = item;
        this.close();
        const lastStr = this.currentSelection.data.lastname.length > 2 ? " " + this.currentSelection.data.lastname.charAt(0).toUpperCase() + "." : "";
        this.name_txt.htmlText = "<b>" + this.currentSelection.data.firstname.toUpperCase() + lastStr;
        if (this.loader) {
            this.removeChild(this.loader);
            this.loader = null;
        }
        this.loader = new Loader();
        this.loader.x = this.loader.y = 5;
        this.addChild(this.loader);
        this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onImgComplete);
        this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, onErr);
        try {
            if (this.currentSelection.data.pic.length > 5) {
                this.loader.load(new URLRequest(this.currentSelection.data.pic));
            }
        } catch (e: any) {
        }
        this.placeholder.visible = true;
    }

    public gotoPage(page: number): void {
        const endIndex = page * 15 + 15 > this.pool!.length ? this.pool!.length : page * 15 + 15;
        const xPos = this.mask_mc.x - 210 * 3 * page;
        TweenLite.to(this.shell, 0.5, { "x": xPos });
        this.currentPage = page;
    }

    public close(): void {
        if (!this.isOpen) {
            return;
        }
        this.isOpen = false;
        this.arrowBtn.gotoAndStop(2);
        this.scroller.visible = false;
        this.removeChild(this.shell);
        this.bg_mc.visible = false;
        this.stage.removeEventListener(KeyboardEvent.KEY_DOWN, this.onKey.bind(this));
    }
}
