import { ReplayableEvent } from "./ReplayableEvent";

function getBrukkargWarEvent(): any { return require("./attackDefend/brukkargWar/BrukkargWarEvent").BrukkargWarEvent; }
function getHellRaisers(): any { return require("./attacking/hellRaisers/HellRaisers").HellRaisers; }
function getMonsterBlitzkrieg(): any { return require("./monsterInvasion/monsterBlitzkrieg/MonsterBlitzkrieg").MonsterBlitzkrieg; }
function getBattletoads(): any { return require("./yardCrawl/battletoads/Battletoads").Battletoads; }

export class ReplayableEventLibrary {
    private static _battleToads: any;
    private static _monsterBlitzkrieg: any;
    private static _hellRaisers: any;
    private static _brukkargEvent: any;
    private static _events: Array<ReplayableEvent> | null = null;

    public static get BATTLE_TOADS(): any {
        if (!ReplayableEventLibrary._battleToads) ReplayableEventLibrary._battleToads = new (getBattletoads())();
        return ReplayableEventLibrary._battleToads;
    }
    public static get MONSTER_BLITZKRIEG(): any {
        if (!ReplayableEventLibrary._monsterBlitzkrieg) ReplayableEventLibrary._monsterBlitzkrieg = new (getMonsterBlitzkrieg())();
        return ReplayableEventLibrary._monsterBlitzkrieg;
    }
    public static get HELL_RAISERS(): any {
        if (!ReplayableEventLibrary._hellRaisers) ReplayableEventLibrary._hellRaisers = new (getHellRaisers())();
        return ReplayableEventLibrary._hellRaisers;
    }
    public static get BRUKKARG_EVENT(): any {
        if (!ReplayableEventLibrary._brukkargEvent) ReplayableEventLibrary._brukkargEvent = new (getBrukkargWarEvent())();
        return ReplayableEventLibrary._brukkargEvent;
    }
    public static get EVENTS(): Array<ReplayableEvent> {
        if (!ReplayableEventLibrary._events) {
            ReplayableEventLibrary._events = [
                ReplayableEventLibrary.BATTLE_TOADS,
                ReplayableEventLibrary.MONSTER_BLITZKRIEG,
                ReplayableEventLibrary.BRUKKARG_EVENT,
                ReplayableEventLibrary.HELL_RAISERS
            ];
        }
        return ReplayableEventLibrary._events;
    }

    constructor() {}

    public static getEventByName(name: string): ReplayableEvent | null {
        for (const event of ReplayableEventLibrary.EVENTS) {
            if (event.name === name) return event;
        }
        return null;
    }

    public static getEventByID(id: number): ReplayableEvent | null {
        for (const event of ReplayableEventLibrary.EVENTS) {
            if (event.id === id) return event;
        }
        return null;
    }
}
