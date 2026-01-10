import Loader from "openfl/display/Loader";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";

import { Contact } from "./model/Contact";

import { KEYS } from "../../../KEYS";

// Forward declaration
declare class FriendPickerItem_CLIP extends Sprite {
    name_txt: any;
    userid_txt: any;
    background: any;
    placeholder: any;
    photoRing: any;
}

/**
 * Friend picker item - represents a single friend in the friend picker list.
 */
export class FriendPickerItem extends FriendPickerItem_CLIP {
    public data: Contact;
    public name_str: string;
    private idleFrameLabel: string;
    private loader: Loader | null = null;

    constructor(contact: Contact) {
        super();
        
        this.data = contact;
        
        const lastName = contact.lastname.length > 2 ? " " + contact.lastname.charAt(0).toUpperCase() + "." : "";
        this.name_str = contact.firstname.toUpperCase() + lastName;
        
        this.name_txt.htmlText = "<b>" + this.name_str;
        this.userid_txt.text = KEYS.Get("label_userid", { v1: contact.userid });
        
        this.idleFrameLabel = contact.friend ? "green" : "gray";
        this.background.gotoAndStop(this.idleFrameLabel);
        
        this.addEventListener(MouseEvent.MOUSE_OVER, this.thisOver.bind(this));
        this.addEventListener(MouseEvent.MOUSE_OUT, this.thisOut.bind(this));
    }

    private thisOver(e: MouseEvent): void {
        this.background.gotoAndStop("white");
    }

    private thisOut(e: MouseEvent): void {
        this.background.gotoAndStop(this.idleFrameLabel);
    }

    public displayAs(type: string): void {
        // Override in subclasses
    }

    public shouldLoadImage(): void {
        if (!this.loader) {
            this.loader = new Loader();
            this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImgComplete.bind(this));
            this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.onErr.bind(this));
            
            try {
                if (this.data.pic.length > 5) {
                    this.loader.load(new URLRequest(this.data.pic), new LoaderContext(true));
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }

    private onErr(e: IOErrorEvent): void {
        // Handle error
    }

    private onImgComplete(e: Event): void {
        if (this.loader) {
            this.addChild(this.loader);
            this.loader.x = this.placeholder.x;
            this.loader.y = this.placeholder.y;
            this.loader.width = this.loader.height = 50;
            this.setChildIndex(this.photoRing, this.numChildren - 1);
        }
    }

    public toString(): string {
        return this.name_str;
    }
}
