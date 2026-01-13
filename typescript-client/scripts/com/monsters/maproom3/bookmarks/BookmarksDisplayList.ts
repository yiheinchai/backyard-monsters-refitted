import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";

import { ScrollSetV } from "../../display/ScrollSetV";
import { MapRoom3 } from "../MapRoom3";
import { Bookmark } from "./Bookmark";

/**
 * Bookmarks display list - scrollable list of bookmark items.
 */
export class BookmarksDisplayList extends Sprite {
    private m_BookmarksToDisplay: Array<Bookmark> | null;
    private m_BookmarkDisplays: Array<Sprite> | null = null;
    private m_BookmarkDisplayFactory: Function;
    private m_Container: Sprite;
    private m_ScrollMask: Sprite;
    private m_ScrollBar: ScrollSetV;
    private m_MaxDisplayListHeight: number;
    private m_LastSelectedBookmarkIndex: number = -1;

    constructor(bookmarks: Array<Bookmark>, displayFactory: Function, maxItems: number = -1) {
        super();
        this.m_BookmarksToDisplay = bookmarks;
        this.m_BookmarkDisplayFactory = displayFactory;
        this.m_Container = new Sprite();
        this.addChild(this.m_Container);
        this.CreateBookmarkDisplays();
        this.m_MaxDisplayListHeight = this.m_Container.height;
        if (maxItems !== -1 && maxItems < this.m_BookmarkDisplays!.length) {
            this.m_MaxDisplayListHeight = maxItems * this.m_BookmarkDisplays![0].height;
        }
        this.m_ScrollMask = new Sprite();
        this.m_ScrollMask.graphics.beginFill(16777215, 0.01);
        this.m_ScrollMask.graphics.drawRect(0, 0, this.m_Container.width, this.m_MaxDisplayListHeight);
        this.m_ScrollMask.graphics.endFill();
        this.m_ScrollMask.mouseEnabled = false;
        this.m_ScrollMask.mouseChildren = false;
        this.addChild(this.m_ScrollMask);
        this.m_ScrollBar = new ScrollSetV(this.m_Container, this.m_ScrollMask);
        this.m_ScrollBar.x = this.m_Container.width - this.m_ScrollBar.width;
        this.addChild(this.m_ScrollBar);
    }

    public get maxDisplayListHeight(): number {
        return this.m_MaxDisplayListHeight;
    }

    public Clear(): void {
        this.ClearBookmarkDisplays();
        this.removeChild(this.m_ScrollBar);
        this.removeChild(this.m_ScrollMask);
        this.removeChild(this.m_Container);
        this.m_ScrollBar = null!;
        this.m_ScrollMask = null!;
        this.m_Container = null!;
        this.m_BookmarksToDisplay = null;
        this.m_BookmarkDisplayFactory = null!;
    }

    public Refresh(): void {
        this.ClearBookmarkDisplays();
        this.CreateBookmarkDisplays();
        this.m_ScrollBar.checkResize();
    }

    private CreateBookmarkDisplays(): void {
        if (this.m_BookmarksToDisplay === null) {
            return;
        }
        let yPos: number = 0;
        const count: number = this.m_BookmarksToDisplay.length;
        this.m_BookmarkDisplays = new Array(count);
        for (let i = 0; i < count; i++) {
            const display: Sprite = this.m_BookmarkDisplayFactory(this.m_BookmarksToDisplay[i], i);
            this.m_BookmarkDisplays[i] = display;
            this.m_Container.addChild(display);
            display.x = 0;
            display.y = yPos;
            yPos += display.height;
        }
    }

    private ClearBookmarkDisplays(): void {
        if (this.m_BookmarkDisplays === null) {
            return;
        }
        const count: number = this.m_BookmarkDisplays.length;
        for (let i = 0; i < count; i++) {
            const display: Sprite = this.m_BookmarkDisplays[i];
            if ((display as any).Clear) {
                (display as any).Clear();
            }
            this.m_Container.removeChild(display);
        }
        this.m_BookmarkDisplays.length = 0;
        this.m_BookmarkDisplays = null;
    }

    public NavigateToNextBookmark(event: Event | null = null): void {
        const count: number = this.m_BookmarksToDisplay!.length;
        if (count === 0) {
            return;
        }
        ++this.m_LastSelectedBookmarkIndex;
        if (this.m_LastSelectedBookmarkIndex >= this.m_BookmarksToDisplay!.length) {
            this.m_LastSelectedBookmarkIndex = 0;
        }
        MapRoom3.mapRoom3Window.NavigateToCell(this.m_BookmarksToDisplay![this.m_LastSelectedBookmarkIndex].mapCell!);
    }
}
