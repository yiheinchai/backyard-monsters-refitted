import { MonsterBase } from "../monsters/MonsterBase";

/**
 * Information about a single creep/monster instance.
 */
export class CreepInfo {
    private m_health: number = 0;
    public ownerID: number = 0;
    public self: MonsterBase | null = null;
    public queued: number = 0;

    constructor(ownerID: number = 0, health: number = Number.MAX_VALUE, self: MonsterBase | null = null) {
        this.ownerID = ownerID;
        this.health = health;
        this.self = self;
        this.queued = 0;
    }

    public get health(): number {
        return this.m_health;
    }

    public set health(value: number) {
        this.m_health = value > 0 ? value : 0;
    }
}
