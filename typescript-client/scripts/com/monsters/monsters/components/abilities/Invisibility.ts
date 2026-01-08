import { Component } from "../Component";

import { GLOBAL } from "../../../../../GLOBAL";

/**
 * Invisibility - allows creature to become invisible while moving to target.
 */
export class Invisibility extends Component {
    private m_timeInvisiblityExpires: number = 0;
    private m_cooldownDuration: number;
    private m_isInvisible: boolean = false;
    private m_oldAggroRange: number = 0;

    constructor(cooldownDuration: number) {
        super();
        this.m_cooldownDuration = cooldownDuration;
    }

    public override tick(delta: number = 1): void {
        if (this.m_isInvisible) {
            if (this.owner._atTarget) {
                if (this.m_timeInvisiblityExpires) {
                    if (GLOBAL.Timestamp() >= this.m_timeInvisiblityExpires) {
                        this.stopInvisibility();
                    }
                } else {
                    this.m_timeInvisiblityExpires = this.m_cooldownDuration + GLOBAL.Timestamp();
                }
            } else {
                this.m_timeInvisiblityExpires = 0;
            }
        } else if (this.owner._hasTarget && !this.owner._atTarget) {
            this.startInvisibility();
        }
    }

    private startInvisibility(): void {
        this.owner.spriteAction = "invisible";
        this.m_isInvisible = this.owner.invisible = true;
        this.m_oldAggroRange = this.owner.aggroRange;
        this.owner.aggroRange = 1;
    }

    private stopInvisibility(): void {
        this.owner.spriteAction = "walking";
        this.m_isInvisible = this.owner.invisible = false;
        this.owner.aggroRange = this.m_oldAggroRange;
        this.m_timeInvisiblityExpires = 0;
    }
}
