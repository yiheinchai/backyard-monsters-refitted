import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { Loader } from "openfl/display/Loader";

import { ImageCache } from "../../../display/ImageCache";
import { MapRoom } from "../../MapRoom";
import { PlayerHandler } from "../../PlayerHandler";
import { BaseObject } from "../../model/BaseObject";
import { WMListViewItem_CLIP } from "./WMListViewItem_CLIP";

/**
 * WM list view item - displays a base item in the wild monster list.
 */
export class WMListViewItem extends WMListViewItem_CLIP {
    private loaded: boolean = false;
    public portrait: Bitmap | null = null;
    public data: BaseObject | null = null;
    public attackStarPoints: number = 0;
    public helpStarPoints: number = 0;
    public online: number = 0;
    public ownerName: string = "";
    public status: string = "";
    public level: number = 0;
    public loader: Loader | null = null;
    public helpStars: Array<any> = [];
    public attackStars: Array<any> = [];
    public handler: PlayerHandler | null = null;

    constructor() {
        super();
        this.removeChild(this.dot);
        this.removeChild(this.attacks_txt);
        this.removeChild(this.status_txt);
        this.removeChild(this.extraStatus_txt);
    }

    public Display(): void {
        if (!this.loaded) {
            try {
                ImageCache.GetImageWithCallBack(this.data!.pic, this.onImageLoaded.bind(this));
                this.loaded = true;
            } catch (e: any) {
                MapRoom.BRIDGE.Log("err", "MapRoom WMListViewItem Display: " + e.stack);
            }
        }
    }

    private onImageLoaded(url: string, bitmapData: BitmapData): void {
        const bitmap: Bitmap = new Bitmap(bitmapData);
        this.addChild(bitmap);
        bitmap.x = this.placeholder.x;
        bitmap.y = this.placeholder.y;
        bitmap.width = bitmap.height = 50;
    }

    public Setup(baseObj: BaseObject): void {
        this.data = baseObj;
        this.handler = new PlayerHandler();
        this.Update();
    }

    public Update(...rest: any[]): void {
        const config: any = this.handler!.configure(this);
        this.name_txt.htmlText = "<b>" + this.data!.ownerName;
        this.ownerName = this.data!.ownerName;
        this.online = 0;
        this.attackStarPoints = 5;
        this.helpStarPoints = 0;
        this.status = "enemy";
        this.level = this.data!.level.Get();
        const levels: Array<number> = [1, 10, 85, 200];
    }
}
