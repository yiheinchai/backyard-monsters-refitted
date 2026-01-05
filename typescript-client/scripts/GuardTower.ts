import { BTOWER } from './BTOWER';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import Event from 'openfl/events/Event';
import { GLOBAL } from './GLOBAL';
import { SOUNDS } from './SOUNDS';

// Stubs for missing dependencies
class EFFECTS {
    public static Lightning(x1: any, y1: any, x2: any, y2: any, parent: any): void {}
}
class MAP {
    public static _CREEPSMC: any = { addChild: () => {} };
}
class Targeting {
    public static k_TARGETS_FLYING: number = 1;
    public static k_TARGETS_GROUND: number = 2;
    public static k_TARGETS_ATTACKERS: number = 4;
    public static getCreepsInRange(range: any, pos: any, flags: any): Array<any> { return []; }
}
class MathUtils {
    public static getAngleBetweenTwoPointsInDegrees(p1: Point, p2: Point): number { return 0; }
}

export class GuardTower extends BTOWER implements ICoreBuilding {
    public static k_SPECIAL_ANGLE: Point = new Point(90, 180);
    private static m_teslaPositions: Array<TeslaData>;
    private static m_teslaDamagedPositions: Array<TeslaData>;
    public static k_TYPE: number = 138;

    private m_lastDamagedState: boolean = false;
    private m_teslas: Array<GuardTowerTesla>;
    private m_tick: number = 0;
    private m_isAttacking: boolean = false;

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
        if (this.graphic) {
            this.graphic.addEventListener(Event.ENTER_FRAME, this.onEnterFrame.bind(this));
        }
    }

    public ApplyJar(param1: number): void {
        super.ApplyJar(param1);
    }

    protected onEnterFrame(param1: any): void {
        if (!this._mcHit.parent) {
            return;
        }
        if (this.anim2Container) {
            this.anim2Container.visible = false;
        }
        this.m_tick++;
        // this.AnimFrame(true); // Stub implementation in BFOUNDATION?
        if (this.m_tick % 2 == 0) {
            this._animTick--;
        }
        if (this.anim2Container) {
            this.anim2Container.visible = this.m_isAttacking;
        }
    }

    public Setup(param1: any): void {
        super.Setup(param1);
        this.setupTeslas();
        GLOBAL.setTownHall(this);
    }

    public Cancel(): void {
        GLOBAL.setTownHall(null);
        super.Cancel();
    }

    public Constructed(): void {
        super.Constructed();
        GLOBAL.setTownHall(this);
    }

    private setupTeslas(): void {
        var _loc2_: GuardTowerTesla;
        var _loc1_: number = 0;
        while (_loc1_ < GuardTower.m_teslaPositions.length) {
            _loc2_ = new GuardTowerTesla(this.damage, this._range, GuardTower.m_teslaPositions[_loc1_].angleRange, this._rate);
            if (_loc1_ == 0) {
                // _loc2_.parent = MAP._CREEPSMC;
            }
            this.m_teslas.push(_loc2_);
            _loc1_++;
        }
        this.updateTeslaPositions();
    }

    private updateTeslas(): void {
        var _loc2_: GuardTowerTesla;
        this.m_isAttacking = false;
        var _loc1_: number = 0;
        while (_loc1_ < this.m_teslas.length) {
            _loc2_ = this.m_teslas[_loc1_];
            _loc2_.tick();
            if (_loc2_.target) {
                this.m_isAttacking = true;
            }
            _loc1_++;
        }
    }

    public Tick(param1: number): void {
        super.Tick(param1);
        if (this.isDamaged != this.m_lastDamagedState && this.m_teslas) {
            this.updateTeslaPositions();
        }
    }

    private updateTeslaPositions(): void {
        var _loc1_: Point = new Point(this.x, this.y);
        var _loc2_: Array<TeslaData> = this.isDamaged ? GuardTower.m_teslaDamagedPositions : GuardTower.m_teslaPositions;
        var _loc3_: number = 0;
        while (_loc3_ < this.m_teslas.length) {
            this.m_teslas[_loc3_].moveTo(_loc1_.add(_loc2_[_loc3_].position));
            _loc3_++;
        }
        this.m_lastDamagedState = this.isDamaged;
    }

    public TickAttack(): void {
        super.TickAttack();
        if (this.m_teslas && this.canAttack) {
            this.updateTeslas();
        }
    }

    protected onMove(): void {
        this.updateTeslaPositions();
    }
}

class GuardTowerTesla {
    public parent: any;
    private m_x: number = 0;
    private m_y: number = 0;
    private m_target: any; // MonsterBase stub
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

    public get target(): any {
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
            if (Date.now() >= this.m_timeAbleToFire) { // GLOBAL.Timestamp stub
                this.fire();
            }
        }
    }

    private fire(): void {
        SOUNDS.Play("lightningfire");
        EFFECTS.Lightning(this.m_x, this.m_y, this.m_target.x, this.m_target.getDisplayY(), this.parent);
        if (this.m_target.modifyHealth) this.m_target.modifyHealth(-this.m_damage, this.m_target);
        this.m_timeAbleToFire = Date.now() + this.m_attackSpeed;
    }

    public moveTo(param1: Point): void {
        this.m_x = param1.x;
        this.m_y = param1.y;
    }

    private getTarget(): any {
        // Basic stub implementation
        return null;
    }
}

class TeslaData {
    public position: Point;
    public angleRange: Point;

    constructor(param1: Point, param2: Point) {
        this.position = param1;
        this.angleRange = param2;
    }
}
