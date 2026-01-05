
import { BTOWER } from './BTOWER';
import { SOUNDS } from './SOUNDS';
import { FIREBALLS } from './FIREBALLS'; // Stub needed for Spawn2 and TYPE_MAGMA
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { BASE } from './BASE';
import { Targeting } from './Targeting';
import { MonsterBase } from './MonsterBase';
// import { FlameEffect } from './com/monsters/monsters/components/statusEffects/FlameEffect'; // Stub needed
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import MovieClip from 'openfl/display/MovieClip';
import BitmapData from 'openfl/display/BitmapData';
import Event from 'openfl/events/Event';

// Stubbing FlameEffect and FIREBALL
const FlameEffect: any = class { constructor(a:any, b:any) {} }; 

export class INFERNO_MAGMA_TOWER extends BTOWER {
    public static readonly ID: number = 132;

    public _animMC: MovieClip;
    public _animBitmap: BitmapData;
    public _lostCreep: boolean = false;
    public _fireStage: number = 1;
    public _targetArray: number[];
    protected _projectile: any; // FIREBALL
    protected _projectileType: string;

    constructor() {
        super();
        this._targetArray = [4, 4, 6, 8, 10, 12];
        this._frameNumber = 0;
        this._type = 132;
        this._top = -30;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [
            [new Rectangle(0, 0, 70, 70), 10],
            [new Rectangle(10, 10, 50, 50), 200]
        ];
        this._projectileType = FIREBALLS.TYPE_MAGMA;
        this._fireStage = 1;
        this.SetProps();
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
        super.AnimFrame(false);
    }

    public Fire(param1: any): void {
        super.Fire(param1);
        if (Math.random() * 2 <= 1) {
            SOUNDS.Play("magma1");
        } else {
            SOUNDS.Play("magma2");
        }
        let _loc2_: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let _loc3_: number = 1;
        if (GLOBAL._towerOverdrive && GLOBAL._towerOverdrive.Get() >= GLOBAL.Timestamp()) {
            _loc3_ = 1.25;
        }
        this._projectile = FIREBALLS.Spawn2(
            new Point(this._mc.x, this._mc.y + this._top),
            new Point(param1.x, param1.y),
            param1,
            this._speed,
            Math.floor(this.damage * _loc2_ * _loc3_),
            this._splash,
            this._projectileType,
            1,
            this
        );
    }

    protected onProjectileCollision(param1: Event): void {
        let _loc2_: any = param1.target; // FIREBALL
        // _loc2_.removeEventListener("COLLIDED", this.onProjectileCollision); // Assuming string const
        let _loc3_: any[] = Targeting.getCreepsInRange(
            this._splash,
            new Point(_loc2_._targetCreep.x, _loc2_._targetCreep.y),
            Targeting.getOldStyleTargets(0)
        );
        for (let creepWrapper of _loc3_) {
            // (creepWrapper.creep as MonsterBase).addStatusEffect(new FlameEffect(creepWrapper.creep as MonsterBase, this.damage * 0.5));
        }
    }

    public Description(): void {
        super.Description();
        this._upgradeDescription = "";
        if (this._lvl.Get() > 0 && this._lvl.Get() < this._buildingProps.costs.length) {
            let _loc1_: any = this._buildingProps.stats[this._lvl.Get() - 1];
            let _loc2_: any = this._buildingProps.stats[this._lvl.Get()];
            let _loc3_: number = Math.floor(_loc1_.range);
            let _loc4_: number = Math.floor(_loc2_.range);
            
            if (BASE.isOutpost) {
                _loc3_ = BTOWER.AdjustTowerRange(GLOBAL._currentCell, _loc3_);
                _loc4_ = BTOWER.AdjustTowerRange(GLOBAL._currentCell, _loc4_);
            }
            if (_loc1_.range < _loc2_.range) {
                this._upgradeDescription += KEYS.Get("building_rangeincrease", { "v1": _loc3_, "v2": _loc4_ }) + "<br>";
            }
            if (_loc1_.damage < _loc2_.damage) {
                this._upgradeDescription += KEYS.Get("building_dpsincrease", { "v1": _loc1_.damage, "v2": _loc2_.damage }) + "<br>";
            }
            if (this._lvl.Get() > 1) {
                this._upgradeDescription += KEYS.Get("building_sfpsincrease", { "v1": this._targetArray[this._lvl.Get() - 1], "v2": this._targetArray[this._lvl.Get()] }) + "<br>";
            }
        }
    }

    public Setup(param1: any): void {
        param1.t = this._type;
        super.Setup(param1);
        this.Props();
    }
}
