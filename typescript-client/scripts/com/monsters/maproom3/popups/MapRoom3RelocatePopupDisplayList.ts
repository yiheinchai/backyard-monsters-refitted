import Sprite from "openfl/display/Sprite";

import { ScrollSetV } from "../../display/ScrollSetV";
import { MapRoom3FriendData } from "../data/MapRoom3FriendData";
import { MapRoom3RelocatePopupItemDisplay } from "./MapRoom3RelocatePopupItemDisplay";

/**
 * Map room 3 relocate popup display list - displays friend list for relocation.
 */
export class MapRoom3RelocatePopupDisplayList extends Sprite {
    private m_FriendsToDisplay: Array<MapRoom3FriendData> | null;
    private m_FriendItemDisplays: Array<MapRoom3RelocatePopupItemDisplay> | null = null;
    private m_Container: Sprite;
    private m_ScrollMask: Sprite;
    private m_ScrollBar: ScrollSetV;

    constructor(friends: Array<MapRoom3FriendData>, maxVisibleItems: number = -1) {
        super();
        this.m_FriendsToDisplay = friends;
        this.m_Container = new Sprite();
        this.addChild(this.m_Container);
        this.CreateFriendDisplays();
        let visibleHeight: number = this.m_Container.height;
        if (maxVisibleItems !== -1 && maxVisibleItems < this.m_FriendItemDisplays!.length) {
            visibleHeight = maxVisibleItems * this.m_FriendItemDisplays![0].height;
        }
        this.m_ScrollMask = new Sprite();
        this.m_ScrollMask.graphics.beginFill(16777215, 0.01);
        this.m_ScrollMask.graphics.drawRect(0, 0, this.m_Container.width, visibleHeight);
        this.m_ScrollMask.graphics.endFill();
        this.m_ScrollMask.mouseEnabled = false;
        this.m_ScrollMask.mouseChildren = false;
        this.addChild(this.m_ScrollMask);
        this.m_ScrollBar = new ScrollSetV(this.m_Container, this.m_ScrollMask);
        this.m_ScrollBar.x = this.m_Container.width - this.m_ScrollBar.width;
        this.addChild(this.m_ScrollBar);
    }

    public Clear(): void {
        this.ClearFriendDisplays();
        this.removeChild(this.m_ScrollBar);
        this.removeChild(this.m_ScrollMask);
        this.removeChild(this.m_Container);
        this.m_ScrollBar = null!;
        this.m_ScrollMask = null!;
        this.m_Container = null!;
        this.m_FriendsToDisplay = null;
    }

    public Refresh(): void {
        this.ClearFriendDisplays();
        this.CreateFriendDisplays();
        this.m_ScrollBar.checkResize();
    }

    private CreateFriendDisplays(): void {
        if (this.m_FriendsToDisplay === null) {
            return;
        }
        let yPos: number = 0;
        const count: number = this.m_FriendsToDisplay.length;
        this.m_FriendItemDisplays = new Array(count);
        for (let i = 0; i < count; i++) {
            const display: MapRoom3RelocatePopupItemDisplay = new MapRoom3RelocatePopupItemDisplay(this.m_FriendsToDisplay[i]);
            this.m_FriendItemDisplays[i] = display;
            this.m_Container.addChild(display);
            display.x = 0;
            display.y = yPos;
            yPos += display.height;
        }
    }

    private ClearFriendDisplays(): void {
        if (this.m_FriendItemDisplays === null) {
            return;
        }
        const count: number = this.m_FriendItemDisplays.length;
        for (let i = 0; i < count; i++) {
            const display: MapRoom3RelocatePopupItemDisplay = this.m_FriendItemDisplays[i];
            display.Clear();
            this.m_Container.removeChild(display);
        }
        this.m_FriendItemDisplays.length = 0;
        this.m_FriendItemDisplays = null;
    }
}
