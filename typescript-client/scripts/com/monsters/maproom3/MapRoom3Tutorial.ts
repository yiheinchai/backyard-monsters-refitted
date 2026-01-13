import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import { TweenLite } from "gs/TweenLite";

import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { UI_BOTTOM } from "../ui/UI_BOTTOM";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3CellMouseover } from "./MapRoom3CellMouseover";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAP } from "../../../MAP";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { SOUNDS } from "../../../SOUNDS";
import { TUTORIAL } from "../../../TUTORIAL";
import { UI_VISITOR } from "../../../UI_VISITOR";
import { popup_mr2tutorial } from "../../../popup_mr2tutorial";

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
        return !this.m_target || cell === this.m_target || TUTORIAL.hasFinished;
    }

    public importData(data: Record<string, any>): void {
    }

    public update(): void {
        let cell: MapRoom3Cell;
        let cells: Array<MapRoom3Cell>;
        let mouseoverInfo: MapRoom3CellMouseover;
        switch (this.m_tutorialStep) {
            case MapRoom3Tutorial.k_STEP_OPENMAP:
                BASE.BuildingDeselect();
                TUTORIAL.Add(6, TUTORIAL.BOBBOTTOMLEFTLOW, KEYS.Get("tut_NWM_Step33"), TUTORIAL.POINT_MAP, ["mc", UI_BOTTOM._mc.bMap, new Point(15, 15), -30], false, false, this.openedMapRoom.bind(this));
                break;
            case MapRoom3Tutorial.k_STEP_CLICKWM:
                if (!MapRoomManager.instance.isOpen || !MapRoomManager.instance.isInMapRoom3) {
                    break;
                }
                TUTORIAL._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                this.m_target = null;
                cells = MapRoomManager.instance.GetHexCellsInRange(GLOBAL._mapHome.x, GLOBAL._mapHome.y, 1);
                for (cell of cells) {
                    if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                        if (cell.isOwnedByPlayer) {
                            TUTORIAL._container = GLOBAL._layerMessages;
                            TUTORIAL.Add(6, TUTORIAL.BOBBOTTOMLEFTLOW, KEYS.Get("btn_returnhome"), TUTORIAL.POINT_MAP, ["mc", UI_BOTTOM._mc.bMap, new Point(15, 15), -30], false, false, this.returnedHome.bind(this));
                            this.m_target = null;
                            break;
                        }
                        this.m_target = cell;
                    }
                }
                if (this.m_target) {
                    TUTORIAL.Add(6, new Point(this.m_target.cellGraphic.x + GLOBAL._SCREEN.width / 2 - 160, this.m_target.cellGraphic.y), KEYS.Get("tut_NWM_Step_2"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y + this.m_target.cellGraphic.height * 0.5), [], false, false, this.clickWMBase.bind(this), null);
                    TUTORIAL._mcArrow.alpha = 0;
                    TweenLite.to(TUTORIAL._mcArrow, 0.75, { "autoAlpha": 1, "delay": 0.5, "overwrite": 1 });
                    MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                }
                break;
            case MapRoom3Tutorial.k_STEP_SCOUTWM:
                if (!MapRoomManager.instance.isOpen) {
                    break;
                }
                if (!MapRoom3.mapRoom3Window.mouseoverInfo || !MapRoom3.mapRoom3Window.mouseoverInfo.visible) {
                    this.rewind();
                } else {
                    TUTORIAL._container = GLOBAL._layerMessages;
                    mouseoverInfo = MapRoom3.mapRoom3Window.mouseoverInfo;
                    TUTORIAL.Add(6, new Point(100, 160), KEYS.Get("tut_NWM_Step_3"), new Point(mouseoverInfo.x, mouseoverInfo.y + 100), ["mc", mouseoverInfo.scoutAttackButton, new Point(15, 15), 100], false, false, this.scoutWMBase.bind(this), this.failScoutWMBase.bind(this));
                    TUTORIAL._mcArrow.alpha = 0;
                    TweenLite.to(TUTORIAL._mcArrow, 0.75, { "autoAlpha": 1, "delay": 0.5, "overwrite": 1 });
                }
                break;
            case MapRoom3Tutorial.k_STEP_ATTACKWM:
                MAP.Focus(-200, 0);
                MAP.FocusTo(200, 0, 5, 0, 0, false);
                TUTORIAL.Add(6, TUTORIAL.BOBBOTTOMLEFTLOW, KEYS.Get("tut_NWM_Step_4"), TUTORIAL.POINT_MAP, ["mc", (UI_VISITOR.mc as any).bAttack, new Point(15, 15), -30], false, false, this.attackWMBase.bind(this));
                break;
            case MapRoom3Tutorial.k_STEP_HOLD:
                this.m_target = null;
                break;
            case MapRoom3Tutorial.k_STEP_COUNQURED:
                if (!MapRoomManager.instance.isOpen) {
                    this.rewind();
                } else {
                    TUTORIAL._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                    this.m_target = null;
                    cells = MapRoomManager.instance.GetHexCellsInRange(GLOBAL._mapHome.x, GLOBAL._mapHome.y, 1);
                    for (cell of cells) {
                        if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                            this.m_target = cell;
                        }
                    }
                    if (this.m_target) {
                        TUTORIAL.Add(6, new Point(this.m_target.cellGraphic.x - 100, this.m_target.cellGraphic.y + 200), KEYS.Get("tut_NWM_Step_8"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y), [], true, false, null, null);
                        TUTORIAL._mcArrow.alpha = 0;
                        TweenLite.to(TUTORIAL._mcArrow, 0.75, { "autoAlpha": 1, "delay": 1, "overwrite": 1 });
                        MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                    }
                }
                break;
            case MapRoom3Tutorial.k_STEP_FORTIFICATION_ARM:
                TUTORIAL._container = MapRoom3.mapRoom3Window.scrollingCanvas;
                this.m_target = null;
                cells = MapRoomManager.instance.GetHexCellsInRange(GLOBAL._mapHome.x, GLOBAL._mapHome.y, 1);
                for (cell of cells) {
                    if (cell.cellType === EnumYardType.FORTIFICATION && (!this.m_target || cell.baseLevel < (this.m_target as MapRoom3Cell).baseLevel)) {
                        this.m_target = cell;
                    }
                }
                if (this.m_target) {
                    TUTORIAL.Add(6, new Point(this.m_target.cellGraphic.x - 100, this.m_target.cellGraphic.y + 200), KEYS.Get("tut_NWM_Step_8"), new Point(this.m_target.cellGraphic.x + this.m_target.cellGraphic.width * 0.5, this.m_target.cellGraphic.y), [], true, false, null, null);
                    TUTORIAL._mcArrow.alpha = 0;
                    TweenLite.to(TUTORIAL._mcArrow, 0.75, { "autoAlpha": 1, "delay": 1, "overwrite": 1 });
                    MapRoom3.mapRoom3Window.NavigateToCell(this.m_target as MapRoom3Cell);
                }
                break;
        }
    }

    private openedMapRoom(): void {
        const cell = GLOBAL._currentCell as MapRoom3Cell;
        if (MapRoomManager.instance.isOpen && cell && cell.isDataLoaded) {
            this.advance();
        }
    }

    private returnedHome(): void {
        if (!MapRoomManager.instance.isOpen && GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
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
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.WMVIEW) {
            TUTORIAL._container = GLOBAL._layerMessages;
            this.advance();
        }
    }

    private failScoutWMBase(): void {
        if (!MapRoom3.mapRoom3Window.mouseoverInfo || !MapRoom3.mapRoom3Window.mouseoverInfo.visible) {
            this.rewind();
        }
    }

    private attackWMBase(): void {
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.WMATTACK) {
            this.advance();
            TUTORIAL._stage = 111;
            TUTORIAL.Advance();
        }
    }

    private closedMapRoom(): void {
        if (!MapRoomManager.instance.isOpen) {
            TUTORIAL._container = GLOBAL._layerMessages;
            this.m_tutorialStep = 0;
            TUTORIAL._stage = 99;
            TUTORIAL.Advance();
        }
    }

    public advance(event: Event | null = null): void {
        ++this.m_tutorialStep;
        TUTORIAL.clearStage();
        this.update();
    }

    private rewind(): void {
        --this.m_tutorialStep;
        TUTORIAL.clearStage();
        this.update();
    }

    private showBigDialog(body: string, imageUrl: string): void {
        this.hideBigDialog();
        GLOBAL.BlockerAdd();
        SOUNDS.Play("click1");
        this.m_bigPopup = new popup_mr2tutorial();
        this.m_bigPopup.tBody.htmlText = body;
        this.m_bigPopup.bAction.SetupKey("btn_continue");
        this.m_bigPopup.bAction.addEventListener(MouseEvent.CLICK, this.advance.bind(this), false, 0, true);
        this.m_bigPopup.bAction.Highlight = true;
        this.m_bigPopup.mcFrame.Setup(true, this.finish.bind(this));
        this.m_currImageUrl = imageUrl;
        ImageCache.GetImageWithCallBack(this.m_currImageUrl, this.imageLoaded.bind(this));
        GLOBAL._layerTop.addChild(this.m_bigPopup);
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
        GLOBAL.Message(message, KEYS.Get("btn_continue"), this.advance.bind(this));
    }

    public start(): void {
        if (!MapRoomManager.instance.isInMapRoom3 || this.m_tutorialStep >= MapRoom3Tutorial.k_STEP_FINISHED) {
            return;
        }
        this.m_started = true;
        this.update();
    }

    public finish(event: Event | null = null): void {
        this.clear();
        TUTORIAL._stage = 129;
        TUTORIAL.Advance();
    }

    public clear(): void {
        this.m_started = false;
        this.m_tutorialStep = MapRoom3Tutorial.k_STEP_FINISHED;
        this.m_tutorialId = MapRoom3Tutorial.k_ID_FINISHED;
        TUTORIAL._container = GLOBAL._layerMessages;
    }

    public continueFromAttack(): void {
        this.m_tutorialStep = MapRoom3Tutorial.k_STEP_COUNQURED;
        this.update();
    }

    private hideBigDialog(): void {
        if (this.m_bigPopup) {
            GLOBAL.BlockerRemove();
            GLOBAL._layerTop.removeChild(this.m_bigPopup);
            this.m_bigPopup = null;
        }
    }
}
