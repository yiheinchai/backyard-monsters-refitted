import { Loader } from "openfl/display/Loader";
import { MovieClip } from "openfl/display/MovieClip";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { IOErrorEvent } from "openfl/events/IOErrorEvent";
import { URLRequest } from "openfl/net/URLRequest";
import { TextFieldAutoSize } from "openfl/text/TextFieldAutoSize";

import { Contact } from "./model/Contact";

// Forward declaration
declare class ThreadMember_CLIP extends Sprite {
    leftbg_mc: MovieClip;
    rightbg_mc: MovieClip;
    placeholder: any;
    photoRing: any;
    body_txt: any;
}

/**
 * Thread member message - displays a single message in a thread.
 */
export class ThreadMember extends ThreadMember_CLIP {
    public bg_mc: MovieClip | null = null;
    public loader: Loader | null = null;
    public data: any = null;
    public margin: number = 10;
    public left: any;
    public right: any;
    private configuration: any;

    constructor() {
        super();
        
        this.left = {
            imageX: 0,
            bg: this.leftbg_mc,
            txtX: 77,
            txtLayout: TextFieldAutoSize.LEFT
        };
        
        this.right = {
            imageX: 327,
            bg: this.rightbg_mc,
            txtX: 3,
            txtLayout: TextFieldAutoSize.RIGHT
        };
        
        this.setOrientation("left");
    }

    public Setup(messageData: any): void {
        this.body_txt.autoSize = this.configuration.txtLayout;
        this.body_txt.text = messageData.message;
        this.configuration.bg.height = Math.floor(this.body_txt.height + this.margin * 2);
        this.configuration.bg.y = this.margin + Math.floor(0.5 * this.configuration.bg.height - this.margin);
        this.data = messageData;
    }

    public setOrientation(orientation: string): void {
        this.configuration = orientation === "left" ? this.left : this.right;
        const otherConfig = orientation === "left" ? this.right : this.left;
        
        this.bg_mc = this.configuration.bg;
        this.placeholder.x = this.configuration.imageX;
        otherConfig.bg.visible = false;
        this.configuration.bg.visible = true;
        this.configuration.bg.height = Math.floor(this.body_txt.height + this.margin * 2);
        this.configuration.bg.y = this.margin + Math.floor(0.5 * this.configuration.bg.height - this.margin);
        this.photoRing.x = this.placeholder.x;
        this.photoRing.y = this.placeholder.y;
        this.body_txt.x = this.configuration.txtX;
        this.body_txt.autoSize = this.configuration.txtLayout;
    }

    public getVisibleHeight(): number {
        return this.bg_mc && this.bg_mc.height > 50 ? Math.floor(this.bg_mc.height) : 50;
    }

    public shouldLoadImage(): void {
        if (!this.loader) {
            const contact = Contact.contactWithUserId(this.data.userid, true);
            if (!contact) {
                return;
            }
            
            const picUrl = contact.pic;
            this.loader = new Loader();
            this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImgComplete.bind(this));
            this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.onErr.bind(this));
            
            try {
                this.loader.load(new URLRequest(picUrl));
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
}
