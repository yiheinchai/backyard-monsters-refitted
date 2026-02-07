import Point from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { AOEEnrage } from "../components/abilities/AOEEnrage";
import { ChampionBase } from "./ChampionBase";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getPATHING(): any { return require("../../pathing/PATHING").PATHING; }
function getATTACK(): any { return require("../../../../ATTACK").ATTACK; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getCHAMPIONCAGE(): any { return require("../../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getFIREBALL(): any { return require("../../../../FIREBALL").FIREBALL; }
function getFIREBALLS(): any { return require("../../../../FIREBALLS").FIREBALLS; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }
function getLOGIN(): any { return require("../../../../LOGIN").LOGIN; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }
function getSPRITES(): any { return require("../../../../SPRITES").SPRITES; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }



/**
 * Fomor - Water champion that buffs allies and attacks enemies.
 */
export class Fomor extends ChampionBase {
    constructor(
        creatureId: string,
        position: Point,
        rotation: number,
        targetPos: Point | null = null,
        defending: boolean = false,
        targetBld: BFOUNDATION | null = null,
        level: number = 1,
        param8: number = 0,
        param9: number = 0,
        param10: number = 1,
        param11: number = 20000,
        param12: number = 0,
        param13: number = 1
    ) {
        super(creatureId, position, rotation, targetPos, defending, targetBld, level, param8, param9, param10, param11, param12, param13);
        this.attackDelayProperty.value = 8;
        if (this._behaviour === "bounce") {
            this._graphicMC.y -= this._altitude;
            this.changeModeBuff();
        }
        getSPRITES().SetupSprite("bigshadow");
        this.addComponent(new AOEEnrage(250, 1 + this._buff * 2, this._buff));
        this.attackFlags = getTargeting().getOldStyleTargets(1);
    }

    public override tick(delta: number = 1): boolean {
        const result = super.tick(delta);
        switch (this._behaviour) {
            case ChampionBase.k_sBHVR_BUFF:
                this.tickBBuff();
                break;
            case ChampionBase.k_sBHVR_PEN:
                this._hasTarget = false;
                break;
        }
        return result;
    }

    public override canShootCreep(): boolean {
        if (this._targetCreep === null) {
            return false;
        }
        const dist = getGLOBAL().QuickDistance(this._targetCreep._tmpPoint, this._tmpPoint);
        if (dist > this.m_range) {
            return false;
        }
        if (getPATHING().LineOfSight(this._tmpPoint.x, this._tmpPoint.y, this._targetCreep._tmpPoint.x, this._targetCreep._tmpPoint.y)) {
            return true;
        }
        return false;
    }

    public findBuffTargets(): void {
        const buildings = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        let hasValidBuilding = false;
        for (const building of buildings) {
            const b = building as BFOUNDATION;
            if (b._class !== "decoration" && b._class !== "immovable" && b.health > 0 && b._class !== "enemy") {
                hasValidBuilding = true;
            }
        }
        if (!hasValidBuilding) {
            this.changeModeRetreat();
            return;
        }
        this._looking = true;
        let findNewTarget = false;
        this._targetCreeps = getTargeting().getCreepsInRange(1500, this._tmpPoint, getTargeting().getOldStyleTargets(1), this);
        if (this._targetCreeps.length > 0) {
            this._targetCreeps.sort((a: any, b: any) => a.dist - b.dist);
            if (!(Boolean(this._targetCreep) && this._targetCreep!.health > 0 && this._targetCreep!.health < this._targetCreep!.maxHealth)) {
                findNewTarget = true;
                while (this._targetCreeps.length > 0 && (this._targetCreeps[0].creep._behaviour === "heal" || this._targetCreeps[0].creep.health === this._targetCreeps[0].creep.maxHealth)) {
                    this._targetCreeps.shift();
                }
                if (this._targetCreeps.length > 0) {
                    this._helpCreep = this._targetCreeps[0].creep;
                    if (this._movement === "fly") {
                        this._waypoints = [this._helpCreep._tmpPoint];
                        this._targetPosition = this._helpCreep._tmpPoint;
                    } else {
                        this.WaypointTo(this._helpCreep._tmpPoint, null);
                    }
                }
            }
        }
        if (this._targetCreeps.length > 0) {
            findNewTarget = false;
            this._helpCreep = this._targetCreeps[0].creep;
            if (this._movement === "fly") {
                this._waypoints = [this._helpCreep._tmpPoint];
                this._targetPosition = this._helpCreep._tmpPoint;
            } else {
                this.WaypointTo(this._helpCreep._tmpPoint, null);
            }
            this._behaviour = ChampionBase.k_sBHVR_BUFF;
        } else if (this._helpCreep && this._helpCreep.health > 0 && this._helpCreep.health < this._helpCreep.maxHealth) {
            findNewTarget = false;
            if (this._movement === "fly") {
                this._waypoints = [this._helpCreep._tmpPoint];
                this._targetPosition = this._helpCreep._tmpPoint;
            } else {
                this.WaypointTo(this._helpCreep._tmpPoint, null);
            }
            this._behaviour = ChampionBase.k_sBHVR_BUFF;
        } else if (this._targetCreeps.length === 0) {
            this.changeModeAttack();
            return;
        }
        if (this._waypoints.length) {
            this._hasTarget = true;
            this._hasPath = true;
        }
    }

    protected override tickBAttack(): void {
        super.tickBAttack();
        if (this._frameNumber % 100 === 0) {
            this.findBuffTargets();
            if (this._behaviour === ChampionBase.k_sBHVR_BUFF) {
                this.tickBBuff();
                return;
            }
        }
    }

    protected override doAttackDamage(): void {
        if (this._creatureID === "G3") {
            if (Boolean(this._targetCreep) && this._targetCreep!.health > 0) {
                this.rangedAttack(this._targetCreep!);
            } else if (this._targetBuilding) {
                this._targetCenter = this._targetBuilding._position;
                this._targetPosition = this._targetBuilding._position;
                this.rangedAttack(this._targetBuilding);
            } else {
                this.findBuffTargets();
            }
        }
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        let fireball: FIREBALL;
        const startPos = Point.interpolate(this._tmpPoint.add(new Point(0, -this._altitude)), this._targetPosition, 0.8);
        if (target instanceof getBFOUNDATION()) {
            fireball = getFIREBALLS().Spawn(startPos, this._targetPosition, this._targetBuilding!, 8, this.damage, 0, 0, getFIREBALLS().TYPE_FIREBALL, this);
        } else {
            fireball = getFIREBALLS().Spawn2(startPos, this._targetCreep!._tmpPoint, this._targetCreep!, 8, this.damage, 0, getFIREBALLS().TYPE_FIREBALL, 1, this);
        }
        getSOUNDS().Play("hit" + Math.floor(1 + Math.random() * 3), 0.1 + Math.random() * 0.1);
        getFIREBALLS()._fireballs[getFIREBALLS()._id - 1]._graphic.gotoAndStop(3);
        return fireball;
    }

    public tickBBuff(): void {
        if (this.health <= 0) {
            getTargeting().CreepCellDelete(this._id, this.node);
            this.changeModeRetreat();
            getATTACK().Log(this._creatureID, getKEYS().Get("attacklog_champ_retreated", {
                "v1": getLOGIN()._playerName,
                "v2": this._level.Get(),
                "v3": getCHAMPIONCAGE()._guardians[this._creatureID].name
            }));
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.ATTACK) {
                getLOGGER().Stat([54, this._creatureID, 1, this._level.Get()]);
            }
            getSOUNDS().Play("monsterland" + (1 + Math.floor(Math.random() * 3)));
            return;
        }
        if (this._frameNumber % 100 === 0) {
            if (!this._attacking) {
                this.findBuffTargets();
            }
        }
        if (this._hasTarget) {
            if (this._targetCreep) {
                if (this._targetCreep.health <= 0 || this._targetCreep.health === this._targetCreep.maxHealth && this._frameNumber % 20 === 0) {
                    this._hasTarget = false;
                    this._attacking = false;
                    this._atTarget = false;
                    this._hasPath = false;
                    this._helpCreep = null;
                    if (Boolean(this._targetCreep) && this._targetCreep.health <= 0) {
                        this._targetCreep = null;
                    }
                    this.findBuffTargets();
                } else if (getGLOBAL().QuickDistance(this._targetCreep._tmpPoint, this._tmpPoint) < this.m_range) {
                    this._atTarget = true;
                } else {
                    this._atTarget = false;
                }
            } else if (this._helpCreep) {
                if (this._helpCreep._targetBuilding) {
                    this._targetBuilding = this._helpCreep._targetBuilding;
                }
                if (this._helpCreep.health <= 0 || this._helpCreep.health === this._helpCreep.maxHealth && this._frameNumber % 20 === 0) {
                    this._hasTarget = false;
                    this._attacking = false;
                    this._atTarget = false;
                    this._hasPath = false;
                    if (this._helpCreep && this._helpCreep.health <= 0) {
                        this._helpCreep = null;
                    }
                    this.findBuffTargets();
                } else if (this._helpCreep && getGLOBAL().QuickDistance(this._helpCreep._tmpPoint, this._tmpPoint) < this.m_range && Boolean(this._helpCreep._targetBuilding) && getGLOBAL().QuickDistance(this._helpCreep._targetBuilding._position, this._tmpPoint) < this.m_range) {
                    this._atTarget = true;
                } else if (!this._attacking && !this._looking && this._frameNumber % 120 === 0) {
                    this.findBuffTargets();
                } else if (this._attacking && this._helpCreep && getGLOBAL().QuickDistance(this._helpCreep._tmpPoint, this._tmpPoint) > this.m_range * 1.25) {
                    this._attacking = false;
                    this._atTarget = false;
                } else if (this._waypoints.length === 0 && !this._atTarget) {
                    if (this.canHitBuilding()) {
                        this._atTarget = true;
                    } else if (!this._looking) {
                        if (this._movement === "fly") {
                            this._hasPath = true;
                            this._waypoints = [this._targetBuilding!._position];
                            this._targetPosition = this._targetBuilding!._position;
                        } else if (!this._looking) {
                            this._hasPath = false;
                            this._hasTarget = false;
                            this.WaypointTo(this._targetBuilding!._position, this._targetBuilding);
                        }
                    }
                }
            } else if (Boolean(this._targetBuilding) && this._targetBuilding!.health > 0) {
                if (this.canHitBuilding()) {
                    this._atTarget = true;
                } else {
                    this._atTarget = false;
                    this._attacking = false;
                    if (this._waypoints.length === 0 && !this._looking) {
                        this._hasPath = false;
                        if (this._movement === "fly") {
                            this._waypoints = [this._helpCreep!._tmpPoint];
                            this._targetPosition = this._helpCreep!._tmpPoint;
                        } else {
                            this.WaypointTo(this._helpCreep!._tmpPoint, this._targetBuilding);
                        }
                    }
                }
            } else {
                this._attacking = false;
                this._atTarget = false;
                this._hasPath = false;
                this._targetCreep = null;
                this._helpCreep = null;
                this._targetBuilding = null;
                this.findBuffTargets();
            }
        } else {
            this._attacking = false;
            this._atTarget = false;
            this._hasPath = false;
            this._targetCreep = null;
            this._helpCreep = null;
            this._targetBuilding = null;
            this.findBuffTargets();
        }
        if (this._atTarget) {
            if (this.attackCooldown <= 0) {
                this.attackCooldown += Math.floor(this.attackDelay);
                if (Boolean(this._targetCreep) && this._targetCreep!.health > 0) {
                    this._attacking = true;
                    this.rangedAttack(this._targetCreep!);
                    this._targetCenter = this._targetCreep!._tmpPoint;
                    this._targetPosition = this._targetCreep!._tmpPoint;
                } else if (this._helpCreep && this._helpCreep._targetBuilding && this._helpCreep._targetBuilding.health > 0 || this._targetBuilding && this._targetBuilding.health > 0) {
                    if (this._helpCreep) {
                        this._targetBuilding = this._helpCreep._targetBuilding;
                    }
                    if (Boolean(this._targetBuilding) && getGLOBAL().QuickDistance(this._targetBuilding!._position, this._tmpPoint) < this.m_range) {
                        this._attacking = true;
                        this._targetCenter = this._targetBuilding!._position;
                        this._targetPosition = this._targetBuilding!._position;
                        this.rangedAttack(this._targetBuilding!);
                    } else if (this._targetBuilding) {
                        this._attacking = false;
                        this._atTarget = false;
                        if (this._movement === "fly") {
                            this._hasPath = true;
                            this._waypoints = [this._targetBuilding._position];
                            this._targetPosition = this._targetBuilding._position;
                        } else if (!this._looking) {
                            this._hasPath = false;
                            this._hasTarget = false;
                            this.WaypointTo(this._targetBuilding._position, this._targetBuilding);
                        }
                    } else {
                        this._attacking = false;
                        this._atTarget = false;
                        this._hasPath = false;
                        this._targetCreep = null;
                        this._helpCreep = null;
                        this._targetBuilding = null;
                        this.findBuffTargets();
                    }
                } else {
                    this._attacking = false;
                    this._atTarget = false;
                    this._hasTarget = false;
                    this._hasPath = false;
                    this._targetBuilding = null;
                    this._targetCreep = null;
                    this._helpCreep = null;
                    this.findBuffTargets();
                }
            } else {
                --this.attackCooldown;
            }
        } else {
            this._attacking = false;
        }
    }

    public changeModeBuff(): void {
        this.changeMode();
        this._behaviour = ChampionBase.k_sBHVR_BUFF;
        this.findBuffTargets();
    }
}
