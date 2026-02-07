import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import { TweenLite } from "gs/TweenLite";

import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3CellMouseover } from "./MapRoom3CellMouseover";

import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { UI_VISITOR } from "../../../UI_VISITOR";
import { popup_mr2tutorial } from "../../../popup_mr2tutorial";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getMAP(): any { return require("../../../MAP").MAP; }
function getSOUNDS(): any { return require("../../../SOUNDS").SOUNDS; }
function getTUTORIAL(): any { return require("../../../TUTORIAL").TUTORIAL; }


/**
 * MapRoom3Tutorial - Tutorial handler for Map Room 3.
 */
export class MapRoom3Tutorial {
    private static readonly k_ID_START: number = 0;
    private static readonly k_ID_HALFWAY: number = 1;
    private static readonly k_ID_FINISHED: number = 2;

    public static readonly k_STEP_OPENMAP: number = 0;
    public static readonly k_STEP_CLICKWM: number = 1;
    public static readonly k_STEP_SCOUTWM: number = 2;
    public static readonly k_STEP_ATTACKWM: number = 3;
    public static readonly k_STEP_HOLD: number = 4;
    public static readonly k_STEP_COUNQURED: number = 5;
    public static readonly k_STEP_FORTIFICATION_ARM: number = 6;
    public static readonly k_STEP_FINISHED: number = 7;
    public static readonly k_MAX_STEP: number = 8;

    private static m_instance: MapRoom3Tutorial | null = null;

    private m_started: boolean = false;
    private m_tutorialStep: number = 0;
    private m_currImageUrl: string = "";
    private m_bigPopup: popup_mr2tutorial | null = null;
    private m_tutorialId: number = 0;
    private m_target: any = null;

    private constructor() {
    }

    public static get instance(): MapRoom3Tutorial {
        MapRoom3Tutorial.m_instance = MapRoom3Tutorial.m_instance || new MapRoom3Tutorial();
        return MapRoom3Tutorial.m_instance;
    }

    public get tutorialId(): number {
        return this.m_tutorialId;
    }

    public get tutorialStep(): number {
        return this.m_tutorialStep;
    }

    public get allowScrolling(): boolean {
        return !this.m_started || this.m_tutorialStep < MapRoom3Tutorial.k_STEP_CLICKWM || this.m_tutorialStep > MapRoom3Tutorial.k_STEP_ATTACKWM;
    }

    public get isStarted(): boolean {
        return this.m_started;
    }

    public get isHolding(): boolean {
        return this.m_tutorialStep === MapRoom3Tutorial.k_STEP_HOLD;
    }

    public isClickableCell(cell: MapRoom3Cell): boolean {
        return !this.m_target || cell === this.m_target || getTUTORIAL().hasFinished;
    }

    public importData(data: Record<string, any>): void {
    }

    public update(): void {
        let cell: MapRoom3Cell;
        let cells: Array<MapRoom3Cell>;
        let mouseoverInfo: MapRoom3CellMouseover;
        switch (this.m_tutorialStep) {
            case MapRoom3Tutorial.k_STEP_OPENMAP:
                getBASE().BuildingDeselect();
                getTUTORIAL().Add(6, getTUTORIAL().BOBBOTTOMLEFTLOW, getKEYS().Get("tut_NWM_Step33"), getTUTORIAL().POINT_MAP, ["mc", UI_BOTTOM._mc.bMap, new Point(15, 15), -30], false, false, this.openedMapRoom.bind(this));
                break;
            case MapRoom3Tutorial.k_STEP_CLICKWM:
                if (!getMapRoomManager().instance.isOpen || !getMapRoomManager().instance.isInMapRoom3) {
                    break;
                }
                getTUTORIAL()._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                this.m_target = null;
                cells = getMapRoomManager().instance.GetHexCellsInRange(getGLOBAL()._mapHome.x, getGLOBAL()._mapHome.y, 1);
                for (cell of cells) {
                    if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                        if (cell.isOwnedByPlayer) {
                            getTUTORIAL()._container = getGLOBAL()._layerMessages;
                            getTUTORIAL().Add(6, getTUTORIAL().BOBBOTTOMLEFTLOW, getKEYS().Get("btn_returnhome"), getTUTORIAL().POINT_MAP, ["mc", UI_BOTTOM._mc.bMap, new Point(15, 15), -30], false, false, this.returnedHome.bind(this));
                            this.m_target = null;
                            break;
                        }
                        this.m_target = cell;
                    }
                }
                if (this.m_target) {
                    getTUTORIAL().Add(6, new Point(this.m_target.cellGraphic.x + getGLOBAL()._SCREEN.width / 2 - 160, this.m_target.cellGraphic.y), getKEYS().Get("tut_NWM_Step_2"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y + this.m_target.cellGraphic.height * 0.5), [], false, false, this.clickWMBase.bind(this), null);
                    getTUTORIAL()._mcArrow.alpha = 0;
                    TweenLite.to(getTUTORIAL()._mcArrow, 0.75, { "autoAlpha": 1, "delay": 0.5, "overwrite": 1 });
                    MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                }
                break;
            case MapRoom3Tutorial.k_STEP_SCOUTWM:
                if (!getMapRoomManager().instance.isOpen) {
                    break;
                }
                if (!MapRoom3.mapRoom3Window.mouseoverInfo || !MapRoom3.mapRoom3Window.mouseoverInfo.visible) {
                    this.rewind();
                } else {
                    getTUTORIAL()._container = getGLOBAL()._layerMessages;
                    mouseoverInfo = MapRoom3.mapRoom3Window.mouseoverInfo;
                    getTUTORIAL().Add(6, new Point(100, 160), getKEYS().Get("tut_NWM_Step_3"), new Point(mouseoverInfo.x, mouseoverInfo.y + 100), ["mc", mouseoverInfo.scoutAttackButton, new Point(15, 15), 100], false, false, this.scoutWMBase.bind(this), this.failScoutWMBase.bind(this));
                    getTUTORIAL()._mcArrow.alpha = 0;
                    TweenLite.to(getTUTORIAL()._mcArrow, 0.75, { "autoAlpha": 1, "delay": 0.5, "overwrite": 1 });
                }
                break;
            case MapRoom3Tutorial.k_STEP_ATTACKWM:
                getMAP().Focus(-200, 0);
                getMAP().FocusTo(200, 0, 5, 0, 0, false);
                getTUTORIAL().Add(6, getTUTORIAL().BOBBOTTOMLEFTLOW, getKEYS().Get("tut_NWM_Step_4"), getTUTORIAL().POINT_MAP, ["mc", (UI_VISITOR.mc as any).bAttack, new Point(15, 15), -30], false, false, this.attackWMBase.bind(this));
                break;
            case MapRoom3Tutorial.k_STEP_HOLD:
                this.m_target = null;
                break;
            case MapRoom3Tutorial.k_STEP_COUNQURED:
                if (!getMapRoomManager().instance.isOpen) {
                    this.rewind();
                } else {
                    getTUTORIAL()._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                    this.m_target = null;
                    cells = getMapRoomManager().instance.GetHexCellsInRange(getGLOBAL()._mapHome.x, getGLOBAL()._mapHome.y, 1);
                    for (cell of cells) {
                        if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                            this.m_target = cell;
                        }
                    }
                    if (this.m_target) {
                        getTUTORIAL().Add(6, new Point(this.m_target.cellGraphic.x - 100, this.m_target.cellGraphic.y + 200), getKEYS().Get("tut_NWM_Step_8"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y), [], true, false, null, null);
                        getTUTORIAL()._mcArrow.alpha = 0;
                        TweenLite.to(getTUTORIAL()._mcArrow, 0.75, { "autoAlpha": 1, "delay": 1, "overwrite": 1 });
                        MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                    }
                }
                break;
            case MapRoom3Tutorial.k_STEP_FORTIFICATION_ARM:
                getTUTORIAL()._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                this.m_target = null;
                cells = getMapRoomManager().instance.GetHexCellsInRange(getGLOBAL()._mapHome.x, getGLOBAL()._mapHome.y, 1);
                for (cell of cells) {
                    if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                        this.m_target = cell;
                    }
                }
                if (this.m_target) {
                    getTUTORIAL().Add(6, new Point(this.m_target.cellGraphic.x - 100, this.m_target.cellGraphic.y + 200), getKEYS().Get("tut_NWM_Step_8"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y), [], true, false, null, null);
                    getTUTORIAL()._mcArrow.alpha = 0;
                    TweenLite.to(getTUTORIAL()._mcArrow, 0.75, { "autoAlpha": 1, "delay": 1, "overwrite": 1 });
                    MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                }
                break;
        }
    }

    private openedMapRoom(): void {
        const cell = getGLOBAL()._currentCell as MapRoom3Cell;
        if (getMapRoomManager().instance.isOpen && cell && cell.isDataLoaded) {
            this.advance();
        }
    }

    private returnedHome(): void {
        if (!getMapRoomManager().instance.isOpen && getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            this.finish();
        }
    }

    private clickWMBase(): void {
        const mouseoverInfo = MapRoom3.mapRoom3Window.mouseoverInfo;
        if (mouseoverInfo && mouseoverInfo.visible && mouseoverInfo.scoutAttackButton.parent && mouseoverInfo.scoutAttackButton.parent.visible && mouseoverInfo.selectedCell === this.m_target) {
            this.advance();
        }
    }

    private scoutWMBase(): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMVIEW) {
            getTUTORIAL()._container = getGLOBAL()._layerMessages;
            this.advance();
        }
    }

    private failScoutWMBase(): void {
        if (!MapRoom3.mapRoom3Window.mouseoverInfo || !MapRoom3.mapRoom3Window.mouseoverInfo.visible) {
            this.rewind();
        }
    }

    private attackWMBase(): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.WMATTACK) {
            this.advance();
            getTUTORIAL()._stage = 111;
            getTUTORIAL().Advance();
        }
    }

    private closedMapRoom(): void {
        if (!getMapRoomManager().instance.isOpen) {
            getTUTORIAL()._container = getGLOBAL()._layerMessages;
            this.m_tutorialStep = 0;
            getTUTORIAL()._stage = 99;
            getTUTORIAL().Advance();
        }
    }

    public advance(event: Event | null = null): void {
        ++this.m_tutorialStep;
        getTUTORIAL().clearStage();
        this.update();
    }

    private rewind(): void {
        --this.m_tutorialStep;
        getTUTORIAL().clearStage();
        this.update();
    }

    private showBigDialog(body: string, imageUrl: string): void {
        this.hideBigDialog();
        getGLOBAL().BlockerAdd();
        getSOUNDS().Play("click1");
        this.m_bigPopup = new popup_mr2tutorial();
        this.m_bigPopup.tBody.htmlText = body;
        this.m_bigPopup.bAction.SetupKey("btn_continue");
        this.m_bigPopup.bAction.addEventListener(MouseEvent.CLICK, this.advance.bind(this), false, 0, true);
        this.m_bigPopup.bAction.Highlight = true;
        this.m_bigPopup.mcFrame.Setup(true, this.finish.bind(this));
        this.m_currImageUrl = imageUrl;
        ImageCache.GetImageWithCallBack(this.m_currImageUrl, this.imageLoaded.bind(this));
        getGLOBAL()._layerTop.addChild(this.m_bigPopup);
        POPUPSETTINGS.AlignToCenter(this.m_bigPopup);
        POPUPSETTINGS.ScaleUp(this.m_bigPopup);
    }

    private imageLoaded(url: string, bmd: BitmapData): void {
        if (this.m_currImageUrl === url) {
            this.m_bigPopup!.mcImageContainer.addChild(new Bitmap(bmd));
        }
    }

    private showSmallDialog(message: string): void {
        this.hideBigDialog();
        this.m_currImageUrl = "";
        getGLOBAL().Message(message, getKEYS().Get("btn_continue"), this.advance.bind(this));
    }

    public start(): void {
        if (!getMapRoomManager().instance.isInMapRoom3 || this.m_tutorialStep >= MapRoom3Tutorial.k_STEP_FINISHED) {
            return;
        }
        this.m_started = true;
        this.update();
    }

    public finish(event: Event | null = null): void {
        this.clear();
        getTUTORIAL()._stage = 129;
        getTUTORIAL().Advance();
    }

    public clear(): void {
        this.m_started = false;
        this.m_tutorialStep = MapRoom3Tutorial.k_STEP_FINISHED;
        this.m_tutorialId = MapRoom3Tutorial.k_ID_FINISHED;
        getTUTORIAL()._container = getGLOBAL()._layerMessages;
    }

    public continueFromAttack(): void {
        this.m_tutorialStep = MapRoom3Tutorial.k_STEP_COUNQURED;
        this.update();
    }

    private hideBigDialog(): void {
        if (this.m_bigPopup) {
            getGLOBAL().BlockerRemove();
            getGLOBAL()._layerTop.removeChild(this.m_bigPopup);
            this.m_bigPopup = null;
        }
    }
}
