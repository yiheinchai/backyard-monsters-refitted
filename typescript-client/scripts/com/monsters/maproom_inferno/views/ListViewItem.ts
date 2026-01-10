import Bitmap from "openfl/display/Bitmap";
import Loader from "openfl/display/Loader";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import URLRequest from "openfl/net/URLRequest";
import LoaderContext from "openfl/system/LoaderContext";

import { ListViewItem_CLIP } from "../../maproom/views/ListViewItem_CLIP";
import { PlayerHandler } from "../PlayerHandler";
import { BaseObject } from "../model/BaseObject";

import { KEYS } from "../../../../KEYS";
import { GLOBAL } from "../../../../GLOBAL";
import { LOGGER } from "../../../../LOGGER";

/**
 * List view item (Inferno) - displays player base info in inferno map room list.
 */
export class ListViewItem extends ListViewItem_CLIP {
    private loaded: boolean = false;
    public portrait: Bitmap | null = null;
    public data: BaseObject | null = null;
    public attackStarPoints: number = 0;
    public helpStarPoints: number = 0;
    public online: number = 0;
    public ownerName: string = "";
    public status: string = "";
    public level: number = 0;
    public loader: Loader;
    public helpStars: Array<any> = [];
    public attackStars: Array<any> = [];
    public handler: PlayerHandler | null = null;

    constructor() {
        super();
        this.truceBtn.SetupKey("map_truce_btn");
        this.msgBtn.SetupKey("map_message_btn");
        this.loader = new Loader();
    }

    public Display(): void {
        if (!this.loaded) {
            this.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.onImageLoaded.bind(this));
            try {
                const LoadImageError = (event: IOErrorEvent): void => {
                    // Empty error handler
                };
                this.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
                this.loader.load(new URLRequest(this.data!.pic), new LoaderContext(true));
                this.loaded = true;
            } catch (e: any) {
                LOGGER.Log("err", "MapRoom ListViewItem Display: " + e.stack);
            }
        }
    }

    private onImageLoaded(event: Event): void {
        this.addChild(this.loader);
        this.loader.x = this.placeholder.x;
        this.loader.y = this.placeholder.y;
        this.loader.width = this.loader.height = 50;
    }

    public Setup(baseObj: BaseObject): void {
        this.data = baseObj;
        this.handler = new PlayerHandler();
        this.Update();
        baseObj.addEventListener(Event.CHANGE, this.Update.bind(this));
    }

    public Update(event: Event | null = null): void {
        const config: any = this.handler!.configure(this);
        this.name_txt.htmlText = "<b>" + this.data!.ownerName;
        this.userid_txt.text = KEYS.Get("label_userid", { "v1": this.data!.userid.Get() });
        this.online_txt.text = "";
        if (this.data!.saved.Get() >= GLOBAL.Timestamp() - 62) {
            this.dot.gotoAndStop(2);
        } else {
            this.dot.gotoAndStop(1);
        }
        this.ownerName = this.data!.ownerName;
        this.online = this.data!.saved.Get();
        this.attackStarPoints = this.data!.attacksto.Get() + this.data!.attacksfrom.Get();
        this.helpStarPoints = this.data!.helpsto.Get() + this.data!.helpsfrom.Get();
        this.status = config.relation;
        this.level = this.data!.level.Get();
        const levels: Array<number> = [1, 10, 85, 200];
        const attackColor: string = this.attackStarPoints === 0 ? "#666666" : "#990000";
        const battleKey: string = this.attackStarPoints === 1 ? "map_battle" : "map_battles";
        this.attacks_txt.htmlText = "<font color='" + attackColor + "'>" + KEYS.Get(battleKey, { "v1": this.attackStarPoints });
        this.status_txt.htmlText = "<font color='" + config.relationColor + "'>" + config.relation;
        this.extraStatus_txt.htmlText = "<b><font color='" + config.extraStatusColor + "'>" + config.extraStatus;
        this.levelStar.lv_txt.htmlText = "<b>" + this.level;
    }

    private setStars(points: any, thresholds: Array<number>, stars: Array<any>): void {
        let starCount: number = 0;
        for (let i = 0; i < thresholds.length; i++) {
            if (points < thresholds[i]) {
                break;
            }
            starCount++;
        }
        for (let i = 0; i < stars.length; i++) {
            if (i < starCount) {
                stars[i].gotoAndStop(1);
            } else {
                stars[i].gotoAndStop(2);
            }
        }
    }
}
