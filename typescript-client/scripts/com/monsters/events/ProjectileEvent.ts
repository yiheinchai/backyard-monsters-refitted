import Event from "openfl/events/Event";

import { ITargetable } from "../interfaces/ITargetable";
import { BFOUNDATION } from "../../../BFOUNDATION";

/**
 * Event dispatched when a projectile hits a target.
 */
export class ProjectileEvent extends Event {
    public static readonly k_hit: string = "projectileHit";

    public m_targetCreep: ITargetable;
    public m_targetBuilding: BFOUNDATION | null;

    constructor(type: string, targetCreep: ITargetable, targetBuilding: BFOUNDATION | null = null) {
        super(type);
        this.m_targetCreep = targetCreep;
        this.m_targetBuilding = targetBuilding;
    }
}
