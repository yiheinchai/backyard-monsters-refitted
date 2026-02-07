import { BaseBuff } from "../../BaseBuff";
import { CreepEvent } from "../../../events/CreepEvent";
import { MultiplicationPropertyModifier } from "../../../monsters/components/modifiers/MultiplicationPropertyModifier";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }



/**
 * Monster damage multiplier - internal class for monster damage buff.
 */
class MonsterDamageMultiplier extends MultiplicationPropertyModifier {
    constructor(multiplier: number) {
        super(multiplier);
    }
}

/**
 * Monster damage buff - increases monster damage for alliance members.
 */
export class MonsterDamageBuff extends BaseBuff {
    public static readonly ID: number = 5;

    private m_eventType: string;

    constructor(eventType: string) {
        super("Monster Damage", "bufficons/monsterdamagebuff.png");
        this.m_eventType = eventType;
    }

    public override get description(): string {
        return "";
    }

    public override apply(): void {
        getGLOBAL().eventDispatcher.addEventListener(this.m_eventType, this.spawnedDefendingCreep.bind(this));
    }

    protected spawnedDefendingCreep(event: CreepEvent): void {
        event.creep.damageProperty.addModifier(new MonsterDamageMultiplier(this.getValue() * 0.01 + 1));
    }

    public override clear(): void {
        getGLOBAL().eventDispatcher.removeEventListener(this.m_eventType, this.spawnedDefendingCreep.bind(this));
    }
}
