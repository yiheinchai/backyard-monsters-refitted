import { BFOUNDATION } from "../../../BFOUNDATION";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";

/**
 * PlannerNode - represents a building node in the base planner.
 */
export class PlannerNode {
    public static readonly TYPE_DEFENSIVE: string = "defensive";
    public static readonly TYPE_BUILDING: string = "building";
    public static readonly TYPE_RESOURCE: string = "resource";
    public static readonly TYPE_DECORATION: string = "decoration";
    public static readonly TYPE_TRAP: string = "trap";
    public static readonly TYPE_WALL: string = "wall";
    public static readonly TYPE_MISC: string = "misc";
    protected static readonly MAX_TEXT_BEFORE_LEVEL: number = 16;

    public x: number = 0;
    public y: number = 0;
    public id: number = 0;
    public type: number = 0;
    public level: number = 0;
    public fortification: number = 0;
    public building: BFOUNDATION;
    public props: Record<string, any> | null = null;
    private shootrange: number = 0;
    public category: string = "";
    public categoryName: string = "";
    public name: string = "";
    public displayName: string = "";
    public displayNameFull: string = "";
    public stored: number = 0;
    public order: number = 0;
    public isSet: boolean = false;

    constructor(building: BFOUNDATION, x: number = 0, y: number = 0, order: number = 0) {
        this.building = building;
        this.x = x;
        this.y = y;
        this.id = building._id;
        this.type = building._type;
        this.level = building._lvl.Get();
        this.fortification = building._fortification.Get();
        this.order = order;
        this.shootrange = building._range;
        this.name = KEYS.Get(GLOBAL._buildingProps[this.type - 1].name);
        this.defineCategory(building._type);
        if (this.category !== PlannerNode.TYPE_DECORATION) {
            if (this.name.length > PlannerNode.MAX_TEXT_BEFORE_LEVEL && this.name.indexOf(" ") !== this.name.lastIndexOf(" ")) {
                this.displayName = this.name.substr(0, this.name.lastIndexOf(" "));
            } else {
                this.displayName = this.name;
            }
            if (building._buildingProps.type !== "enemy") {
                this.displayName += " " + KEYS.Get("basePlanner_buildingLevel") + building._lvl.Get();
            }
        } else {
            this.displayName = this.name;
        }
        this.displayNameFull = this.displayName;
        if (this.building._fortification.Get() > 0) {
            this.displayNameFull += " " + KEYS.Get("basePlanner_buildingFort") + " " + building._fortification.Get();
        }
    }

    public place(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public store(): void {
        this.x;
        this.y;
        this.stored = 1;
    }

    public get range(): number {
        return this.shootrange;
    }

    public defineCategory(buildingType: number): void {
        this.props = GLOBAL._buildingProps[buildingType - 1];
        if (!this.props) {
            return;
        }
        const group = this.props.group;
        const type = String(this.props.type);
        let category: string;
        let categoryName: string;
        switch (group) {
            case 1:
                category = PlannerNode.TYPE_RESOURCE;
                categoryName = KEYS.Get("basePlanner_catResource");
                break;
            case 2:
                category = PlannerNode.TYPE_BUILDING;
                categoryName = KEYS.Get("basePlanner_catBuilding");
                break;
            case 3:
                category = PlannerNode.TYPE_DEFENSIVE;
                categoryName = KEYS.Get("basePlanner_catDefensive");
                if (type === "wall") {
                    category = PlannerNode.TYPE_WALL;
                    categoryName = KEYS.Get("basePlanner_catWall");
                } else if (type === "trap") {
                    category = PlannerNode.TYPE_TRAP;
                    categoryName = KEYS.Get("basePlanner_catTrap");
                }
                break;
            case 4:
                category = PlannerNode.TYPE_DECORATION;
                categoryName = KEYS.Get("basePlanner_catDecoration");
                break;
            default:
                category = PlannerNode.TYPE_MISC;
                categoryName = KEYS.Get("basePlanner_catMisc");
        }
        this.categoryName = categoryName;
        this.category = category;
    }
}
