import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { ImageCache } from "../../../../display/ImageCache";
import { MapRoomManager } from "../../../../maproom_manager/MapRoomManager";
import { HellRaisersBattleSummary_CLIP } from "./HellRaisersBattleSummary_CLIP";

import { KEYS } from "../../../../../../KEYS";

/**
 * Hell Raisers battle summary - displays win/lose summary after battle.
 */
export class HellRaisersBattleSummary {
    private static readonly k_winImageURL: string = "events/hellraisers/hellraisers_win.jpg";
    private static readonly k_loseImageURL: string = "events/hellraisers/hellraisers_lose.jpg";

    private m_graphic: HellRaisersBattleSummary_CLIP;

    constructor(isWin: boolean, points: number) {
        this.m_graphic = new HellRaisersBattleSummary_CLIP();
        let imageURL: string;
        if (isWin) {
            imageURL = HellRaisersBattleSummary.k_winImageURL;
        } else {
            imageURL = HellRaisersBattleSummary.k_loseImageURL;
        }
        ImageCache.GetImageWithCallBack(imageURL, this.loadedImage.bind(this));
        this.m_graphic.tBody.htmlText = ">YOU GOT SUM POINTS, LOL :" + points;
        this.m_graphic.bAction.Setup(KEYS.Get("btn_openmap"));
        this.m_graphic.bAction.addEventListener(MouseEvent.CLICK, this.clickedActionButton.bind(this));
    }

    protected clickedActionButton(event: Event): void {
        MapRoomManager.instance.SetupAndShow();
    }

    private loadedImage(url: string, bitmapData: BitmapData): void {
        const bitmap: Bitmap = new Bitmap(bitmapData);
        this.m_graphic.mcImage.addChild(bitmap);
    }

    public get graphic(): MovieClip {
        return this.m_graphic;
    }
}
