import DisplayObject from "openfl/display/DisplayObject";
import MovieClip from "openfl/display/MovieClip";

import { IAttackable } from "../../../interfaces/IAttackable";
import { Targeting } from "../../../../../Targeting";
import { AOEDamageOnDeath } from "./AOEDamageOnDeath";

import { MAP } from "../../../../../MAP";
import { FIREBALL_CLIP } from "../../../../../FIREBALL_CLIP";

/**
 * AOE heal on death - heals nearby friendly units on death.
 */
export class AOEHealOnDeath extends AOEDamageOnDeath {
    protected m_healAmount: number;

    constructor(radius: number = 200, healAmount: number = 100, maxTargets: number = 4294967295) {
        super(radius, Targeting.k_TARGETS_ALL, maxTargets);
        this.m_healAmount = healAmount;
    }

    protected override dealAOEDamage(damage: number, initialTarget: IAttackable | null = null): void {
        const radiusX: number = this.m_radiusOuter;
        const radiusY: number = this.m_radiusOuter;
        super.dealAOEDamage(this.m_healAmount, initialTarget);
        for (let i = 0; i < 10; i++) {
            const fireball: MovieClip = new FIREBALL_CLIP();
            MAP._FIREBALLS.addChild(fireball);
            fireball.gotoAndStop(2);
            fireball.x = this.owner._mc.x;
            fireball.y = this.owner._mc.y;
            const randX: number = Math.random() * 2 - 1;
            const destX: number = fireball.x + randX * radiusX;
            const randY: number = Math.random() * 2 - 1;
            const baseY: number = randX * -1 * radiusY;
            const destY: number = baseY + radiusY * 1.5;
        }
    }

    private removeFireball(fireball: DisplayObject): void {
        MAP._FIREBALLS.removeChild(fireball);
    }
}
