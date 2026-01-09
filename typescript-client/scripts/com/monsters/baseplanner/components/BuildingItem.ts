import { MouseEvent } from "openfl/events/MouseEvent";
import { DropShadowFilter } from "openfl/filters/DropShadowFilter";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { PlannerDesignView } from "../PlannerDesignView";
import { PlannerNode } from "../PlannerNode";
import { BasePlannerNodeEvent } from "../events/BasePlannerNodeEvent";
import { PlannerItem } from "./PlannerItem";
import { Console } from "../../debug/Console";
import { BasePlannerPopup_DisplayItem_Building } from "../BasePlannerPopup_DisplayItem_Building";

import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { PLANNER } from "../../../../PLANNER";
import { YARD_PROPS } from "../../../../YARD_PROPS";

/**
 * Building item - represents a building in the base planner grid.
 */
export class BuildingItem extends PlannerItem {
    public static readonly TYPE_DEFENSIVE: string = "defensive";
    public static readonly TYPE_BUILDING: string = "building";
    public static readonly TYPE_RESOURCE: string = "resource";
    public static readonly TYPE_DECORATION: string = "decoration";
    public static readonly TYPE_TRAP: string = "trap";
    public static readonly TYPE_WALL: string = "wall";
    public static readonly TYPE_MISC: string = "misc";

    public props: Record<string, any> | null = null;
    public node: PlannerNode;
    public category: string = "";
    public desc: string = "";
    private mcX: number = 0;
    private mcY: number = 0;
    private mcSize: number = 0;

    constructor(plannerNode: PlannerNode) {
        super();
        this.node = plannerNode;
        this.mc = new BasePlannerPopup_DisplayItem_Building();
        this.addChild(this.mc);
        if (YARD_PROPS._yardProps[this.node.type - 1].type === "decoration") {
            this.size = new Rectangle(0, 0, YARD_PROPS._yardProps[this.node.type - 1].size, YARD_PROPS._yardProps[this.node.type - 1].size);
        } else {
            this.size = new Rectangle(0, 0, this.node.building._footprint[0].width, this.node.building._footprint[0].height);
        }
        this.category = this.defineCategory(this.node.type)!;
        this.desc = this.node.name + " " + KEYS.Get("basePlanner_buildingLevel") + this.node.level;
        this.x = Math.floor(this.node.x / PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD) * PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD;
        this.y = Math.floor(this.node.y / PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD) * PlannerDesignView.MOUSE_POSITION_SNAP_THRESHHOLD;
        this.setPositionReference();
        this.mc.width = this.size.width;
        this.mc.height = this.size.height;
        this.mcSize = this.mc.width;
        this.mc.x = this.mc.width / 2;
        this.mc.y = this.mc.height / 2;
        this.mc.mcFrame.gotoAndStop(1);
        this.mc.mcBG.gotoAndStop(this.category);
        if (this.category === BuildingItem.TYPE_TRAP && this.node.type === 117) {
            this.mc.mcBG.gotoAndStop("htrap");
        }
        this.mc.mcIcon.gotoAndStop(this.node.type);
        this.mc.mcInvalid.visible = false;
        this.toggleMoreInfo(false);
    }

    public rangeCategory(): number {
        if (YARD_PROPS._yardProps[this.node.type - 1].attackType) {
            return YARD_PROPS._yardProps[this.node.type - 1].attackType;
        }
        return 0;
    }

    public updateScale(scale: number): void {
        this.scaleX = this.scaleY = scale;
    }

    public get scale(): number {
        return this.scaleX;
    }

    public get widthsize(): number {
        return this.mcSize;
    }

    public defineCategory(buildingType: number): string | null {
        this.props = GLOBAL._buildingProps[buildingType - 1];
        if (!this.props) {
            Console.warning("props fail" + buildingType);
            return null;
        }
        const group: number = this.props.group;
        const type: string = String(this.props.type);
        let categoryStr: string;
        switch (group) {
            case 1:
                categoryStr = BuildingItem.TYPE_RESOURCE;
                break;
            case 2:
                categoryStr = BuildingItem.TYPE_BUILDING;
                break;
            case 3:
                categoryStr = BuildingItem.TYPE_DEFENSIVE;
                if (type === "wall") {
                    categoryStr = BuildingItem.TYPE_WALL;
                } else if (type === "trap") {
                    categoryStr = BuildingItem.TYPE_TRAP;
                }
                break;
            case 4:
                categoryStr = BuildingItem.TYPE_DECORATION;
                break;
            default:
                categoryStr = BuildingItem.TYPE_MISC;
        }
        return categoryStr;
    }

    public setPositionReference(): Point {
        this.mcX = this.x;
        this.mcY = this.y;
        this.node.place(this.x, this.y);
        return new Point(this.mcX, this.mcY);
    }

    public resetPositionReference(): void {
        this.x = this.mcX;
        this.y = this.mcY;
    }

    public toggleMoreInfo(showInfo: boolean = false, showFort: boolean = true): void {
        if (this.node.category === PlannerNode.TYPE_DECORATION) {
            this.mc.mcFort.mcLevel.tLabel.visible = false;
            this.mc.mcFort.mcLevel.tLabel.htmlText = "";
            this.mc.mcLevel.tLabel.htmlText = "";
            this.mc.mcLevel.tLabel.visible = false;
            return;
        }
        if (Boolean(this.node.level) && showInfo) {
            this.mc.mcLevel.tLabel.htmlText = this.node.level.toString();
            this.mc.mcLevel.tLabel.visible = true;
        } else {
            this.mc.mcLevel.tLabel.htmlText = "";
            this.mc.mcLevel.tLabel.visible = false;
        }
        if (this.node.fortification && showInfo && showFort) {
            this.mc.mcFort.mcLevel.tLabel.htmlText = this.node.fortification.toString();
            this.mc.mcFort.mcLevel.tLabel.visible = true;
        } else {
            this.mc.mcFort.mcLevel.tLabel.htmlText = "";
            this.mc.mcFort.mcLevel.tLabel.visible = false;
        }
    }

    public toggleInvalid(invalid: boolean = false): void {
        this.mc.mcInvalid.visible = invalid;
    }

    public override onMouseDown(event: MouseEvent | null = null): void {
        super.onMouseDown(event);
    }

    public override onMouseUp(event: MouseEvent | null = null): void {
        super.onMouseDown(event);
        if (!PLANNER.basePlanner.popup.designView._dragged) {
            this.dispatchEvent(new BasePlannerNodeEvent(PlannerDesignView.BUILDING_CLICK, this.node));
        }
    }

    public override onRollOver(event: MouseEvent | null = null): void {
        this.dispatchEvent(new BasePlannerNodeEvent(PlannerDesignView.BUILDING_OVER, this.node));
        this.mc.mcFrame.gotoAndStop("on");
    }

    public override onRollOut(event: MouseEvent | null = null): void {
        this.dispatchEvent(new BasePlannerNodeEvent(PlannerDesignView.BUILDING_OUT, this.node));
        this.mc.mcFrame.gotoAndStop("off");
    }

    public addShadow(): void {
        const filter = new DropShadowFilter();
        filter.distance = 5;
        filter.angle = 45;
        filter.color = 0;
        filter.alpha = 0.5;
        filter.blurX = 3;
        filter.blurY = 3;
        filter.strength = 1;
        filter.quality = 15;
        this.mc.filters = [filter];
    }

    public removeShadow(): void {
        this.mc.filters = [];
    }
}
