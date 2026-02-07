import MovieClip from 'openfl/display/MovieClip';
import Shape from 'openfl/display/Shape';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { SecNum } from './com/cc/utils/SecNum';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { SpriteData } from './com/monsters/display/SpriteData';
import { SpriteSheetAnimation } from './com/monsters/display/SpriteSheetAnimation';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { IMapRoomCell } from './com/monsters/maproom_manager/IMapRoomCell';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getPATHING(): any { return require("./com/monsters/pathing/PATHING").PATHING; }
function getSiegeWeapons(): any { return require("./com/monsters/siege/SiegeWeapons").SiegeWeapons; }
function getJars(): any { return require("./com/monsters/siege/weapons/Jars").Jars; }
function getVacuum(): any { return require("./com/monsters/siege/weapons/Vacuum").Vacuum; }
function getVacuumHose(): any { return require("./com/monsters/siege/weapons/VacuumHose").VacuumHose; }
function getBASE(): any { return require("./BASE").BASE; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getGRID(): any { return require("./GRID").GRID; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSPRITES(): any { return require("./SPRITES").SPRITES; }
function getTargeting(): any { return require("./Targeting").Targeting; }


/**
 * BTOWER - Tower defense building class
 * Extends BFOUNDATION for attack towers (cannons, snipers, etc.)
 */
export class BTOWER extends BFOUNDATION {
    private static _targetFlyerMode: Record<string, number> = {
        "20": 0, "21": 1, "23": 0, "25": 1, "115": 2, "118": 0, "129": 0, "130": 0, "132": 1
    };

    private creeps: any[] = [];
    private maxDist: number = 0;
    private minDist: number = 0;
    public _frameNumber: number = 0;
    public _hasTargets: boolean = false;
    public _targetCreeps: any[] = [];
    public _priority: number = 1;
    public _retarget: number = 0;
    public _top: number = 0;
    public _fireTick: number = 0;
    public _target: IAttackable | null = null;
    private pointA: Point | null = null;
    private pointB: Point | null = null;
    private _radiusGraphic: Shape | null = null;
    protected _jarAnimation: SpriteSheetAnimation | null = null;
    public _jarHealth: SecNum | null = null;
    public _targetVacuum: boolean = false;
    protected _maxTargets: number = 1;

    constructor() {
        super();
        this._priority = 1;
        this._retarget = 0;
        this.attackFlags = getTargeting().getOldStyleTargets(0);
    }

    public static AdjustTowerRange(cell: IMapRoomCell | null, range: number): number {
        if (getMapRoomManager().instance.isInMapRoom2 && getBASE().isOutpostMapRoom2Only && 
            cell && cell.cellHeight && cell.cellHeight >= 100) {
            return Math.floor(cell.cellHeight * range / getGLOBAL()._averageAltitude.Get());
        }
        return range;
    }

    public static GetRandomString(strings: string[]): string {
        return strings[Math.floor(Math.random() * strings.length)];
    }

    public Props(): void {
        if (this._lvl.Get() > 0) {
            if (getMapRoomManager().instance.isInMapRoom2 && (getBASE().isOutpostMapRoom2Only || getGLOBAL().mode === "wmattack")) {
                const baseRange: number = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].range;
                this._range = baseRange;
                if (getGLOBAL()._currentCell) {
                    this._range = BTOWER.AdjustTowerRange(getGLOBAL()._currentCell, baseRange);
                }
            } else {
                this._range = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].range;
            }
            this.damageProperty.value = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].damage;
            this._rate = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].rate;
            this._splash = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].splash;
            this._speed = getGLOBAL()._buildingProps[this._type - 1].stats[this._lvl.Get() - 1].speed;
        } else if (this._lvl.Get() > getGLOBAL()._buildingProps[this._type - 1].stats.length) {
            throw new Error("ILLEGAL TOWER LEVEL Type: " + this._type + " Level: " + this._lvl.Get());
        }
        this._fireTick = this._rate;
    }

    public override Place(event: MouseEvent | null = null): void {
        ++getGLOBAL()._bTowerCount;
        getGLOBAL()._bTower = this;
        super.Place(event);
    }

    public override Description(): void {
        this._specialDescription = getKEYS().Get("bdg_tower_desc");
        super.Description();
        this._upgradeDescription = "";
        if (this._lvl.Get() > 0 && this._lvl.Get() < this._buildingProps.costs.length) {
            const currentStats = this._buildingProps.stats[this._lvl.Get() - 1];
            const nextStats = this._buildingProps.stats[this._lvl.Get()];
            let currentRange: number = currentStats.range;
            let nextRange: number = nextStats.range;
            if (getBASE().isOutpost) {
                currentRange = BTOWER.AdjustTowerRange(getGLOBAL()._currentCell, currentRange);
                nextRange = BTOWER.AdjustTowerRange(getGLOBAL()._currentCell, nextRange);
            }
            if (currentStats.range < nextStats.range) {
                this._upgradeDescription += getKEYS().Get("bdg_tower_rangeupgrade", { v1: currentRange, v2: nextRange }) + "<br>";
            }
            if (currentStats.damage * (40 / currentStats.rate) < nextStats.damage * (40 / nextStats.rate)) {
                this._upgradeDescription += getKEYS().Get("bdg_tower_damageupgrade", {
                    v1: Math.floor(currentStats.damage * (40 / currentStats.rate)),
                    v2: Math.floor(nextStats.damage * (40 / nextStats.rate))
                }) + "<br>";
            }
            if (currentStats.splash < nextStats.splash) {
                this._upgradeDescription += getKEYS().Get("bdg_tower_explosionupgrade", { v1: currentStats.splash, v2: nextStats.splash }) + "<br>";
            }
        }
    }

    public get canAttack(): boolean {
        return this.health > 0 && this._countdownBuild.Get() + this._countdownUpgrade.Get() + this._countdownFortify.Get() === 0;
    }

    protected canShootVacuumHose(): boolean {
        const hose: VacuumHose | null = getVacuum().getHose();
        if (hose && getGLOBAL().QuickDistance(new Point(hose.x, hose.y), this._position!) <= this._range && BTOWER._targetFlyerMode[this._type]) {
            return true;
        }
        return false;
    }

    public override TickAttack(): void {
        if (this.canAttack) {
            --this._fireTick;
            if (this._fireTick <= 0) {
                this._fireTick += this._rate * 2;
                const hose: VacuumHose | null = getVacuum().getHose();
                if (!this._targetVacuum && (!this._hasTargets || !this.targetInRange())) {
                    if (this.canShootVacuumHose()) {
                        this._targetVacuum = true;
                        this._fireTick = 30;
                    } else {
                        this._targetVacuum = false;
                        this.FindTargets(this._maxTargets, this._priority);
                        this._fireTick = 30;
                        if (getCREEPS()._creepCount > 150) {
                            this._fireTick += Math.floor(getCREEPS()._creepCount / 15);
                        }
                    }
                } else {
                    if (this._targetVacuum) {
                        if (hose) {
                            this.Fire(hose);
                        } else {
                            this._targetVacuum = false;
                        }
                    } else {
                        for (let i = 0; i < this._targetCreeps.length; i++) {
                            const creep: MonsterBase = this._targetCreeps[i].creep;
                            if (creep.health > 0 && creep.isTargetable && !creep.invisible) {
                                this.Fire(this._targetCreeps[i].creep);
                            } else {
                                this._targetCreeps = [];
                            }
                        }
                    }
                    if (this._retarget) {
                        this.FindTargets(this._maxTargets, this._priority);
                        this._fireTick = 30;
                        if (getCREEPS()._creepCount > 150) {
                            this._fireTick += Math.floor(getCREEPS()._creepCount / 15);
                        }
                        this._retarget = 0;
                    }
                }
            }
        }
        if (this._jarAnimation) {
            this.TickJar();
        }
    }

    public targetInRange(): boolean {
        const towerPos: Point = getGRID().FromISO(this._mc!.x, this._mc!.y);
        towerPos.add(new Point(this._footprint[0].width * 0.5, this._footprint[0].height * 0.5));
        for (let i = 0; i < this._targetCreeps.length; i++) {
            const creepPos: Point = getGRID().FromISO(this._targetCreeps[i].creep._tmpPoint.x, this._targetCreeps[i].creep._tmpPoint.y);
            const distSquared: number = getGLOBAL().QuickDistanceSquared(towerPos, creepPos);
            if (distSquared < this._range * this._range) {
                return true;
            }
        }
        return false;
    }

    public get isJard(): boolean {
        return !!this._jarHealth;
    }

    public ApplyJar(durability: number): void {
        ++this.targetableStatus;
        this._jarAnimation = new SpriteSheetAnimation(getSPRITES().GetSpriteDescriptor(getJars().JAR_GRAPHIC) as SpriteData, getJars().JAR_GRAPHIC_FRAMES);
        this._jarAnimation.render();
        this._jarAnimation.x += -(this._jarAnimation.width * 0.5) + this._middle! * 0.5;
        this._jarAnimation.y += -(this._jarAnimation.height * 0.5);
        this.addChild(this._jarAnimation);
        getSOUNDS().Play(BTOWER.GetRandomString(getJars().LAND_SOUNDS));
    }

    private JarLanded(): void {
        this._jarHealth = new SecNum((getSiegeWeapons().getWeapon(getJars().ID) as Jars).durability);
    }

    private UpdateJar(): void {
        const ratio: number = this._jarHealth!.Get() / (getSiegeWeapons().getWeapon(getJars().ID) as Jars).durability;
        if (ratio < 0.3) {
            this._jarAnimation!.gotoAndStop(2);
            getSOUNDS().Play(BTOWER.GetRandomString(getJars().CRACKING_SOUNDS));
        } else if (ratio < 0.6) {
            this._jarAnimation!.gotoAndStop(1);
            getSOUNDS().Play(BTOWER.GetRandomString(getJars().CRACKING_SOUNDS));
        } else {
            this._jarAnimation!.gotoAndStop(0);
        }
        this._jarAnimation!.render();
    }

    private TickJar(): void {
        if (this._jarHealth && this._jarHealth.Get() <= 0) {
            this.KillJar();
        }
        this._jarAnimation!.update();
        if (this._jarAnimation!.currentFrame >= this._jarAnimation!.totalFrames) {
            this.RemoveJar();
        }
    }

    private RemoveJar(): void {
        this.removeChild(this._jarAnimation!);
        this._jarAnimation = null;
        --this.targetableStatus;
    }

    public KillJar(): void {
        this._jarHealth = null;
        if (this._jarAnimation) {
            this._jarAnimation.play();
            getSOUNDS().Play(BTOWER.GetRandomString(getJars().EXPLODE_SOUNDS));
        }
    }

    public Fire(target: IAttackable): void {
        if (this._jarHealth) {
            this.UpdateJar();
        }
        this._target = target;
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override Upgraded(): void {
        super.Upgraded();
        this.Props();
    }

    public override Constructed(): void {
        super.Constructed();
        this.Props();
    }

    public FindTargets(maxTargets: number, priority: number): void {
        let flyerMode: number = 0;
        if (BTOWER._targetFlyerMode[this._type]) {
            flyerMode = BTOWER._targetFlyerMode[this._type];
        }
        const flags: number = getTargeting().getOldStyleTargets(flyerMode);
        this.creeps = getTargeting().getCreepsInRange(this._range, this._position!.add(new Point(0, this._footprint[0].height / 2)), flags);
        this._hasTargets = false;
        if (this.creeps.length > 0) {
            this._targetCreeps = [];
            if (priority === 1) {
                this.creeps.sort((a: any, b: any) => a.dist - b.dist);
            } else if (priority === 2) {
                this.creeps.sort((a: any, b: any) => b.dist - a.dist);
            } else if (priority === 3) {
                this.creeps.sort((a: any, b: any) => b.hp - a.hp);
            } else if (priority === 4) {
                this.creeps.sort((a: any, b: any) => a.hp - b.hp);
            }
            let count: number = 0;
            for (const key in this.creeps) {
                count++;
                if (count <= maxTargets) {
                    const target = this.creeps[key];
                    this._targetCreeps.push({
                        creep: target.creep,
                        dist: target.dist,
                        position: target.pos
                    });
                    this._hasTargets = true;
                }
            }
        }
    }

    public override RecycleC(): void {
        getGLOBAL()._bTower = null;
        --getGLOBAL()._bTowerCount;
        super.RecycleC();
    }

    public override Cancel(): void {
        getGLOBAL()._bTower = null;
        --getGLOBAL()._bTowerCount;
        super.Cancel();
    }

    protected Rotate(): void {
        if (this._targetVacuum) {
            const townHallPos: Point = getGLOBAL().townHall._position!;
            let towerPos: Point = getPATHING().FromISO(new Point(this._mc!.x, this._mc!.y));
            towerPos = towerPos.add(new Point(35, 35));
            const dx: number = townHallPos.x - towerPos.x;
            const dy: number = townHallPos.y - towerPos.y;
            let angle: number = Math.atan2(dy, dx) * 57.2957795;
            if (angle < 0) angle = 360 + angle;
            angle /= 11.25;
            this._animTick = Math.floor(angle);
            this.AnimFrame();
            ++this._frameNumber;
        } else if (this._hasTargets) {
            const creep: MonsterBase = this._targetCreeps[0].creep;
            const creepPos: Point = getPATHING().FromISO(creep._tmpPoint);
            let towerPos: Point = getPATHING().FromISO(new Point(this._mc!.x, this._mc!.y));
            towerPos = towerPos.add(new Point(35, 35));
            const dx: number = creepPos.x - towerPos.x;
            const dy: number = creepPos.y - towerPos.y;
            let angle: number = Math.atan2(dy, dx) * 57.2957795;
            if (angle < 0) angle = 360 + angle;
            angle /= 11.25;
            this._animTick = Math.floor(angle);
            this.AnimFrame();
            ++this._frameNumber;
        }
    }

    public override Setup(building: any): void {
        super.Setup(building);
        ++getGLOBAL()._bTowerCount;
        getGLOBAL()._bTower = this;
        this.Props();
    }

    public override Over(event: MouseEvent): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && this._lvl.Get() > 0 && 
            this._countdownBuild.Get() === 0 && this._countdownFortify.Get() === 0 && 
            this._countdownUpgrade.Get() === 0 && this.health > 0) {
            // TweenLite.delayedCall(0.25, this.RangeIndicator);
        }
    }

    public override Out(event: MouseEvent): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && this._radiusGraphic) {
            if (this._radiusGraphic.parent) {
                this._radiusGraphic.parent.removeChild(this._radiusGraphic);
            }
            this._radiusGraphic = null;
        }
    }

    public setTarget(target: MonsterBase): void {
        this._target = target;
    }
}
