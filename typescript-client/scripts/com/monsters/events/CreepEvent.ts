import { Event } from "openfl/events/Event";

import { MonsterBase } from "../monsters/MonsterBase";

/**
 * Event dispatched when a creep/monster is spawned.
 */
export class CreepEvent extends Event {
    public static readonly ATTACKING_MONSTER_SPAWNED: string = "attackingCreepSpawned";
    public static readonly DEFENDING_CREEP_SPAWNED: string = "defendingCreepSpawned";

    private m_Creep: MonsterBase;

    constructor(type: string, creep: MonsterBase) {
        super(type);
        this.m_Creep = creep;
    }

    public get creep(): MonsterBase {
        return this.m_Creep;
    }
}
