import { Point } from "openfl/geom/Point";

import { Component } from "../Component";
import { DivisionModifier } from "../modifiers/DivisionModifier";
import { MultiplicationPropertyModifier } from "../modifiers/MultiplicationPropertyModifier";

import { EFFECTS } from "../../../../../EFFECTS";
import { TweenMax } from "gs/TweenMax";

/**
 * Zombiefy - transforms creature into a zombie with modified stats and lightning effects.
 */
export class Zombiefy extends Component {
    private m_attackDelayModifier: DivisionModifier;
    private m_moveSpeedModifier: MultiplicationPropertyModifier;
    private m_damageModifier: MultiplicationPropertyModifier;
    private m_maxHealthModifier: MultiplicationPropertyModifier;

    constructor(speedMultiplier: number, healthMultiplier: number, damageMultiplier: number) {
        super();
        this.m_attackDelayModifier = new DivisionModifier(speedMultiplier);
        this.m_moveSpeedModifier = new MultiplicationPropertyModifier(speedMultiplier);
        this.m_damageModifier = new MultiplicationPropertyModifier(damageMultiplier);
        this.m_maxHealthModifier = new MultiplicationPropertyModifier(healthMultiplier);
    }

    protected override onRegister(): void {
        this.owner.attackDelayProperty.addModifier(this.m_attackDelayModifier);
        this.owner.moveSpeedProperty.addModifier(this.m_moveSpeedModifier);
        this.owner.maxHealthProperty.store();
        this.owner.maxHealthProperty.addModifier(this.m_maxHealthModifier);
        this.owner.maxHealthProperty.updateHealth();
        this.owner.damageProperty.addModifier(this.m_damageModifier);
        TweenMax.to(this.owner._graphicMC, 1, { "colorMatrixFilter": { "saturation": 0 } });
        this.owner.isDisposable = true;
    }

    protected override onUnregister(): void {
        this.owner.attackDelayProperty.removeModifier(this.m_attackDelayModifier);
        this.owner.moveSpeedProperty.removeModifier(this.m_moveSpeedModifier);
        this.owner.maxHealthProperty.removeModifier(this.m_maxHealthModifier);
        this.owner.damageProperty.removeModifier(this.m_damageModifier);
        TweenMax.to(this.owner._graphicMC, 1, { "colorMatrixFilter": { "saturation": 1 } });
    }

    public override tick(delta: number = 1): void {
        if (Math.random() > 0.9) {
            const startPoint: Point = new Point(this.owner.x, this.owner.y).add(this.owner.getRandomPointOnGraphic());
            const endPoint: Point = new Point(this.owner.x, this.owner.y).add(this.owner.getRandomPointOnGraphic());
            EFFECTS.Lightning(startPoint.x, startPoint.y, endPoint.x, endPoint.y, null, 65280);
        }
    }

    public override clone(): Component {
        return new Zombiefy(this.m_moveSpeedModifier.multiple, this.m_maxHealthModifier.multiple, this.m_damageModifier.multiple);
    }
}
