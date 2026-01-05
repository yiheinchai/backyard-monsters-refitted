
import { BTOWER } from './BTOWER';
import { SOUNDS } from './SOUNDS';
import { PROJECTILES } from './PROJECTILES';
import { Targeting } from './Targeting'; // Stub needed
import { GLOBAL } from './GLOBAL';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';

export class INFERNO_CANNON_TOWER extends BTOWER {
    public static readonly TYPE: number = 130;

    constructor() {
        super();
        this._frameNumber = 0;
        this._type = INFERNO_CANNON_TOWER.TYPE;
        this._top = -25;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [
            [new Rectangle(0, 0, 70, 70), 10],
            [new Rectangle(10, 10, 50, 50), 200]
        ];
        this.SetProps();
        this.Props();
    }

    public TickAttack(): void {
        super.TickAttack();
        this.Rotate();
    }

    public AnimFrame(param1: boolean = true): void {
        if (this._animLoaded && GLOBAL._render) {
            this._animRect.x = this._animRect.width * this._animTick;
            this._animContainerBMD.copyPixels(this._animBMD, this._animRect, this._nullPoint);
        }
    }

    public Fire(param1: any): void {
        super.Fire(param1);
        SOUNDS.Play("icannon");
        let _loc2_: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let _loc3_: number = 1;
        if (GLOBAL._towerOverdrive && GLOBAL._towerOverdrive.Get() >= GLOBAL.Timestamp()) {
            _loc3_ = 1.25;
        }
        PROJECTILES.Spawn(
            new Point(this._mc.x, this._mc.y + this._top),
            null,
            param1,
            this._speed,
            Math.floor(this.damage * _loc2_ * _loc3_),
            false,
            this._splash,
            Targeting.getOldStyleTargets(-1)
        );
    }
}
