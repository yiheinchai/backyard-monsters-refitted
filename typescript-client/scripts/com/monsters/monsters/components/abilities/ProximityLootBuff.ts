import { SecNum } from "../../../../cc/utils/SecNum";
import { ITickable } from "../../../interfaces/ITickable";
import { ChampionBase } from "../../champions/ChampionBase";
import { Component } from "../Component";
import { LootingMultiplier } from "./LootingMultiplier";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getCREEPS(): any { return require("../../../../../CREEPS").CREEPS; }



/**
 * Proximity loot buff - buffs loot multiplier for nearby allies.
 */
export class ProximityLootBuff extends Component implements ITickable {
    protected _radiusSqrd: SecNum | null = null;
    protected _championOwner: ChampionBase | null = null;
    private m_buddiesInRange: Array<MonsterBase>;

    constructor() {
        super();
        this.m_buddiesInRange = [];
    }

    public override register(owner: MonsterBase, name: string | null = null): void {
        super.register(owner, name);
        this._championOwner = owner as ChampionBase;
        this._radiusSqrd = new SecNum(this._championOwner._buffRadius * this._championOwner._buffRadius);
    }

    public override unregister(): void {
        this.removeBuffFromCreepsNoLongerInRange();
        this._championOwner = null;
        super.onUnregister();
    }

    public override tick(delta: number = 1): void {
        const creeps: Record<string, any> = getCREEPS()._creeps;
        const quickDistSqrd: Function = getGLOBAL().QuickDistanceSquared;
        if (this.owner._behaviour !== getMonsterBase().k_sBHVR_ATTACK && this.owner._behaviour !== getMonsterBase().k_sBHVR_BOUNCE) {
            return;
        }
        if (this.owner._frameNumber % 50 === 0) {
            for (const creepId in creeps) {
                const monster: MonsterBase = creeps[creepId] as MonsterBase;
                if (creeps[creepId] === this.owner || !monster) {
                    continue;
                }
                const lootMod: LootingMultiplier | null = monster.getComponentByType(LootingMultiplier) as LootingMultiplier;
                const inRange: boolean = quickDistSqrd(this._championOwner!._tmpPoint, monster._tmpPoint) < this._radiusSqrd!.Get();
                if (inRange && !lootMod) {
                    monster.addComponent(new LootingMultiplier(1 + this._championOwner!._buff));
                    this.m_buddiesInRange.push(monster);
                }
            }
            this.removeBuffFromCreepsNoLongerInRange();
        }
    }

    private removeBuffFromCreepsNoLongerInRange(): void {
        const quickDistSqrd: Function = getGLOBAL().QuickDistanceSquared;
        for (let i = this.m_buddiesInRange.length - 1; i >= 0; i--) {
            const buddy: MonsterBase = this.m_buddiesInRange[i];
            const lootMod: LootingMultiplier | null = buddy.getComponentByType(LootingMultiplier) as LootingMultiplier;
            const inRange: boolean = quickDistSqrd(this._championOwner!._tmpPoint, buddy._tmpPoint) < this._radiusSqrd!.Get();
            if (!inRange && Boolean(lootMod)) {
                buddy.removeComponent(lootMod);
                this.m_buddiesInRange.splice(i, 1);
            }
        }
    }
}
