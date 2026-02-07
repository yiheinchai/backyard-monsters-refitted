import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import Timer from "openfl/utils/Timer";
import { TweenLite, Quad } from "gs/TweenLite";

import { ImageCache } from "../../display/ImageCache";
import { DescentView_CLIP } from "./DescentView_CLIP";
import { DescentLayer } from "../DescentLayer";
import { ForeignBase } from "../ForeignBase";
import { MiniMap } from "../MiniMap";
import { Obstruction } from "../Obstruction";
import { map_descent_bg } from "../../../../map_descent_bg";
import { MapViewDescent_Fog_Shroud } from "../../../../MapViewDescent_Fog_Shroud";

// Lazy imports to break circular dependency chains
function getTUTORIAL(): any { return require("../../../../TUTORIAL").TUTORIAL; }



/**
 * Descent view - main scrollable map view for inferno descent.
 */
export class DescentView extends DescentView_CLIP {
    private static instance: DescentView | null = null;
    private static readonly _MAPSIZE: Rectangle = new Rectangle(0, 0, 700, 1842);

    public map: Sprite | null = null;
    public shell: Sprite | null = null;
    public map_mc: MovieClip | null = null;
    public miniMap: MiniMap | null = null;
    public players: DescentLayer | null = null;
    public shroud: MovieClip | null = null;
    private dragPoint: Point | null = null;
    private bounds: Rectangle | null = null;
    public displayBounds: Rectangle | null = null;
    public hardBounds: Rectangle | null = null;
    private updateTimer: Timer | null = null;
    private throwDrag: number = 0.28;
    private dragging: boolean = false;
    public bases: Array<any> = [];
    public gotFirstData: boolean = false;

    constructor() {
        super();
        DescentView.instance = this;
        this.bases = [].concat();
    }

    public static getInstance(): DescentView {
        if (!DescentView.instance) {
            return new DescentView();
        }
        return DescentView.instance;
    }

    public Clear(): void {
        TweenLite.killTweensOf(this.shell);
        if (Boolean(this.shell) && Boolean(this.shell!.parent)) {
            this.shell!.parent.removeChild(this.shell!);
        }
        this.shell = null;
        if (Boolean(this.shroud) && Boolean(this.shroud!.parent)) {
            this.shroud!.parent.removeChild(this.shroud!);
        }
        this.shroud = null;
        if (Boolean(this.map_mc) && Boolean(this.map_mc!.parent)) {
            this.map_mc!.parent.removeChild(this.map_mc!);
        }
        this.map_mc = null;
        if (Boolean(this.miniMap) && Boolean(this.miniMap!.parent)) {
            this.miniMap!.parent.removeChild(this.miniMap!);
        }
        this.miniMap!.Clear();
        this.miniMap = null;
        this.map = null;
        this.players!.Clear();
        if (Boolean(this.players) && Boolean(this.players!.parent)) {
            this.players!.parent.removeChild(this.players!);
        }
        this.players = null;
        DescentView.instance = null;
    }

    public Setup(): void {
        const imageLoaded = (key: string, bmd: BitmapData): void => {
            try {
                this.map_mc!.addChild(new Bitmap(bmd));
            } catch (e: any) {
            }
        };
        this.bounds = new Rectangle(0, 0, -DescentView._MAPSIZE.width, -DescentView._MAPSIZE.height);
        this.displayBounds = new Rectangle(this.mask_mc.x, this.mask_mc.y, this.mask_mc.width, this.mask_mc.height);
        this.hardBounds = new Rectangle(this.mask_mc.x, this.mask_mc.y, -DescentView._MAPSIZE.width + this.mask_mc.width + this.mask_mc.x, -DescentView._MAPSIZE.height + this.mask_mc.height + this.mask_mc.y);
        this.shell = new Sprite();
        this.addChild(this.shell);
        this.map_mc = new map_descent_bg();
        for (let i = 1; i < this.map_mc.numChildren; i++) {
            Obstruction.Register(this.map_mc.getChildAt(i));
            this.map_mc.getChildAt(i).visible = false;
        }
        ImageCache.GetImageWithCallBack("ui/descent_maproom2.jpg", imageLoaded, true, 1);
        this.map = new Sprite();
        this.map.addChild(this.map_mc);
        this.shell.addChild(this.map);
        this.shell.mask = this.mask_mc;
        this.players!.mapWidth = Math.abs(this.bounds.width + 260);
        this.players!.addEventListener("down", this.onBaseDown.bind(this), false, 0, true);
        this.players!.addEventListener(Event.COMPLETE, this.onPlayersData.bind(this), false, 0, true);
        this.shell.addChild(this.players!);
        this.shroud = new MapViewDescent_Fog_Shroud();
        this.shroud.mouseEnabled = false;
        this.shroud.mouseChildren = false;
        this.shroud.x = -50;
        this.shroud.x = -225;
        this.shell.addChild(this.shroud);
        this.map.addEventListener(MouseEvent.MOUSE_DOWN, this.shellDown.bind(this));
        this.scrollTo(0.5, 0.5);
        this.miniMap = MiniMap.getInstance();
        this.miniMap.selectorSize = new Rectangle(0, 0, 700, 560);
        this.miniMap.mapSize = new Rectangle(this.displayBounds.x, this.displayBounds.y, DescentView._MAPSIZE.width, DescentView._MAPSIZE.height);
        this.miniMap.x = 620;
        this.miniMap.y = 8;
        this.miniMap.Setup();
        this.miniMap.dragCallBack = this.scrollTo.bind(this);
        this.addChild(this.miniMap);
        this.miniMap.drawPlayerAt(this.players!.player.x, this.players!.player.y);
    }

    public onAdd(): void {
        if (this.players!.targetBase) {
            this.scrollToBase(this.players!.targetBase);
        } else {
            this.scrollToBase(this.players!.player);
        }
    }

    private onPlayersData(event: Event): void {
        if (!this.gotFirstData) {
            if (getTUTORIAL()._stage < 130) {
                this.scrollToBase(this.players!.basesWM[0]);
            } else if (this.players!.targetBase) {
                this.scrollToBase(this.players!.targetBase);
            } else {
                this.scrollToBase(this.players!.player);
            }
            this.gotFirstData = true;
        }
    }

    private onBaseDown(event: Event): void {
    }

    private scrollToBase(base: any): void {
        let targetX: number = 0;
        let targetY: number = 0;
        if (base) {
            targetX = -(base.x - this.displayBounds!.x) + this.displayBounds!.width * 0.5;
            targetY = -(base.y - this.displayBounds!.y) + this.displayBounds!.height * 0.5;
        } else {
            targetX = 0;
            targetY = 0;
        }
        targetY -= 30;
        const constraintRect: Rectangle = new Rectangle(this.displayBounds!.x, this.displayBounds!.y, this.displayBounds!.x + this.bounds!.width + this.displayBounds!.width, this.displayBounds!.y + this.bounds!.height + this.displayBounds!.height);
        if (targetX > constraintRect.x) {
            targetX = constraintRect.x;
        }
        if (targetX < constraintRect.width) {
            targetX = constraintRect.width;
        }
        if (targetY > constraintRect.y) {
            targetY = constraintRect.y;
        }
        if (targetY < constraintRect.height) {
            targetY = constraintRect.height;
        }
        if (base instanceof ForeignBase) {
            MiniMap.getInstance().highlightBase(base);
        }
        TweenLite.to(this.shell, 0.5, {
            "x": targetX,
            "y": targetY,
            "ease": Quad.easeOut,
            "onUpdate": this.baseScrollUpdate.bind(this)
        });
    }

    public scrollToBaseId(baseId: number): void {
        for (const foreignBase of this.players!.basesForeign) {
            if (foreignBase.data.baseid.Get() === baseId) {
                this.scrollToBase(foreignBase);
                return;
            }
        }
    }

    private baseScrollUpdate(): void {
        const percentX: number = (this.shell!.x - this.displayBounds!.x) / (this.bounds!.width + this.displayBounds!.width);
        const percentY: number = (this.shell!.y - this.displayBounds!.y) / (this.bounds!.height + this.displayBounds!.height);
        MiniMap.getInstance().scrollTo(percentX, percentY);
    }

    private shellDown(event: MouseEvent): void {
        TweenLite.killTweensOf(this.shell, false);
        this.dragging = true;
        this.dragPoint = new Point(this.stage.mouseX - this.shell!.x, this.stage.mouseY - this.shell!.y);
        this.addEventListener(Event.ENTER_FRAME, this.shellDrag.bind(this), false, 0, true);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this), false, 0, true);
    }

    public scrollTo(percentX: number, percentY: number, unclamped: boolean = false): void {
        if (!unclamped) {
            if (percentX > 1) {
                percentX = 1;
            }
            if (percentX < 0) {
                percentX = 0;
            }
            if (percentY > 1) {
                percentY = 1;
            }
            if (percentY < 0) {
                percentY = 0;
            }
        }
        this.shell!.x = this.displayBounds!.x + Math.floor(percentX * (this.bounds!.width + this.displayBounds!.width));
        this.shell!.y = this.displayBounds!.y + Math.floor(percentY * (this.bounds!.height + this.displayBounds!.height));
    }

    public Tick(): void {
        this.players!.Tick();
    }

    public Get(): void {
        this.players!.Get();
    }

    public Hide(...rest: any[]): void {
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this));
    }

    private stageUp(event: MouseEvent): void {
        if (!this.dragging) {
            return;
        }
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this), false, 0, true);
        this.removeEventListener(Event.ENTER_FRAME, this.shellDrag.bind(this));
        let needsSnap: boolean = false;
        let snapX: number = this.shell!.x;
        let snapY: number = this.shell!.y;
        const constraintRect: Rectangle = new Rectangle(this.displayBounds!.x, this.displayBounds!.y, this.displayBounds!.x + this.bounds!.width + this.displayBounds!.width, this.displayBounds!.y + this.bounds!.height + this.displayBounds!.height);
        if (this.shell!.x > constraintRect.x) {
            snapX = constraintRect.x;
            needsSnap = true;
        }
        if (this.shell!.x < constraintRect.width) {
            snapX = constraintRect.width;
            needsSnap = true;
        }
        if (this.shell!.y > constraintRect.y) {
            snapY = constraintRect.y;
            needsSnap = true;
        }
        if (this.shell!.y < constraintRect.height) {
            snapY = constraintRect.height;
            needsSnap = true;
        }
        this.dragging = false;
        if (needsSnap) {
        }
    }

    private shellDrag(event: Event): void {
        let newX: number = Math.floor(this.stage.mouseX - this.dragPoint!.x);
        let newY: number = Math.floor(this.stage.mouseY - this.dragPoint!.y);
        if (newX > this.hardBounds!.x) {
            newX = this.hardBounds!.x;
        }
        if (newY > this.hardBounds!.y) {
            newY = this.hardBounds!.y;
        }
        if (newX < this.hardBounds!.width) {
            newX = this.hardBounds!.width;
        }
        if (newY < this.hardBounds!.height) {
            newY = this.hardBounds!.height;
        }
        const targetX: number = this.shell!.x - (this.shell!.x - newX) * this.throwDrag;
        const targetY: number = this.shell!.y - (this.shell!.y - newY) * this.throwDrag;
        const percentX: number = (targetX - this.displayBounds!.x) / (this.bounds!.width + this.displayBounds!.width);
        const percentY: number = (targetY - this.displayBounds!.y) / (this.bounds!.height + this.displayBounds!.height);
        MiniMap.getInstance().scrollTo(percentX, percentY);
        this.scrollTo(percentX, percentY, true);
    }
}
