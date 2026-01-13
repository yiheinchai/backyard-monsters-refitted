import { GameObject } from "../../GameObject";
import { CModifiableProperty } from "./CModifiableProperty";

/**
 * Health property that tracks and updates game object health when modifiers change.
 */
export class MaxHealthProperty extends CModifiableProperty {
    private m_healthProperty: GameObject;
    private m_lastKnownValue: number = 0;

    constructor(gameObject: GameObject, maximum: number = Number.MAX_VALUE, minimum: number = Number.NEGATIVE_INFINITY) {
        super(maximum, minimum, 0);
        this.m_healthProperty = gameObject;
    }

    public store(): void {
        this.m_lastKnownValue = this.value;
    }

    public updateHealth(): void {
        const currentValue = this.value;
        if (this.m_lastKnownValue !== currentValue) {
            const ratio = this.m_healthProperty.health / this.m_lastKnownValue;
            const newHealth = ratio * currentValue;
            if (ratio) {
                this.m_healthProperty.setHealth(newHealth);
            }
        }
    }
}
