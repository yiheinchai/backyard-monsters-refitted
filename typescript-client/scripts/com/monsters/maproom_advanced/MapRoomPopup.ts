import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Loader from "openfl/display/Loader";
import MovieClip from "openfl/display/MovieClip";
import StageDisplayState from "openfl/display/StageDisplayState";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import URLRequest from "openfl/net/URLRequest";
import getTimer from "openfl/utils/getTimer";

import { AllyInfo } from "../alliances/AllyInfo";
import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { bubblepopup3 } from "../../../bubblepopup3";
import { bubblepopupBuff } from "../../../bubblepopupBuff";
import { CellData } from "./CellData";
import { MapRoom } from "./MapRoom";
import { MapRoomBookmark } from "../../../MapRoomBookmark";
import { MapRoomCell } from "./MapRoomCell";
import { MapRoomPopupJump } from "../../../MapRoomPopupJump";
import { MapRoomPopup_CLIP } from "../../../MapRoomPopup_CLIP";
import { PopupAttackA } from "./PopupAttackA";
import { PopupInfoEnemy } from "./PopupInfoEnemy";
import { PopupInfoMine } from "./PopupInfoMine";
import { PopupInfoViewOnly } from "./PopupInfoViewOnly";
import { PopupMonstersA } from "./PopupMonstersA";
import { PopupMonstersB } from "./PopupMonstersB";
import { PopupNewBookmark } from "../../../PopupNewBookmark";
import { PopupRelocateMe } from "./PopupRelocateMe";
import { ui_buffIcon_CLIP } from "../../../ui_buffIcon_CLIP";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { POWERUPS } from "../../../POWERUPS";
import { SOUNDS } from "../../../SOUNDS";
import { Tutorial } from "./Tutorial";

/**
 * MapRoomPopup - Main map room popup UI controller.
 */
export class MapRoomPopup extends MapRoomPopup_CLIP {
    private mapOffset: Point | null = null;
    private _cellContainer: MovieClip | null = null;
    private _cells: Array<MapRoomCell> = [];
    private _mouseClickPoint: Point | null = null;
    private _containerClickPoint: Point | null = null;
    private _containerStartPoint: Point | null = null;
    private _sortArray: Array<any> = [];
    private _cellCountX: number = 0;
    private _cellCountY: number = 0;
    private _bubble: bubblepopup3 | null = null;
    private _cellWidth: number = 150;
    private _cellHeight: number = 75;
    private _popupBookmarkAdd: PopupNewBookmark | null = null;
    private _popupRelocateMe: PopupRelocateMe | null = null;
    public _popupInfoMine: PopupInfoMine | null = null;
    private _popupInfoEnemy: PopupInfoEnemy | null = null;
    private _popupMonsters: PopupMonstersA | null = null;
    private _popupInfoViewOnly: PopupInfoViewOnly | null = null;
    private _popupBuff: bubblepopupBuff | null = null;
    private _popupBookmarkMenu: Array<any> = [];
    private _menuShown: boolean = false;
    private _fullScreen: boolean = false;
    private _fallbackHomeCell: MapRoomCell | null = null;
    private _popupAttackA: PopupAttackA | null = null;
    public _dragged: boolean = false;
    private _popupMonstersB: PopupMonstersB | null = null;

    public static s_Instance: MapRoomPopup | null = null;
    public static get instance(): MapRoomPopup { return MapRoomPopup.s_Instance = MapRoomPopup.s_Instance || new MapRoomPopup(); }

    constructor() {
        super();
        this._sortArray = [];
        let w = GLOBAL._ROOT.stage.stageWidth;
        let h = GLOBAL.GetGameHeight();
        if (w > 1024) w = 1024;
        if (h > 768) h = 768;
        const r = new Rectangle(0 - (w - 760) / 2, 0 - (h - 720) / 2, w, h);
        if (GLOBAL.isFullScreen) {
            this._fullScreen = true;
            this.mcFrame.x = r.x + 175;
            this.mcFrame.y = r.y + 20;
            this.mcFrame.width = w - 195;
            this.mcFrame.height = h - 40;
            this.mcMask.x = r.x + 175;
            this.mcMask.y = r.y + 20;
            this.mcMask.mcMask.width = w - 195;
            this.mcMask.mcMask.height = h - 40;
            this.mcFrame2.x = r.x;
            this.mcFrame2.y = r.y + 20;
            this.mcBuffHolder.x = this.mcMask.width + this.mcMask.x - 70;
            this.mcBuffHolder.y = this.mcMask.y + 28;
        } else {
            this._fullScreen = false;
            this.mcFrame.x = 190;
            this.mcFrame.y = 20;
            this.mcFrame.width = 760 - 20 - 190;
            this.mcFrame.height = 520 - 40;
            this.mcMask.x = this.mcFrame.x;
            this.mcMask.y = this.mcFrame.y;
            this.mcMask.mcMask.width = this.mcFrame.width;
            this.mcMask.mcMask.height = this.mcFrame.height;
            this.mcFrame2.x = 20;
            this.mcFrame2.y = 20;
            this.mcBuffHolder.x = this.mcMask.width + this.mcMask.x - 70;
            this.mcBuffHolder.y = this.mcMask.y + 30;
        }
        this.mcInfo.x = this.mcFrame2.x + 20;
        this.mcInfo.y = this.mcFrame2.y + 270;
        this.mcInfo.visible = false;
        this.mcFrame.Setup(true, true, true, 0, 0);
        this.mcFrame2.Setup(false);
        this.mcMask.mcMask.mouseEnabled = false;
        this._bubble = new bubblepopup3();
        this._popupInfoMine = new PopupInfoMine();
        this._popupInfoEnemy = new PopupInfoEnemy();
        this._popupMonsters = new PopupMonstersA();
        this._popupMonstersB = new PopupMonstersB();
        this._popupAttackA = new PopupAttackA();
        this._popupAttackA.x = 380;
        this._popupAttackA.y = 260;
        this._popupBookmarkAdd = new PopupNewBookmark();
        this._popupBookmarkAdd.x = 380;
        this._popupBookmarkAdd.y = 260;
        this._popupRelocateMe = new PopupRelocateMe();
        this._popupBookmarkMenu = [];
        this._popupBookmarkAdd.mcFrame.Setup(true, this.HideBookmarkAddPopup.bind(this));
        this._popupInfoViewOnly = new PopupInfoViewOnly();
        if (!MapRoom._viewOnly) {
            this.bHome.SetupKey("btn_home");
            this.bHome.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => { this.HideBookmarkMenu(); MapRoom.JumpTo(GLOBAL._mapHome); });
            this.bHome.buttonMode = true;
            this.bHome.x = this.mcFrame2.x + 20;
            this.bHome.y = this.mcFrame2.y + 200;
            this.bJump.SetupKey("btn_jump");
            this.bJump.addEventListener(MouseEvent.CLICK, this.JumpPopupShow.bind(this));
            this.bJump.buttonMode = true;
            this.bJump.x = this.mcFrame2.x + 80;
            this.bJump.y = this.mcFrame2.y + 200;
            this.bBookmarks.SetupKey("btn_bookmarks");
            this.bBookmarks.addEventListener(MouseEvent.CLICK, this.ShowBookmarkMenu.bind(this));
            this.bBookmarks.buttonMode = true;
            this.bBookmarks.x = this.mcFrame2.x + 20;
            this.bBookmarks.y = this.mcFrame2.y + 235;
            this.UpdateResourceDisplay();
        } else {
            this.bBookmarks.SetupKey("btn_home");
            this.bBookmarks.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => { MapRoom.JumpTo(MapRoom._inviteLocation); });
            this.bBookmarks.buttonMode = true;
            this.bBookmarks.Enabled = true;
            this.bBookmarks.x = this.mcFrame2.x + 20;
            this.bBookmarks.y = this.mcFrame2.y + 235;
            this.bHome.visible = false;
            this.bJump.visible = false;
            this.HideResourceDisplay();
        }
        this.mcInfo.labelOwner.htmlText = "<b>" + KEYS.Get("label_owner") + "</b>";
        if (Boolean(GLOBAL._flags.viximo) || Boolean(GLOBAL._flags.kongregate)) { this.mcInfo.labelAlliance.htmlText = "<b>" + KEYS.Get("label_type") + "</b>"; }
        else { this.mcInfo.labelAlliance.htmlText = "<b>" + KEYS.Get("label_alliance") + "</b>"; }
        this.mcInfo.labelStatus.htmlText = "<b>" + KEYS.Get("label_status") + "</b>";
        this.mcInfo.labelLocation.htmlText = "<b>" + KEYS.Get("label_location") + "</b>";
        this.GenerateCells(MapRoom._homePoint);
        this._sortArray.sort((a, b) => a.depth - b.depth);
        for (let i = 0; i < this._sortArray.length; i++) { if (this._cellContainer!.getChildIndex(this._sortArray[i]) !== i) this._cellContainer!.setChildIndex(this._sortArray[i], i); }
        this._cellContainer!.addEventListener(MouseEvent.MOUSE_DOWN, this.ContainerClick.bind(this));
        GLOBAL._ROOT.stage.addEventListener(MouseEvent.MOUSE_UP, this.ContainerRelease.bind(this));
        this.mcMask.mcBG.addChild(this._cellContainer!);
    }

    private JumpPopupShow(event: MouseEvent | null = null): void {
        let popupMC: MapRoomPopupJump | null = null;
        const Jump = (e: MouseEvent | null = null): void => { const result = this.JumpToCoordinate(popupMC!.tX.text, popupMC!.tY.text); if (result) GLOBAL.Message(result); else JumpPopupHide(); };
        const JumpPopupHide = (e: MouseEvent | null = null): void => { GLOBAL.BlockerRemove(); popupMC!.bJump.removeEventListener(MouseEvent.CLICK, Jump); popupMC!.mcFrame = null; popupMC!.parent.removeChild(popupMC!); popupMC = null; };
        this.HideBookmarkMenu();
        popupMC = new MapRoomPopupJump();
        popupMC.tMessage.htmlText = KEYS.Get("label_jumptolocation");
        popupMC.tX.htmlText = "";
        popupMC.tY.htmlText = "";
        popupMC.bJump.SetupKey("btn_jump");
        popupMC.bJump.addEventListener(MouseEvent.CLICK, Jump);
        popupMC.x = 450;
        popupMC.y = 250;
        popupMC.mcFrame.Setup(true, JumpPopupHide);
        GLOBAL.BlockerAdd(this);
        this.addChild(popupMC);
    }

    private HideResourceDisplay(): void { for (let i = 1; i < 5; i++) (this as any)["mcR" + i].visible = false; this.mcOutposts.visible = false; }
    private UpdateResourceDisplay(): void {
        for (let i = 1; i < 5; i++) {
            (this as any)["mcR" + i].x = this.mcFrame2.x + 20;
            (this as any)["mcR" + i].y = this.mcFrame2.y + 18 + (i - 1) * 36;
            (this as any)["mcR" + i].tR.htmlText = GLOBAL.FormatNumber(GLOBAL._resources["r" + i].Get());
            let barWidth = Math.floor(100 / GLOBAL._resources["r" + i + "max"] * GLOBAL._resources["r" + i].Get());
            if (barWidth > 90) barWidth = 90;
            (this as any)["mcR" + i].mcBar.width = barWidth;
        }
        this.mcOutposts.x = this.mcFrame2.x + 20;
        this.mcOutposts.y = this.mcFrame2.y + 162;
        this.mcOutposts.tR.htmlText = GLOBAL._mapOutpost.length + " " + KEYS.Get("newmap_outposts");
    }

    public ShowInfo(cell: MapRoomCell): void {
        if (!cell._updated) return;
        let numChildren = this.mcInfo.mcProfilePic.mcImage.numChildren;
        while (numChildren--) this.mcInfo.mcProfilePic.mcImage.removeChildAt(numChildren);
        numChildren = this.mcInfo.mcAlliancePic.mcImage.numChildren;
        while (numChildren--) this.mcInfo.mcAlliancePic.mcImage.removeChildAt(numChildren);
        this.mcInfo.mcAlliancePic.visible = false;
        if (!GLOBAL._flags.viximo) {
            if (cell._base > 1 && Boolean(cell._pic_square)) { this.ProfilePicVix(cell._pic_square); if (Boolean(cell._alliance) && Boolean(cell._alliance.image)) { this.AlliancePic(AllyInfo._picURLs.sizeM, cell._alliance); this.mcInfo.mcAlliancePic.visible = true; } }
        } else if (cell._base > 1 && Boolean(cell._facebookID)) { this.ProfilePic(cell._facebookID); if (Boolean(cell._alliance) && Boolean(cell._alliance.image)) { this.AlliancePic(AllyInfo._picURLs.sizeM, cell._alliance); this.mcInfo.mcAlliancePic.visible = true; } }
        if (cell._base === 1 && Boolean(cell._name)) this.TribePic(cell._name);
        if (cell._water) { this.mcInfo.tAlliance.htmlText = ""; this.mcInfo.tStatus.htmlText = KEYS.Get("status_water"); this.mcInfo.tOwner.htmlText = ""; this.mcInfo.tUserId.visible = false; }
        else {
            if (cell._alliance) { if (cell._base === 0) this.mcInfo.tAlliance.htmlText = ""; else if (cell._base === 1) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_wm"); else this.mcInfo.tAlliance.htmlText = cell._alliance.name; }
            else { if (cell._base === 0) this.mcInfo.tAlliance.htmlText = ""; else if (cell._base === 1) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_wm"); else if (cell._base === 2 && Boolean(cell._mine)) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_my"); else if (cell._base === 2 && !cell._mine) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_ey"); else if (cell._base === 3 && Boolean(cell._mine)) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_outposts"); else if (cell._base === 3 && !cell._mine) this.mcInfo.tAlliance.htmlText = KEYS.Get("newmap_eo"); }
            if (cell._damage) this.mcInfo.tStatus.htmlText = '<font color="#FF0000">' + KEYS.Get("newmap_inf_damaged", { "v1": Math.floor(cell._damage) }) + "</font>";
            if (!cell._damage) this.mcInfo.tStatus.htmlText = "Fine";
            if (!cell._damage && cell._base < 1) this.mcInfo.tStatus.htmlText = KEYS.Get("newmap_re");
            this.mcInfo.tOwner.htmlText = cell._name;
            this.mcInfo.tUserId.text = KEYS.Get("label_userid", { "v1": cell._userID });
            this.mcInfo.tUserId.visible = true;
        }
        this.mcInfo.tLocation.htmlText = cell.X + " x " + cell.Y;
        this.mcInfo.visible = true;
    }

    private ProfilePic(fbid: number): void {
        const profilePic = new Loader();
        const onImageLoad = (event: Event): void => { profilePic.width = profilePic.height = 50; this.mcInfo.mcProfilePic.mcImage.addChild(profilePic); profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError); profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad); };
        const LoadImageError = (event: IOErrorEvent): void => { profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError); profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad); };
        profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
        profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
        profilePic.load(new URLRequest("http://graph.facebook.com/" + fbid + "/picture"));
    }

    private ProfilePicVix(imgURL: string): void {
        const profilePic = new Loader();
        const onImageLoad = (event: Event): void => { profilePic.width = profilePic.height = 50; this.mcInfo.mcProfilePic.mcImage.addChild(profilePic); profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError); profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad); };
        const LoadImageError = (event: IOErrorEvent): void => { profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError); profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad); };
        profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false, 0, true);
        profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
        profilePic.load(new URLRequest(imgURL));
    }

    private TribePic(tribe: string): void {
        const imageComplete = (path: string, bitmapData: BitmapData): void => { const bmp = new Bitmap(bitmapData); this.mcInfo.mcProfilePic.mcImage.addChild(bmp); };
        switch (tribe) {
            case "Dreadnought": case "Dreadnaut": ImageCache.GetImageWithCallBack("monsters/tribe_dreadnaut_50.v2.jpg", imageComplete); break;
            case "Kozu": ImageCache.GetImageWithCallBack("monsters/tribe_kozu_50.v2.jpg", imageComplete); break;
            case "Legionnaire": ImageCache.GetImageWithCallBack("monsters/tribe_legionnaire_50.v2.jpg", imageComplete); break;
            case "Abunakki": ImageCache.GetImageWithCallBack("monsters/tribe_abunakki_50.v2.jpg", imageComplete); break;
        }
    }

    private AlliancePic(size: string, ally: AllyInfo): void { ally.AlliancePic(size, this.mcInfo.mcAlliancePic.mcImage, this.mcInfo.mcAlliancePic.mcBG, true); }

    public Hide(event: MouseEvent | null = null): void {
        GLOBAL._attackerCellsInRange = [];
        if (BASE._loadedFriendlyBaseID) { BASE.yardType = BASE._loadedYardType; BASE.LoadBase(null, 0, BASE._loadedFriendlyBaseID, GLOBAL.e_BASE_MODE.BUILD, false, BASE._loadedYardType); }
        else { BASE.yardType = EnumYardType.MAIN_YARD; BASE.LoadBase(null, 0, GLOBAL._homeBaseID, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD); }
        SOUNDS.Play("close");
        this.Cleanup();
        MapRoomManager.instance.Hide();
    }

    public CloseMapRoomAfterMigration(): void { BASE.yardType = EnumYardType.MAIN_YARD; BASE.LoadBase(null, 0, GLOBAL._homeBaseID, GLOBAL.e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD); this.Cleanup(); MapRoomManager.instance.Hide(); }

    public Cleanup(): void {
        this._bubble = null;
        if (this._popupInfoMine) { this._popupInfoMine.Cleanup(); this._popupInfoMine = null; }
        if (this._popupInfoEnemy) { this._popupInfoEnemy.Cleanup(); this._popupInfoEnemy = null; }
        if (this._popupMonsters) { this._popupMonsters.Cleanup(); this._popupMonsters = null; }
        if (this._popupMonstersB) { this._popupMonstersB.Cleanup(); this._popupMonstersB = null; }
        if (this._popupAttackA) { this._popupAttackA.Cleanup(); this._popupAttackA = null; }
        if (this._popupBookmarkAdd) { this._popupBookmarkAdd.mcFrame = null; this._popupBookmarkAdd = null; }
        if (this._popupRelocateMe) { this._popupRelocateMe.Cleanup(); this._popupRelocateMe = null; }
        this._popupBookmarkMenu = [];
        if (this._popupInfoViewOnly) { this._popupInfoViewOnly.Cleanup(); this._popupInfoViewOnly = null; }
        if (this._popupBuff) { if (this._popupBuff.parent) this._popupBuff.parent.removeChild(this._popupBuff); this._popupBuff.Cleanup(); this._popupBuff = null; }
        if (this.mcFrame) { this.mcFrame.Clear(); this.mcFrame = null; }
        if (this.mcFrame2) { this.mcFrame2.Clear(); this.mcFrame2 = null; }
        if (this._cellContainer) {
            while (this._cellContainer.numChildren > 0) this._cellContainer.removeChildAt(0);
            this._cellContainer.removeEventListener(MouseEvent.MOUSE_DOWN, this.ContainerClick.bind(this));
            GLOBAL._ROOT.stage.removeEventListener(MouseEvent.MOUSE_UP, this.ContainerRelease.bind(this));
            if (this._cellContainer.parent) this._cellContainer.parent.removeChild(this._cellContainer);
            this._cellContainer = null;
        }
        if (this._cells) { for (let i = this._cells.length - 1; i >= 0; i--) { this._cells[i].Cleanup(); } this._cells = []; }
    }

    public Setup(): void {
        const savedCount = MapRoom.BookmarkDataGet("mbms");
        if (savedCount > 0) {
            for (let i = 0; i < savedCount; i++) { const data = MapRoom.BookmarkDataGet("mbm" + i); const posX = Math.floor(data / 10000); const posY = data - posX * 10000; const name = MapRoom.BookmarkDataGetStr("mbmn" + i); MapRoom._currentPosition = new Point(posX, posY); MapRoom.AddBookmark(name, false); }
        } else { MapRoomManager.instance.BookmarksClear(); }
        if (MapRoom._bookmarks.length > 0 || MapRoom._viewOnly) this.bBookmarks.Enabled = true;
        else this.bBookmarks.Enabled = false;
    }

    public JumpTo(point: Point): void {
        this.mcMask.mcBG.removeChild(this._cellContainer!);
        this.GenerateCells(point);
        this._sortArray.sort((a, b) => a.depth - b.depth);
        for (let i = 0; i < this._sortArray.length; i++) { if (this._cellContainer!.getChildIndex(this._sortArray[i]) !== i) this._cellContainer!.setChildIndex(this._sortArray[i], i); }
        this._cellContainer!.addEventListener(MouseEvent.MOUSE_DOWN, this.ContainerClick.bind(this));
        GLOBAL._ROOT.stage.addEventListener(MouseEvent.MOUSE_UP, this.ContainerRelease.bind(this));
        this.mcMask.mcBG.addChild(this._cellContainer!);
        this.Update();
    }

    private GenerateCells(point: Point): void {
        let stageWidth = GLOBAL._ROOT.stage.stageWidth;
        let stageHeight = GLOBAL.GetGameHeight();
        LOGGER.Log("log", "val of param1: " + point);
        if (stageWidth > 1024) stageWidth = 1024;
        if (stageHeight > 768) stageHeight = 768;
        if (this._cellContainer) { while (this._cellContainer.numChildren > 0) this._cellContainer.removeChildAt(0); this._cellContainer.removeEventListener(MouseEvent.MOUSE_DOWN, this.ContainerClick.bind(this)); GLOBAL._ROOT.stage.removeEventListener(MouseEvent.MOUSE_UP, this.ContainerRelease.bind(this)); if (this._cellContainer.parent) this._cellContainer.parent.removeChild(this._cellContainer); this._cellContainer = null; }
        if (this._cells) { for (let i = this._cells.length - 1; i >= 0; i--) { } }
        this._cells = [];
        this._cellContainer = new MovieClip();
        this._sortArray = [];
        if (GLOBAL.isFullScreen) { this._cellCountX = 18; this._cellCountY = 15; }
        else { this._cellCountX = 16; this._cellCountY = 14; }
        for (let colIndex = 0; colIndex < this._cellCountX; colIndex++) {
            for (let rowIndex = 0; rowIndex < this._cellCountY; rowIndex++) {
                const mapRoomCell = new MapRoomCell();
                mapRoomCell.x = Math.floor(colIndex * (this._cellWidth * 0.75) - this._cellWidth * 0.75 * 4);
                mapRoomCell.y = Math.floor(rowIndex * this._cellHeight - this._cellHeight * 5);
                mapRoomCell.X = colIndex;
                mapRoomCell.Y = rowIndex;
                mapRoomCell.cacheAsBitmap = true;
                mapRoomCell.mc.gotoAndStop(1);
                mapRoomCell.mc.mcPlayer.visible = false;
                if (colIndex % 2 === 0) mapRoomCell.y += this._cellHeight * 0.5;
                this._cells.push(mapRoomCell);
                mapRoomCell.depth = mapRoomCell.y * 1000 + mapRoomCell.x;
                this._sortArray.push(mapRoomCell);
                this._cellContainer.addChild(mapRoomCell);
                if (GLOBAL.isFullScreen) { mapRoomCell.Y += point.y - 8; if (point.x % 2) { mapRoomCell.X += point.x - 8; this._cellContainer.x = -125; this._cellContainer.y = 18; } else { mapRoomCell.X += point.x - 7; this._cellContainer.x = -9; this._cellContainer.y = 54; } }
                else { mapRoomCell.Y += point.y - 7; if (point.x % 2) { mapRoomCell.X += point.x - 4; this._cellContainer.x = 209; this._cellContainer.y = 7; } else { mapRoomCell.X += point.x - 5; this._cellContainer.x = 101; this._cellContainer.y = 40; } }
            }
        }
        this._fallbackHomeCell = new MapRoomCell();
        this._fallbackHomeCell.X = GLOBAL._mapHome.x;
        this._fallbackHomeCell.Y = GLOBAL._mapHome.y;
        this._cellContainer.addEventListener(MouseEvent.MOUSE_DOWN, this.ContainerClick.bind(this));
        GLOBAL._ROOT.stage.addEventListener(MouseEvent.MOUSE_UP, this.ContainerRelease.bind(this));
        this.mcMask.mcBG.addChild(this._cellContainer);
    }

    private ContainerClick(event: MouseEvent): void { this._dragged = false; this._containerClickPoint = new Point(this._cellContainer!.x, this._cellContainer!.y); this._mouseClickPoint = new Point(this.mouseX, this.mouseY); this._containerStartPoint = new Point(this._cellContainer!.x, this._cellContainer!.y); this._cellContainer!.addEventListener(MouseEvent.MOUSE_MOVE, this.ContainerMove.bind(this)); }
    private ContainerMove(event: MouseEvent | null = null): void {
        const newPos = new Point(Math.floor(this._containerClickPoint!.x - this._mouseClickPoint!.x + this.mouseX), Math.floor(this._containerClickPoint!.y - this._mouseClickPoint!.y + this.mouseY));
        if (this._cellContainer!.x !== newPos.x || this._cellContainer!.y !== newPos.y) { this._cellContainer!.x = newPos.x; this._cellContainer!.y = newPos.y; }
        if (Point.distance(this._containerStartPoint!, new Point(this._cellContainer!.x, this._cellContainer!.y)) > 10) { this._dragged = true; this.HideBubble(); }
        this.Update();
    }
    private ContainerRelease(event: MouseEvent): void { if (this._cellContainer) this._cellContainer.removeEventListener(MouseEvent.MOUSE_MOVE, this.ContainerMove.bind(this)); this._dragged = false; }

    public Tick(): void { this.UpdateResourceDisplay(); for (const cell of this._cells) cell.Tick(); this.Update(); }
    public Check(): void { for (const cell of this._cells) cell.Check(); }

    public Update(forceUpdate: boolean = false): void {
        if (this._fullScreen && GLOBAL._ROOT.stage.displayState === StageDisplayState.NORMAL) { MapRoomManager.instance.ResizeHandler(); this._fullScreen = false; return; }
        if ((!this._fallbackHomeCell!._updated || forceUpdate) && this._fallbackHomeCell!._dataAge <= 0) { const data = MapRoom.GetCell(this._fallbackHomeCell!.X, this._fallbackHomeCell!.Y); if (data) this._fallbackHomeCell!.Setup(data); }
        this._sortArray = [];
        let needsSort = false;
        for (const cell of this._cells) {
            let needsUpdate = false;
            if (this._cellContainer!.x + cell.x > this._cellCountX * (this._cellWidth * 0.75) - this._cellWidth * 0.75 * 5) { cell.x -= this._cellCountX * (this._cellWidth * 0.75); cell.X -= this._cellCountX; if (cell.X < 0) cell.X += MapRoom._mapWidth; needsUpdate = true; }
            if (this._cellContainer!.y + cell.y > this._cellCountY * this._cellHeight - this._cellHeight * 5) { cell.y -= this._cellCountY * this._cellHeight; cell.Y -= this._cellCountY; if (cell.Y < 0) cell.Y += MapRoom._mapHeight; needsUpdate = true; }
            if (this._cellContainer!.x + cell.x < -(this._cellWidth * 0.75 * 5)) { cell.x += this._cellCountX * (this._cellWidth * 0.75); cell.X += this._cellCountX; if (cell.X > MapRoom._mapWidth - 1) cell.X -= MapRoom._mapWidth; needsUpdate = true; }
            if (this._cellContainer!.y + cell.y < -(this._cellHeight * 5)) { cell.y += this._cellCountY * this._cellHeight; cell.Y += this._cellCountY; if (cell.Y > MapRoom._mapHeight - 1) cell.Y -= MapRoom._mapHeight; needsUpdate = true; }
            if (cell.X < 0) { cell.X += MapRoom._mapWidth; needsUpdate = true; }
            if (cell.Y < 0) { cell.Y += MapRoom._mapHeight; needsUpdate = true; }
            if (cell.X >= MapRoom._mapWidth) { cell.X -= MapRoom._mapWidth; needsUpdate = true; }
            if (cell.Y >= MapRoom._mapHeight) { cell.Y -= MapRoom._mapHeight; needsUpdate = true; }
            if (needsUpdate) { cell.mc.gotoAndStop(1); cell.mc.y = 18; cell.mc.mcPlayer.visible = false; cell._updated = false; cell._dataAge = 0; needsSort = true; }
            if ((!cell._updated || forceUpdate) && cell._dataAge <= 0) { const data = MapRoom.GetCell(cell.X, cell.Y); if (data) cell.Setup(data); }
            cell.depth = cell.y * 1000 + cell.x;
            this._sortArray.push(cell);
        }
        if (needsSort) { this._sortArray.sort((a, b) => a.depth - b.depth); for (let i = 0; i < this._sortArray.length; i++) { if (this._cellContainer!.getChildIndex(this._sortArray[i]) !== i) this._cellContainer!.setChildIndex(this._sortArray[i], i); } }
        if (Boolean(this._popupInfoMine) && Boolean(this._popupInfoMine!.parent)) this._popupInfoMine!.Update();
        if (Boolean(this._popupAttackA) && Boolean(this._popupAttackA!.parent)) this._popupAttackA!.Update();
        if (!this._dragged) { for (const cell of this._cells) { if (!cell._over) cell.mc.mcGlow.alpha = 0; else cell.mc.mcGlow.alpha = 0.5; cell._inRange = false; } }
        if (!MapRoom._viewOnly) { let homeCellRendered = false; for (const cell of this._cells) { if (cell._mine && cell._flingerRange!.Get() > 0 && cell._base > 0) { const range = POWERUPS.Apply(POWERUPS.ALLIANCE_DECLAREWAR, [cell._flingerRange!.Get()]); this.ShowRange(cell, range); if (cell.X === GLOBAL._mapHome.x && cell.y === GLOBAL._mapHome.y) homeCellRendered = true; } } if (!homeCellRendered && this._fallbackHomeCell!._mine && this._fallbackHomeCell!._base > 0) this.ShowRange(this._fallbackHomeCell!, POWERUPS.Apply(POWERUPS.ALLIANCE_DECLAREWAR, [this._fallbackHomeCell!._flingerRange!.Get()])); }
        if (MapRoom._bookmarks.length > 0 || MapRoom._viewOnly) this.bBookmarks.Enabled = true; else this.bBookmarks.Enabled = false;
        this.DisplayBuffs();
    }

    public ShowBubble(cell: MapRoomCell): void { }
    public HideBubble(): void { if (this._bubble!.parent) this._bubble!.parent.removeChild(this._bubble!); }

    public ShowRange(cell: MapRoomCell, range: number): void {
        if (!this._dragged) {
            if (cell._water === false) {
                if (!cell._over) cell.mc.mcGlow.alpha = 0.5;
                cell._inRange = true;
                const cellsInRange = this.GetCellsInRange(cell.X, cell.Y, range);
                for (const cellData of cellsInRange) { const targetCell = cellData.cell as MapRoomCell; if (Boolean(targetCell) && !targetCell._water) { if (!targetCell._over) { if (cellData.range <= 10) targetCell.mc.mcGlow.alpha = 0.5; else targetCell.mc.mcGlow.alpha = Math.max(targetCell.mc.mcGlow.alpha, 0.35); } targetCell._inRange = true; } }
            }
        }
    }

    public GetCellsInRange(startOffsetX: number, startOffsetY: number, range: number): Array<CellData> {
        const cells: Array<CellData> = [];
        const startAxialQ = startOffsetX;
        const startAxialR = startOffsetY - (startOffsetX - (startOffsetX & 1)) / 2;
        for (let deltaQ = -range; deltaQ <= range; deltaQ++) {
            for (let deltaR = Math.max(-range, -deltaQ - range); deltaR <= Math.min(range, -deltaQ + range); deltaR++) {
                if (deltaQ === 0 && deltaR === 0) continue;
                const currentAxialQ = startAxialQ + deltaQ;
                const currentAxialR = startAxialR + deltaR;
                const distance = Math.max(Math.abs(deltaQ), Math.abs(deltaR), Math.abs(-deltaQ - deltaR));
                const currentOffsetX = currentAxialQ;
                const currentOffsetY = currentAxialR + (currentAxialQ - (currentAxialQ & 1)) / 2;
                const cell = this.GetCell(currentOffsetX, currentOffsetY);
                cells.push(new CellData(cell, distance));
            }
        }
        return cells;
    }

    private GetCell(hexX: number, hexY: number): MapRoomCell | null {
        if (hexX >= MapRoom._mapWidth) hexX -= MapRoom._mapWidth; else if (hexX < 0) hexX = MapRoom._mapWidth + hexX;
        if (hexY >= MapRoom._mapHeight) hexY -= MapRoom._mapHeight; else if (hexY < 0) hexY = MapRoom._mapHeight + hexY;
        for (const cell of this._cells) { if (cell.X === hexX && cell.Y === hexY) return cell; }
        if (this._fallbackHomeCell!.X === hexX && this._fallbackHomeCell!.Y === hexY) return this._fallbackHomeCell;
        return null;
    }

    public ShowInfoMine(cell: MapRoomCell): void { this.HideBookmarkMenu(); if (!this._dragged) { SOUNDS.Play("click1"); this.HideBubble(); this._popupInfoMine!.Setup(cell); GLOBAL.BlockerAdd(this); this.addChild(this._popupInfoMine!); } this._dragged = false; }
    public HideInfoMine(): void { GLOBAL.BlockerRemove(); if (this._popupInfoMine!.parent) this._popupInfoMine!.parent.removeChild(this._popupInfoMine!); SOUNDS.Play("close"); }
    public ShowInfoEnemy(cell: MapRoomCell, inRange: boolean = false): void { this.HideBookmarkMenu(); if (!this._dragged) { SOUNDS.Play("click1"); this.HideBubble(); this._popupInfoEnemy!.Setup(cell, inRange); GLOBAL.BlockerAdd(this); this.addChild(this._popupInfoEnemy!); } this._dragged = false; }
    public HideInfoEnemy(): void { GLOBAL.BlockerRemove(); if (this._popupInfoEnemy!.parent) this._popupInfoEnemy!.parent.removeChild(this._popupInfoEnemy!); SOUNDS.Play("close"); }
    public ShowInfoViewOnly(cell: MapRoomCell, inRange: boolean = false): void { if (!this._dragged) { SOUNDS.Play("click1"); this._popupInfoViewOnly!.Setup(cell, inRange); GLOBAL.BlockerAdd(this); this.addChild(this._popupInfoViewOnly!); } this._dragged = false; }
    public HideInfoViewOnly(): void { GLOBAL.BlockerRemove(); if (this._popupInfoViewOnly!.parent) this._popupInfoViewOnly!.parent.removeChild(this._popupInfoViewOnly!); SOUNDS.Play("close"); }
    public ShowInfoDestroyed(cell: MapRoomCell): void { this.HideBookmarkMenu(); if (!this._dragged) { SOUNDS.Play("click1"); this.HideBubble(); cell._destroyed = 1; this._popupInfoEnemy!.Setup(cell); GLOBAL.BlockerAdd(this); this.addChild(this._popupInfoEnemy!); } this._dragged = false; }
    public HideTransferB(): void { }
    public ShowMonstersA(cell: MapRoomCell, isReopen: boolean = false): void { SOUNDS.Play("click1"); this.HideBookmarkMenu(); this.HideInfoMine(); this._popupMonsters!.Setup(cell, isReopen); GLOBAL.BlockerAdd(this); this.addChild(this._popupMonsters!); }
    public HideMonstersA(): void { if (this._popupMonsters!.parent) this._popupMonsters!.parent.removeChild(this._popupMonsters!); GLOBAL.BlockerRemove(); SOUNDS.Play("close"); }
    public ShowMonstersB(monsters: any, cell: MapRoomCell): void { SOUNDS.Play("click1"); this.HideBookmarkMenu(); this._popupMonstersB!.Setup(monsters, cell); GLOBAL.BlockerAdd(this); this.addChild(this._popupMonstersB!); }
    public HideMonstersB(): void { GLOBAL.BlockerRemove(); if (Boolean(this._popupMonstersB) && Boolean(this._popupMonstersB!.parent)) this._popupMonstersB!.parent.removeChild(this._popupMonstersB!); SOUNDS.Play("close"); }
    public ShowAttack(cell: MapRoomCell): void { SOUNDS.Play("click1"); this.HideBookmarkMenu(); if (cell && !cell._protected && !(cell._truce && cell._truce > GLOBAL.Timestamp())) { this._popupAttackA!.Setup(cell); GLOBAL.BlockerAdd(this); this.addChild(this._popupAttackA!); } else if (cell._protected) GLOBAL.Message(KEYS.Get("newmap_dp")); else if (Boolean(cell._truce) && cell._truce > GLOBAL.Timestamp()) GLOBAL.Message(KEYS.Get("newmap_truce")); }
    public HideAttack(): void { GLOBAL.BlockerRemove(); if (this._popupAttackA!.parent) this._popupAttackA!.parent.removeChild(this._popupAttackA!); SOUNDS.Play("close"); }

    public ShowBookmarkMenu(event: MouseEvent): void {
        SOUNDS.Play("click1");
        if (!this._menuShown && MapRoom._bookmarks.length > 0) {
            const length = MapRoom._bookmarks.length;
            let newY = this.bBookmarks.y;
            for (let i = 0; i < length; i++) {
                const menuItem = new MapRoomBookmark();
                menuItem.mcBG.index = i;
                menuItem.x = this.bBookmarks.x + 115;
                menuItem.y = newY;
                newY += menuItem.height;
                menuItem.tName.mouseEnabled = false;
                menuItem.bDelete.index = i;
                menuItem.bDelete.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => { this.BookmarkRemove((e.target as any).index); });
                menuItem.bDelete.buttonMode = true;
                menuItem.mcBG.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => { this.BookmarkSelect((e.target as any).index); });
                menuItem.tName.htmlText = MapRoom._bookmarks[i].name;
                menuItem.visible = true;
                this._popupBookmarkMenu[i] = menuItem;
                this.addChild(this._popupBookmarkMenu[i]);
            }
            this._menuShown = true;
        } else { this.HideBookmarkMenu(); }
    }

    public HideBookmarkMenu(): void { if (this._menuShown) { for (let i = 0; i < this._popupBookmarkMenu.length; i++) { if (this._popupBookmarkMenu[i].parent) this._popupBookmarkMenu[i].parent.removeChild(this._popupBookmarkMenu[i]); } this._menuShown = false; SOUNDS.Play("close"); } }

    public JumpToCoordinate(xStr: string, yStr: string): string {
        const x = Number(xStr);
        const y = Number(yStr);
        if (!isNaN(x) && !isNaN(y)) { const intX = Math.floor(x); const intY = Math.floor(y); if (intX >= 0 && intX < MapRoom._mapWidth && intY >= 0 && intY <= MapRoom._mapHeight) { MapRoom._homePoint = new Point(intX, intY); MapRoom.JumpTo(MapRoom._homePoint); return ""; } return KEYS.Get("map_coordinateoffmap"); }
        return KEYS.Get("map_notanumber");
    }

    public BookmarkSelect(index: number): void { this.HideBookmarkMenu(); if (MapRoom._bookmarks.length > index) MapRoom.JumpTo(MapRoom._bookmarks[index].location); }
    public BookmarkRemove(index: number): void {
        MapRoom._bookmarks.splice(index, 1);
        if (this._popupBookmarkMenu[index].parent) this._popupBookmarkMenu[index].parent.removeChild(this._popupBookmarkMenu[index]);
        this._popupBookmarkMenu.splice(index, 1);
        if (MapRoom._bookmarks.length > 0) {
            const length = MapRoom._bookmarks.length;
            for (let i = index; i < length; i++) { --this._popupBookmarkMenu[i].mcBG.index; this._popupBookmarkMenu[i].y -= this._popupBookmarkMenu[i].height; MapRoom.BookmarkDataSet("mbm" + i, MapRoom._bookmarks[i].location.x * 10000 + MapRoom._bookmarks[i].location.y, false); MapRoom.BookmarkDataSetStr("mbmn" + i, MapRoom._bookmarks[i].name, false); }
            MapRoom.BookmarkDataSet("mbms", length, false);
            MapRoom.BookmarkDataSet("mbm" + length, 0, false);
            MapRoom.BookmarkDataSetStr("mbmn" + length, "", false);
            MapRoom.BookmarksSave();
        } else { MapRoomManager.instance.BookmarksClear(); this._menuShown = false; }
    }

    public ShowBookmarkAddPopup(cell: MapRoomCell): void { SOUNDS.Play("click1"); MapRoom._currentPosition = new Point(cell.X, cell.Y); this._popupBookmarkAdd!.tName.htmlText = KEYS.Get("map_yardowner", { "v1": cell._name }); this._popupBookmarkAdd!.tMessage.htmlText = KEYS.Get("newmap_bm_add"); this._popupBookmarkAdd!.bSave.SetupKey("btn_save"); this._popupBookmarkAdd!.bSave.addEventListener(MouseEvent.CLICK, this.HideBookmarkAddPopupWithAdd.bind(this)); GLOBAL.BlockerAdd(this); this.addChild(this._popupBookmarkAdd!); }
    public ShowRelocateMePopup(cell: MapRoomCell): void { SOUNDS.Play("click1"); this._popupRelocateMe!.Setup(cell); GLOBAL.BlockerAdd(this); this.addChild(this._popupRelocateMe!); }
    public HideBookmarkAddPopup(event: MouseEvent | null = null): void { if (this._popupBookmarkAdd!.parent) this._popupBookmarkAdd!.parent.removeChild(this._popupBookmarkAdd!); GLOBAL.BlockerRemove(); }
    public HideBookmarkAddPopupWithAdd(event: MouseEvent): void { GLOBAL.BlockerRemove(); const result = MapRoom.AddBookmark(this._popupBookmarkAdd!.tName.text); if (result.hide && this._popupBookmarkAdd && Boolean(this._popupBookmarkAdd.parent)) this._popupBookmarkAdd.parent.removeChild(this._popupBookmarkAdd); if (result.message !== "SUCCESS") GLOBAL.Message(result.message); SOUNDS.Play("close"); }

    public DisplayBuffs(): void {
        const powerCount = POWERUPS.CheckPowers(null, "NORMAL");
        let numChildren = this.mcBuffHolder.numChildren;
        while (numChildren--) { this.mcBuffHolder.getChildAt(numChildren).removeEventListener(MouseEvent.ROLL_OVER, this.BuffShow.bind(this)); this.mcBuffHolder.getChildAt(numChildren).removeEventListener(MouseEvent.ROLL_OUT, this.BuffHide.bind(this)); this.mcBuffHolder.removeChildAt(numChildren); }
        if (powerCount > 0) {
            const maxCols = 3; let colIdx = 0; let rowIdx = 0;
            const powerups = POWERUPS.GetPowerups("NORMAL");
            for (const key in powerups) {
                if (POWERUPS._expireRealTime && powerups[key].endtime.Get() < GLOBAL.Timestamp()) { this.BuffHide(null); continue; }
                const icon = new ui_buffIcon_CLIP();
                icon.gotoAndStop(key);
                icon.name = key;
                icon.x = colIdx * (-32 - 4);
                icon.y = rowIdx * (32 + 4);
                colIdx++;
                if (colIdx >= maxCols) { colIdx = 0; rowIdx++; }
                icon.addEventListener(MouseEvent.ROLL_OVER, this.BuffShow.bind(this));
                icon.addEventListener(MouseEvent.ROLL_OUT, this.BuffHide.bind(this));
                this.mcBuffHolder.addChild(icon);
            }
        } else { this.BuffHide(null); }
    }

    public BuffShow(event: MouseEvent): void { const target = event.currentTarget as MovieClip; const desc = KEYS.Get(target.name + "_desc"); let duration = "<b>" + KEYS.Get("buff_duration") + "</b>"; if (POWERUPS._expireRealTime) { if (POWERUPS.Timeleft(target.name) > 0) duration += GLOBAL.ToTime(POWERUPS.Timeleft(target.name), true); else duration = ""; } else { if (POWERUPS.Timeleft(target.name) > 0) duration += GLOBAL.ToTime(POWERUPS.Timeleft(target.name), true); else duration = ""; } if (!this._popupBuff) { const buff = new bubblepopupBuff(); this._popupBuff = this.addChild(buff) as bubblepopupBuff; buff.Setup(target.x + target.width / 2, target.y + target.height + 4, desc, duration); buff.x = this.mcBuffHolder.x + (target.x + target.width / 2); if (buff.x >= this.mcBuffHolder.x) { buff.x = this.mcBuffHolder.x + (target.x + target.width / 2) - 60; buff.mcArrow.x = 60; } buff.y = this.mcBuffHolder.y + (target.y + target.height + 4); } else { (this._popupBuff as bubblepopupBuff).Update(desc, duration); } }
    public BuffHide(event: MouseEvent | null): void { if (this._popupBuff) { this.removeChild(this._popupBuff); (this._popupBuff as bubblepopupBuff).Cleanup(); this._popupBuff = null; } }
    public BuffOff(event: MouseEvent): void { POWERUPS._testToggleOffPowers = true; const target = event.currentTarget as MovieClip; POWERUPS.Remove(target.name); this.BuffHide(null); }
    public Help(): void { Tutorial.ForceShowAll(); }
    public FullScreen(): void { if (GLOBAL.isFullScreen) this._fullScreen = true; else this._fullScreen = false; MapRoomManager.instance.ResizeHandler(); }
    public Resize(): void { let needsResize = false; if (GLOBAL.isFullScreen) { if (this._fullScreen !== true) needsResize = true; } else if (this._fullScreen !== false) needsResize = true; if (needsResize) MapRoomManager.instance.ResizeHandler(); }
}
