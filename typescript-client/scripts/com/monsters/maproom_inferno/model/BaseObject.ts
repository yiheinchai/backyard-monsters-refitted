import Loader from "openfl/display/Loader";
import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";

import { SecNum } from "../../../../cc/utils/SecNum";

/**
 * BaseObject - data model for a base on the Inferno map.
 */
export class BaseObject {
    public baseid: SecNum;
    public attackpermitted: SecNum;
    public seentime: SecNum;
    public friend: SecNum;
    public attacker: string = "";
    public helpsto: SecNum | null = null;
    public baseseed: SecNum | null = null;
    public attacksto: SecNum | null = null;
    public helpsfrom: SecNum | null = null;
    public basename: string = "";
    public attacksfrom: SecNum | null = null;
    public saved: SecNum;
    public online: boolean = false;
    public pic: string = "";
    public ownerName: string = "";
    public trucestate: string = "";
    public truceexpire: number = 0;
    public userid: SecNum | null = null;
    public level: SecNum;
    public wm: SecNum;
    public description: string = "";
    public type: number = 0;
    public retaliatecount: number = 0;
    public destroyed: number = 0;
    private dsp: EventDispatcher;
    public loader: Loader | null = null;
    public loaded: number = 0;

    constructor(data: Record<string, any>) {
        this.level = new SecNum(Number(data.level));
        this.baseid = new SecNum(Number(data.baseid));
        this.basename = data.basename;
        this.ownerName = this.basename.split("'s")[0];
        this.pic = data.pic;
        this.dsp = new EventDispatcher();
        if (data.wm !== undefined && data.wm === 1) {
            this.wm = new SecNum(data.wm);
            this.attackpermitted = new SecNum(1);
            this.saved = new SecNum(0);
            this.seentime = new SecNum(0);
            this.friend = new SecNum(0);
            this.trucestate = "";
            this.truceexpire = 0;
            this.description = data.description;
            this.type = data.type;
        } else {
            this.wm = new SecNum(0);
            this.userid = new SecNum(data.userid);
            this.attackpermitted = new SecNum(data.attackpermitted);
            this.friend = new SecNum(data.friend);
            this.attacker = data.attacker;
            this.helpsto = new SecNum(data.helpsto);
            this.helpsfrom = new SecNum(data.helpsfrom);
            this.baseseed = new SecNum(data.baseseed);
            this.attacksto = new SecNum(data.attacksto);
            this.attacksfrom = new SecNum(data.attacksfrom);
            this.saved = new SecNum(data.saved);
            this.retaliatecount = data.retaliatecount;
            this.seentime = new SecNum(data.saved);
            this.truceexpire = data.truceexpire;
            this.trucestate = data.trucestate;
        }
        if (data.destroyed) {
            this.destroyed = data.destroyed;
        }
    }

    public Clear(): void {
        this.baseid = null!;
        this.attackpermitted = null!;
        this.seentime = null!;
        this.friend = null!;
        this.attacker = "";
        this.helpsto = null;
        this.baseseed = null;
        this.attacksto = null;
        this.helpsfrom = null;
        this.basename = "";
        this.attacksfrom = null;
        this.saved = null!;
        this.pic = "";
        this.userid = null;
        this.level = null!;
        this.wm = null!;
        this.dsp = null!;
        this.loader = null;
    }

    public Update(data: Record<string, any>): void {
        if (this.wm.Get() === 0) {
            this.seentime.Set(data.saved);
            this.saved.Set(data.saved);
            this.truceexpire = data.truceexpire;
            this.trucestate = data.trucestate;
            this.attacksfrom!.Set(data.attacksfrom);
            this.attacker = data.attacker;
            this.attackpermitted.Set(data.attackpermitted);
            this.friend.Set(data.friend);
            this.dsp.dispatchEvent(new Event(Event.CHANGE));
        }
    }

    public addEventListener(type: string, listener: Function): void {
        this.dsp.addEventListener(type, listener as any);
    }

    public removeEventListener(type: string, listener: Function): void {
        this.dsp.removeEventListener(type, listener as any);
    }

    public loadImage(): void {
        if (!this.loader && this.loaded === 0 && this.pic.length > 5) {
            try {
                const LoadImageError = (event: IOErrorEvent): void => {
                };
                this.loader = new Loader();
                this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.imgComplete.bind(this));
                this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
                this.loader.load(new URLRequest(this.pic), new LoaderContext(true));
                this.loaded = 1;
            } catch (e: any) {
            }
        } else {
            this.dsp.dispatchEvent(new Event(Event.COMPLETE));
        }
    }

    private imgComplete(event: Event): void {
        this.loaded = 2;
        this.dsp.dispatchEvent(event.clone());
    }

    public toString(): string {
        return "[BaseObject name:" + this.basename + " trucestate:" + this.trucestate + "]";
    }
}
