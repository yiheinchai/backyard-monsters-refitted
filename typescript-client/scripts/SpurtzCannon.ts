import { BitmapData } from 'openfl/display/BitmapData';
import { DisplayObject } from 'openfl/display/DisplayObject';
import { Sprite } from 'openfl/display/Sprite';
import { Event } from 'openfl/events/Event';
import { ColorMatrixFilter } from 'openfl/filters/ColorMatrixFilter';
import { GlowFilter } from 'openfl/filters/GlowFilter';
import { Point } from 'openfl/geom/Point';
import { Rectangle } from 'openfl/geom/Rectangle';
import { SecNum } from './com/cc/utils/SecNum';
import { BuildingAssetContainer } from './com/monsters/display/BuildingAssetContainer';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { MonsterBase } from './com/monsters/monsters/MonsterBase';
import { Spurtz } from './com/monsters/monsters/creeps/inferno/Spurtz';
import { MathUtils } from './com/monsters/utils/MathUtils';
import { BTOWER } from './BTOWER';
import { SPRITES } from './SPRITES';
import { FIREBALL, FIREBALLS } from './FIREBALL';
import { GLOBAL } from './GLOBAL';
import { SOUNDS } from './SOUNDS';
import { ATTACK } from './ATTACK';
import { MAP } from './MAP';
import { CREATURES } from './CREATURES';
import { Targeting } from './Targeting';

export class SpurtzCannon extends BTOWER {
    public static readonly TYPE: number = 136;
    public static SPURTZ_PROJECTILE: string = "spurtz_projectile";

    protected _shotsFired: number;
    protected _shotsPerFire: number;
    protected _projectile: FIREBALL;
    protected _projectileType: string;
    protected _barrelRotation: number = 0;
    protected _angleToTarget: number;
    protected _chanceToSpawnSpurtz: number = 0.5;
    private readonly _barrelRotationSpeed: number = 1;
    private readonly _ANGLE_THRESHOLD_TO_SWITCH_TARGETS: number = 2;
    private readonly _ANGLE_THRESHOLD_TO_START_SHOOTING: number = 20;
    private _spurts: Spurtz[];
    private _targetCreepIndex: number;

    constructor(param1: number = 0) {
        super();
        this._animRandomStart = false;
        this._top = -32;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this._maxTargets = 10;
        if (!param1) {
            param1 = SpurtzCannon.TYPE;
        }
        this._type = param1;
        this.SetProps();
        this._projectileType = FIREBALL.TYPE_SPURTZ;
        SPRITES.SetupSprite(SpurtzCannon.SPURTZ_PROJECTILE);
        this._spurts = [];
        this._buildInstant = true;
        this._buildInstantCost = new SecNum(0);
    }

    public override InstantBuildCost(): number {
        return 0;
    }

    public get isFiring(): boolean {
        return this._shotsFired > 0;
    }

    protected override setupImage(param1: number, param2: string, param3: BuildingAssetContainer, param4: any, param5: BitmapData, param6: number): void {
        super.setupImage(param1, param2, param3, param4, param5, param6);
        this.renderRotation();
    }

    public override Fire(param1: IAttackable): void {
        super.Fire(param1);
        this.FindTargets(this._maxTargets, this._priority);
        this._shotsFired = 0;
        this._targetCreepIndex = 0;
        if (this._target) {
            this.setAngleToTarget();
        }
    }

    public override TickFast(param1: Event = null): void {
        super.TickFast(param1);
        this.killSpurts();
    }

    private killSpurts(): void {
        for (let _loc1_ = this._spurts.length - 1; _loc1_ >= 0; _loc1_--) {
            const _loc2_ = this._spurts[_loc1_];
            if (_loc2_._frameNumber > 100 && (Math.random() > 0.9 || !_loc2_._hasTarget)) {
                _loc2_.setHealth(0);
            }
            if (_loc2_.health <= 0) {
                this._spurts.splice(_loc1_, 1);
            }
        }
    }

    public override TickAttack(): void {
        super.TickAttack();
        this._shotsPerFire = this._buildingProps.stats[this._lvl.Get() - 1].shots;
        this.updateTarget();
        if (this._target) {
            this.rotateBarrelTowardsTarget();
            if (this.shouldFire()) {
                this.shoot();
            }
        }
    }

    private updateTarget(): void {
        if (!this.hasValidTarget()) {
            this._target = null;
            return;
        }
        if (Math.abs(this._angleToTarget - this._barrelRotation) <= this._ANGLE_THRESHOLD_TO_SWITCH_TARGETS) {
            if (this._targetCreeps.length > 1) {
                this._target = this.getNextTarget();
                this.setAngleToTarget();
            }
        }
    }

    private getNextTarget(): any {
        ++this._targetCreepIndex;
        if (this._targetCreepIndex >= this._targetCreeps.length) {
            this._targetCreepIndex = 0;
        }
        return this._targetCreeps[this._targetCreepIndex].creep;
    }

    private setAngleToTarget(): void {
        const _loc1_ = Math.atan2(this.y + Math.abs(this._top) - this._target.y, this.x - this._target.x);
        this._angleToTarget = _loc1_ * (180 / Math.PI);
    }

    private shouldFire(): boolean {
        return this._fireTick % 5 == 0 && this._shotsFired < this._shotsPerFire && (Math.abs(this._angleToTarget - this._barrelRotation) <= this._ANGLE_THRESHOLD_TO_START_SHOOTING || this.isFiring);
    }

    private hasValidTarget(): boolean {
        return Boolean(this._targetCreeps) && this._targetCreeps.length > 0 && (this._targetCreeps[0].creep as MonsterBase).health > 0;
    }

    private rotateBarrelTowardsTarget(): void {
        const _loc1_ = this._angleToTarget - this._barrelRotation > 0 ? 1 : -1;
        this._barrelRotation += _loc1_ * this._barrelRotationSpeed;
        if (this._barrelRotation > 180) {
            this._barrelRotation = -(180 - this._barrelRotation);
        } else if (this._barrelRotation < -180) {
            this._barrelRotation = 180 - (180 - this._barrelRotation);
        }
        this.renderRotation();
    }

    private renderRotation(): void {
        this._animTick = Math.floor((this._barrelRotation + 180) / 11.25);
        this.AnimFrame();
        ++this._frameNumber;
    }

    private shoot(): void {
        SOUNDS.Play(Math.random() > 0.5 ? "magma2" : "magma1");
        if (this.isJard) {
            this.shootJar();
            return;
        }
        const _loc1_ = 0.5 + 0.5 / this.maxHealth * this.health;
        let _loc2_ = 1;
        const _loc3_ = MathUtils.getDistanceBetweenTwoPoints(this._position, new Point(this._target.x, this._target.y));
        const _loc4_ = (this._barrelRotation + 180) * (Math.PI / 180);
        let _loc5_ = new Point(this.x + Math.cos(_loc4_) * _loc3_, this.y + Math.sin(_loc4_) * _loc3_);
        _loc5_ = _loc5_.add(new Point(this.getSpreadFromDistance(_loc3_ * 0.2), this.getSpreadFromDistance(_loc3_ * 0.2)));
        if (GLOBAL._towerOverdrive && GLOBAL._towerOverdrive.Get() >= GLOBAL.Timestamp()) {
            _loc2_ = 1.25;
        }
        this._projectile = FIREBALLS.Spawn2(new Point(this._mc.x, this._mc.y + this._top), _loc5_, null, this._speed, Math.floor(this.damage * _loc1_ * _loc2_), this._splash, this._projectileType, 3, this);
        this._projectile.addEventListener(FIREBALL.COLLIDED, this.collidedWithTarget.bind(this), false, 0, true);
        ++this._shotsFired;
        this.scaleDisplayObjectRandomly(this._projectile._graphic);
    }

    private shootJar(): void {
        const _loc1_ = 0.5 + 0.5 / this.maxHealth * this.health;
        let _loc2_ = 1;
        if (GLOBAL._towerOverdrive && GLOBAL._towerOverdrive.Get() >= GLOBAL.Timestamp()) {
            _loc2_ = 1.25;
        }
        const _loc3_ = Math.floor(this.damage * 0.25 * _loc1_ * _loc2_);
        this._jarHealth.Add(-_loc3_);
        ATTACK.Damage(this._mc.x, this._mc.y + this._top, _loc3_);
    }

    private scaleDisplayObjectRandomly(param1: DisplayObject): void {
        const _loc2_ = Math.random() * 0.6 + 0.4;
        param1.scaleX = _loc2_;
        param1.scaleY = _loc2_;
    }

    private makeItSperm(param1: Sprite): void {
        let _loc2_: number[] = [];
        _loc2_ = _loc2_.concat([1, 1, 1, 1, 1]);
        _loc2_ = _loc2_.concat([1, 1, 1, 1, 1]);
        _loc2_ = _loc2_.concat([1, 1, 1, 1, 1]);
        _loc2_ = _loc2_.concat([0, 0, 0, 1, 0]);
        param1.filters = [new ColorMatrixFilter(_loc2_)];
    }

    private getSpreadFromDistance(param1: number): number {
        return Math.random() * (param1 * 2) - param1;
    }

    protected collidedWithTarget(param1: Event): void {
        const _loc2_ = param1.target as FIREBALL;
        _loc2_.removeEventListener(FIREBALL.COLLIDED, this.collidedWithTarget.bind(this));
        const _loc3_ = Math.atan2(_loc2_._startPoint.x - _loc2_._targetPoint.x, _loc2_._startPoint.y - _loc2_._targetPoint.y);
        const _loc4_ = _loc3_ * (180 / Math.PI);
        this.dealAoEDamage(_loc2_);
        if (Math.random() > this._chanceToSpawnSpurtz) {
            this.spawnSpurtzAt(_loc2_._tmpX, _loc2_._tmpY, _loc4_, _loc2_._graphic.scaleX);
        }
    }

    private dealAoEDamage(param1: FIREBALL): void {
        const _loc2_ = this._projectile._graphic.width + this._projectile._graphic.height;
        const _loc3_ = new Point(param1._tmpX, this._projectile._tmpY);
        const _loc4_ = Targeting.getCreepsInRange(_loc2_, _loc3_, Targeting.getOldStyleTargets(0));
        if (_loc4_.length > 0) {
            Targeting.DealLinearAEDamage(_loc3_, _loc2_, this._projectile._damage, _loc4_);
        }
    }

    private spawnSpurtzAt(param1: number, param2: number, param3: number, param4: number): void {
        const _loc5_ = CREATURES.Spawn("IC1", MAP._BUILDINGTOPS, "defend", new Point(param1, param2), param3) as Spurtz;
        _loc5_.isDisposable = true;
        _loc5_.findDefenseTargets();
        _loc5_.graphic.scaleX = param4;
        _loc5_.graphic.scaleY = param4;
        this._spurts.push(_loc5_);
    }

    private makeSuperSpurtz(param1: Spurtz): void {
        param1.graphic.scaleX = 2;
        param1.graphic.scaleY = 2;
        param1.graphic.filters = [new GlowFilter(16759349, 1, 10, 10, 6, 3)];
    }
}
