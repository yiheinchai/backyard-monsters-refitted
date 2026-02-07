import Event from "openfl/events/Event";

import { AOEDamage } from "./AOEDamage";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }


/**
 * AOE damage on death - deals AOE damage when the creature dies.
 */
export class AOEDamageOnDeath extends AOEDamage {
    constructor(radius: number, targetFlags: number, maxTargets: number = 4294967295) {
        super(radius, targetFlags, maxTargets);
    }

    protected override onRegister(): void {
        this.owner.addEventListener(getMonsterBase().k_DEATH_EVENT, this.onDeath.bind(this));
    }

    protected override onUnregister(): void {
        this.owner.removeEventListener(getMonsterBase().k_DEATH_EVENT, this.onDeath.bind(this));
    }

    protected onDeath(event: Event | null = null): void {
        const damage: number = this.owner.damage * (1 + this.owner.powerUpLevel() * 0.5);
        this.dealAOEDamage(damage);
    }
}
