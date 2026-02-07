import Point from "openfl/geom/Point";

import { BYMConfig } from "../../../configs/BYMConfig";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { Component } from "../Component";
import { RasterData } from "../../../rendering/RasterData";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }


/**
 * CStatusEffect - base class for creature status effects with visual icons.
 */
export class CStatusEffect extends Component {
    protected static readonly _MAGIC_PADDING: number = 5;
    protected static readonly _MAX_TICKS: number = 40;

    protected _icon: SpriteSheetAnimation | null = null;
    protected _rasterData: RasterData | null = null;
    protected _rasterPt: Point | null = null;
    protected _priority: number = 0;
    protected _dps: number = 0;
    protected _target: MonsterBase | null;
    protected _curLife: number = 0;
    protected _curTick: number = 0;

    constructor(target: MonsterBase) {
        super();
        this._target = target;
    }

    public get icon(): SpriteSheetAnimation | null {
        return this._icon;
    }

    protected override onRegister(): void {
        this._target!.addChild(this._icon!);
        if (BYMConfig.instance.RENDERER_ON) {
            this._rasterPt = new Point();
            this._rasterData = new RasterData(this._icon!.bitmapData, this._rasterPt, Number.MAX_SAFE_INTEGER);
        }
        this._priority = -1;
        for (let i = 0; i < this._target!._components.length; i++) {
            if (this._target!._components[i] instanceof CStatusEffect) {
                ++this._priority;
            }
        }
    }

    protected override onUnregister(): void {
        this._target!.removeChild(this._icon!);
        this.destroy();
    }

    public override tick(delta: number = 1): void {
        if (this._target!.health <= 0) {
            this.owner.removeComponent(this);
            return;
        }
        this._curTick += delta;
        if (this._curTick >= CStatusEffect._MAX_TICKS) {
            this._curTick -= CStatusEffect._MAX_TICKS;
            this.updateDPS(delta);
        }
        this.updatePosition();
        if (this._icon) {
            this._icon.update();
        }
    }

    protected updatePosition(): void {
        this._icon!.x = -this._icon!.width / 2;
        if (this._priority % 2) {
            this._icon!.x += Math.floor(this._priority / 2 + 1) * (this._icon!.width + CStatusEffect._MAGIC_PADDING);
        } else {
            this._icon!.x -= this._priority / 2 * (this._icon!.width + CStatusEffect._MAGIC_PADDING);
        }
        this._icon!.y = this._target!._graphicMC.y - this._icon!.height;
        if (BYMConfig.instance.RENDERER_ON) {
            this._rasterPt!.x = this._target!.rasterPt.x + (this._target!._graphicMC.width >> 1) + this._icon!.x;
            this._rasterPt!.y = this._target!.rasterPt.y - this._icon!.height;
        }
    }

    public renew(): void {
        this._curLife = 0;
    }

    protected updateDPS(delta: number): void {
        this._target!.modifyHealth(-this._dps);
    }

    public setDPS(dps: number): void {
        this._dps = dps;
    }

    public override destroy(): void {
        this._icon = null;
        if (this._rasterData) {
            this._rasterData.clear();
        }
        this._rasterData = null;
        this._rasterPt = null;
        this._target = null;
    }
}
