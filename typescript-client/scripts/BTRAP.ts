import Point from 'openfl/geom/Point';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { RasterData } from './com/monsters/rendering/RasterData';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getEFFECTS(): any { return require("./EFFECTS").EFFECTS; }
function getGIBLETS(): any { return require("./GIBLETS").GIBLETS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getTargeting(): any { return require("./Targeting").Targeting; }


/**
 * BTRAP - Trap building class
 * Extends BFOUNDATION for explosive trap buildings
 */
export class BTRAP extends BFOUNDATION {
    private creeps: any[] = [];
    private maxDist: number = 0;
    private minDist: number = 0;
    public _hasTargets: boolean = false;
    public _targetCreeps: any[] = [];
    public _retarget: number = 0;

    constructor() {
        super();
        this._fired = false;
        this._retarget = 0;
        this._range = 20;
        this.attackFlags = getTargeting().getOldStyleTargets(-1);
    }

    public override SetProps(): void {
        super.SetProps();
        this.damageProperty.value = this._buildingProps.damage[0];
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD) {
            this._mc!.visible = false;
            this._mcBase!.visible = false;
        }
    }

    protected override updateRasterData(): void {
        if (getGLOBAL().mode !== getGLOBAL().e_BASE_MODE.BUILD) {
            this._mc!.visible = false;
            this._mcBase!.visible = false;
        }
        super.updateRasterData();
    }

    public override TickAttack(): void {
        if (this._countdownBuild.Get() === 0 && !this._fired) {
            if (!this._hasTargets) {
                if (this._retarget === 0) {
                    this.FindTargets();
                    this._retarget = 20;
                }
                --this._retarget;
            } else {
                this.Explode();
            }
        }
    }

    public FindTargets(): void {
        this.creeps = getTargeting().getCreepsInRange(this._range, this._position!, this.attackFlags);
        this._hasTargets = false;
        this._targetCreeps = [];
        
        for (const key in this.creeps) {
            const target = this.creeps[key];
            const creep: MonsterBase = target.creep;
            const dist: number = target.dist;
            const pos: Point = target.pos;
            
            this._targetCreeps.push({
                creep: creep,
                dist: dist,
                position: pos
            });
            this._hasTargets = true;
        }
    }

    public Explode(): void {
        const targets: any[] = getTargeting().getCreepsInRange(
            this._size!,
            new Point(this._mc!.x, this._mc!.y),
            this.attackFlags
        );
        
        let hitCount: number = 0;
        let killCount: number = 0;
        
        for (const key in targets) {
            const target = targets[key];
            const creep: MonsterBase = target.creep;
            if (creep.health > 0) {
                hitCount++;
                const dist: number = target.dist;
                creep.modifyHealth(-(this.damage / this._buildingProps.size * (this._buildingProps.size - dist * 0.5)));
                if (creep.health <= 0) {
                    killCount++;
                    getGIBLETS().Create(new Point(this._mc!.x, this._mc!.y + 3), 0.8, 75, 2);
                }
            }
        }
        
        if (hitCount > 0) {
            this._fired = true;
            if (killCount === hitCount) {
                getATTACK().Log("trap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapkilled", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: killCount
                })}</font>`);
            } else if (killCount > 0) {
                getATTACK().Log("trap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapdamagedkilled", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: hitCount,
                    v3: killCount
                })}</font>`);
            } else {
                getATTACK().Log("trap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapdamaged", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: hitCount
                })}</font>`);
            }
            getEFFECTS().Scorch(new Point(this._mc!.x, this._mc!.y + 5));
        }
        
        this._hasTargets = false;
        this._mc!.visible = true;
        this._mcBase!.visible = true;
        
        if (BYMConfig.instance.RENDERER_ON) {
            for (const rasterData of this._rasterData) {
                if (rasterData) {
                    rasterData.visible = true;
                }
            }
        }
        
        this.setHealth(0);
        getSOUNDS().Play("trap");
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            this.RecycleC();
        }
    }
}
