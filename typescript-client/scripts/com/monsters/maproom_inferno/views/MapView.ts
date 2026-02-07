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
import { MapView_CLIP } from "../../maproom/views/MapView_CLIP";
import { ForeignBase } from "../ForeignBase";
import { MiniMap } from "../MiniMap";
import { Obstruction } from "../Obstruction";
import { PlayerLayer } from "../PlayerLayer";
import { map_bg_inferno } from "../../../../map_bg_inferno";

// Lazy imports to break circular dependency chains
function getTUTORIAL(): any { return require("../../../../TUTORIAL").TUTORIAL; }



/**
 * MapView - Inferno map room view with draggable map and minimap.
 */
export class MapView extends MapView_CLIP {
    private static instance: MapView | null = null;
    private static readonly _MAPSIZE: Rectangle = new Rectangle(0, 0, 1600, 1200);

    public map: Sprite | null = null;
    public shell: Sprite | null = null;
    public shell_mask: Sprite | null = null;
    public map_mc: MovieClip | null = null;
    public miniMap: MiniMap | null = null;
    public players: PlayerLayer | null = null;
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
        MapView.instance = this;
        this.bases = [];
    }

    public static getInstance(): MapView {
        if (!MapView.instance) {
            return new MapView();
        }
        return MapView.instance;
    }

    public Clear(): void {
        TweenLite.killTweensOf(this.shell);
        if (Boolean(this.shell) && Boolean(this.shell!.parent)) {
            this.shell!.parent.removeChild(this.shell!);
        }
        this.shell = null;
        if (Boolean(this.map_mc) && Boolean(this.map_mc!.parent)) {
            this.map_mc!.parent.removeChild(this.map_mc!);
        }
        this.map_mc = null;
        if (Boolean(this.miniMap) && Boolean(this.miniMap!.parent)) {
            this.miniMap!.parent.removeChild(this.miniMap!);
        }
        this.miniMap!.Clear();
        this.miniMap = null;
        this.shell = null;
        this.map = null;
        this.players!.Clear();
        if (Boolean(this.players) && Boolean(this.players!.parent)) {
            this.players!.parent.removeChild(this.players!);
        }
        this.players = null;
        MapView.instance = null;
    }

    public Setup(): void {
        const imageLoaded = (key: string, bmd: BitmapData): void => {
            try {
                const bmp = new Bitmap(bmd);
                this.map_mc!.addChild(bmp);
            } catch (e: any) {
            }
        };
        this.bounds = new Rectangle(0, 0, -MapView._MAPSIZE.width, -MapView._MAPSIZE.height);
        this.displayBounds = new Rectangle(this.mask_mc.x, this.mask_mc.y, this.mask_mc.width, this.mask_mc.height);
        this.hardBounds = new Rectangle(this.mask_mc.x, this.mask_mc.y, -MapView._MAPSIZE.width + this.mask_mc.width + this.mask_mc.x, -MapView._MAPSIZE.height + this.mask_mc.height + this.mask_mc.y);
        this.shell = new Sprite();
        this.addChild(this.shell);
        this.shell_mask = new Sprite();
        this.shell_mask.graphics.lineStyle(1, 0);
        this.shell_mask.graphics.beginFill(16711935);
        this.shell_mask.graphics.drawRect(0, 0, 700, 385);
        this.shell_mask.graphics.endFill();
        this.addChild(this.shell_mask);
        this.map_mc = new map_bg_inferno();
        Obstruction.Clear();
        for (let i = 1; i < this.map_mc.numChildren; i++) {
            Obstruction.Register(this.map_mc.getChildAt(i));
            this.map_mc.getChildAt(i).visible = false;
        }
        ImageCache.GetImageWithCallBack("ui/inferno_maproom1.jpg", imageLoaded, true, 1);
        this.map = new Sprite();
        this.map.addChild(this.map_mc);
        this.shell.addChild(this.map);
        this.shell.mask = this.shell_mask;
        this.mask_mc.visible = false;
        this.players!.mapWidth = Math.abs(this.bounds.width + 260);
        this.players!.mapHeight = Math.abs(this.bounds.height + 200);
        this.players!.addEventListener("down", this.onBaseDown.bind(this), false, 0, true);
        this.players!.addEventListener(Event.COMPLETE, this.onPlayersData.bind(this), false, 0, true);
        this.shell.addChild(this.players!);
        this.map.addEventListener(MouseEvent.MOUSE_DOWN, this.shellDown.bind(this));
        this.scrollTo(0.5, 0.5);
        this.miniMap = MiniMap.getInstance();
        this.miniMap.selectorSize = new Rectangle(0, 0, 700, 560);
        this.miniMap.mapSize = new Rectangle(this.displayBounds.x, this.displayBounds.y, MapView._MAPSIZE.width, MapView._MAPSIZE.height);
        this.miniMap.x = 560;
        this.miniMap.y = 8;
        this.miniMap.Setup();
        this.miniMap.dragCallBack = this.scrollTo.bind(this);
        this.addChild(this.miniMap);
        this.miniMap.drawPlayerAt(this.players!.player.x, this.players!.player.y);
    }

    public onAdd(): void {
        this.scrollToBase(this.players!.player);
    }

    private onPlayersData(event: Event): void {
        if (!this.gotFirstData) {
            if (getTUTORIAL()._stage < 130) {
                this.scrollToBase(this.players!.basesWM[0]);
            } else {
                this.scrollToBase(this.players!.player);
            }
            this.gotFirstData = true;
        }
    }

    private onBaseDown(event: Event): void {
    }

    private scrollToBase(base: any): void {
        let targetX = 0;
        let targetY = 0;
        if (base) {
            targetX = -(base.x - this.displayBounds!.x) + this.displayBounds!.width * 0.5;
            targetY = -(base.y - this.displayBounds!.y) + this.displayBounds!.height * 0.5;
        } else {
            targetX = 0;
            targetY = 0;
        }
        targetY -= 30;
        const scrollBounds = new Rectangle(this.displayBounds!.x, this.displayBounds!.y, this.displayBounds!.x + this.bounds!.width + this.displayBounds!.width, this.displayBounds!.y + this.bounds!.height + this.displayBounds!.height);
        if (targetX > scrollBounds.x) {
            targetX = scrollBounds.x;
        }
        if (targetX < scrollBounds.width) {
            targetX = scrollBounds.width;
        }
        if (targetY > scrollBounds.y) {
            targetY = scrollBounds.y;
        }
        if (targetY < scrollBounds.height) {
            targetY = scrollBounds.height;
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
        for (const base of this.players!.basesForeign) {
            if (base.data.baseid.Get() === baseId) {
                this.scrollToBase(base);
                return;
            }
        }
    }

    private baseScrollUpdate(): void {
        const xRatio = (this.shell!.x - this.displayBounds!.x) / (this.bounds!.width + this.displayBounds!.width);
        const yRatio = (this.shell!.y - this.displayBounds!.y) / (this.bounds!.height + this.displayBounds!.height);
        MiniMap.getInstance().scrollTo(xRatio, yRatio);
    }

    private shellDown(event: MouseEvent): void {
        TweenLite.killTweensOf(this.shell, false);
        this.dragging = true;
        this.dragPoint = new Point(this.stage.mouseX - this.shell!.x, this.stage.mouseY - this.shell!.y);
        this.addEventListener(Event.ENTER_FRAME, this.shellDrag.bind(this), false, 0, true);
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this), false, 0, true);
    }

    public scrollTo(xRatio: number, yRatio: number, allowOverflow: boolean = false): void {
        if (!allowOverflow) {
            if (xRatio > 1) {
                xRatio = 1;
            }
            if (xRatio < 0) {
                xRatio = 0;
            }
            if (yRatio > 1) {
                yRatio = 1;
            }
            if (yRatio < 0) {
                yRatio = 0;
            }
        }
        this.shell!.x = this.displayBounds!.x + Math.floor(xRatio * (this.bounds!.width + this.displayBounds!.width));
        this.shell!.y = this.displayBounds!.y + Math.floor(yRatio * (this.bounds!.height + this.displayBounds!.height));
    }

    public Tick(): void {
        this.players!.Tick();
    }

    public Get(): void {
        this.players!.Get();
    }

    public Hide(...args: any[]): void {
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this));
    }

    private stageUp(event: MouseEvent): void {
        if (!this.dragging) {
            return;
        }
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.stageUp.bind(this), false, 0, true);
        this.removeEventListener(Event.ENTER_FRAME, this.shellDrag.bind(this));
        let needsTween = false;
        let targetX = this.shell!.x;
        let targetY = this.shell!.y;
        const scrollBounds = new Rectangle(this.displayBounds!.x, this.displayBounds!.y, this.displayBounds!.x + this.bounds!.width + this.displayBounds!.width, this.displayBounds!.y + this.bounds!.height + this.displayBounds!.height);
        if (this.shell!.x > scrollBounds.x) {
            targetX = scrollBounds.x;
            needsTween = true;
        }
        if (this.shell!.x < scrollBounds.width) {
            targetX = scrollBounds.width;
            needsTween = true;
        }
        if (this.shell!.y > scrollBounds.y) {
            targetY = scrollBounds.y;
            needsTween = true;
        }
        if (this.shell!.y < scrollBounds.height) {
            targetY = scrollBounds.height;
            needsTween = true;
        }
        this.dragging = false;
        if (needsTween) {
        }
    }

    private shellDrag(event: Event): void {
        let newX = Math.floor(this.stage.mouseX - this.dragPoint!.x);
        let newY = Math.floor(this.stage.mouseY - this.dragPoint!.y);
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
        const smoothX = this.shell!.x - (this.shell!.x - newX) * this.throwDrag;
        const smoothY = this.shell!.y - (this.shell!.y - newY) * this.throwDrag;
        const xRatio = (smoothX - this.displayBounds!.x) / (this.bounds!.width + this.displayBounds!.width);
        const yRatio = (smoothY - this.displayBounds!.y) / (this.bounds!.height + this.displayBounds!.height);
        MiniMap.getInstance().scrollTo(xRatio, yRatio);
        this.scrollTo(xRatio, yRatio, true);
    }
}
