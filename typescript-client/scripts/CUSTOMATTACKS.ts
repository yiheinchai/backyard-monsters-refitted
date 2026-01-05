import { GLOBAL } from './GLOBAL';
import { BASE } from './BASE';
import { GRID } from './GRID'; 
import { MAP } from './MAP';
import { SOUNDS } from './SOUNDS';
import { CREATURES } from './CREATURES';
import { CREEPS } from './CREEPS';
import Point from 'openfl/geom/Point';

// Stubs
class BUILDING27 {
    public static _exists: boolean = false;
}
class WMATTACK {
    public static _isAI: boolean = false;
    public static _inProgress: boolean = false;
    public static AttackB(): void {}
    public static AttackC(): void {}
    public static SpawnA(props: any): any[] { return []; }
}
class UI2 {
    public static _scareAway: any;
    public static Show(type: string): void {}
}
class MONSTERBAITER {
    public static End: Function = () => {};
}

export class CUSTOMATTACKS {
    public static _history: any;
    public static _inProgress: boolean;
    public static _lastClick: number = 0;
    public static _started: boolean;
    public static _isAI: boolean = false;
    public static _attacks: Array<number> = [8000, 18800 /*...*/]; 

    constructor() {}

    public static Setup(): void {
        CUSTOMATTACKS._started = false;
    }

    public static TrojanHorse(): void {
        if (!BUILDING27._exists && !BASE.isInfernoMainYardOrOutpost) {
            // Stubbed
        }
    }

    public static CustomAttack(param1: any[], param2: boolean = false): any[] {
        CUSTOMATTACKS._started = true;
        WMATTACK._isAI = false;
        WMATTACK.AttackB();
        UI2.Show("scareAway");
        if (UI2._scareAway) {
            UI2._scareAway.addEventListener("scareAway", MONSTERBAITER.End);
        }
        return WMATTACK.SpawnA(param1);
    }

    public static WMIAttack(param1: any[]): any[] {
        CUSTOMATTACKS._started = true;
        WMATTACK._isAI = false;
        WMATTACK.AttackB();
        UI2.Show("scareAway");
        return WMATTACK.SpawnA(param1);
    }

    public static TutorialAttack(): void {
        CUSTOMATTACKS._started = true;
        WMATTACK.SpawnA([["C2", "bounce", 1, 180, -10, 0, 1]]);
        SOUNDS.PlayMusic("musicpanic");
        WMATTACK.AttackB();
        WMATTACK.AttackC();
        for (let creep of CREEPS._creeps) {
            // Stub
        }
        WMATTACK._isAI = false;
        WMATTACK._inProgress = true;
    }
}
