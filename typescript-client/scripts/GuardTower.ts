import { DisplayObjectContainer } from 'openfl/display/DisplayObjectContainer';
import { Event } from 'openfl/events/Event';
import { Point } from 'openfl/geom/Point';
import { Rectangle } from 'openfl/geom/Rectangle';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import { ITickable } from './com/monsters/interfaces/ITickable';
import { MonsterBase } from './com/monsters/monsters/MonsterBase';
import { MathUtils } from './com/monsters/utils/MathUtils';
import { BTOWER } from './BTOWER';
import { GLOBAL } from './GLOBAL';
import { MAP } from './MAP';
import { EFFECTS } from './EFFECTS';
import { SOUNDS } from './SOUNDS';
import { Targeting } from './Targeting';

export class GuardTower extends BTOWER implements ICoreBuilding {
    public static readonly k_SPECIAL_ANGLE: Point = new Point(90, 180);
    private static m_teslaPositions: TeslaData[];
    private static m_teslaDamagedPositions: TeslaData[];
    public static readonly k_TYPE: number = 138;

    private m_lastDamagedState: boolean;
    private m_teslas: GuardTowerTesla[];
    private m_tick: number;
    private m_isAttacking: boolean;

    constructor() {
        super();
        GuardTower.m_teslaPositions = [
            new TeslaData(new Point(-0.5, -68), new Point(-180, 0)),
            new TeslaData(new Point(58, -37), new Point(-90, 90)),
            new TeslaData(new Point(-0.5, -7), new Point(0, 180)),
            new TeslaData(new Point(-59, -40), GuardTower.k_SPECIAL_ANGLE)
        ];
        GuardTower.m_teslaDamagedPositions = [
            new TeslaData(new Point(-0.5, -68), new Point(-180, 0)),
            new TeslaData(new Point(58, -26), new Point(-90, 90)),
            new TeslaData(new Point(-6, -7), new Point(0, 180)),
            new TeslaData(new Point(-67, -53), GuardTower.k_SPECIAL_ANGLE)
        ];
        this.m_teslas = [];
        this._animRandomStart = false;
        this._footprint = [new Rectangle(0, 0, 130, 130)];
        this._gridCost = [[new Rectangle(0, 0, 130, 130), 10], [new Rectangle(10, 10, 110, 110), 200]];
        this._type = GuardTower.k_TYPE;
        this.SetProps();
        this.graphic.addEventListener(Event.ENTER_FRAME, this.onEnterFrame.bind(this));
    }

    public override ApplyJar(param1: number): void {
    }

    protected override onEnterFrame(param1: Event): void {
        if (!this._mcHit.parent) {
            return;
        }
        this.anim2Container.visible = false;
        ++this.m_tick;
        this.AnimFrame(true);
        if (this.m_tick % 2 == 0) {
            --this._animTick;
        }
        this.anim2Container.visible = this.m_isAttacking;
    }

    public override Setup(param1: any): void {
        super.Setup(param1);
        this.setupTeslas();
        GLOBAL.setTownHall(this);
    }

    public override Cancel(): void {
        GLOBAL.setTownHall(null);
        super.Cancel();
    }

    public override Constructed(): void {
        super.Constructed();
        GLOBAL.setTownHall(this);
    }

    private setupTeslas(): void {
        for (let _loc1_ = 0; _loc1_ < GuardTower.m_teslaPositions.length; _loc1_++) {
            const _loc2_ = new GuardTowerTesla(this.damage, this._range, GuardTower.m_teslaPositions[_loc1_].angleRange, this._rate);
            if (_loc1_ == 0) {
                _loc2_.parent = MAP._CREEPSMC;
            }
            this.m_teslas.push(_loc2_);
        }
        this.updateTeslaPositions();
    }

    private updateTeslas(): void {
        this.m_isAttacking = false;
        for (let _loc1_ = 0; _loc1_ < this.m_teslas.length; _loc1_++) {
            const _loc2_ = this.m_teslas[_loc1_];
            _loc2_.tick();
            if (_loc2_.target) {
                this.m_isAttacking = true;
            }
        }
    }

    public override Tick(param1: number): void {
        super.Tick(param1);
        if (this.isDamaged != this.m_lastDamagedState && this.m_teslas) {
            this.updateTeslaPositions();
        }
    }

    private updateTeslaPositions(): void {
        const _loc1_ = new Point(this.x, this.y);
        const _loc2_ = this.isDamaged ? GuardTower.m_teslaDamagedPositions : GuardTower.m_teslaPositions;
        for (let _loc3_ = 0; _loc3_ < this.m_teslas.length; _loc3_++) {
            this.m_teslas[_loc3_].moveTo(_loc1_.add(_loc2_[_loc3_].position));
        }
        this.m_lastDamagedState = this.isDamaged;
    }

    public override TickAttack(): void {
        super.TickAttack();
        if (this.m_teslas && this.canAttack) {
            this.updateTeslas();
        }
    }

    protected override onMove(): void {
        this.updateTeslaPositions();
    }
}

// Internal class GuardTowerTesla
class GuardTowerTesla implements ITickable {
    public parent: DisplayObjectContainer;
    private m_x: number;
    private m_y: number;
    private m_target: MonsterBase;
    private m_damage: number;
    private m_range: number;
    private m_attackSpeed: number;
    private m_angleRange: Point;
    private m_timeAbleToFire: number;

    constructor(param1: number, param2: number, param3: Point, param4: number = 0) {
        this.m_timeAbleToFire = 0;
        this.m_damage = param1;
        this.m_attackSpeed = param4;
        this.m_range = param2;
        this.m_angleRange = param3;
    }

    public get target(): MonsterBase {
        return this.m_target;
    }

    public tick(param1: number = 1): void {
        if (!this.m_target || this.m_target.health <= 0 || !this.m_target.isTargetable) {
            this.m_target = this.getTarget();
        }
        if (this.m_target) {
            if (Math.random() > 0.5) {
                EFFECTS.Lightning(this.m_x, this.m_y, this.m_target.x, this.m_target.getDisplayY(), this.parent);
            }
            if (Number(GLOBAL.Timestamp()) >= this.m_timeAbleToFire) {
                this.fire();
            }
        }
    }

    private fire(): void {
        SOUNDS.Play("lightningfire", 0.8);
        EFFECTS.Lightning(this.m_x, this.m_y, this.m_target.x, this.m_target.getDisplayY(), this.parent);
        this.m_target.modifyHealth(-this.m_damage, this.m_target);
        this.m_timeAbleToFire = Number(GLOBAL.Timestamp()) + this.m_attackSpeed;
    }

    public moveTo(param1: Point): void {
        this.m_x = param1.x;
        this.m_y = param1.y;
    }

    private getTarget(): MonsterBase {
        const _loc1_ = Targeting.getCreepsInRange(this.m_range, new Point(this.m_x, this.m_y), Targeting.k_TARGETS_FLYING | Targeting.k_TARGETS_GROUND | Targeting.k_TARGETS_ATTACKERS);
        if (_loc1_.length <= 0) {
            return null;
        }
        _loc1_.sort((a: any, b: any) => a.dist - b.dist);
        for (let _loc2_ = 0; _loc2_ < _loc1_.length; _loc2_++) {
            const _loc3_ = _loc1_[_loc2_].creep as MonsterBase;
            let _loc4_ = MathUtils.getAngleBetweenTwoPointsInDegrees(new Point(this.m_x, this.m_y), new Point(_loc3_.x, _loc3_.y));
            if (this.m_angleRange == GuardTower.k_SPECIAL_ANGLE) {
                _loc4_ = Math.abs(_loc4_);
            }
            if (_loc4_ >= this.m_angleRange.x && _loc4_ <= this.m_angleRange.y) {
                return _loc3_;
            }
        }
        return null;
    }
}

// Internal class TeslaData
class TeslaData {
    public position: Point;
    public angleRange: Point;

    constructor(param1: Point, param2: Point) {
        this.position = param1;
        this.angleRange = param2;
    }
}
