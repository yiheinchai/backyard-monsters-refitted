import Point from 'openfl/geom/Point';
import { BTRAP } from './BTRAP';

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("./com/monsters/monsters/MonsterBase").MonsterBase; }
function getTargeting(): any { return require("./Targeting").Targeting; }
function getGIBLETS(): any { return require("./GIBLETS").GIBLETS; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getEFFECTS(): any { return require("./EFFECTS").EFFECTS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BHEAVYTRAP - Heavy trap building class
 * Extends BTRAP for heavy trap functionality targeting specific creature types
 */
export class BHEAVYTRAP extends BTRAP {
    constructor() {
        super();
    }

    public override FindTargets(): void {
        const targets: any[] = getTargeting().getCreepsInRange(
            this._range, 
            this._position!, 
            getTargeting().getOldStyleTargets(-1)
        );
        this._hasTargets = false;
        this._targetCreeps = [];
        
        for (const key in targets) {
            const target = targets[key];
            const creep: MonsterBase = target.creep;
            const dist: number = target.dist;
            const pos: Point = target.pos;
            const creatureType: string = creep._creatureID.substr(0, 1);
            const creatureId: number = parseInt(creep._creatureID.substring(creep._creatureID.indexOf("C") + 1));
            
            // Only target specific creature types (C10-C12 and I7-I8)
            if (creatureType === "C" && (creatureId < 10 || creatureId > 12)) {
                continue;
            }
            if (creatureType === "I" && (creatureId < 7 || creatureId > 8)) {
                continue;
            }
            
            this._targetCreeps.push({
                creep: creep,
                dist: dist,
                position: pos
            });
            this._hasTargets = true;
            return;
        }
    }

    public override Explode(): void {
        let targets: any[] = getTargeting().getCreepsInRange(
            this._size,
            new Point(this._mc!.x, this._mc!.y),
            getTargeting().getOldStyleTargets(-1)
        );
        
        let hitCount: number = 0;
        let killCount: number = 0;
        
        for (const key in targets) {
            const target = targets[key];
            const creep: MonsterBase = target.creep;
            if (creep.health > 0) {
                hitCount++;
                const dist: number = target.dist;
                creep.modifyHealth(-(this._buildingProps.damage[0] / this._buildingProps.size * (this._buildingProps.size - dist * 0.5)));
                if (creep.health <= 0) {
                    killCount++;
                    getGIBLETS().Create(new Point(this._mc!.x, this._mc!.y + 3), 0.8, 75, 2);
                }
            }
        }
        
        // Also target creature type 2
        targets = getTargeting().getCreepsInRange(
            this._size,
            new Point(this._mc!.x, this._mc!.y),
            getTargeting().getOldStyleTargets(2)
        );
        
        for (const key in targets) {
            const target = targets[key];
            const creep: MonsterBase = target.creep;
            if (creep.health > 0) {
                hitCount++;
                const dist: number = target.dist;
                creep.modifyHealth(-(this._buildingProps.damage[0] * 0.5 / this._buildingProps.size * (this._buildingProps.size - dist * 0.5)));
                if (creep.health <= 0) {
                    killCount++;
                    getGIBLETS().Create(new Point(this._mc!.x, this._mc!.y + 3), 0.8, 75, 2);
                }
            }
        }
        
        if (hitCount > 0) {
            this._fired = true;
            if (killCount === hitCount) {
                getATTACK().Log("htrap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapkilled", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: killCount
                })}</font>`);
            } else if (killCount > 0) {
                getATTACK().Log("htrap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapdamagedkilled", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: hitCount,
                    v3: killCount
                })}</font>`);
            } else {
                getATTACK().Log("htrap" + this._id, `<font color="#FF0000">${getKEYS().Get("attack_log_trapdamaged", {
                    v1: getKEYS().Get(this._buildingProps.name),
                    v2: hitCount
                })}</font>`);
            }
            getEFFECTS().Scorch(new Point(this._mc!.x, this._mc!.y + 5));
        }
        
        this._hasTargets = false;
        this._mc!.visible = true;
        this.setHealth(0);
        getSOUNDS().Play("trap");
        
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            this.RecycleC();
        }
    }
}
