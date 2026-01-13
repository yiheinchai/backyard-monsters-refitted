import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MouseEvent from "openfl/events/MouseEvent";

import { MapRoom3 } from "../MapRoom3";
import { MapRoom3AssetCache } from "../MapRoom3AssetCache";
import { Bookmark } from "./Bookmark";
import { MapRoom3BookmarkDisplay } from "../../../../MapRoom3BookmarkDisplay";

import { KEYS } from "../../../../KEYS";

/**
 * Bookmark display - displays a single bookmark in the map room 3.
 */
export class BookmarkDisplay extends MapRoom3BookmarkDisplay {
    private m_BookmarkToDisplay: Bookmark | null;
    private m_ThumbnailIcon: Bitmap | null = null;
    private m_DamageBarIcon: Bitmap | null = null;

    constructor(bookmark: Bookmark, backgroundFrame: string, thumbnailBitmap: BitmapData) {
        super();
        this.m_BookmarkToDisplay = bookmark;
        this.background.gotoAndStop(backgroundFrame);
        this.buttonMode = true;
        this.m_ThumbnailIcon = new Bitmap(thumbnailBitmap);
        this.imageHolder.addChild(this.m_ThumbnailIcon);
        const damageBarData: BitmapData = MapRoom3AssetCache.instance.GetDamageBarSegmentAsset(bookmark.mapCell.damagePercentage);
        this.m_DamageBarIcon = new Bitmap(damageBarData);
        this.m_DamageBarIcon.y = this.m_ThumbnailIcon.height - damageBarData.height;
        this.imageHolder.addChild(this.m_DamageBarIcon);
        this.nameText.htmlText = "<b>" + this.m_BookmarkToDisplay.displayName + "</b>";
        this.descriptionText.htmlText = KEYS.Get("mr3_bookmark_coordinates_info", {
            "v1": bookmark.cellX,
            "v2": bookmark.cellY
        });
        this.addEventListener(MouseEvent.CLICK, this.OnSelected.bind(this), false, 0, true);
    }

    public Clear(): void {
        this.removeEventListener(MouseEvent.CLICK, this.OnSelected.bind(this));
        if (this.m_ThumbnailIcon !== null) {
            this.imageHolder.removeChild(this.m_ThumbnailIcon);
            this.m_ThumbnailIcon.bitmapData = null;
            this.m_ThumbnailIcon = null;
        }
        if (this.m_DamageBarIcon !== null) {
            this.imageHolder.removeChild(this.m_DamageBarIcon);
            this.m_DamageBarIcon.bitmapData = null;
            this.m_DamageBarIcon = null;
        }
        this.m_BookmarkToDisplay = null;
    }

    private OnSelected(event: MouseEvent): void {
        if (this.m_BookmarkToDisplay !== null) {
            MapRoom3.mapRoom3Window.NavigateToCell(this.m_BookmarkToDisplay.mapCell);
        }
    }
}
