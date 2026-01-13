import BitmapFilter from "openfl/filters/BitmapFilter";
import GlowFilter from "openfl/filters/GlowFilter";

import { MonsterBase } from "../../MonsterBase";
import { CModifiableProperty } from "../CModifiableProperty";
import { Component } from "../Component";
import { AdditionPropertyModifier } from "../modifiers/AdditionPropertyModifier";

/**
 * Looting modifier - internal class for looting multiplier.
 */
class LootingModifier extends AdditionPropertyModifier {
    constructor(value: number) {
        super(value);
    }
}

/**
 * Looting multiplier - increases looting value for creatures.
 */
export class LootingMultiplier extends Component {
    protected m_multiplier: number;
    protected m_modifier: LootingModifier | null = null;
    protected m_lootingProperty: CModifiableProperty | null = null;
    private m_filter: BitmapFilter | null = null;

    constructor(multiplier: number) {
        super();
        this.m_multiplier = multiplier;
    }

    protected override onRegister(): void {
        this.m_lootingProperty = this.owner.getComponentByName(MonsterBase.k_LOOT_PROPERTY) as CModifiableProperty;
        if (this.m_lootingProperty) {
            this.m_modifier = new LootingModifier(this.m_multiplier);
            this.m_lootingProperty.addModifier(this.m_modifier);
            if (!this.m_filter) {
                this.m_filter = new GlowFilter(5635873, 0.6, 8, 8, 4, 3);
                this.owner.addFilter(this.m_filter);
            }
        }
    }

    protected override onUnregister(): void {
        if (Boolean(this.m_lootingProperty) && Boolean(this.m_modifier)) {
            this.m_lootingProperty!.removeModifier(this.m_modifier!);
        }
        if (this.m_filter) {
            this.owner.removeFilter(this.m_filter);
        }
    }
}
