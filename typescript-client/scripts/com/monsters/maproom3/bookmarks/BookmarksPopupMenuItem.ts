import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";

import { MapRoom3 } from "../MapRoom3";
import { Bookmark } from "./Bookmark";
import { BookmarksManager } from "./BookmarksManager";
import { MapRoom3BookmarksPopupItemDisplay } from "./MapRoom3BookmarksPopupItemDisplay";

import { KEYS } from "../../../../KEYS";

/**
 * Bookmarks popup menu item - displays a single bookmark in the popup.
 */
export class BookmarksPopupMenuItem extends MapRoom3BookmarksPopupItemDisplay {
    private m_BookmarkToDisplay: Bookmark | null;

    constructor(bookmark: Bookmark) {
        super();
        this.m_BookmarkToDisplay = bookmark;
        this.buttonMode = true;
        this.nameText.htmlText = bookmark.displayName;
        this.nameText.mouseEnabled = false;
        this.coordinatesText.htmlText = "(" + bookmark.cellX.toString() + "," + bookmark.cellY.toString() + ")";
        this.coordinatesText.mouseEnabled = false;
        this.background.gotoAndStop("default");
        this.addEventListener(MouseEvent.CLICK, this.OnMouseClicked.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.MOUSE_OVER, this.OnMouseOver.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.MOUSE_OUT, this.OnMouseOut.bind(this), false, 0, true);
        this.removeButton.SetupKey("mr3_bookmarks_popup_remove_button_label");
        this.removeButton.addEventListener(MouseEvent.CLICK, this.OnRemoveBookmarkClicked.bind(this), false, 0, true);
        this.removeButton.buttonMode = true;
        if (bookmark.mapCell!.isDataLoaded === false) {
            this.addEventListener(Event.ENTER_FRAME, this.WaitForDataToLoad.bind(this), false, 0, true);
            this.nameText.htmlText = KEYS.Get("msg_loading");
        }
    }

    private WaitForDataToLoad(event: Event): void {
        if (this.m_BookmarkToDisplay === null) {
            this.removeEventListener(Event.ENTER_FRAME, this.WaitForDataToLoad.bind(this));
            return;
        }
        if (this.m_BookmarkToDisplay.mapCell!.isDataLoaded === true) {
            this.removeEventListener(Event.ENTER_FRAME, this.WaitForDataToLoad.bind(this));
            this.nameText.htmlText = this.m_BookmarkToDisplay.displayName;
            return;
        }
    }

    public Clear(): void {
        if (this.hasEventListener(Event.ENTER_FRAME)) {
            this.removeEventListener(Event.ENTER_FRAME, this.WaitForDataToLoad.bind(this));
        }
        this.removeEventListener(MouseEvent.CLICK, this.OnMouseClicked.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.OnMouseOver.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.OnMouseOut.bind(this));
        this.removeButton.removeEventListener(MouseEvent.CLICK, this.OnRemoveBookmarkClicked.bind(this));
        this.m_BookmarkToDisplay = null;
    }

    private OnMouseClicked(event: MouseEvent): void {
        if (this.m_BookmarkToDisplay !== null) {
            MapRoom3.mapRoom3Window.NavigateToCell(this.m_BookmarkToDisplay.mapCell!);
        }
        if (MapRoom3.mapRoom3WindowHUD.bookmarksPopup.visible === true) {
            MapRoom3.mapRoom3WindowHUD.bookmarksPopup.Hide();
        }
    }

    private OnMouseOver(event: MouseEvent): void {
        this.background.gotoAndStop("mouseover");
    }

    private OnMouseOut(event: MouseEvent): void {
        this.background.gotoAndStop("default");
    }

    private OnRemoveBookmarkClicked(event: MouseEvent): void {
        if (this.m_BookmarkToDisplay !== null) {
            BookmarksManager.instance.RemoveBookmark(this.m_BookmarkToDisplay.mapCell!);
        }
        if (MapRoom3.mapRoom3WindowHUD.bookmarksPopup.visible === true) {
            MapRoom3.mapRoom3WindowHUD.bookmarksPopup.Refresh();
        }
    }
}
