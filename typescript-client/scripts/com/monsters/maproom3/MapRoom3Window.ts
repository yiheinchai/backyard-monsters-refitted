import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import GlowFilter from "openfl/filters/GlowFilter";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import Timer from "openfl/utils/Timer";

import { TweenLite } from "../../../gs/TweenLite";
import { Quad } from "../../../gs/easing";
import { ArrowKeyState } from "../../cc/ui/ArrowKeyState";
import { MapRoom3Data } from "./data/MapRoom3Data";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3Cell } from "./MapRoom3Cell";
import { MapRoom3CellGraphic } from "./MapRoom3CellGraphic";
import { MapRoom3CellMouseover } from "./MapRoom3CellMouseover";
import { MapRoom3TileSetManager } from "./tiles/MapRoom3TileSetManager";
import { MapRoom3Tutorial } from "./MapRoom3Tutorial";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }



/**
 * MapRoom3Window - Map room 3 window with scrolling and cell display.
 */
export class MapRoom3Window extends Sprite {
    private static readonly RANGE_LAYER_ALPHA: number = 0.2;
    private static readonly RANGE_GLOW_BLUR_X: number = 50;
    private static readonly RANGE_GLOW_BLUR_Y: number = 50;
    private static readonly RANGE_GLOW_BLUR_STRENGTH: number = 2;
    private static readonly RANGE_GLOW_COLOUR: number = 0x339ACC;
    private static readonly MOUSEOVER_RANGE_GLOW_COLOUR: number = 0xFF0000;
    private static readonly KEY_SCROLL_START_VELOCITY: number = 8;
    private static readonly KEY_SCROLL_MAX_VELOCITY: number = 18;
    private static readonly KEY_SCROLL_ACCELERATION: number = 0.25;
    private static readonly k_MAX_FILTER_TOTAL_SIZE: number = 16777215;
    private static readonly k_MAX_FILTER_SIZE: number = 8191;

    private RANGE_GLOW_FILTER: GlowFilter = new GlowFilter(MapRoom3Window.RANGE_GLOW_COLOUR, 0.5, MapRoom3Window.RANGE_GLOW_BLUR_X, MapRoom3Window.RANGE_GLOW_BLUR_Y, MapRoom3Window.RANGE_GLOW_BLUR_STRENGTH, 1, true, true);
    private MOUSEOVER_RANGE_GLOW_FILTER: GlowFilter = new GlowFilter(MapRoom3Window.MOUSEOVER_RANGE_GLOW_COLOUR, 0.5, MapRoom3Window.RANGE_GLOW_BLUR_X, MapRoom3Window.RANGE_GLOW_BLUR_Y, MapRoom3Window.RANGE_GLOW_BLUR_STRENGTH, 1, true, true);

    private m_MapData: MapRoom3Data;
    private m_TileBuffer: Array<MapRoom3CellGraphic> = [];
    private m_TileLookup: Array<MapRoom3CellGraphic | null> = [];
    private m_BackgroundImage: BitmapData | null = null;
    private m_ScrollingCanvas: Sprite | null = null;
    private m_BaseLayer: Sprite | null = null;
    private m_RangeAlphaLayer: Sprite | null = null;
    private m_RangeLayer: Sprite | null = null;
    private m_RangeGlowLayer: Sprite | null = null;
    private m_MouseoverRangeAlphaLayer: Sprite | null = null;
    private m_MouseoverRangeLayer: Sprite | null = null;
    private m_MouseoverRangeGlowLayer: Sprite | null = null;
    private m_CellOverlayLayer: Sprite | null = null;
    private m_TileLayer: Sprite | null = null;
    private m_InfoLayer: Sprite | null = null;
    private m_MouseoverInfo: MapRoom3CellMouseover = new MapRoom3CellMouseover();
    private m_MousedoverCellGraphic: MapRoom3CellGraphic | null = null;
    private m_SelectedCellGraphic: MapRoom3CellGraphic | null = null;
    private m_CenterPoint: Point = new Point();
    private m_CenterPointForLoading: Point = new Point();
    private m_CenterPointForLoadingLocked: boolean = false;
    private m_TempStartDragPoint: Point | null = null;
    private m_StartDragPoint: Point | null = null;
    private m_StopDragPoint: Point | null = null;
    private m_DragTimer: Timer | null = null;
    private m_Dragging: boolean = false;
    private m_KeyScrollVelocity: number = 8;

    constructor(mapData: MapRoom3Data) {
        super();
        this.m_MapData = mapData;
        this.m_ScrollingCanvas = new Sprite();
        this.m_ScrollingCanvas.mouseEnabled = false;
        this.addChild(this.m_ScrollingCanvas);
        this.m_BaseLayer = new Sprite();
        this.m_BaseLayer.mouseEnabled = false;
        this.m_ScrollingCanvas.addChild(this.m_BaseLayer);
        this.m_RangeAlphaLayer = new Sprite();
        this.m_RangeAlphaLayer.mouseEnabled = false;
        this.m_RangeAlphaLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_RangeAlphaLayer);
        this.m_RangeLayer = new Sprite();
        this.m_RangeLayer.mouseEnabled = false;
        this.m_RangeLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_RangeLayer);
        this.m_RangeAlphaLayer.mask = this.m_RangeLayer;
        this.m_RangeGlowLayer = new Sprite();
        this.m_RangeGlowLayer.mouseEnabled = false;
        this.m_RangeGlowLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_RangeGlowLayer);
        this.m_RangeGlowLayer.filters = [this.RANGE_GLOW_FILTER];
        this.m_MouseoverRangeAlphaLayer = new Sprite();
        this.m_MouseoverRangeAlphaLayer.mouseEnabled = false;
        this.m_MouseoverRangeAlphaLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_MouseoverRangeAlphaLayer);
        this.m_MouseoverRangeLayer = new Sprite();
        this.m_MouseoverRangeLayer.mouseEnabled = false;
        this.m_MouseoverRangeLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_MouseoverRangeLayer);
        this.m_MouseoverRangeAlphaLayer.mask = this.m_MouseoverRangeLayer;
        this.m_MouseoverRangeGlowLayer = new Sprite();
        this.m_MouseoverRangeGlowLayer.mouseEnabled = false;
        this.m_MouseoverRangeGlowLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_MouseoverRangeGlowLayer);
        this.m_MouseoverRangeGlowLayer.filters = [this.MOUSEOVER_RANGE_GLOW_FILTER];
        this.m_CellOverlayLayer = new Sprite();
        this.m_CellOverlayLayer.mouseEnabled = false;
        this.m_ScrollingCanvas.addChild(this.m_CellOverlayLayer);
        this.m_TileLayer = new Sprite();
        this.m_TileLayer.mouseEnabled = false;
        this.m_ScrollingCanvas.addChild(this.m_TileLayer);
        this.m_InfoLayer = new Sprite();
        this.m_InfoLayer.mouseEnabled = false;
        this.m_InfoLayer.mouseChildren = false;
        this.m_ScrollingCanvas.addChild(this.m_InfoLayer);
        this.m_DragTimer = new Timer(100, 1);
        this.m_DragTimer.addEventListener(TimerEvent.TIMER_COMPLETE, this.OnDragTimerComplete.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.OnMouseDown.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.MOUSE_UP, this.OnMouseUp.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.OnMouseMoved.bind(this), false, 0, true);
        this.addEventListener(MouseEvent.CLICK, this.OnMouseClicked.bind(this), true, 0, true);
        this.m_MouseoverInfo.visible = false;
        this.addChild(this.m_MouseoverInfo);
        this.m_BackgroundImage = MapRoom3TileSetManager.instance.currentBackground;
        this.DrawBackground();
    }

    public get scrollingCanvas(): Sprite {
        return this.m_ScrollingCanvas!;
    }

    public get baseLayer(): Sprite {
        return this.m_BaseLayer!;
    }

    public get rangeAlphaLayer(): Sprite {
        return this.m_RangeAlphaLayer!;
    }

    public get rangeLayer(): Sprite {
        return this.m_RangeLayer!;
    }

    public get rangeGlowLayer(): Sprite {
        return this.m_RangeGlowLayer!;
    }

    public get mouseoverRangeAlphaLayer(): Sprite {
        return this.m_MouseoverRangeAlphaLayer!;
    }

    public get mouseoverRangeLayer(): Sprite {
        return this.m_MouseoverRangeLayer!;
    }

    public get mouseoverRangeGlowLayer(): Sprite {
        return this.m_MouseoverRangeGlowLayer!;
    }

    public get cellOverlayLayer(): Sprite {
        return this.m_CellOverlayLayer!;
    }

    public get infoLayer(): Sprite {
        return this.m_InfoLayer!;
    }

    public get centerPoint(): Point {
        return this.m_CenterPoint;
    }

    public get centerPointForLoading(): Point {
        return this.m_CenterPointForLoading;
    }

    public get mouseoverInfo(): MapRoom3CellMouseover {
        return this.m_MouseoverInfo;
    }

    public Init(point: Point | null): void {
        if (point !== null) {
            this.m_CenterPoint.x = point.x;
            this.m_CenterPoint.y = point.y;
        }
        this.CenterOn(this.m_CenterPoint);
    }

    public TickFast(): void {
        const len = this.m_TileBuffer.length;
        for (let i = 0; i < len; i++) {
            this.m_TileBuffer[i].TickFast();
        }
        this.KeyScroll();
    }

    private AdjustCenterPoint(): void {
        this.m_CenterPoint.x = Math.floor(-(this.m_ScrollingCanvas!.x - (getGLOBAL().StageX + getGLOBAL().StageWidth * 0.5) + (this.m_CenterPoint.y % 2 ? MapRoom3CellGraphic.HEX_WIDTH * 0.5 : 0)) / MapRoom3CellGraphic.HEX_WIDTH);
        this.m_CenterPoint.y = Math.floor(-(this.m_ScrollingCanvas!.y - (getGLOBAL().StageY + getGLOBAL().StageHeight * 0.5)) / MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP);
        this.m_CenterPoint.x /= this.m_ScrollingCanvas!.scaleX;
        this.m_CenterPoint.y /= this.m_ScrollingCanvas!.scaleY;
        if (!this.m_CenterPointForLoadingLocked) {
            this.m_CenterPointForLoading.x = this.m_CenterPoint.x;
            this.m_CenterPointForLoading.y = this.m_CenterPoint.y;
        }
    }

    private OnDragTimerComplete(event: TimerEvent): void {
        this.m_StartDragPoint = this.m_TempStartDragPoint!.clone();
    }

    private OnMouseDown(event: MouseEvent): void {
        this.m_StartDragPoint = null;
        this.m_TempStartDragPoint = new Point(event.stageX, event.stageY);
        this.m_DragTimer!.start();
        this.m_Dragging = true;
    }

    private OnMouseUp(event: MouseEvent): void {
        this.m_KeyScrollVelocity = MapRoom3Window.KEY_SCROLL_START_VELOCITY;
        this.m_Dragging = false;
        this.m_DragTimer!.stop();
        this.m_StopDragPoint = new Point(event.stageX, event.stageY);
        if (this.m_StartDragPoint !== null) {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        }
    }

    private OnMouseClicked(event: MouseEvent): void {
        let diffX = 0;
        let diffY = 0;
        if (this.m_StartDragPoint !== null) {
            diffX = Math.abs(this.m_StopDragPoint!.x - this.m_StartDragPoint.x);
            diffY = Math.abs(this.m_StopDragPoint!.y - this.m_StartDragPoint.y);
        }
        if (diffX > 1 || diffY > 1) {
            event.stopImmediatePropagation();
        }
    }

    private OnMouseMoved(event: MouseEvent): void {
        if (this.m_Dragging === false) {
            return;
        }
        if (event.buttonDown === false) {
            this.OnMouseUp(event);
            return;
        }
        if (!MapRoom3Tutorial.instance.allowScrolling) {
            return;
        }
        const dx = event.stageX - this.m_TempStartDragPoint!.x;
        const dy = event.stageY - this.m_TempStartDragPoint!.y;
        if (dx === 0 && dy === 0) {
            return;
        }
        this.SetMousedoverCellGraphic(null);
        this.SetSelectedCellGraphic(null);
        this.m_ScrollingCanvas!.x = this.AdjustHorizontalBounds(this.m_ScrollingCanvas!.x + dx);
        this.m_ScrollingCanvas!.y = this.AdjustVerticalBounds(this.m_ScrollingCanvas!.y + dy);
        this.m_TempStartDragPoint!.x += dx;
        this.m_TempStartDragPoint!.y += dy;
        this.UpdateMap();
        this.m_CenterPointForLoadingLocked = false;
    }

    private KeyScroll(): void {
        if (this.m_Dragging) {
            return;
        }
        if (ArrowKeyState.ArrowKeyPressed) {
            const dx = this.m_KeyScrollVelocity * ArrowKeyState.xDir;
            const dy = this.m_KeyScrollVelocity * ArrowKeyState.yDir;
            if (this.m_KeyScrollVelocity < MapRoom3Window.KEY_SCROLL_MAX_VELOCITY) {
                this.m_KeyScrollVelocity += MapRoom3Window.KEY_SCROLL_ACCELERATION;
            } else {
                this.m_KeyScrollVelocity = MapRoom3Window.KEY_SCROLL_MAX_VELOCITY;
            }
            this.SetMousedoverCellGraphic(null);
            this.SetSelectedCellGraphic(null);
            this.m_ScrollingCanvas!.x = this.AdjustHorizontalBounds(this.m_ScrollingCanvas!.x + dx);
            this.m_ScrollingCanvas!.y = this.AdjustVerticalBounds(this.m_ScrollingCanvas!.y + dy);
            this.UpdateMap();
        } else {
            this.m_KeyScrollVelocity = MapRoom3Window.KEY_SCROLL_START_VELOCITY;
        }
    }

    public Clear(): void {
        TweenLite.killTweensOf(this.m_ScrollingCanvas!, true);
        this.m_CenterPointForLoadingLocked = false;
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.OnMouseDown.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_UP, this.OnMouseUp.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.OnMouseMoved.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.OnMouseClicked.bind(this), true);
        this.m_DragTimer!.removeEventListener(TimerEvent.TIMER_COMPLETE, this.OnDragTimerComplete.bind(this));
        this.m_DragTimer = null;
        this.m_CenterPoint = null!;
        this.m_CenterPointForLoading = null!;
        this.m_TempStartDragPoint = null;
        this.m_StartDragPoint = null;
        this.m_StopDragPoint = null;
        this.m_MousedoverCellGraphic = null;
        this.m_SelectedCellGraphic = null;
        this.m_MouseoverInfo.Clear();
        this.removeChild(this.m_MouseoverInfo);
        this.m_MouseoverInfo = null!;
        for (const tile of this.m_TileBuffer) {
            tile.removeEventListener(MouseEvent.CLICK, this.OnCellGraphicClicked.bind(this));
            tile.removeEventListener(MouseEvent.ROLL_OVER, this.OnCellGraphicRollOver.bind(this));
            tile.removeEventListener(MouseEvent.ROLL_OUT, this.OnCellGraphicRollOut.bind(this));
            tile.Clear();
            this.m_TileLayer!.removeChild(tile);
        }
        this.m_TileBuffer.length = 0;
        this.m_TileLookup.length = 0;
        this.m_ScrollingCanvas!.removeChild(this.m_InfoLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_TileLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_CellOverlayLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_MouseoverRangeGlowLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_MouseoverRangeLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_MouseoverRangeAlphaLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_RangeGlowLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_RangeLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_RangeAlphaLayer!);
        this.m_ScrollingCanvas!.removeChild(this.m_BaseLayer!);
        this.removeChild(this.m_ScrollingCanvas!);
        this.m_BackgroundImage = null;
        this.m_ScrollingCanvas = null;
        this.m_BaseLayer = null;
        this.m_MouseoverRangeAlphaLayer = null;
        this.m_MouseoverRangeLayer = null;
        this.m_MouseoverRangeGlowLayer = null;
        this.m_RangeAlphaLayer = null;
        this.m_RangeLayer = null;
        this.m_RangeGlowLayer = null;
        this.m_CellOverlayLayer = null;
        this.m_TileLayer = null;
        this.m_InfoLayer = null;
        this.m_MapData = null!;
    }

    public NavigateToCell(cell: MapRoom3Cell | null): void {
        if (cell === null) {
            return;
        }
        const point = new Point(cell.cellX, cell.cellY);
        this.NavigateToIndex(point);
    }

    public NavigateToIndex(point: Point): void {
        this.m_CenterPointForLoading.x = point.x;
        this.m_CenterPointForLoading.y = point.y;
        this.m_CenterPointForLoadingLocked = true;
        TweenLite.killTweensOf(this.m_ScrollingCanvas!, true);
        const targetX = this.AdjustHorizontalBounds(this.m_ScrollingCanvas!.x - (point.x - this.m_CenterPoint.x) * (MapRoom3CellGraphic.HEX_WIDTH * this.m_ScrollingCanvas!.scaleX));
        const targetY = this.AdjustVerticalBounds(this.m_ScrollingCanvas!.y - (point.y - this.m_CenterPoint.y) * (MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * this.m_ScrollingCanvas!.scaleY));
        TweenLite.to(this.m_ScrollingCanvas!, 1, {
            "x": targetX,
            "y": targetY,
            "ease": Quad.easeInOut,
            "onUpdate": this.UpdateMap.bind(this),
            "onComplete": this.OnNavigationComplete.bind(this)
        });
        this.SetMousedoverCellGraphic(null);
        this.SetSelectedCellGraphic(null);
    }

    private OnNavigationComplete(): void {
        this.m_CenterPointForLoadingLocked = false;
    }

    private CenterOn(point: Point): void {
        this.m_ScrollingCanvas!.x = this.AdjustHorizontalBounds(-(this.m_CenterPoint.x * MapRoom3CellGraphic.HEX_WIDTH + (this.m_CenterPoint.y % 2 ? MapRoom3CellGraphic.HEX_WIDTH * 0.5 : 0)) + (getGLOBAL().StageX + getGLOBAL().StageWidth * 0.5) - MapRoom3CellGraphic.HEX_WIDTH * 0.5);
        this.m_ScrollingCanvas!.y = this.AdjustVerticalBounds(-this.m_CenterPoint.y * MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP + (getGLOBAL().StageY + getGLOBAL().StageHeight * 0.5) - MapRoom3CellGraphic.HEX_HEIGHT * 0.5);
        this.UpdateMap(true);
    }

    private GetBufferWidth(): number {
        return Math.floor(getGLOBAL().StageWidth / (MapRoom3CellGraphic.HEX_WIDTH * this.m_ScrollingCanvas!.scaleX)) + 5;
    }

    private GetBufferHeight(): number {
        return Math.floor(getGLOBAL().StageHeight / (MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * this.m_ScrollingCanvas!.scaleY)) + 4;
    }

    public Refresh(): void {
        let mouseoverCell: MapRoom3Cell | null = null;
        let selectedCell: MapRoom3Cell | null = null;
        if (this.m_MousedoverCellGraphic !== null) {
            mouseoverCell = this.m_MousedoverCellGraphic.cell;
            this.SetMousedoverCellGraphic(null);
        }
        if (this.m_SelectedCellGraphic !== null) {
            selectedCell = this.m_SelectedCellGraphic.cell;
            this.SetSelectedCellGraphic(null);
        }
        this.UpdateMap(true);
        if (selectedCell !== null) {
            this.SetSelectedCellGraphic(selectedCell.cellGraphic);
        } else if (mouseoverCell !== null) {
            this.SetMousedoverCellGraphic(mouseoverCell.cellGraphic);
        }
    }

    private UpdateMap(forceRedraw: boolean = false): void {
        this.AdjustCenterPoint();
        this.DrawBackground();
        this.DrawRangeAlphaLayer(this.m_RangeAlphaLayer!);
        this.DrawRangeAlphaLayer(this.m_MouseoverRangeAlphaLayer!);
        const bufferWidth = this.GetBufferWidth();
        const bufferHeight = this.GetBufferHeight();
        const bufferSize = bufferWidth * bufferHeight;
        const startX = this.m_CenterPoint.x - Math.floor(bufferWidth * 0.5);
        const startY = this.m_CenterPoint.y - Math.floor(bufferHeight * 0.5);
        const keepTiles: Array<MapRoom3CellGraphic> = [];
        const freeTiles: Array<MapRoom3CellGraphic> = [];
        for (const tile of this.m_TileBuffer) {
            const cell = tile.cell;
            const tileX = Math.floor(tile.x / MapRoom3CellGraphic.HEX_WIDTH) - startX;
            const tileY = Math.floor(tile.y / MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP) - startY;
            if (forceRedraw || tileX < 0 || tileY < 0 || tileX >= bufferWidth || tileY >= bufferHeight) {
                this.m_TileLayer!.removeChild(tile);
                freeTiles.push(tile);
                this.m_TileLookup[tile.cellIndex] = null;
                tile.x = 0;
                tile.y = 0;
            } else {
                keepTiles.push(tile);
            }
        }
        this.m_TileBuffer.length = 0;
        this.m_TileBuffer = keepTiles;
        for (let i = 0; i < bufferSize; i++) {
            const bufX = i % bufferWidth;
            const bufY = Math.floor(i / bufferWidth);
            let cellX = bufX + startX;
            let cellY = bufY + startY;
            let cell = this.m_MapData.GetMapRoom3Cell(cellX, cellY);
            const inRangeCells = cell.inAttackRangeOfCells;
            let rangeIndex = 0;
            while (cell !== null) {
                let cellIndex: number;
                if (cell.isBorder) {
                    cellIndex = (cellY + this.m_MapData.mapHeight) % this.m_MapData.mapHeight * this.m_MapData.mapWidth + (cellX + this.m_MapData.mapWidth) % this.m_MapData.mapWidth;
                } else {
                    cellIndex = cell.cellY * this.m_MapData.mapWidth + cell.cellX;
                }
                if (this.m_TileLookup[cellIndex] === null || this.m_TileLookup[cellIndex] === undefined) {
                    let tile: MapRoom3CellGraphic;
                    if (freeTiles.length > 0) {
                        tile = freeTiles.pop()!;
                    } else {
                        tile = new MapRoom3CellGraphic();
                        tile.addEventListener(MouseEvent.CLICK, this.OnCellGraphicClicked.bind(this));
                        tile.addEventListener(MouseEvent.ROLL_OVER, this.OnCellGraphicRollOver.bind(this));
                        tile.addEventListener(MouseEvent.ROLL_OUT, this.OnCellGraphicRollOut.bind(this));
                    }
                    this.m_TileBuffer.push(tile);
                    tile.cellIndex = cellIndex;
                    this.m_TileLookup[cellIndex] = tile;
                    tile.x = cellX * MapRoom3CellGraphic.HEX_WIDTH + (cellY % 2 ? MapRoom3CellGraphic.HEX_WIDTH * 0.5 : 0);
                    tile.y = cellY * MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP;
                    tile.setMapCell(cell);
                    // Binary search for insertion position
                    let low = 0;
                    let high = this.m_TileLayer!.numChildren;
                    while (low < high) {
                        const mid = Math.floor((low + high) * 0.5);
                        const compareX = tile.x - this.m_TileLayer!.getChildAt(mid).x;
                        const compareY = tile.y - this.m_TileLayer!.getChildAt(mid).y;
                        if (compareY < 0 || (compareY === 0 && compareX <= 0)) {
                            high = mid;
                        } else {
                            low = mid + 1;
                        }
                    }
                    this.m_TileLayer!.addChildAt(tile, low);
                }
                cell = null!;
                if (inRangeCells !== null && rangeIndex < inRangeCells.length) {
                    cell = inRangeCells[rangeIndex++];
                    cellX = cell.cellX;
                    cellY = cell.cellY;
                }
            }
        }
        for (const tile of freeTiles) {
            tile.removeEventListener(MouseEvent.CLICK, this.OnCellGraphicClicked.bind(this));
            tile.removeEventListener(MouseEvent.ROLL_OVER, this.OnCellGraphicRollOver.bind(this));
            tile.removeEventListener(MouseEvent.ROLL_OUT, this.OnCellGraphicRollOut.bind(this));
            tile.Clear();
        }
        freeTiles.length = 0;
        this.m_RangeGlowLayer!.visible = true;
        if (this.m_RangeGlowLayer!.height >= MapRoom3Window.k_MAX_FILTER_SIZE || this.m_RangeGlowLayer!.width >= MapRoom3Window.k_MAX_FILTER_SIZE || this.m_RangeGlowLayer!.width * this.m_RangeGlowLayer!.height >= MapRoom3Window.k_MAX_FILTER_TOTAL_SIZE) {
            this.m_RangeGlowLayer!.visible = false;
        }
    }

    private OnCellGraphicClicked(event: MouseEvent): void {
        const tile = event.currentTarget as MapRoom3CellGraphic;
        if (tile === null) {
            return;
        }
        if (!MapRoom3Tutorial.instance.isClickableCell(tile.cell)) {
            return;
        }
        this.SetSelectedCellGraphic(tile);
    }

    private OnCellGraphicRollOver(event: MouseEvent): void {
        const tile = event.currentTarget as MapRoom3CellGraphic;
        if (tile === null) {
            return;
        }
        if (tile === this.m_SelectedCellGraphic) {
            return;
        }
        if (this.m_SelectedCellGraphic !== null && tile.cell === this.m_SelectedCellGraphic.cell) {
            return;
        }
        this.SetSelectedCellGraphic(null);
        this.SetMousedoverCellGraphic(tile);
        MapRoom3.mapRoom3WindowHUD.DisplayCoordinatesOfCell(tile.cell);
    }

    private OnCellGraphicRollOut(event: MouseEvent): void {
        const tile = event.currentTarget as MapRoom3CellGraphic;
        if (tile === null) {
            return;
        }
        if (tile !== this.m_MousedoverCellGraphic) {
            return;
        }
        if (tile === this.m_SelectedCellGraphic) {
            return;
        }
        if (this.m_SelectedCellGraphic !== null && tile.cell === this.m_SelectedCellGraphic.cell) {
            return;
        }
        this.SetSelectedCellGraphic(null);
        this.SetMousedoverCellGraphic(null);
    }

    private SetMousedoverCellGraphic(tile: MapRoom3CellGraphic | null): void {
        if (this.m_MousedoverCellGraphic === tile) {
            return;
        }
        if (this.m_MousedoverCellGraphic !== null) {
            this.m_MouseoverInfo.Hide();
            this.m_MousedoverCellGraphic.mousedover = false;
            this.m_MousedoverCellGraphic = null;
        }
        if (tile !== null && tile.cell !== null && tile.cell.DoesContainDisplayableBase()) {
            this.m_MousedoverCellGraphic = tile;
            this.m_MousedoverCellGraphic.mousedover = true;
            if (tile.cell.DoesContainDisplayableBase()) {
                const posX = this.m_ScrollingCanvas!.x + this.m_MousedoverCellGraphic.x * this.m_ScrollingCanvas!.scaleX + MapRoom3CellGraphic.HEX_WIDTH * this.m_ScrollingCanvas!.scaleX * 0.5;
                const posY = this.m_ScrollingCanvas!.y + this.m_MousedoverCellGraphic.y * this.m_ScrollingCanvas!.scaleY + MapRoom3CellGraphic.HEX_HEIGHT * this.m_ScrollingCanvas!.scaleY * 0.5;
                this.m_MouseoverInfo.Show(this.m_MousedoverCellGraphic.cell, posX, posY, false);
            }
        }
    }

    private SetSelectedCellGraphic(tile: MapRoom3CellGraphic | null): void {
        if (this.m_SelectedCellGraphic === tile) {
            return;
        }
        if (this.m_SelectedCellGraphic !== null) {
            this.m_MouseoverInfo.Hide();
            this.m_SelectedCellGraphic.selected = false;
            this.m_SelectedCellGraphic = null;
        }
        if (tile !== null && tile.cell !== null && tile.cell.DoesContainDisplayableBase()) {
            this.m_SelectedCellGraphic = tile;
            this.m_SelectedCellGraphic.selected = true;
            const posX = this.m_ScrollingCanvas!.x + this.m_SelectedCellGraphic.x * this.m_ScrollingCanvas!.scaleX + MapRoom3CellGraphic.HEX_WIDTH * this.m_ScrollingCanvas!.scaleX * 0.5;
            const posY = this.m_ScrollingCanvas!.y + this.m_SelectedCellGraphic.y * this.m_ScrollingCanvas!.scaleY + MapRoom3CellGraphic.HEX_HEIGHT * this.m_ScrollingCanvas!.scaleY * 0.5;
            this.m_MouseoverInfo.Show(this.m_SelectedCellGraphic.cell, posX, posY, true);
        }
    }

    IsZoomedOut(): boolean {
        return this.m_ScrollingCanvas!.scaleX < 1;
    }

    Zoom(scale: number, duration: number = 0): void {
        if (this.m_ScrollingCanvas!.scaleX === scale) {
            return;
        }
        if (duration !== 0) {
            TweenLite.to(this.m_ScrollingCanvas!, duration, {
                "scaleX": scale,
                "ease": Quad.easeInOut,
                "onUpdate": this.OnZoomUpdate.bind(this)
            });
        } else {
            this.m_ScrollingCanvas!.scaleX = scale;
            this.OnZoomUpdate();
        }
    }

    private OnZoomUpdate(): void {
        const ratio = this.m_ScrollingCanvas!.scaleX / this.m_ScrollingCanvas!.scaleY;
        const centerX = getGLOBAL().StageX + getGLOBAL().StageWidth * 0.5;
        const centerY = getGLOBAL().StageY + getGLOBAL().StageHeight * 0.5;
        this.m_ScrollingCanvas!.x -= centerX;
        this.m_ScrollingCanvas!.y -= centerY;
        this.m_ScrollingCanvas!.scaleY = this.m_ScrollingCanvas!.scaleX;
        this.m_ScrollingCanvas!.x *= ratio;
        this.m_ScrollingCanvas!.y *= ratio;
        this.m_ScrollingCanvas!.x += centerX;
        this.m_ScrollingCanvas!.y += centerY;
        this.RANGE_GLOW_FILTER.blurX = MapRoom3Window.RANGE_GLOW_BLUR_X * this.m_ScrollingCanvas!.scaleX;
        this.RANGE_GLOW_FILTER.blurY = MapRoom3Window.RANGE_GLOW_BLUR_Y * this.m_ScrollingCanvas!.scaleY;
        this.m_RangeGlowLayer!.filters = [this.RANGE_GLOW_FILTER];
        this.MOUSEOVER_RANGE_GLOW_FILTER.blurX = MapRoom3Window.RANGE_GLOW_BLUR_X * this.m_ScrollingCanvas!.scaleX;
        this.MOUSEOVER_RANGE_GLOW_FILTER.blurY = MapRoom3Window.RANGE_GLOW_BLUR_Y * this.m_ScrollingCanvas!.scaleY;
        this.m_MouseoverRangeGlowLayer!.filters = [this.MOUSEOVER_RANGE_GLOW_FILTER];
        this.Resize();
    }

    public Resize(): void {
        this.m_ScrollingCanvas!.x = this.AdjustHorizontalBounds(this.m_ScrollingCanvas!.x);
        this.m_ScrollingCanvas!.y = this.AdjustVerticalBounds(this.m_ScrollingCanvas!.y);
        this.AdjustCenterPoint();
        this.SetMousedoverCellGraphic(null);
        this.SetSelectedCellGraphic(null);
        this.UpdateMap(true);
    }

    private AdjustHorizontalBounds(posX: number): number {
        const cellWidth = MapRoom3CellGraphic.HEX_WIDTH * this.m_ScrollingCanvas!.scaleX;
        const maxX = getGLOBAL().StageX + cellWidth * 1.5;
        const minX = getGLOBAL().StageX + getGLOBAL().StageWidth - this.m_MapData.mapWidth * cellWidth - cellWidth * 2;
        if (posX > maxX) {
            posX = maxX;
        }
        if (posX < minX) {
            posX = minX;
        }
        return posX;
    }

    private AdjustVerticalBounds(posY: number): number {
        const cellHeight = MapRoom3CellGraphic.HEX_HEIGHT * this.m_ScrollingCanvas!.scaleY;
        const cellHeightOverlap = MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * this.m_ScrollingCanvas!.scaleY;
        const maxY = getGLOBAL().StageY + cellHeight * 2;
        const minY = getGLOBAL().StageY + getGLOBAL().StageHeight - this.m_MapData.mapHeight * cellHeightOverlap - cellHeight * 3 + cellHeightOverlap;
        if (posY > maxY) {
            posY = maxY;
        }
        if (posY < minY) {
            posY = minY;
        }
        return posY;
    }

    private DrawBackground(): void {
        if (this.m_BackgroundImage === null) {
            return;
        }
        const matrix = new Matrix();
        matrix.translate(this.m_ScrollingCanvas!.x / this.m_ScrollingCanvas!.scaleX % this.m_BackgroundImage.width, this.m_ScrollingCanvas!.y / this.m_ScrollingCanvas!.scaleY % this.m_BackgroundImage.height);
        matrix.scale(this.m_ScrollingCanvas!.scaleX, this.m_ScrollingCanvas!.scaleY);
        this.graphics.clear();
        this.graphics.beginBitmapFill(this.m_BackgroundImage, matrix, true);
        this.graphics.drawRect(getGLOBAL().StageX, getGLOBAL().StageY, getGLOBAL().StageWidth, getGLOBAL().StageHeight);
        this.graphics.endFill();
    }

    private DrawRangeAlphaLayer(layer: Sprite): void {
        layer.graphics.clear();
        layer.graphics.beginFill(0xFFFFFF, MapRoom3Window.RANGE_LAYER_ALPHA);
        layer.graphics.drawRect((getGLOBAL().StageX - this.m_ScrollingCanvas!.x) / this.m_ScrollingCanvas!.scaleX, (getGLOBAL().StageY - this.m_ScrollingCanvas!.y) / this.m_ScrollingCanvas!.scaleY, getGLOBAL().StageWidth / this.m_ScrollingCanvas!.scaleX, getGLOBAL().StageHeight / this.m_ScrollingCanvas!.scaleY);
        layer.graphics.endFill();
    }
}
