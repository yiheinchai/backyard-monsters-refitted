import BitmapFilter from "openfl/filters/BitmapFilter";
import GlowFilter from "openfl/filters/GlowFilter";

import { IPropertyModifier } from "../../../interfaces/IPropertyModifier";
import { Component } from "../Component";
import { ArmorPropertyModifier } from "../modifiers/ArmorPropertyModifier";
import { DivisionModifier } from "../modifiers/DivisionModifier";
import { MultiplicationPropertyModifier } from "../modifiers/MultiplicationPropertyModifier";

import { SPECIALEVENT } from "../../../../../SPECIALEVENT";

/**
 * Enrage - ability that boosts move speed, attack speed, and armor.
 */
export class Enrage extends Component {
    private m_moveSpeedModifier: IPropertyModifier;
    private m_attackSpeedModifier: IPropertyModifier;
    private m_armorModifier: IPropertyModifier;
    private m_filter: BitmapFilter;
    private m_sourceCreatureID: string | null;

    constructor(speedMultiplier: number, armorBonus: number, sourceCreatureID: string | null = null) {
        super();
        this.m_moveSpeedModifier = new MultiplicationPropertyModifier(speedMultiplier);
        this.m_attackSpeedModifier = new DivisionModifier(speedMultiplier);
        this.m_armorModifier = new ArmorPropertyModifier(armorBonus);
        this.m_sourceCreatureID = sourceCreatureID;

        const activeEvent: any = SPECIALEVENT.getActiveSpecialEvent();
        if (activeEvent.active && this.m_sourceCreatureID !== "G3") {
            this.m_filter = new GlowFilter(13582340, 1, 3, 3, 5, 1);
            return;
        }
        this.m_filter = new GlowFilter(16724735, 0.6, 8, 8, 4, 3);
    }

    protected override onUnregister(): void {
        this.owner.moveSpeedProperty.removeModifier(this.m_moveSpeedModifier);
        this.owner.attackDelayProperty.removeModifier(this.m_attackSpeedModifier);
        this.owner.armorProperty.removeModifier(this.m_armorModifier);
        this.owner.removeFilter(this.m_filter);
    }

    protected override onRegister(): void {
        this.owner.moveSpeedProperty.addModifier(this.m_moveSpeedModifier);
        this.owner.attackDelayProperty.addModifier(this.m_attackSpeedModifier);
        this.owner.armorProperty.addModifier(this.m_armorModifier);
        this.owner.addFilter(this.m_filter);
    }
}
