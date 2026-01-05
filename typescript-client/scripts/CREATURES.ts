import { GLOBAL } from './GLOBAL';
import { MAP } from './MAP';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import Point from 'openfl/geom/Point';

// Stubs
class CreepBase {
    constructor(p1:any, p2:any, p3:any, p4:any, p5:any, p6:any, p7:any, p8:any, p9:any, p10:any, p11:any, p12:any) {}
    public graphic: any;
    public _spawned: boolean = false;
    public tick(): boolean { return false; }
}
class CreepEvent {
    public static DEFENDING_CREEP_SPAWNED: string = "defendingCreepSpawned";
    constructor(type: string, data: any) {}
}
class BYMConfig {
    public static instance: any = { RENDERER_ON: true };
}
class CREATURELOCKER {
    public static _creatures: any = {};
}
class SPECIALEVENT {
    public static getActiveSpecialEvent(): any { return { active: false }; }
}

export class CREATURES {
    public static _creatures: any = {};
    public static _creatureID: number = 0;
    public static _creatureCount: number = 0;
    public static _ticks: number = 0;
    public static _guardianList: any[] = [];
    public static _wmCreatureLevels: any = {};

    constructor() {
        CREATURES._creatures = {};
        CREATURES._creatureID = 0;
        CREATURES._creatureCount = 0;
        CREATURES._ticks = 0;
        CREATURES._guardianList = [];
    }

    public static GetProperty(param1: string, param2: string, param3: number = 0, param4: boolean = true): number {
        if (!param1 || param1.substr(0, 1) == "G") {
            return 0;
        }
        return 0; // Stub
    }

    public static Tick(): void {
        for (let key in CREATURES._creatures) {
            let creature = CREATURES._creatures[key];
            if (creature.tick()) {
                delete CREATURES._creatures[key];
            }
        }
    }

    public static Spawn(param1: string, param2: any, param3: string, param4: Point, param5: number, param6: Point | null = null, param7: any = null, param8: number = 0, param9: number = 2147483647): any {
        if (!CREATURELOCKER._creatures[param1]) {
            return null;
        }
        CREATURES._creatureID++;
        CREATURES._creatureCount++;
        let creatureClass = CREATURELOCKER._creatures[param1].classType || CreepBase;
        let creature = new creatureClass(param1, param3, param4, param5, param8, param9, param6, true, param7, 1, false, null);
        CREATURES._creatures[CREATURES._creatureID] = creature;
        return creature;
    }

    public static Clear(): void {
        CREATURES._creatures = {};
        CREATURES._creatureCount = 0;
        CREATURES._guardianList = [];
    }
    
    public static get _guardian(): any {
        return null; 
    }
    public static set _guardian(val: any) {}
}
