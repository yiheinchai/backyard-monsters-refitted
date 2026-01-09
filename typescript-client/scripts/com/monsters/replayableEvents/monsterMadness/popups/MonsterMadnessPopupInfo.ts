import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { DisplayObject } from "openfl/display/DisplayObject";
import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";
import { MouseEvent } from "openfl/events/MouseEvent";
import { NetStatusEvent } from "openfl/events/NetStatusEvent";
import { Video } from "openfl/media/Video";
import { NetStream } from "openfl/net/NetStream";
import { URLRequest } from "openfl/net/URLRequest";
import { navigateToURL } from "openfl/net/navigateToURL";

import { ImageCache } from "../../../display/ImageCache";
import { MonsterMadness } from "../../attacking/monsterMadness/MonsterMadness";
import { VideoUtils } from "../../../utils/VideoUtils";
import { MonsterMadnessPopup } from "./MonsterMadnessPopup";
import { Button } from "../../../../Button";

import { BASE } from "../../../../../BASE";
import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { BUILDINGS } from "../../../../../BUILDINGS";
import { BUILDINGOPTIONS } from "../../../../../BUILDINGOPTIONS";
import { GLOBAL } from "../../../../../GLOBAL";
import { INFERNOPORTAL } from "../../../../../INFERNOPORTAL";
import { KEYS } from "../../../../../KEYS";
import { POPUPS } from "../../../../../POPUPS";

/**
 * Monster Madness popup info - base class for popup dialogs.
 */
export class MonsterMadnessPopupInfo extends EventDispatcher {
    public static readonly KOGOTH_SPINNING_VIDEO: string = "assets/specialevent/monstermadness/mc_promo_walk.flv";
    public static readonly KOGOTH_SPINNING_STOMP_VIDEO: string = "assets/specialevent/monstermadness/mc_promo_attack.flv";
    public static readonly KOGOTH_SPINNING_FIREBALL_VIDEO: string = "assets/specialevent/monstermadness/mc_promo_fireball.flv";
    public static readonly KOGOTH_BRAG_IMAGE1: string = "G4_P1-90.png";
    public static readonly KOGOTH_BRAG_IMAGE2: string = "G4_P2-90.png";
    public static readonly KOGOTH_BRAG_IMAGE3: string = "G4_P3-90.png";
    public static readonly BANNER_IMAGE_LOCATION: string = "specialevent/monstermadness/bym_mm_banner_600x82.png";
    public static readonly REMOVE_LOADING_CIRCLE: string = "removeLoadingCircle";

    public isOnlySeenOnce: boolean = false;
    private readonly _RSVP_URL: string = "https://www.facebook.com/events/193849810724330/";
    private _videoStream: NetStream | null = null;

    constructor() {
        super();
    }

    public getBanner(goal: number): string {
        return MonsterMadnessPopupInfo.BANNER_IMAGE_LOCATION;
    }

    public getCopy(goal: number): string {
        return "";
    }

    public getMedia(goal: number): DisplayObject | null {
        return null;
    }

    public setupButton(button: Button, goal: number): void {
    }

    public setupButton2(button: Button, goal: number): void {
        button.visible = false;
    }

    protected setupVideo(videoPath: string): Video {
        const video = new Video(MonsterMadnessPopup._MEDIA_DIMENTIONS_X, MonsterMadnessPopup._MEDIA_DIMENTIONS_Y);
        this._videoStream = VideoUtils.getVideoStream(video, videoPath);
        this._videoStream.addEventListener(NetStatusEvent.NET_STATUS, this.onNetStatusUpdate.bind(this));
        VideoUtils.loopStream(this._videoStream);
        return video;
    }

    private onNetStatusUpdate(event: NetStatusEvent): void {
        if (event.info.code === "NetStream.Play.Start") {
            this.dispatchEvent(new Event(MonsterMadnessPopupInfo.REMOVE_LOADING_CIRCLE));
        }
    }

    protected setupImage(imagePath: string): Bitmap {
        const bmp = new Bitmap();
        ImageCache.GetImageWithCallBack(imagePath, this.onImageLoad.bind(this), true, 4, "", [bmp]);
        return bmp;
    }

    private onImageLoad(key: string, bmd: BitmapData, args: Array<any> | null = null): void {
        (args![0] as Bitmap).bitmapData = bmd;
    }

    protected setupUpgradeButton(button: Button): void {
        if (BASE.isInfernoMainYardOrOutpost) {
            this.setupRSVPButton(button);
            return;
        }
        const townHall: BFOUNDATION = GLOBAL.townHall;
        let keyStr: string = "btn_upgradenow";
        let clickHandler: Function | null = null;
        if (townHall._lvl.Get() >= 6) {
            if (GLOBAL._bMap) {
                clickHandler = this.onClickUpgradeMaproom.bind(this);
            } else {
                clickHandler = this.onClickBuildMaproom.bind(this);
                keyStr = "btn_buildnow";
            }
        } else {
            clickHandler = this.onClickUpgradeTownhall.bind(this);
        }
        button.Setup(KEYS.Get(keyStr));
        button.addEventListener(MouseEvent.CLICK, clickHandler as any);
        button.Highlight = true;
    }

    protected onClickBuildMaproom(event: MouseEvent): void {
        this.close();
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickBuildMaproom.bind(this));
        BUILDINGS._buildingID = 11;
        BUILDINGS.Show();
    }

    protected onClickUpgradeMaproom(event: MouseEvent): void {
        this.close();
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickUpgradeMaproom.bind(this));
        GLOBAL._selectedBuilding = GLOBAL._bMap;
        BUILDINGOPTIONS.Show(GLOBAL._bMap, "upgrade");
    }

    protected onClickUpgradeTownhall(event: MouseEvent): void {
        this.close();
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickUpgradeTownhall.bind(this));
        GLOBAL._selectedBuilding = GLOBAL.townHall;
        BUILDINGOPTIONS.Show(GLOBAL.townHall, "upgrade");
    }

    protected setupRSVPButton(button: Button): void {
        if (MonsterMadness.hasEventStarted) {
            button.visible = false;
            return;
        }
        button.Setup(KEYS.Get("btn_rsvp"));
        button.addEventListener(MouseEvent.CLICK, this.onClickRSVPButton.bind(this));
        button.Highlight = true;
    }

    private onClickRSVPButton(event: MouseEvent): void {
        this.close();
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickRSVPButton.bind(this));
        navigateToURL(new URLRequest(this._RSVP_URL));
    }

    protected setupMapButtton(button: Button): void {
        if (BASE.isInfernoMainYardOrOutpost) {
            this.setupExitButton(button);
            return;
        }
        button.Setup(KEYS.Get("btn_openmap"));
        button.addEventListener(MouseEvent.CLICK, this.onClickMapButton.bind(this));
    }

    private setupExitButton(button: Button): void {
        button.Setup(KEYS.Get("btn_exitcavern"));
        button.addEventListener(MouseEvent.CLICK, this.onClickExitButton.bind(this));
    }

    protected onClickExitButton(event: MouseEvent): void {
        this.close();
        INFERNOPORTAL.ToggleYard();
    }

    private onClickMapButton(event: MouseEvent): void {
        this.close();
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickMapButton.bind(this));
        GLOBAL.ShowMap();
    }

    protected setupCloseButtton(button: Button): void {
        button.Setup(KEYS.Get("btn_close"));
        button.addEventListener(MouseEvent.CLICK, this.onClickCloseButton.bind(this));
    }

    private onClickCloseButton(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.onClickCloseButton.bind(this));
        this.close();
    }

    protected ShowBrag(imageUrl: string, titleKey: string, bodyKey: string, linkUrl: string): void {
        GLOBAL.CallJS("sendFeed", [imageUrl, KEYS.Get(titleKey), KEYS.Get(bodyKey), linkUrl]);
        this.close();
    }

    protected close(): void {
        POPUPS.Next();
        if (this._videoStream) {
            this._videoStream.close();
        }
    }
}
