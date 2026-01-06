import { IAttackable } from "com.monsters.interfaces.IAttackable";
import { MonsterBase } from "com.monsters.monsters.MonsterBase";
import { FlameEffect } from "com.monsters.monsters.components.statusEffects.FlameEffect";
import { BitmapData } from "openfl/display/BitmapData";
import { MovieClip } from "openfl/display/MovieClip";
import { Event } from "openfl/events/Event";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";
import { BTOWER } from "./BTOWER";
import { GLOBAL } from "./GLOBAL";
import { SOUNDS } from "./SOUNDS";
import { FIREBALLS } from "./FIREBALLS";
import { FIREBALL } from "./FIREBALL";
import { Targeting } from "./Targeting";

export class INFERNO_MAGMA_TOWER extends BTOWER {
    public static readonly ID: number = 132;

    public _animMC: MovieClip;
    public _animBitmap: BitmapData;
    public _lostCreep: boolean = false;
    public _fireStage: number = 1;
    public _targetArray: number[];
    protected _projectile: FIREBALL;
    protected _projectileType: string;

    constructor() {
        super();
        this._targetArray = [4, 4, 6, 8, 10, 12];
        this._frameNumber = 0;
        this._type = 132;
        this._top = -30;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this._projectileType = FIREBALLS.TYPE_MAGMA;
        this._fireStage = 1;
        this.SetProps();
    }

    override TickAttack(): void {
        super.TickAttack();
        this.Rotate();
    }

    override AnimFrame(param1: boolean = true): void {
        if (this._animLoaded && GLOBAL._render) {
            this._animRect.x = this._animRect.width * this._animTick;
            this._animContainerBMD.copyPixels(this._animBMD, this._animRect, this._nullPoint);
        }
        super.AnimFrame(false);
    }

    override Fire(param1: IAttackable): void {
        super.Fire(param1);
        if (Math.random() * 2 <= 1) {
            SOUNDS.Play("magma1");
        } else {
            SOUNDS.Play("magma2");
        }
        const _loc2_: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let _loc3_: number = 1;
        if (Boolean(GLOBAL._towerOverdrive) && GLOBAL._towerOverdrive.Get() >= GLOBAL.Timestamp()) {
            _loc3_ = 1.25;
        }
        this._projectile = FIREBALLS.Spawn2(new Point(this._mc.x, this._mc.y + this._top), new Point(param1.x, param1.y), param1, this._speed, Math.floor(this.damage * _loc2_ * _loc3_), this._splash, this._projectileType, 1, this);
    }

    protected onProjectileCollision(param1: Event): void {
        const _loc2_: FIREBALL = param1.target as FIREBALL;
        _loc2_.removeEventListener(FIREBALL.COLLIDED, this.onProjectileCollision);
        const _loc3_: Array<any> = Targeting.getCreepsInRange(this._splash, new Point(_loc2_._targetCreep.x, _loc2_._targetCreep.y), Targeting.getOldStyleTargets(0));
        let _loc4_: number = 0;
        while (_loc4_ < _loc3_.length) {
            ((_loc3_[_loc4_].creep) as MonsterBase).addStatusEffect(new FlameEffect((_loc3_[_loc4_].creep) as MonsterBase, this.damage * 0.5));
            _loc4_++;
        }
    }

    override Description(): void {
        let _loc1_: any = null;
        let _loc2_: any = null;
        let _loc3_: number = 0;
        let _loc4_: number = 0;
        super.Description();
        this._upgradeDescription = "";
        if (this._lvl.Get() > 0 && this._lvl.Get() < this._buildingProps.costs.length) {
            _loc1_ = this._buildingProps.stats[this._lvl.Get() - 1];
            _loc2_ = this._buildingProps.stats[this._lvl.Get()];
            _loc3_ = Number(_loc1_.range);
            _loc4_ = Number(_loc2_.range);
            if (BASE.isOutpost) {
                _loc3_ = BTOWER.AdjustTowerRange(GLOBAL._currentCell, _loc3_);
                _loc4_ = BTOWER.AdjustTowerRange(GLOBAL._currentCell, _loc4_);
            }
            if (_loc1_.range < _loc2_.range) {
                this._upgradeDescription += KEYS.Get("building_rangeincrease", {
                    "v1": _loc3_,
                    "v2": _loc4_
                }) + "<br>";
            }
            if (_loc1_.damage < _loc2_.damage) {
                this._upgradeDescription += KEYS.Get("building_dpsincrease", {
                    "v1": _loc1_.damage,
                    "v2": _loc2_.damage
                }) + "<br>";
            }
            if (this._lvl.Get() > 1) {
                this._upgradeDescription += KEYS.Get("building_sfpsincrease", {
                    "v1": this._targetArray[this._lvl.Get() - 1],
                    "v2": this._targetArray[this._lvl.Get()]
                }) + "<br>";
            }
        }
    }

    override Setup(param1: any): void {
        param1.t = this._type;
        super.Setup(param1);
        this.Props();
    }
}

// Import needed for Description method
import { BASE } from "./BASE";
import { KEYS } from "./KEYS";
