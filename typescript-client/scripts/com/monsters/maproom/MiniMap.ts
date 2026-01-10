import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";
import Rectangle from "openfl/geom/Rectangle";
import { TweenLite } from "../../TweenLite";

import { ForeignBase } from "./ForeignBase";
import { MapRoom } from "./MapRoom";
import { MiniMap_CLIP } from "./MiniMap_CLIP";
import { PlayerLayer } from "./PlayerLayer";
import { Ring } from "./Ring";
import { WildMonsterBase } from "./WildMonsterBase";

import { TUTORIAL } from "../../../TUTORIAL";

/**
 * Mini map - displays an overview of the map room with player and AI bases.
 */
export class MiniMap extends MiniMap_CLIP {
    private static instance: MiniMap | null = null;
    private static readonly COLOR1: number = 65280;    // Green
    private static readonly COLOR2: number = 16776960; // Yellow
    private static readonly COLOR3: number = 16750848; // Orange
    private static readonly COLOR4: number = 16711680; // Red

    public playerLayer: PlayerLayer | null = null;
    public largeMap: MapRoom | null = null;
    public selector: Sprite | null = null;
    public selectorSize: Rectangle | null = null;
    public players: Sprite | null = null;
    public ai: Sprite | null = null;
    public mapSize: Rectangle | null = null;
    public dragCallBack: Function | null = null;
    private dragFriction: number = 0.7;
    private playerDot: Sprite | null = null;
    private rings: Sprite | null = null;
    public pctX: number = 0;
    public pctY: number = 0;

    constructor() {
        super();
    }

    public static getInstance(): MiniMap {
        if (!MiniMap.instance) {
            MiniMap.instance = new MiniMap();
        }
        return MiniMap.instance;
    }

    public Setup(): void {
        const scale = this.background_mc.width / this.mapSize!.width;
        this.players = new Sprite();
        this.addChild(this.players);
        this.ai = new Sprite();
        this.addChild(this.ai);
        this.playerDot = new Sprite();
        this.addChild(this.playerDot);
        this.rings = new Sprite();
        this.addChild(this.rings);
        this.selector = new Sprite();
        this.selector.graphics.lineStyle(1, 16777215, 1, false);
        this.selector.graphics.beginFill(16777215, 0.5);
        this.selector.graphics.drawRect(0, 0, this.selectorSize!.width * scale, this.selectorSize!.height * scale);
        this.selector.graphics.endFill();
        this.selector.buttonMode = true;
        this.addChild(this.selector);
        this.selector.addEventListener(MouseEvent.MOUSE_DOWN, this.selectorDown.bind(this));
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mapDown.bind(this));
    }

    public Clear(): void {
        MiniMap.instance = null;
        this.playerLayer = null;
    }

    private mapDown(event: MouseEvent): void {
        if (TUTORIAL._stage < 110) {
            return;
        }
        if (event.target !== this.selector) {
            const reposition = (): void => {
                this.scrollTo(this.pctX, this.pctY);
                this.dragCallBack!(this.pctX, this.pctY);
            };
            const tx = event.localX / this.background_mc.width;
            const ty = event.localY / this.background_mc.height;
            TweenLite.to(this, 0.3, {
                "pctX": tx,
                "pctY": ty,
                "onUpdate": reposition
            });
        }
    }

    public drawPlayerAt(px: number, py: number): void {
        const scale = this.background_mc.width / this.mapSize!.width;
        this.playerDot!.graphics.clear();
        this.playerDot!.graphics.beginFill(MiniMap.COLOR2, 1);
        this.playerDot!.graphics.drawEllipse(px * scale, py * scale, 5, 5);
        this.playerDot!.graphics.endFill();
    }

    private selectorDown(event: MouseEvent): void {
        if (TUTORIAL._stage < 110) {
            return;
        }
        const bounds = new Rectangle(this.background_mc.x, this.background_mc.y, this.background_mc.width - this.selector!.width + 1, this.background_mc.height - this.selector!.height + 1);
        this.selector!.startDrag(false, bounds);
        this.addEventListener(Event.ENTER_FRAME, this.onSelectorDragged.bind(this));
        this.stage.addEventListener(MouseEvent.MOUSE_UP, this.onStageUp.bind(this));
    }

    private onSelectorDragged(event: Event): void {
        this.pctX = this.selector!.x / (this.background_mc.width - this.selector!.width);
        this.pctY = this.selector!.y / (this.background_mc.height - this.selector!.height);
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
        this.selector!.x = this.background_mc.x + this.pctX * (this.background_mc.width - this.selector!.width);
        this.selector!.y = this.background_mc.y + this.pctY * (this.background_mc.height - this.selector!.height);
    }

    public highlightBase(foreignBase: ForeignBase): void {
        const scale = this.background_mc.width / this.mapSize!.width;
        const px = Math.floor(foreignBase.x * scale - 0.5);
        const py = Math.floor(foreignBase.y * scale - 0.5);
        Ring.MakeRings(3, 1.5, this.rings!, px, py, 40, 1, 3, this.colorForBase(foreignBase));
    }

    public Update(foreignBases: Array<ForeignBase>, wildMonsterBases: Array<WildMonsterBase>): void {
        const scale = this.background_mc.width / this.mapSize!.width;
        (this.players as any).cacheAsBitmap = false;
        this.players!.graphics.clear();
        for (const foreignBase of foreignBases) {
            this.dotAt(foreignBase.x * scale, foreignBase.y * scale, this.colorForBase(foreignBase), this.players!);
        }
        (this.players as any).cacheAsBitmap = true;
        (this.ai as any).cacheAsBitmap = false;
        this.ai!.graphics.clear();
        for (const wmBase of wildMonsterBases) {
            this.dotAt(wmBase.x * scale, wmBase.y * scale, 16711680, this.ai!);
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
        const scale = this.background_mc.width / this.mapSize!.width;
        canvas.graphics.beginFill(color);
        canvas.graphics.drawRect(px - 2, py - 2, 3, 3);
        canvas.graphics.endFill();
    }
}
