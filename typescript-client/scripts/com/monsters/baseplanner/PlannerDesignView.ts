import { MovieClip } from "openfl/display/MovieClip";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { BuildingItem } from "./components/BuildingItem";
import { DashedLine } from "./components/DashedLine";
import { HitTestBitmap } from "./components/HitTestBitmap";
import { BasePlannerNodeEvent } from "./events/BasePlannerNodeEvent";
import { BasePlannerPopup } from "./popups/BasePlannerPopup";
import { BasePlannerPopup_xSpot } from "./popups/BasePlannerPopup_xSpot";
import { PlannerNode } from "./PlannerNode";

import { BASE } from "../../../BASE";
import { Checkbox } from "../../../Checkbox";
import { GAME } from "../../../GAME";
import { GLOBAL } from "../../../GLOBAL";
import { STORE } from "../../../STORE";

/**
 * PlannerDesignView - Base planner design view for building layout.
 */
export class PlannerDesignView extends Sprite {
    public static zoomValue: number = 0.5;
    public static readonly CHECKBOX_GROUND: number = 0;
    public static readonly CHECKBOX_AIR: number = 1;
    public static readonly CHECKBOX_TRAP: number = 2;
    private static readonly SIDEBAR_WIDTH: number = 140;
    private static readonly BOTTOMBAR_HEIGHT: number = 50;
    private static readonly SCROLL_ACTIVATION_PIXEL_THRESHOLD: number = 20;
    public static SHOULD_SHOW_MOREINFO: boolean = true;
    public static SHOULD_SHOW_FORTIFICATION: boolean = false;
    public static readonly BUILDING_CLICK: string = "building_clicked";
    public static readonly BUILDING_OVER: string = "building_over";
    public static readonly BUILDING_OUT: string = "building_out";
    public static readonly BUILDING_PLACED: string = "building_placed";
    public static readonly CANVAS_CLICK: string = "view_clicked";
    public static readonly STATE_CHANGE: string = "design_statechange";
    private static readonly ADD_INVENTORY_PAINTMODE: boolean = true;
    public static readonly TOOL_SELECTMOVE: string = "selectmove";
    public static readonly TOOL_STORE: string = "storebuilding";
    public static readonly MOUSE_POSITION_SNAP_THRESHHOLD: number = 5;

    private _canvas: Sprite | null = null;
    private _layerSelectBuildings: Sprite | null = null;
    private _layerSelectRanges: Sprite | null = null;
    private _layerShroud: Sprite | null = null;
    private _layerSetBuildings: Sprite | null = null;
    private _layerSetRanges: Sprite | null = null;
    private _layerGround: Sprite | null = null;
    private displayData: Array<PlannerNode>;
    private displayInventory: Array<BuildingItem> = [];
    private fontSize: Point;
    public xSpot: MovieClip | null = null;
    public readonly zoomMax: number = 2;
    public readonly zoomMin: number = 0.25;
    public readonly zoomStep: number = 0.25;
    private rangeCheckboxesFlags: number = 0;
    private _isAddingBuilding: boolean = false;
    public _dragging: boolean = false;
    public _dragged: boolean = false;
    private _dragOffset: Point | null = null;
    public _dragPoint: Point | null = null;
    public _windowRect: Rectangle;
    private readonly GRASSCOLOR: number = 0x66A233;
    private readonly BOUNDS_LINE_COLOR: number = 0xFFFFFF;
    private readonly BOUNDS_DASHEDLINE_COLOR: number = 0xEEEEEE;
    private readonly BOUNDS_LINE_WEIGHT: number = 2;
    private readonly MAX_YARD_DIMENSIONS: Point = new Point(3240, 2600);
    private readonly YARD_EXPANSIONS: Array<Point> = [
        new Point(1000, 800), new Point(1100, 880), new Point(1220, 980),
        new Point(1340, 1080), new Point(1480, 1180), new Point(1620, 1300),
        new Point(1780, 1420)
    ];
    public currentTool: string = "selectmove";
    public toolTarget: any = null;
    public _selectMoveDragging: boolean = false;
    public _selectMoveTarget: BuildingItem | null = null;
    public _selectMoveInventoryBuilding: boolean = false;
    public _selectMoveDragPoint: Point | null = null;

    constructor(data: Array<PlannerNode>) {
        super();
        this.fontSize = new Point(14, 12);
        this._windowRect = new Rectangle(35, 65, 565, 425);
        this.displayData = data;
    }

    public setup(): void {
        this.clearAllLayers();
        if (this._canvas) {
            this.clearLayer(this._canvas);
        }
        this._canvas = new Sprite();
        this.addChild(this._canvas);
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.canvasDragStart.bind(this));
        this.addEventListener(MouseEvent.CLICK, this.onCanvasClick.bind(this));
        this._canvas.addChild(this._layerGround!);
        this._canvas.addChild(this._layerSetBuildings!);
        this._canvas.addChild(this._layerSetRanges!);
        this._canvas.addChild(this._layerShroud!);
        this._canvas.addChild(this._layerSelectRanges!);
        this._canvas.addChild(this._layerSelectBuildings!);
        this.setZoom(PlannerDesignView.zoomValue);
        this.centerView();
        this.displayInventory = [];
        this.fillGrass(this._layerGround!);
        this.drawYardBounds();
        this.populateBuildingItems(this.displayData);
        this.drawRanges();
        this.recenter();
    }

    public centerView(): void {
        this._canvas!.x = 260;
        this._canvas!.y = 290;
    }

    public populateBuildingItems(nodes: Array<PlannerNode>): void {
        for (let i = 0; i < nodes.length; i++) {
            const item = new BuildingItem(nodes[i]);
            item.addEventListener(PlannerDesignView.BUILDING_CLICK, this.onBuildingClick.bind(this));
            item.addEventListener(PlannerDesignView.BUILDING_OVER, this.onBuildingOver.bind(this));
            item.addEventListener(PlannerDesignView.BUILDING_OUT, this.onBuildingOut.bind(this));
            this._layerSetBuildings!.addChild(item);
            this.displayInventory.push(item);
        }
    }

    private drawYardBounds(): void {
        let expansionLevel = 1;
        if (STORE._storeData.ENL) {
            expansionLevel = STORE._storeData.ENL.q + 1;
        }
        let currentExpansion = 0;
        if (STORE._storeData.ENL) {
            currentExpansion = STORE._storeData.ENL.q;
        }
        const currentSize = this.YARD_EXPANSIONS[currentExpansion];
        const nextSize = this.YARD_EXPANSIONS[Math.min(currentExpansion + 1, this.YARD_EXPANSIONS.length - 1)];
        const currentRect = new Rectangle(-currentSize.x / 2, -currentSize.y / 2, currentSize.x, currentSize.y);
        let nextRect: Rectangle | null = null;
        if (Math.min(currentExpansion + 1, this.YARD_EXPANSIONS.length - 1) > currentExpansion) {
            nextRect = new Rectangle(-nextSize.x / 2, -nextSize.y / 2, nextSize.x, nextSize.y);
        }
        if (Boolean(nextRect) && !BASE.isOutpost) {
            const nextBg = new Sprite();
            nextBg.graphics.beginFill(0xFFFFFF, 0.25);
            nextBg.graphics.drawRect(nextRect!.x, nextRect!.y, nextRect!.width, nextRect!.height);
            nextBg.graphics.endFill();
            this._layerGround!.addChild(nextBg);
            const dashedLine = new DashedLine(this.BOUNDS_LINE_WEIGHT, this.BOUNDS_DASHEDLINE_COLOR, [8, 4, 2, 4]);
            dashedLine.moveTo(nextRect!.x, nextRect!.y);
            dashedLine.lineTo(nextRect!.x + nextRect!.width, nextRect!.y);
            dashedLine.lineTo(nextRect!.x + nextRect!.width, nextRect!.y + nextRect!.height);
            dashedLine.lineTo(nextRect!.x, nextRect!.y + nextRect!.height);
            dashedLine.lineTo(nextRect!.x, nextRect!.y);
            this._layerGround!.addChild(dashedLine);
        }
        const currentBg = new Sprite();
        currentBg.graphics.lineStyle(this.BOUNDS_LINE_WEIGHT, this.BOUNDS_LINE_COLOR, 1);
        currentBg.graphics.beginFill(0xFFFFFF, 0.25);
        currentBg.graphics.drawRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
        currentBg.graphics.endFill();
        this._layerGround!.addChild(currentBg);
    }

    public setZoom(zoom: number): void {
        if (zoom > 0 && zoom < 10) {
            PlannerDesignView.zoomValue = zoom;
            this._canvas!.scaleX = this._canvas!.scaleY = PlannerDesignView.zoomValue;
            this.dealWithZoomReposition();
        }
    }

    private dealWithZoomReposition(): void {
        this._dragOffset = new Point(this._canvas!.x - this.mouseX, this._canvas!.y - this.mouseY);
        this.checkDragBounds();
    }

    public fillGrass(layer: Sprite): void {
        const grass = new Sprite();
        grass.graphics.beginFill(this.GRASSCOLOR, 1);
        grass.graphics.drawRect(0, 0, this.MAX_YARD_DIMENSIONS.x, this.MAX_YARD_DIMENSIONS.y);
        grass.graphics.endFill();
        grass.x = -(grass.width / 2);
        grass.y = -(grass.height / 2);
        this.xSpot = new BasePlannerPopup_xSpot();
        this.xSpot.x = grass.width / 2;
        this.xSpot.y = grass.height / 2;
        this.xSpot.rotation = 45;
        grass.addChild(this.xSpot);
        layer.addChild(grass);
    }

    public onCanvasClick(event: MouseEvent | null = null): void {
        if (this.currentTool === PlannerDesignView.TOOL_SELECTMOVE) {
            if (this._selectMoveDragging) {
                // Handle click during drag
            }
        }
    }

    public canvasDragStart(event: MouseEvent | null = null): void {
        this._dragging = true;
        this._dragged = false;
        this._dragOffset = new Point(this._canvas!.x - this.mouseX, this._canvas!.y - this.mouseY);
        this._dragPoint = new Point(this._canvas!.x, this._canvas!.y);
        GAME._instance.addEventListener(MouseEvent.MOUSE_MOVE, this.canvasDrag.bind(this));
        GAME._instance.addEventListener(MouseEvent.MOUSE_UP, this.canvasDragStop.bind(this));
        GAME._instance.addEventListener(MouseEvent.ROLL_OUT, this.canvasDragStop.bind(this));
    }

    public canvasDragStop(event: MouseEvent | null = null): void {
        this._dragging = false;
        GAME._instance.removeEventListener(MouseEvent.MOUSE_MOVE, this.canvasDrag.bind(this));
        GAME._instance.removeEventListener(MouseEvent.MOUSE_UP, this.canvasDragStop.bind(this));
        GAME._instance.removeEventListener(MouseEvent.ROLL_OUT, this.canvasDragStop.bind(this));
    }

    public canvasDrag(event: Event | null = null): void {
        if (this._dragged) {
            this.checkDragBounds();
            return;
        }
        const diffX = this._canvas!.x - (this.mouseX + this._dragOffset!.x);
        const diffY = this._canvas!.y - (this.mouseY + this._dragOffset!.y);
        if (Math.abs(diffX) > PlannerDesignView.SCROLL_ACTIVATION_PIXEL_THRESHOLD || Math.abs(diffY) > PlannerDesignView.SCROLL_ACTIVATION_PIXEL_THRESHOLD) {
            this._dragOffset!.x += diffX;
            this._dragOffset!.y += diffY;
            this.checkDragBounds();
        }
    }

    private checkDragBounds(): void {
        let posX = this.mouseX + this._dragOffset!.x;
        if (posX > this._canvas!.width / 2) {
            posX = this._canvas!.width / 2;
        } else if (posX < GLOBAL._SCREEN.width - this._canvas!.width / 2 - PlannerDesignView.SIDEBAR_WIDTH) {
            posX = GLOBAL._SCREEN.width - this._canvas!.width / 2 - PlannerDesignView.SIDEBAR_WIDTH;
        }
        if (this._canvas!.width < GLOBAL._SCREEN.width) {
            posX = GLOBAL._SCREEN.width / 2 - PlannerDesignView.SIDEBAR_WIDTH;
        }
        this._canvas!.x = posX;
        let posY = this.mouseY + this._dragOffset!.y;
        if (posY > this._canvas!.height / 2) {
            posY = this._canvas!.height / 2;
        } else if (posY < GLOBAL._SCREEN.height - this._canvas!.height / 2 - PlannerDesignView.BOTTOMBAR_HEIGHT) {
            posY = GLOBAL._SCREEN.height - this._canvas!.height / 2 - PlannerDesignView.BOTTOMBAR_HEIGHT;
        }
        if (this._canvas!.height < GLOBAL._SCREEN.height) {
            posY = GLOBAL._SCREEN.height / 2 - PlannerDesignView.BOTTOMBAR_HEIGHT;
        }
        this._canvas!.y = posY;
        this._dragged = true;
    }

    public recenter(): void {
        this._canvas!.x = GLOBAL._SCREEN.width / 2 - PlannerDesignView.SIDEBAR_WIDTH;
        this._canvas!.y = GLOBAL._SCREEN.height / 2 - PlannerDesignView.BOTTOMBAR_HEIGHT;
    }

    public addInventoryItem(node: PlannerNode): void {
        if (!this._isAddingBuilding) {
            this._isAddingBuilding = true;
            const item = new BuildingItem(node);
            item.addEventListener(PlannerDesignView.BUILDING_CLICK, this.onBuildingClick.bind(this));
            item.addEventListener(PlannerDesignView.BUILDING_OVER, this.onBuildingOver.bind(this));
            item.addEventListener(PlannerDesignView.BUILDING_OUT, this.onBuildingOut.bind(this));
            item.x = 0;
            item.y = 0;
            let dragPoint = new Point(0, 0);
            if (this._dragPoint) {
                dragPoint = this._dragPoint;
            }
            item.x = -(item.mc.width / 2);
            item.y = -(item.mc.height / 2);
            item.x += Math.floor((this.mouseX - this._canvas!.x) / this._canvas!.scaleX);
            item.y += Math.floor((this.mouseY - this._canvas!.y) / this._canvas!.scaleY);
            this._layerSetBuildings!.addChild(item);
            this.displayInventory.push(item);
            this.addMode(item);
        } else {
            const sameType = node.type === this._selectMoveTarget!.node.type;
            if (this._selectMoveDragging) {
                this.cancelAddInventory(this._selectMoveTarget!);
                if (!sameType) {
                    this.addInventoryItem(node);
                }
            }
        }
    }

    public cancelAddInventory(item: BuildingItem): void {
        this._selectMoveDragging = false;
        this._isAddingBuilding = false;
        this._selectMoveInventoryBuilding = false;
        this.currentTool = PlannerDesignView.TOOL_SELECTMOVE;
        this.removeBuildingItem(item);
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.DESIGN_BUILDING_INVALID, item.node));
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragBuildingTick.bind(this));
    }

    public addMode(item: BuildingItem): void {
        this.currentTool = PlannerDesignView.TOOL_SELECTMOVE;
        this.toolTarget = item;
        this.dragBuilding(item, true);
    }

    public setTool(tool: string): void {
        if (this.currentTool === tool) {
            return;
        }
        this.currentTool = tool;
        this.dispatchEvent(new Event(BasePlannerPopup.DESIGN_TOOL_UPDATE));
        if (tool) {
            this.removeSelection();
        }
    }

    public removeSelection(): void {
        if (this._selectMoveTarget) {
            this.cancelDragBuilding(this._selectMoveTarget);
        }
    }

    public onBuildingClick(event: BasePlannerNodeEvent): void {
        this.toolTarget = event.target;
        if (!(event.target instanceof BuildingItem)) {
            return;
        }
        const item = event.target as BuildingItem;
        if (item.props.type === "enemy") {
            return;
        }
        if (this.currentTool === PlannerDesignView.TOOL_SELECTMOVE || this._selectMoveDragging) {
            this.dragBuilding(item);
        } else if (this.currentTool === PlannerDesignView.TOOL_STORE) {
            this.storeBuilding(item);
            this.redrawRanges();
        }
    }

    public onBuildingOver(event: BasePlannerNodeEvent): void {
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.PLANNER_HINT, event.node));
    }

    public onBuildingOut(event: BasePlannerNodeEvent): void {
        if (!this._selectMoveDragging) {
            this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.PLANNER_HINT_HIDE, event.node));
        }
    }

    public storeBuilding(item: BuildingItem): void {
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.DESIGN_BUILDING_STORE, item.node));
        this.dispatchEvent(new Event(PlannerDesignView.STATE_CHANGE));
        this.removeBuildingItem(item);
    }

    public spliceDisplayData(node: PlannerNode): void {
        const index = this.displayData.indexOf(node);
        if (index >= 0) {
            this.displayData.splice(index, 1);
        }
    }

    public removeBuildingItem(item: BuildingItem): void {
        for (let i = 0; i < this.displayInventory.length; i++) {
            if (item === this.displayInventory[i]) {
                this.displayInventory[i].parent.removeChild(this.displayInventory[i]);
                this.displayInventory.splice(i, 1);
                return;
            }
        }
    }

    public dragBuilding(item: BuildingItem, isInventory: boolean = false): void {
        this._selectMoveTarget = item;
        if (isInventory) {
            this._selectMoveInventoryBuilding = true;
            if (this.currentTool) {
                this.setTool("");
            }
        }
        if (!this._selectMoveDragging) {
            this.startDragBuilding(item);
        } else {
            this.stopDragBuilding(item);
        }
    }

    public startDragBuilding(item: BuildingItem): void {
        if (this._selectMoveDragging) {
            return;
        }
        this._selectMoveDragging = true;
        this.sortBuildingOrder(item, "front");
        item.setPositionReference();
        const useCursor = false;
        if (useCursor) {
            this._selectMoveDragPoint = new Point(item.x - (this.mouseX - this._canvas!.x) / this._canvas!.scaleX, item.y - (this.mouseY - this._canvas!.y) / this._canvas!.scaleY);
        } else {
            this._selectMoveDragPoint = new Point(0 - item.widthsize / 2 * item.scale, 0 - item.widthsize / 2 * item.scale);
        }
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.dragBuildingTick.bind(this));
    }

    public stepDragBuilding(item: BuildingItem): void {
    }

    public dragBuildingTick(event: Event): void {
        this._selectMoveTarget!.toggleInvalid(!this.validateBuilding(this._selectMoveTarget!));
        this._selectMoveTarget!.x = Math.floor(((this.mouseX - this._canvas!.x) / this._canvas!.scaleX + this._selectMoveDragPoint!.x) / PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD) * PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD;
        this._selectMoveTarget!.y = Math.floor(((this.mouseY - this._canvas!.y) / this._canvas!.scaleY + this._selectMoveDragPoint!.y) / PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD) * PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD;
        this.redrawRanges();
    }

    public stopDragBuilding(item: BuildingItem, forceCancel: boolean = false): void {
        this._selectMoveDragging = false;
        this._isAddingBuilding = false;
        if (this.validateBuilding(item)) {
            item.toggleInvalid(false);
            item.setPositionReference();
            this.updateNodeReference(item);
            if (this._selectMoveInventoryBuilding) {
                this.displayData.push(item.node);
                this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.DESIGN_BUILDING_PLACE, item.node));
            }
            this.dispatchEvent(new Event(PlannerDesignView.STATE_CHANGE));
        } else {
            if (this._selectMoveInventoryBuilding) {
                if (PlannerDesignView.ADD_INVENTORY_PAINTMODE && !forceCancel) {
                    this._selectMoveDragging = true;
                    this._isAddingBuilding = true;
                    return;
                }
                this.removeBuildingItem(item);
                this.dispatchEvent(new Event(BasePlannerPopup.DESIGN_CLEAR_EXPLORER));
            }
            item.resetPositionReference();
            this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.DESIGN_BUILDING_INVALID, item.node));
        }
        if (!this._selectMoveDragging) {
            this.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragBuildingTick.bind(this));
            item.toggleInvalid(false);
            this._selectMoveInventoryBuilding = false;
            this.setTool(PlannerDesignView.TOOL_SELECTMOVE);
        }
    }

    public cancelDragBuilding(item: BuildingItem): void {
        this._selectMoveDragging = false;
        this._isAddingBuilding = false;
        if (this._selectMoveInventoryBuilding) {
            this.removeBuildingItem(item);
            this.dispatchEvent(new Event(BasePlannerPopup.DESIGN_CLEAR_EXPLORER));
        }
        item.resetPositionReference();
        this.dispatchEvent(new BasePlannerNodeEvent(BasePlannerPopup.DESIGN_BUILDING_INVALID, item.node));
        if (!this._selectMoveDragging) {
            this.removeEventListener(MouseEvent.MOUSE_MOVE, this.dragBuildingTick.bind(this));
            item.toggleInvalid(false);
            this._selectMoveInventoryBuilding = false;
            this._selectMoveTarget = null;
        }
    }

    public updateNodeReference(item: BuildingItem): void {
        for (let i = 0; i < this.displayData.length; i++) {
            if (this.displayData[i] === item.node) {
                this.displayData[i].x = item.node.x;
                this.displayData[i].y = item.node.y;
                return;
            }
        }
    }

    public sortBuildingOrder(item: BuildingItem, order: string = "front"): void {
        const parent = item.parent as Sprite;
        if (!parent) {
            return;
        }
        switch (order) {
            case "back":
            case "bottom":
                parent.setChildIndex(item, 0);
                break;
            case "front":
            case "top":
            default:
                parent.addChild(item);
        }
    }

    public validateBuilding(item: BuildingItem): boolean {
        for (let i = 0; i < this.displayInventory.length; i++) {
            if (this.displayInventory[i] !== item) {
                if (HitTestBitmap.complexHitTestObject(item.mc, this.displayInventory[i].mc)) {
                    return false;
                }
            }
        }
        let expansionLevel = 0;
        if (STORE._storeData.ENL) {
            expansionLevel = STORE._storeData.ENL.q;
        }
        const yardSize = this.YARD_EXPANSIONS[expansionLevel];
        if (item.category !== BuildingItem.TYPE_DECORATION) {
            if (item.x < -yardSize.x / 2 || item.y < -yardSize.y / 2 || item.x > yardSize.x / 2 - item.widthsize || item.y > yardSize.y / 2 - item.widthsize) {
                return false;
            }
        } else if (item.x < -this.MAX_YARD_DIMENSIONS.x / 2 || item.y < -this.MAX_YARD_DIMENSIONS.y / 2 || item.x > this.MAX_YARD_DIMENSIONS.x / 2 - item.widthsize || item.y > this.MAX_YARD_DIMENSIONS.y / 2 - item.widthsize) {
            return false;
        }
        return true;
    }

    public Bounds(): void {
    }

    public clearAllLayers(): void {
        if (this._layerSelectBuildings) {
            this.clearLayer(this._layerSelectBuildings);
        }
        this._layerSelectBuildings = new Sprite();
        this._layerSelectBuildings.mouseEnabled = false;
        if (this._layerSelectRanges) {
            this.clearLayer(this._layerSelectRanges);
        }
        this._layerSelectRanges = new Sprite();
        this._layerSelectRanges.mouseEnabled = false;
        if (this._layerShroud) {
            this.clearLayer(this._layerShroud);
        }
        this._layerShroud = new Sprite();
        this._layerShroud.mouseEnabled = false;
        if (this._layerSetBuildings) {
            this.clearLayer(this._layerSetBuildings);
        }
        this._layerSetBuildings = new Sprite();
        this._layerSetBuildings.mouseEnabled = false;
        if (this._layerSetRanges) {
            this.clearLayer(this._layerSetRanges);
        }
        this._layerSetRanges = new Sprite();
        this._layerSetRanges.mouseEnabled = false;
        if (this._layerGround) {
            this.clearLayer(this._layerGround);
        }
        this._layerGround = new Sprite();
        this._layerGround.mouseEnabled = false;
    }

    public clearLayer(layer: Sprite): void {
        while (layer.numChildren) {
            if ("remove" in (layer.getChildAt(0) as any)) {
                (layer.getChildAt(0) as any).remove();
            }
            layer.removeChildAt(0);
        }
    }

    public remove(): void {
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.canvasDragStart.bind(this));
        this.removeEventListener(MouseEvent.CLICK, this.onCanvasClick.bind(this));
        GAME._instance.removeEventListener(MouseEvent.MOUSE_MOVE, this.canvasDrag.bind(this));
        GAME._instance.removeEventListener(MouseEvent.MOUSE_UP, this.canvasDragStop.bind(this));
        GAME._instance.removeEventListener(MouseEvent.ROLL_OUT, this.canvasDragStop.bind(this));
        this.clearAllLayers();
    }

    public redraw(data: Array<PlannerNode> | null = null): void {
        this.setup();
    }

    public toggleView(checkbox: Checkbox): void {
        switch (checkbox.name) {
            case "check1":
                this.rangeCheckboxesFlags ^= 1 << PlannerDesignView.CHECKBOX_GROUND;
                break;
            case "check2":
                this.rangeCheckboxesFlags ^= 1 << PlannerDesignView.CHECKBOX_AIR;
                break;
            case "check3":
                this.rangeCheckboxesFlags ^= 1 << PlannerDesignView.CHECKBOX_TRAP;
                break;
            case "check4":
                this.toggleMoreInfo(checkbox.Checked);
                break;
        }
        this.redrawRanges();
    }

    private toggleMoreInfo(show: boolean = false): void {
        if (!PlannerDesignView.SHOULD_SHOW_MOREINFO) {
            return;
        }
        for (let i = 0; i < this.displayInventory.length; i++) {
            this.displayInventory[i].toggleMoreInfo(show, PlannerDesignView.SHOULD_SHOW_FORTIFICATION);
        }
    }

    public redrawRanges(): void {
        this.clearRanges();
        this.drawRanges();
    }

    private clearRanges(): void {
        while (this._layerSetRanges!.numChildren) {
            this._layerSetRanges!.removeChildAt(0);
        }
    }

    private drawRanges(): void {
        const rangeLayer = new Sprite();
        for (let i = 0; i < this._layerSetBuildings!.numChildren; i++) {
            let shouldDraw = false;
            const item = this._layerSetBuildings!.getChildAt(i) as BuildingItem;
            if (Boolean(this.rangeCheckboxesFlags & 1 << PlannerDesignView.CHECKBOX_TRAP) && item.category === BuildingItem.TYPE_TRAP) {
                shouldDraw = true;
            } else if (item.rangeCategory()) {
                switch (item.rangeCategory()) {
                    case 1:
                    case 2:
                        shouldDraw = Boolean(this.rangeCheckboxesFlags & 1 << (item.rangeCategory() - 1));
                        break;
                    case 3:
                        shouldDraw = Boolean(this.rangeCheckboxesFlags & 1 << PlannerDesignView.CHECKBOX_GROUND || this.rangeCheckboxesFlags & 1 << PlannerDesignView.CHECKBOX_AIR);
                        break;
                }
            }
            if (shouldDraw) {
                rangeLayer.mouseEnabled = false;
                rangeLayer.graphics.lineStyle(3, 0xFFFFFF, 0.25);
                rangeLayer.graphics.beginFill(0xFF0000, 0.1);
                rangeLayer.graphics.drawCircle(item.x + item.widthsize / 2, item.y + item.widthsize / 2, item.node.range * item.scale);
                this._layerSetRanges!.addChild(rangeLayer);
                rangeLayer.graphics.endFill();
            }
        }
    }
}
