import { ReplayableEvent } from "./ReplayableEvent";
import { BrukkargWarEvent } from "./attackDefend/brukkargWar/BrukkargWarEvent";
import { HellRaisers } from "./attacking/hellRaisers/HellRaisers";
import { MonsterBlitzkrieg } from "./monsterInvasion/monsterBlitzkrieg/MonsterBlitzkrieg";
import { Battletoads } from "./yardCrawl/battletoads/Battletoads";

/**
 * Replayable event library - registry of all replayable events.
 */
export class ReplayableEventLibrary {
    public static readonly BATTLE_TOADS: Battletoads = new Battletoads();
    public static readonly MONSTER_BLITZKRIEG: MonsterBlitzkrieg = new MonsterBlitzkrieg();
    public static readonly HELL_RAISERS: HellRaisers = new HellRaisers();
    public static readonly BRUKKARG_EVENT: BrukkargWarEvent = new BrukkargWarEvent();

    public static readonly EVENTS: Array<ReplayableEvent> = [
        ReplayableEventLibrary.BATTLE_TOADS,
        ReplayableEventLibrary.MONSTER_BLITZKRIEG,
        ReplayableEventLibrary.BRUKKARG_EVENT,
        ReplayableEventLibrary.HELL_RAISERS
    ];

    constructor() {
    }

    public static getEventByName(name: string): ReplayableEvent | null {
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event: ReplayableEvent = ReplayableEventLibrary.EVENTS[i];
            if (event.name === name) {
                return event;
            }
        }
        return null;
    }

    public static getEventByID(id: number): ReplayableEvent | null {
        for (let i = 0; i < ReplayableEventLibrary.EVENTS.length; i++) {
            const event: ReplayableEvent = ReplayableEventLibrary.EVENTS[i];
            if (event.id === id) {
                return event;
            }
        }
        return null;
    }
}
