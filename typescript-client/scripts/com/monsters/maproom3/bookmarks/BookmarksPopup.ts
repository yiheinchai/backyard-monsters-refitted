import { MapRoom3BookmarksPopup } from "../../../../MapRoom3BookmarksPopup";
import { BookmarksDisplayList } from "./BookmarksDisplayList";
import { BookmarksPopupMenuItem } from "./BookmarksPopupMenuItem";
import { Bookmark } from "./Bookmark";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * Bookmarks popup - displays bookmarked map locations in map room 3.
 */
export class BookmarksPopup extends MapRoom3BookmarksPopup {
    private static readonly MAX_BOOKMARKS_DISPLAY_LIST_LENGTH: number = 10;

    private m_BookmarkDisplayList: BookmarksDisplayList | null = null;

    constructor() {
        super();
        this.titleText.text = getKEYS().Get("mr3_bookmarks_popup_title");
        this.contentsFrame.mouseEnabled = false;
        this.contentsMask.mouseEnabled = false;
    }

    public Show(bookmarks: Array<Bookmark>): void {
        this.Hide();
        this.m_BookmarkDisplayList = new BookmarksDisplayList(
            bookmarks,
            this.CreateNewBookmarksPopupMenuItem.bind(this),
            BookmarksPopup.MAX_BOOKMARKS_DISPLAY_LIST_LENGTH
        );
        this.contentsContainer.addChild(this.m_BookmarkDisplayList);
        getPOPUPS().Push(this);
    }

    private CreateNewBookmarksPopupMenuItem(bookmark: Bookmark, index: number): BookmarksPopupMenuItem {
        return new BookmarksPopupMenuItem(bookmark);
    }

    public Hide(): void {
        getPOPUPS().Next();
        if (this.m_BookmarkDisplayList !== null) {
            this.contentsContainer.removeChild(this.m_BookmarkDisplayList);
            this.m_BookmarkDisplayList = null;
        }
    }

    Refresh(): void {
        if (this.m_BookmarkDisplayList !== null) {
            this.m_BookmarkDisplayList.Refresh();
        }
    }
}
