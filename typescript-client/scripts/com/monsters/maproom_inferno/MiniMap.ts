import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";
import { TweenLite } from "../../../gs/TweenLite";

import { DescentMonsterBase } from "./DescentMonsterBase";
import { ForeignBase } from "./views/ForeignBase";
import { MapRoom } from "./MapRoom";
import { PlayerLayer } from "./PlayerLayer";
import { Ring } from "./Ring";
import { WildMonsterBase } from "./WildMonsterBase";
import { MiniMapInferno_CLIP } from "./MiniMapInferno_CLIP";
import { MiniMapDescent_CLIP } from "./MiniMapDescent_CLIP";

import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";

/**
 * Inferno mini map - displays map overview for inferno/descent map rooms.
 */
export class MiniMap extends MovieClip {
    private static instance: MiniMap | null = null;
    private static readonly COLOR1: number = 65280;    // Green
    private static readonly COLOR2: number = 16776960; // Yellow
    private static readonly COLOR3: number = 16750848; // Orange
    private static readonly COLOR4: number = 16711680; // Red
    private static readonly MINIMAPDESCENT: string = "minimap_descent";
    private static readonly MINIMAPINFERNO: string = "minimap_inferno";

    public playerLayer: PlayerLayer | null = null;
    public largeMap: MapRoom | null = null;
    public selector: Sprite | null = null;
    public background: MovieClip | null = null;
    public selectorSize: Rectangle | null = null;
    public players: Sprite | null = null;
    public ai: Sprite | null = null;
    public mapSize: Rectangle | null = null;
    public dragCallBack: Function | null = null;
    private dragFriction: number = 0.7;
    public _mc: MovieClip;
    private playerDot: Sprite | null = null;
    private rings: Sprite | null = null;
    public pctX: number = 0;
    public pctY: number = 0;
    public readonly fowCoordMap: Array<number> = [25, 35, 45, 60, 106, 148, 190];

    constructor(clip: MovieClip) {
        super();
        this._mc = clip;
        this.addChild(this._mc);
    }

    public static getInstance(): MiniMap {
        if (!MiniMap.instance) {
            if (MAPROOM_DESCENT.DescentPassed) {
                MiniMap.instance = new MiniMap(new MiniMapInferno_CLIP());
            } else {
                MiniMap.instance = new MiniMap(new MiniMapDescent_CLIP());
            }
        }
        return MiniMap.instance;
    }

    public Setup(): void {
        if (this._mc === null) {
            return;
        }
        this.background = this._mc.background_mc;
        const scale = this._mc.background_mc.width / this.mapSize!.width;
        this.players = new Sprite();
        this._mc.addChild(this.players);
        this.ai = new Sprite();
        this._mc.addChild(this.ai);
        this.playerDot = new Sprite();
        this._mc.addChild(this.playerDot);
        this.rings = new Sprite();
        this._mc.addChild(this.rings);
        this.selector = new Sprite();
        this.selector.graphics.lineStyle(1, 16777215, 1, false);
        this.selector.graphics.beginFill(16777215, 0.5);
        this.selector.graphics.drawRect(0, 0, this.selectorSize!.width * scale, this.selectorSize!.height * scale);
        this.selector.graphics.endFill();
        this.selector.buttonMode = true;
        this._mc.addChild(this.selector);
        this.selector.addEventListener(MouseEvent.MOUSE_DOWN, this.selectorDown.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mapDown.bind(this));
        if (this._mc.fow_mc) {
            const fowLevel = Math.min(Math.max(MAPROOM_DESCENT._descentLvl - 1, 0), MAPROOM_DESCENT._descentLvlMax);
            this._mc.fow_mc.y = this.fowCoordMap[fowLevel];
        }
    }

    public Clear(): void {
        MiniMap.instance = null;
        this.playerLayer = null;
    }

    private mapDown(event: MouseEvent): void {
        if (event.target !== this.selector) {
            const reposition = (): void => {
                this.scrollTo(this.pctX, this.pctY);
                this.dragCallBack!(this.pctX, this.pctY);
            };
            const tx = event.localX / this.background!.width;
            const ty = event.localY / this.background!.height;
            TweenLite.to(this, 0.3, {
                "pctX": tx,
                "pctY": ty,
                "onUpdate": reposition
            });
        }
    }

    public drawPlayerAt(px: number, py: number): void {
        const scale = this.background!.width / this.mapSize!.width;
        this.playerDot!.graphics.clear();
        this.playerDot!.graphics.beginFill(MiniMap.COLOR2, 1);
        this.playerDot!.graphics.drawEllipse(px * scale, py * scale, 5, 5);
        this.playerDot!.graphics.endFill();
    }

    private selectorDown(event: MouseEvent): void {
        const bounds = new Rectangle(this.background!.x, this.background!.y, this.background!.width - this.selector!.width + 1, this.background!.height - this.selector!.height + 1);
        this.selector!.startDrag(false, bounds);
        this.addEventListener(Event.ENTER_FRAME, this.onSelectorDragged.bind(this));
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onStageUp.bind(this));
    }

    private onSelectorDragged(event: Event): void {
        this.pctX = this.selector!.x / (this.background!.width - this.selector!.width);
        this.pctY = this.selector!.y / (this.background!.height - this.selector!.height);
        this.dragCallBack!(this.pctX, this.pctY);
    }

    private onStageUp(event: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.onSelectorDragged.bind(this));
        this.stage.removeEventListener(MouseEvent.MOUSE_UP, this.onStageUp.bind(this));
        this.selector!.stopDrag();
    }

    public scrollTo(percentX: number, percentY: number): void {
        this.pctX = percentX;
        this.pctY = percentY;
        if (this.pctX < 0) {
            this.pctX = 0;
        }
        if (this.pctX > 1) {
            this.pctX = 1;
        }
        if (this.pctY < 0) {
            this.pctY = 0;
        }
        if (this.pctY > 1) {
            this.pctY = 1;
        }
        this.selector!.x = this.background!.x + this.pctX * (this.background!.width - this.selector!.width);
        this.selector!.y = this.background!.y + this.pctY * (this.background!.height - this.selector!.height);
    }

    public highlightBase(foreignBase: ForeignBase): void {
        const scale = this.background!.width / this.mapSize!.width;
        const px = Math.floor(foreignBase.x * scale - 0.5);
        const py = Math.floor(foreignBase.y * scale - 0.5);
        Ring.MakeRings(3, 1.5, this.rings!, px, py, 40, 1, 3, this.colorForBase(foreignBase));
    }

    public Update(foreignBases: Array<ForeignBase>, aiList: Array<any>): void {
        const scale = this.background!.width / this.mapSize!.width;
        (this.players as any).cacheAsBitmap = false;
        this.players!.graphics.clear();
        for (const foreignBase of foreignBases) {
            this.dotAt(foreignBase.x * scale, foreignBase.y * scale, this.colorForBase(foreignBase), this.players!);
        }
        (this.players as any).cacheAsBitmap = true;
        (this.ai as any).cacheAsBitmap = false;
        this.ai!.graphics.clear();
        if (MAPROOM_DESCENT.DescentPassed) {
            for (const wmBase of aiList as Array<WildMonsterBase>) {
                this.dotAt(wmBase.x * scale, wmBase.y * scale, 16711680, this.ai!);
            }
        } else {
            for (const dmBase of aiList as Array<DescentMonsterBase>) {
                if (dmBase.data.destroyed === 0 && dmBase.data.baseid.Get() > 200 && dmBase.data.level.Get() >= MAPROOM_DESCENT.DescentLevel) {
                    this.dotAt(dmBase.x * scale, dmBase.y * scale, 16711680, this.ai!);
                }
            }
        }
        (this.ai as any).cacheAsBitmap = true;
    }

    private colorForBase(foreignBase: ForeignBase): number {
        let color: number = 0;
        if (foreignBase.data!.friend.Get() === 1) {
            color = MiniMap.COLOR1;
        } else {
            color = MiniMap.COLOR3;
        }
        return color;
    }

    private dotAt(px: number, py: number, color: number, canvas: Sprite): void {
        const scale = this.background!.width / this.mapSize!.width;
        canvas.graphics.beginFill(color);
        canvas.graphics.drawRect(px - 2, py - 2, 3, 3);
        canvas.graphics.endFill();
    }
}
