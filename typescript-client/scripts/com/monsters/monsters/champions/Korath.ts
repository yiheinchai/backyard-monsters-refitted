import Point from "openfl/geom/Point";
import Shape from "openfl/display/Shape";
import Sprite from "openfl/display/Sprite";
import GlowFilter from "openfl/filters/GlowFilter";
import { TweenLite } from "gs/TweenLite";

import { BYMConfig } from "../../configs/BYMConfig";
import { ProjectileEvent } from "../../events/ProjectileEvent";
import { MonsterBase } from "../MonsterBase";
import { FlameEffect } from "../components/statusEffects/FlameEffect";
import { ChampionBase } from "./ChampionBase";
import { PATHING } from "../../pathing/PATHING";
import { Targeting } from "../../../../Targeting";
import { RasterData } from "../../rendering/RasterData";

import { ATTACK } from "../../../../ATTACK";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { FIREBALL } from "../../../../FIREBALL";
import { FIREBALLS } from "../../../../FIREBALLS";
import { GLOBAL } from "../../../../GLOBAL";
import { MAP } from "../../../../MAP";
import { SOUNDS } from "../../../../SOUNDS";
import { SPRITES } from "../../../../SPRITES";

/**
 * Korath - fire-breathing champion with stomp ability.
 */
export class Korath extends ChampionBase {
    public static readonly KORATH_POWER_NORMAL: number = 1;
    public static readonly KORATH_POWER_FIREBALL: number = 2;
    public static readonly KORATH_POWER_STOMP: number = 3;

    public _attackNum: number = 0;
    public _quaking: boolean = false;

    constructor(
        creatureID: string, 
        pos: Point, 
        direction: number, 
        target: Point | null = null, 
        friendly: boolean = false, 
        building: BFOUNDATION | null = null, 
        level: number = 1, 
        param8: number = 0, 
        param9: number = 0, 
        param10: number = 1, 
        health: number = 20000, 
        param12: number = 0, 
        powerLevel: number = 1
    ) {
        super(creatureID, pos, direction, target, friendly, building, level, param8, param9, param10, health, param12, powerLevel);
        this._attackNum = 0;
        this._quaking = false;
        switch (level) {
            case 1:
                this.attackDelayProperty.value = 72;
                break;
            case 2:
                this.attackDelayProperty.value = 72;
                break;
            case 3:
                this.attackDelayProperty.value = 80;
                break;
            case 4:
                this.attackDelayProperty.value = 80;
                break;
            case 5:
                this.attackDelayProperty.value = 80;
                break;
            case 6:
                this.attackDelayProperty.value = 80;
                break;
            default:
                this.attackDelayProperty.value = 72;
        }
    }

    protected override changeMode(): void {
        super.changeMode();
        this._quaking = false;
    }

    protected override tickBAttack(): void {
        if (this.health > 0 && this.doQuakeCheck()) {
            return;
        }
        super.tickBAttack();
    }

    protected override tickBDefend(): void {
        if (this.health > 0) {
            if (this.doQuakeCheck()) {
                return;
            }
        }
        super.tickBDefend();
    }

    protected override doAttackDamage(): void {
        const dmgMult = 1;
        if (this._targetCreep && this._targetCreep._movement === "fly" && this._powerLevel.Get() >= Korath.KORATH_POWER_FIREBALL && this._level.Get() > 3) {
            if (this._targetCreep.health > 0) {
                this.shootFireball(this._targetCreep);
            }
        } else {
            ++this._attackNum;
            if (Boolean(this._targetBuilding) && this._targetBuilding!._fortification.Get() > 0) {
                ATTACK.Damage(this._tmpPoint.x, this._tmpPoint.y - 5, this.damage * dmgMult * (100 - (this._targetBuilding!._fortification.Get() * 10 + 10)) / 100, this._mc.visible);
            } else {
                ATTACK.Damage(this._tmpPoint.x, this._tmpPoint.y - 5, this.damage * dmgMult, this._mc.visible);
            }
            if (this._targetCreep) {
                this._targetCreep.modifyHealth(-(this.damage * dmgMult));
                this.addFlameDOT(this._targetCreep);
            } else if (this._targetBuilding) {
                this._targetBuilding.modifyHealth(this.damage * dmgMult, this);
            } else {
                this.findTarget();
            }
        }
    }

    protected override doDefenseDamage(): void {
        if (this._powerLevel.Get() >= Korath.KORATH_POWER_FIREBALL && this._level.Get() > 3 && this._targetCreep!._movement === "fly") {
            this.shootFireball(this._targetCreep!);
        } else {
            ++this._attackNum;
            ATTACK.Damage(this._tmpPoint.x, this._tmpPoint.y - 5, this.damage, this._mc.visible);
            this._targetCreep!.modifyHealth(-this.damage);
            this.addFlameDOT(this._targetCreep!);
        }
    }

    private shootFireball(target: MonsterBase): void {
        const offset = 50;
        const startPos = Point.interpolate(this._tmpPoint.add(new Point(0, -offset)), this._targetCreep!._tmpPoint, 0.8);
        const fireball = FIREBALLS.Spawn2(startPos, this._targetCreep!._tmpPoint, this._targetCreep!, 8, this.damage / 4, 0, FIREBALLS.TYPE_MAGMA, 1, this);
        fireball.addEventListener(FIREBALL.COLLIDED, this.addFlameDOTEvent.bind(this), false, 0, true);
    }

    protected override getTargetCreeps(): void {
        if (this._powerLevel.Get() >= Korath.KORATH_POWER_FIREBALL && this._level.Get() > 3) {
            this._targetCreeps = Targeting.getCreepsInRange(800, this._tmpPoint, Targeting.getOldStyleTargets(1));
        } else {
            this._targetCreeps = Targeting.getCreepsInRange(800, this._tmpPoint, Targeting.getOldStyleTargets(0));
        }
    }

    public override canShootCreep(): boolean {
        if (this._targetCreep === null) {
            return false;
        }
        if (this._targetCreep._movement === "fly") {
            if (this._powerLevel.Get() < Korath.KORATH_POWER_FIREBALL || this._level.Get() < 4) {
                return false;
            }
        }
        const dist = GLOBAL.QuickDistance(this._targetCreep._tmpPoint, this._tmpPoint);
        if (dist > this.m_range) {
            return false;
        }
        if (PATHING.LineOfSight(this._tmpPoint.x, this._tmpPoint.y, this._targetCreep._tmpPoint.x, this._targetCreep._tmpPoint.y)) {
            return true;
        }
        return false;
    }

    protected override getNextSprite(): void {
        super.getNextSprite();
        if (this._quaking) {
            SPRITES.GetSprite(this._graphic, this._spriteID, "stomp", this.m_rotation - 45, this._frameNumber);
        }
    }

    private drawFrame(): void {
    }

    private addFlameDOTEvent(event: ProjectileEvent): void {
        (event.target as FIREBALL).removeEventListener(FIREBALL.COLLIDED, this.addFlameDOTEvent.bind(this));
        if (event.m_targetCreep instanceof MonsterBase) {
            this.addFlameDOT(event.m_targetCreep as MonsterBase);
        }
    }

    private addFlameDOT(target: MonsterBase): boolean {
        target.addStatusEffect(new FlameEffect(target, this.damage * 0.1));
        return true;
    }

    private doQuakeCheck(): boolean {
        if (this._creatureID !== "G4") {
            return false;
        }
        if (this._quaking) {
            if (this._frameNumber / 8 % 10 + 20 === 26) {
                const dmgMult = 1;
                this._attackNum = 0;
                SOUNDS.Play("quake", 0.4);
                this.quake(this.damage * dmgMult);
            } else if (this._frameNumber / 8 % 10 + 20 === 29) {
                this._quaking = false;
            }
        } else if (this.attackCooldown <= 0) {
            if (this._powerLevel.Get() >= Korath.KORATH_POWER_STOMP && this._level.Get() > 4 && this._attackNum >= 3) {
                this._quaking = true;
                this._frameNumber = 0;
            }
        }
        return this._quaking;
    }

    private quake(damage: number): void {
        const pos = new Point(this._mc.x, this._mc.y);
        let targetFlags = Targeting.getEnemyFlag(this) | Targeting.k_TARGETS_GROUND | Targeting.k_TARGETS_INVISIBLE;
        if (!this._friendly) {
            targetFlags |= Targeting.k_TARGETS_BUILDINGS;
        }
        const targets = Targeting.getTargetsInRange(this.m_range * 2.5, new Point(this._mc.x, this._mc.y), targetFlags);
        if (targets) {
            Targeting.DealLinearAEDamage(pos, this.m_range * 2.5, damage, targets, this.m_range * 1.5);
        }
        const offsetY = 0;
        const quakeGraphic = new G4QuakeGraphic(20, this.m_range * 2.5, BYMConfig.instance.RENDERER_ON ? new Point(this._rasterPt.x, this._rasterPt.y + this._graphic.height * 0.6) : null);
        quakeGraphic.graphic.y = quakeGraphic.graphic.y + offsetY;
        if (!BYMConfig.instance.RENDERER_ON) {
            this._mc.addChildAt(quakeGraphic.graphic, Math.max(this.graphic.getChildIndex(this._graphicMC) - 1, 0));
        }
    }
}

/**
 * G4QuakeGraphic - visual effect for Korath's stomp attack.
 */
class G4QuakeGraphic {
    public graphic: Shape;
    protected m_rasterData: RasterData | null = null;
    protected m_rasterPt: Point | null = null;

    constructor(size: number, maxSize: number, rasterPt: Point | null = null) {
        this.graphic = new Shape();
        this.graphic.graphics.lineStyle(0.3, 15893760, 0.5);
        this.graphic.graphics.drawEllipse(-size, -size / 2, size * 2, size);
        this.graphic.graphics.drawEllipse(-size * 0.8, -size / 2.5, size * 1.6, size * 0.8);
        this.graphic.graphics.drawEllipse(-size * 0.6, -size / 3.333333, size * 1.2, size * 0.6);
        const glow = new GlowFilter(16737792, 1, 20, 20, 5 + Math.random() * 5, 1, false, false);
        this.graphic.filters = [glow];
        TweenLite.to(this.graphic, 1, {
            "width": maxSize * 2,
            "height": maxSize,
            "alpha": 0,
            "onComplete": this.onComplete.bind(this)
        });
        if (BYMConfig.instance.RENDERER_ON && Boolean(rasterPt)) {
            const container = new Sprite();
            container.addChild(this.graphic);
            this.m_rasterPt = new Point(rasterPt!.x + container.width, rasterPt!.y + container.height);
            this.m_rasterData = new RasterData(container, this.m_rasterPt, MAP.DEPTH_SHADOW + 1);
        }
    }

    private onComplete(): void {
        this.graphic.parent.removeChild(this.graphic);
        this.graphic.filters = [];
        this.graphic = null!;
        if (this.m_rasterData) {
            this.m_rasterData.clear();
        }
        this.m_rasterData = null;
        this.m_rasterPt = null;
    }
}
