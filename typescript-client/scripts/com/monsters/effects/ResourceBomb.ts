import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { Point } from "openfl/geom/Point";

import { InstanceManager } from "../managers/InstanceManager";
import { MonsterBase } from "../monsters/MonsterBase";
import { Enrage } from "../monsters/components/abilities/Enrage";
import { TemporaryComponent } from "../monsters/components/abilities/TemporaryComponent";
import { PATHING } from "../pathing/PATHING";
import { ResourceBombParticle } from "./ResourceBombParticle";

import { BASE } from "../../BASE";
import { BFOUNDATION } from "../../BFOUNDATION";
import { BTOWER } from "../../BTOWER";
import { CREEPS } from "../../CREEPS";
import { MAP } from "../../MAP";
import { SPRITES } from "../../SPRITES";

/**
 * Resource bomb - area effect bomb that damages buildings or affects creatures.
 */
export class ResourceBomb {
    private static readonly k_PUTTY_BOMB_ENRAGE: string = "PuttyBombEnrage";

    private position: Point;
    private positionFromISO: Point;
    private size: number;
    private damage: number;
    private particles: Record<string, ResourceBombParticle> = {};
    private i: number = 0;
    private particleCount: number = 0;
    private angle: number = 0;
    private distance: number = 0;
    private damageSum: number = 0;
    private targets: Array<any> = [];
    private bomb: Record<string, any>;
    private tempPoint: Point | null = null;
    private dist: number = 0;
    private tempBuilding: Array<any> | null = null;
    private mctop: DisplayObject | null = null;
    private mcbottom: DisplayObject | null = null;
    private totalDamage: number = 0;
    private resourceid: number;
    private dpp: number = 0;

    constructor(clip: MovieClip, pos: Point, bombData: Record<string, any>, resourceType: number) {
        this.position = pos;
        this.size = bombData.radius;
        this.bomb = bombData;
        this.damage = bombData.damage;
        this.damageSum = 0;
        this.resourceid = bombData.resource;
        this.positionFromISO = PATHING.FromISO(this.position);
        
        if (this.resourceid !== ResourceBombParticle.k_TYPE_PUTTY) {
            const buildings = InstanceManager.getInstancesByClass(BFOUNDATION);
            for (const building of buildings) {
                const buildingPoint = new Point(building._mc.x, building._mc.y + building._middle);
                if (!(building._class === "trap" || building.health <= 0 || building._class === "decoration" || building._class === "enemy" || building._class === "immovable")) {
                    let angle = Math.atan2(this.position.y - buildingPoint.y, this.position.x - buildingPoint.x);
                    const ellipseDist1 = BASE.EllipseEdgeDistanceSqrd(angle, this.size, this.size * BASE._angle);
                    angle = Math.atan2(buildingPoint.y - this.position.y, buildingPoint.x - this.position.x);
                    const ellipseDist2 = BASE.EllipseEdgeDistanceSqrd(angle, building._size * 0.5, building._size * 0.5 * BASE._angle);
                    const dx = this.position.x - buildingPoint.x;
                    const dy = this.position.y - buildingPoint.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq * distSq < (ellipseDist1 + ellipseDist2) * (ellipseDist1 + ellipseDist2)) {
                        this.targets.push([building, 1 - 1 / (this.size * 0.5) * this.dist, this.tempPoint, building._footprint[0].width * 0.5]);
                    }
                }
            }
        } else {
            const creeps = CREEPS._creeps;
            for (const creatureId in creeps) {
                const creep = creeps[creatureId];
                this.tempPoint = PATHING.FromISO(new Point(creep.x, creep.y));
                let sprite: any;
                if (creep._creatureID.substr(0, 1) === "G") {
                    sprite = SPRITES._sprites[creep._spriteID];
                } else {
                    sprite = SPRITES._sprites[creep._creatureID];
                }
                this.tempPoint.add(sprite.middle);
                const dx = this.positionFromISO.x - this.tempPoint.x;
                const dy = this.positionFromISO.y - this.tempPoint.y;
                const radius = this.size * 0.5;
                if (dx * dx + dy * dy < radius * radius) {
                    this.targets.push([creep]);
                }
            }
        }
        
        this.mctop = MAP._BUILDINGTOPS.addChild(new MovieClip());
        this.mcbottom = MAP._BUILDINGBASES.addChild(new MovieClip());
        const particleCount = this.bomb.particles;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * 360 * 0.0174532925;
            this.distance = Math.random() * this.size / 2;
            this.particles[i.toString()] = new ResourceBombParticle(
                this.mctop as MovieClip,
                this.mcbottom as MovieClip,
                new Point(this.position.x + Math.sin(angle) * this.distance, this.position.y + Math.cos(angle) * this.distance * 0.5),
                this,
                i.toString(),
                resourceType,
                this.resourceid
            );
            this.particleCount++;
        }
        this.dpp = bombData.damage / this.particleCount;
    }

    public RemoveParticle(id: string): void {
        this.particles[id].clear();
        delete this.particles[id];
        this.particleCount--;
    }

    public Damage(point: Point): void {
        const targetCount = this.targets.length;
        const isoPoint = PATHING.FromISO(point);
        
        if (this.resourceid !== ResourceBombParticle.k_TYPE_PUTTY) {
            for (const target of this.targets) {
                const building = target[0] as BFOUNDATION;
                const distMult = target[1] * 0.5 + 0.5;
                let dmg = building._type !== 6 ? Math.floor(distMult * this.dpp) : this.dpp;
                if (building._type === 6) {
                    dmg *= building._lvl.Get();
                }
                if (building._class === "wall") {
                    dmg *= 0.06;
                }
                if (building._class === "tower") {
                    dmg *= 0.9;
                    if (building._type !== 22 && building._type !== 128 && (building as BTOWER).isJard) {
                        dmg = 0;
                    }
                }
                if (building._type === 114) {
                    dmg = 0;
                }
                this.totalDamage += dmg;
                building.modifyHealth(dmg);
            }
        } else {
            for (let i = 0; i < targetCount; i++) {
                if (Boolean(this.targets[i][0]._visible) && !this.targets[i][0].dead) {
                    if (this.targets[i][0] instanceof MonsterBase) {
                        const monster = this.targets[i][0] as MonsterBase;
                        if (!monster.getComponentByName(ResourceBomb.k_PUTTY_BOMB_ENRAGE)) {
                            monster.addComponent(new TemporaryComponent(new Enrage(this.bomb.speed, this.bomb.damageMult), this.bomb.speedlength), ResourceBomb.k_PUTTY_BOMB_ENRAGE);
                        }
                    }
                }
            }
        }
    }

    public Tick(): boolean {
        return !this.particleCount;
    }

    public Freeze(): void {
        if (Boolean(this.mctop) && Boolean(this.mctop!.parent)) {
            this.mctop!.parent.removeChild(this.mctop!);
            (this.mcbottom as any).cacheAsBitmap = true;
        }
    }
}
