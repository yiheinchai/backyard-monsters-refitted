import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import TextField from "openfl/text/TextField";
import TextFieldAutoSize from "openfl/text/TextFieldAutoSize";
import TextFormat from "openfl/text/TextFormat";
import TextFormatAlign from "openfl/text/TextFormatAlign";
import { ScaleBitmap } from "../../../org/bytearray/display/ScaleBitmap";

import { Chat } from "../chat/Chat";
import { EnumYardType } from "../../enums/EnumYardType";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { Bookmark } from "./bookmarks/Bookmark";
import { BookmarkDisplay } from "./bookmarks/BookmarkDisplay";
import { BookmarksDisplayList } from "./bookmarks/BookmarksDisplayList";
import { BookmarksExpandableFrame } from "./bookmarks/BookmarksExpandableFrame";
import { BookmarksManager } from "./bookmarks/BookmarksManager";
import { BookmarksPopup } from "./bookmarks/BookmarksPopup";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3AssetCache } from "./MapRoom3AssetCache";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3ResourcesDisplay } from "./MapRoom3ResourcesDisplay";
import { Maproom3JumpPopup } from "./popups/Maproom3JumpPopup";

import { BASE } from "../../../BASE";
import { bubblepopup5 } from "../../../bubblepopup5";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { POPUPS } from "../../../POPUPS";
import { StoneButton } from "../../../StoneButton";

/**
 * MapRoom3WindowHUD - HUD for Map Room 3.
 */
export class MapRoom3WindowHUD extends Sprite {
    private static readonly MENU_BUTTONS_BAR_MARGIN_WIDTH: number = 10;
    private static readonly MENU_BUTTONS_BAR_BUTTON_SPACING: number = 10;
    private static readonly OPTION_BUTTONS_BAR_PADDING_RIGHT: number = 10;
    private static readonly OPTION_BUTTONS_BAR_PADDING_TOP: number = 10;
    private static readonly OPTION_BUTTONS_BAR_BUTTON_SPACING: number = 5;
    private static readonly BOOKMARKS_BAR_SPACING: number = 10;
    private static readonly MAX_BOOKMARKS_DISPLAY_LIST_LENGTH: number = 3;
    private static readonly REOURCE_BAR_WIDTH: number = 90;
    private static readonly ZOOM_TIME: number = 1;

    private m_ResourcesDisplay: MapRoom3ResourcesDisplay | null = null;
    private m_OptionButtonsBar: Sprite | null = null;
    private m_ZoomOutButton: Sprite | null = null;
    private m_ZoomInButton: Sprite | null = null;
    private m_FullscreenButton: Sprite | null = null;
    private m_OptionButtonToolTip: bubblepopup5 | null = null;
    private m_LeftMenuButtonsBar: Sprite | null = null;
    private m_LeftMenuButtonsContainerBackground: ScaleBitmap | null = null;
    private m_BookmarksButton: StoneButton | null = null;
    private m_JumpButton: StoneButton | null = null;
    private m_CoordinatesPanel: Sprite | null = null;
    private m_CoordinatesBackground: Bitmap | null = null;
    private m_CoordinatesLabel: TextField | null = null;
    private m_RightMenuButtonsBar: Sprite | null = null;
    private m_RightMenuButtonsContainerBackground: ScaleBitmap | null = null;
    private m_FindBaseButton: StoneButton | null = null;
    private m_EnterBaseButton: StoneButton | null = null;
    private m_BookmarksBar: Sprite | null = null;
    private m_ResourceBookmarksBar: BookmarksExpandableFrame | null = null;
    private m_ResourceBookmarksDisplayList: BookmarksDisplayList | null = null;
    private m_StrongholdBookmarksBar: BookmarksExpandableFrame | null = null;
    private m_StrongholdBookmarksDisplayList: BookmarksDisplayList | null = null;
    private m_BookmarksPopup: BookmarksPopup;

    constructor() {
        super();
        this.m_BookmarksPopup = new BookmarksPopup();
        this.m_ResourcesDisplay = new MapRoom3ResourcesDisplay();
        this.m_ResourcesDisplay.mouseEnabled = false;
        this.m_ResourcesDisplay.mouseChildren = false;
        this.m_ResourcesDisplay.gotoAndStop(BASE.isInfernoMainYardOrOutpost ? 2 : 1);
        this.addChild(this.m_ResourcesDisplay);
        this.m_OptionButtonsBar = new Sprite();
        this.m_OptionButtonsBar.buttonMode = true;
        this.addChild(this.m_OptionButtonsBar);
        this.m_ZoomOutButton = new Sprite();
        this.m_ZoomOutButton.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BUTTON_ZOOM_OUT)));
        this.m_ZoomOutButton.addEventListener(MouseEvent.CLICK, this.OnZoomOutButtonClicked.bind(this), false, 0, true);
        this.m_ZoomOutButton.addEventListener(MouseEvent.MOUSE_OVER, this.OnZoomOutButtonMouseOver.bind(this), false, 0, true);
        this.m_ZoomOutButton.addEventListener(MouseEvent.MOUSE_OUT, this.OnZoomOutButtonMouseOut.bind(this), false, 0, true);
        this.m_OptionButtonsBar.addChild(this.m_ZoomOutButton);
        this.m_ZoomInButton = new Sprite();
        this.m_ZoomInButton.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BUTTON_ZOOM_IN)));
        this.m_ZoomInButton.addEventListener(MouseEvent.CLICK, this.OnZoomInButtonClicked.bind(this), false, 0, true);
        this.m_ZoomInButton.addEventListener(MouseEvent.MOUSE_OVER, this.OnZoomInButtonMouseOver.bind(this), false, 0, true);
        this.m_ZoomInButton.addEventListener(MouseEvent.MOUSE_OUT, this.OnZoomInButtonMouseOut.bind(this), false, 0, true);
        this.m_ZoomInButton.visible = false;
        this.m_OptionButtonsBar.addChild(this.m_ZoomInButton);
        this.m_FullscreenButton = new Sprite();
        this.m_FullscreenButton.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BUTTON_FULL_SCREEN)));
        this.m_FullscreenButton.x = this.m_ZoomInButton.width + MapRoom3WindowHUD.OPTION_BUTTONS_BAR_BUTTON_SPACING;
        this.m_FullscreenButton.addEventListener(MouseEvent.CLICK, this.OnFullscreenButtonClicked.bind(this), false, 0, true);
        this.m_FullscreenButton.addEventListener(MouseEvent.MOUSE_OVER, this.OnFullscreenButtonMouseOver.bind(this), false, 0, true);
        this.m_FullscreenButton.addEventListener(MouseEvent.MOUSE_OUT, this.OnFullscreenButtonMouseOut.bind(this), false, 0, true);
        this.m_OptionButtonsBar.addChild(this.m_FullscreenButton);
        this.m_OptionButtonToolTip = new bubblepopup5();
        this.m_OptionButtonToolTip.visible = false;
        this.m_OptionButtonToolTip.mouseEnabled = false;
        this.m_OptionButtonToolTip.mouseChildren = false;
        this.m_OptionButtonToolTip.mcText.autoSize = TextFieldAutoSize.LEFT;
        this.addChild(this.m_OptionButtonToolTip);
        const bgBmd = MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BUTTONS_BAR_BACKGROUND);
        this.m_LeftMenuButtonsBar = new Sprite();
        this.addChild(this.m_LeftMenuButtonsBar);
        this.m_LeftMenuButtonsContainerBackground = new ScaleBitmap(bgBmd);
        this.m_LeftMenuButtonsBar.addChild(this.m_LeftMenuButtonsContainerBackground);
        this.m_BookmarksButton = new StoneButton();
        this.m_BookmarksButton.SetupKey("mr3_bookmarks_button", 12);
        this.m_BookmarksButton.addEventListener(MouseEvent.CLICK, this.OnBookmarksButtonClicked.bind(this));
        this.m_LeftMenuButtonsBar.addChild(this.m_BookmarksButton);
        this.m_JumpButton = new StoneButton();
        this.m_JumpButton.SetupKey("btn_jump", 12);
        this.m_JumpButton.addEventListener(MouseEvent.CLICK, this.OnJumpButtonClicked.bind(this));
        this.m_LeftMenuButtonsBar.addChild(this.m_JumpButton);
        this.m_CoordinatesPanel = new Sprite();
        this.m_LeftMenuButtonsBar.addChild(this.m_CoordinatesPanel);
        this.m_CoordinatesBackground = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_COORDINATES_BACKGROUND));
        this.m_CoordinatesPanel.addChild(this.m_CoordinatesBackground);
        const textFormat = new TextFormat();
        textFormat.color = 0xFFFFFF;
        textFormat.font = "Verdana";
        textFormat.size = 12;
        textFormat.align = TextFormatAlign.CENTER;
        this.m_CoordinatesLabel = new TextField();
        this.m_CoordinatesLabel.defaultTextFormat = textFormat;
        this.m_CoordinatesLabel.selectable = false;
        this.m_CoordinatesLabel.y = 10;
        this.m_CoordinatesLabel.width = this.m_CoordinatesBackground.width;
        this.m_CoordinatesLabel.height = this.m_CoordinatesBackground.height;
        this.m_CoordinatesPanel.addChild(this.m_CoordinatesLabel);
        this.m_RightMenuButtonsBar = new Sprite();
        this.addChild(this.m_RightMenuButtonsBar);
        this.m_RightMenuButtonsContainerBackground = new ScaleBitmap(bgBmd);
        this.m_RightMenuButtonsBar.addChild(this.m_RightMenuButtonsContainerBackground);
        this.m_FindBaseButton = new StoneButton();
        this.m_FindBaseButton.SetupKey("mr3_find_base", 12);
        this.m_FindBaseButton.addEventListener(MouseEvent.CLICK, this.OnFindBaseButtonClicked.bind(this));
        this.m_RightMenuButtonsBar.addChild(this.m_FindBaseButton);
        this.m_EnterBaseButton = new StoneButton();
        this.m_EnterBaseButton.SetupKey("mr3_exit_to_base", 12);
        this.m_EnterBaseButton.addEventListener(MouseEvent.CLICK, this.OnEnterBaseButtonClicked.bind(this));
        this.m_RightMenuButtonsBar.addChild(this.m_EnterBaseButton);
        const barHalfHeight = this.m_LeftMenuButtonsContainerBackground.height * 0.5;
        const btnHalfHeight = this.m_BookmarksButton.getButtonHeight() * 0.5;
        const btnY = barHalfHeight - btnHalfHeight;
        let xPos = MapRoom3WindowHUD.MENU_BUTTONS_BAR_MARGIN_WIDTH;
        this.m_BookmarksButton.x = xPos;
        this.m_BookmarksButton.y = btnY;
        xPos += this.m_BookmarksButton.getButtonWidth() + MapRoom3WindowHUD.MENU_BUTTONS_BAR_BUTTON_SPACING;
        this.m_JumpButton.x = xPos;
        this.m_JumpButton.y = btnY;
        xPos += this.m_JumpButton.getButtonWidth() + MapRoom3WindowHUD.MENU_BUTTONS_BAR_BUTTON_SPACING;
        this.m_CoordinatesPanel.x = xPos;
        this.m_CoordinatesPanel.y = btnY;
        xPos += this.m_CoordinatesPanel.width + MapRoom3WindowHUD.MENU_BUTTONS_BAR_MARGIN_WIDTH;
        this.m_LeftMenuButtonsContainerBackground.width = xPos;
        xPos = MapRoom3WindowHUD.MENU_BUTTONS_BAR_MARGIN_WIDTH;
        this.m_FindBaseButton.x = xPos;
        this.m_FindBaseButton.y = btnY;
        xPos += this.m_FindBaseButton.getButtonWidth() + MapRoom3WindowHUD.MENU_BUTTONS_BAR_BUTTON_SPACING;
        this.m_EnterBaseButton.x = xPos;
        this.m_EnterBaseButton.y = btnY;
        xPos += this.m_EnterBaseButton.getButtonWidth() + MapRoom3WindowHUD.MENU_BUTTONS_BAR_MARGIN_WIDTH;
        this.m_RightMenuButtonsContainerBackground.width = xPos;
        this.m_BookmarksBar = new Sprite();
        this.addChild(this.m_BookmarksBar);
        const resourceBookmarks = BookmarksManager.instance.GetBookmarksOfType(BookmarksManager.TYPE_PLAYER_RESOURCES);
        const resourceHeader = KEYS.Get("mr3_resource_bookmarks_header", { "v1": resourceBookmarks.length });
        this.m_ResourceBookmarksDisplayList = new BookmarksDisplayList(resourceBookmarks, this.CreateNewResourceBookmarkDisplay.bind(this), MapRoom3WindowHUD.MAX_BOOKMARKS_DISPLAY_LIST_LENGTH);
        this.m_ResourceBookmarksBar = new BookmarksExpandableFrame(this.m_ResourceBookmarksDisplayList, resourceHeader, this.m_ResourceBookmarksDisplayList.maxDisplayListHeight);
        this.m_ResourceBookmarksBar.frameHeader.addEventListener(MouseEvent.CLICK, this.m_ResourceBookmarksDisplayList.NavigateToNextBookmark.bind(this.m_ResourceBookmarksDisplayList), false, 0, true);
        this.m_BookmarksBar.addChild(this.m_ResourceBookmarksBar);
        const strongholdBookmarks = BookmarksManager.instance.GetBookmarksOfType(BookmarksManager.TYPE_PLAYER_STRONGHOLDS);
        const strongholdHeader = KEYS.Get("mr3_stronghold_bookmarks_header", { "v1": strongholdBookmarks.length });
        this.m_StrongholdBookmarksDisplayList = new BookmarksDisplayList(strongholdBookmarks, this.CreateNewStrongholdBookmarkDisplay.bind(this), MapRoom3WindowHUD.MAX_BOOKMARKS_DISPLAY_LIST_LENGTH);
        this.m_StrongholdBookmarksBar = new BookmarksExpandableFrame(this.m_StrongholdBookmarksDisplayList, strongholdHeader, this.m_StrongholdBookmarksDisplayList.maxDisplayListHeight);
        this.m_StrongholdBookmarksBar.frameHeader.addEventListener(MouseEvent.CLICK, this.m_StrongholdBookmarksDisplayList.NavigateToNextBookmark.bind(this.m_StrongholdBookmarksDisplayList), false, 0, true);
        this.m_StrongholdBookmarksBar.x = this.m_ResourceBookmarksBar.width + MapRoom3WindowHUD.BOOKMARKS_BAR_SPACING;
        this.m_BookmarksBar.addChild(this.m_StrongholdBookmarksBar);
        this.UpdateResourcesDisplay();
        this.PositionHUDElements();
    }

    public get bookmarksPopup(): BookmarksPopup {
        return this.m_BookmarksPopup;
    }

    private CreateNewResourceBookmarkDisplay(bookmark: Bookmark, index: number): BookmarkDisplay {
        const bgType = index % 2 ? "bgDark" : "bgLight";
        return new BookmarkDisplay(bookmark, bgType, MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BOOKMARK_THUMBNAIL_RESOURCE));
    }

    private CreateNewStrongholdBookmarkDisplay(bookmark: Bookmark, index: number): BookmarkDisplay {
        const bgType = index % 2 ? "bgDark" : "bgLight";
        return new BookmarkDisplay(bookmark, bgType, MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.HUD_BOOKMARK_THUMBNAIL_STRONGHOLD));
    }

    public Clear(): void {
        this.m_BookmarksPopup.Hide();
        this.m_BookmarksPopup = null!;
        this.m_BookmarksBar!.removeChild(this.m_StrongholdBookmarksBar!);
        this.m_BookmarksBar!.removeChild(this.m_ResourceBookmarksBar!);
        this.removeChild(this.m_BookmarksBar!);
        this.m_StrongholdBookmarksBar!.frameHeader.removeEventListener(MouseEvent.CLICK, this.m_StrongholdBookmarksDisplayList!.NavigateToNextBookmark.bind(this.m_StrongholdBookmarksDisplayList));
        this.m_ResourceBookmarksBar!.frameHeader.removeEventListener(MouseEvent.CLICK, this.m_ResourceBookmarksDisplayList!.NavigateToNextBookmark.bind(this.m_ResourceBookmarksDisplayList));
        this.m_StrongholdBookmarksBar!.Clear();
        this.m_ResourceBookmarksBar!.Clear();
        this.m_StrongholdBookmarksBar = null;
        this.m_ResourceBookmarksBar = null;
        this.m_BookmarksBar = null;
        this.m_RightMenuButtonsBar!.removeChild(this.m_RightMenuButtonsContainerBackground!);
        this.m_RightMenuButtonsBar!.removeChild(this.m_EnterBaseButton!);
        this.m_RightMenuButtonsBar!.removeChild(this.m_FindBaseButton!);
        this.removeChild(this.m_RightMenuButtonsBar!);
        this.m_EnterBaseButton = null;
        this.m_FindBaseButton = null;
        this.m_RightMenuButtonsContainerBackground = null;
        this.m_RightMenuButtonsBar = null;
        this.m_CoordinatesPanel!.removeChild(this.m_CoordinatesLabel!);
        this.m_CoordinatesPanel!.removeChild(this.m_CoordinatesBackground!);
        this.m_LeftMenuButtonsBar!.removeChild(this.m_CoordinatesPanel!);
        this.m_LeftMenuButtonsBar!.removeChild(this.m_BookmarksButton!);
        this.removeChild(this.m_LeftMenuButtonsBar!);
        this.m_CoordinatesLabel = null;
        this.m_CoordinatesBackground = null;
        this.m_CoordinatesPanel = null;
        this.m_BookmarksButton = null;
        this.m_JumpButton = null;
        this.m_LeftMenuButtonsContainerBackground = null;
        this.m_LeftMenuButtonsBar = null;
        this.m_ZoomOutButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomOutButtonClicked.bind(this));
        this.m_ZoomOutButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomOutButtonMouseOver.bind(this));
        this.m_ZoomOutButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomOutButtonMouseOut.bind(this));
        this.m_ZoomInButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomInButtonClicked.bind(this));
        this.m_ZoomInButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomInButtonMouseOver.bind(this));
        this.m_ZoomInButton!.removeEventListener(MouseEvent.CLICK, this.OnZoomInButtonMouseOut.bind(this));
        this.m_FullscreenButton!.removeEventListener(MouseEvent.CLICK, this.OnFullscreenButtonClicked.bind(this));
        this.m_FullscreenButton!.removeEventListener(MouseEvent.CLICK, this.OnFullscreenButtonMouseOver.bind(this));
        this.m_FullscreenButton!.removeEventListener(MouseEvent.CLICK, this.OnFullscreenButtonMouseOut.bind(this));
        this.RemoveAllChildren(this.m_ZoomOutButton!);
        this.RemoveAllChildren(this.m_ZoomInButton!);
        this.RemoveAllChildren(this.m_FullscreenButton!);
        this.m_OptionButtonsBar!.removeChild(this.m_ZoomOutButton!);
        this.m_OptionButtonsBar!.removeChild(this.m_ZoomInButton!);
        this.m_OptionButtonsBar!.removeChild(this.m_FullscreenButton!);
        this.removeChild(this.m_OptionButtonToolTip!);
        this.removeChild(this.m_OptionButtonsBar!);
        this.m_ZoomOutButton = null;
        this.m_ZoomInButton = null;
        this.m_FullscreenButton = null;
        this.m_OptionButtonToolTip = null;
        this.m_OptionButtonsBar = null;
    }

    private RemoveAllChildren(sprite: Sprite): void {
        while (sprite.numChildren > 0) {
            const child = sprite.removeChildAt(0) as Bitmap;
            if (child !== null) {
                child.bitmapData = null!;
            }
        }
    }

    private UpdateResourcesDisplay(): void {
        for (let i = 1; i <= 4; i++) {
            const current = GLOBAL._resources["r" + i].Get();
            const max = GLOBAL._resources["r" + i + "max"];
            const ratio = Math.max(0, Math.min(1, current / max));
            this.m_ResourcesDisplay!["resourceDisplay" + i].tR.htmlText = "<b>" + GLOBAL.FormatNumber(current) + "</b>";
            this.m_ResourcesDisplay!["resourceDisplay" + i].mcBar.width = MapRoom3WindowHUD.REOURCE_BAR_WIDTH * ratio;
        }
    }

    private PositionHUDElements(): void {
        this.PositionResourcesDisplay();
        this.PositionBookmarksBar();
        this.PositionOptionsButtonBar();
        this.PositionLeftMenuButtonsBar();
        this.PositionRightMenuButtonsBar();
    }

    private PositionResourcesDisplay(): void {
        this.m_ResourcesDisplay!.x = GLOBAL._SCREEN.x;
        this.m_ResourcesDisplay!.y = GLOBAL._SCREEN.y;
    }

    private PositionBookmarksBar(): void {
        this.m_BookmarksBar!.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width * 0.5 - this.m_BookmarksBar!.width * 0.5;
        this.m_BookmarksBar!.y = GLOBAL._SCREEN.y;
        if (this.m_BookmarksBar!.x < this.m_ResourcesDisplay!.x + this.m_ResourcesDisplay!.width) {
            this.m_BookmarksBar!.x = this.m_ResourcesDisplay!.x + this.m_ResourcesDisplay!.width;
        }
    }

    private PositionOptionsButtonBar(): void {
        this.m_OptionButtonsBar!.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - this.m_OptionButtonsBar!.width - MapRoom3WindowHUD.OPTION_BUTTONS_BAR_PADDING_RIGHT;
        this.m_OptionButtonsBar!.y = GLOBAL._SCREEN.y + MapRoom3WindowHUD.OPTION_BUTTONS_BAR_PADDING_TOP;
    }

    public PositionLeftMenuButtonsBar(): void {
        if (this.m_LeftMenuButtonsContainerBackground === null) {
            return;
        }
        this.m_LeftMenuButtonsBar!.x = GLOBAL._SCREEN.x;
        if (Chat._bymChat !== null && Chat._bymChat.chatBox !== null && Chat._bymChat.chatBox.background !== null) {
            this.m_LeftMenuButtonsBar!.y = Chat._bymChat.y + Chat._bymChat.chatBox.y + Chat._bymChat.chatBox.background.y - this.m_LeftMenuButtonsContainerBackground.height;
        } else {
            this.m_LeftMenuButtonsBar!.y = GLOBAL._SCREEN.y + GLOBAL._SCREEN.height - this.m_LeftMenuButtonsContainerBackground.height;
        }
    }

    public PositionRightMenuButtonsBar(): void {
        if (this.m_RightMenuButtonsContainerBackground === null) {
            return;
        }
        this.m_RightMenuButtonsBar!.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - this.m_RightMenuButtonsContainerBackground.width;
        if (UI_BOTTOM._missions !== null && UI_BOTTOM._missions.frame !== null) {
            this.m_RightMenuButtonsBar!.y = UI_BOTTOM._missions.y + UI_BOTTOM._missions.frame.y - this.m_RightMenuButtonsContainerBackground.height + 1;
        }
    }

    private OnBookmarksButtonClicked(event: MouseEvent): void {
        this.m_BookmarksPopup.Show(BookmarksManager.instance.GetBookmarksOfType(BookmarksManager.TYPE_CUSTOM));
    }

    protected OnJumpButtonClicked(event: MouseEvent): void {
        const popup = new Maproom3JumpPopup();
        popup.addEventListener(Maproom3JumpPopup.k_clickedJump, this.clickedJump.bind(this));
        POPUPS.Push(popup);
    }

    protected clickedJump(event: Event): void {
        const popup = event.target as Maproom3JumpPopup;
        popup.removeEventListener(Maproom3JumpPopup.k_clickedJump, this.clickedJump.bind(this));
        popup.Hide();
        const cell = popup.targetCell as MapRoom3Cell;
        MapRoom3.mapRoom3Window.NavigateToCell(cell);
        this.DisplayCoordinatesOfCell(cell);
    }

    private OnFindBaseButtonClicked(event: MouseEvent): void {
        if (GLOBAL._mapHome !== null) {
            MapRoom3.mapRoom3Window.NavigateToIndex(GLOBAL._mapHome);
        }
    }

    private OnEnterBaseButtonClicked(event: MouseEvent): void {
        BASE.LoadBase(null, 0, GLOBAL._homeBaseID, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.PLAYER);
    }

    private OnZoomOutButtonClicked(event: MouseEvent): void {
        this.m_ZoomOutButton!.visible = false;
        this.m_ZoomInButton!.visible = true;
        MapRoom3.mapRoom3Window.Zoom(0.5, MapRoom3WindowHUD.ZOOM_TIME);
    }

    private OnZoomInButtonClicked(event: MouseEvent): void {
        this.m_ZoomInButton!.visible = false;
        this.m_ZoomOutButton!.visible = true;
        MapRoom3.mapRoom3Window.Zoom(1, MapRoom3WindowHUD.ZOOM_TIME);
    }

    private OnFullscreenButtonClicked(event: MouseEvent): void {
        GLOBAL.goFullScreen();
    }

    private OnZoomOutButtonMouseOver(event: MouseEvent): void {
        this.ShowOptionButtonToolTip("settings_zoomout", (event.target as Sprite).x, (event.target as Sprite).y);
    }

    private OnZoomOutButtonMouseOut(event: MouseEvent): void {
        this.HideOptionButtonToolTip();
    }

    private OnZoomInButtonMouseOver(event: MouseEvent): void {
        this.ShowOptionButtonToolTip("settings_zoomin", (event.target as Sprite).x, (event.target as Sprite).y);
    }

    private OnZoomInButtonMouseOut(event: MouseEvent): void {
        this.HideOptionButtonToolTip();
    }

    private OnFullscreenButtonMouseOver(event: MouseEvent): void {
        const key = GLOBAL._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN || GLOBAL._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN_INTERACTIVE ? "settings_fullscreenexit" : "settings_fullscreenenter";
        this.ShowOptionButtonToolTip(key, (event.target as Sprite).x, (event.target as Sprite).y);
    }

    private OnFullscreenButtonMouseOut(event: MouseEvent): void {
        this.HideOptionButtonToolTip();
    }

    private ShowOptionButtonToolTip(key: string, xPos: number, yPos: number): void {
        this.m_OptionButtonToolTip!.visible = true;
        this.m_OptionButtonToolTip!.mcText.htmlText = "<b>" + KEYS.Get(key) + "</b>";
        this.m_OptionButtonToolTip!.x = this.m_OptionButtonsBar!.x + xPos + 12;
        this.m_OptionButtonToolTip!.y = this.m_OptionButtonsBar!.y + yPos + 20;
        this.m_OptionButtonToolTip!.mcText.x = 10 - this.m_OptionButtonToolTip!.mcText.width;
        this.m_OptionButtonToolTip!.mcBG.x = this.m_OptionButtonToolTip!.mcText.x - 5;
        this.m_OptionButtonToolTip!.mcBG.width = this.m_OptionButtonToolTip!.mcText.width + 10;
    }

    private HideOptionButtonToolTip(): void {
        this.m_OptionButtonToolTip!.visible = false;
    }

    public Resize(): void {
        this.PositionHUDElements();
    }

    public DisplayCoordinatesOfCell(cell: MapRoom3Cell): void {
        if (cell !== null && cell.isBorder === false) {
            this.m_CoordinatesLabel!.text = cell.cellX.toString() + "," + cell.cellY.toString();
        } else {
            this.m_CoordinatesLabel!.text = "";
        }
    }

    public get leftMenuButtonsBar(): Sprite {
        return this.m_LeftMenuButtonsBar!;
    }
}
