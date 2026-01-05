import { BFOUNDATION } from './BFOUNDATION';
import Rectangle from 'openfl/geom/Rectangle';
import Point from 'openfl/geom/Point';
import { GLOBAL } from './GLOBAL';
import { POPUPSETTINGS } from './POPUPSETTINGS'; // Used for stubs or references

// Local stubs for champion system
class ChampionBase {
    public static k_CHAMPION_STATUS_NORMAL: number = 0;
}
class Fomor extends ChampionBase {}
class Korath extends ChampionBase {}
class Krallen extends ChampionBase {}
class ProximityLootBuff {}

class CHAMPIONCAGEPOPUP {
    public Center(): void {}
    public ScaleUp(): void {}
    public Setup(v: number): void {}
    public Tick(): void {}
}
class CHAMPIONSELECTPOPUP {
    public Center(): void {}
    public ScaleUp(): void {}
}
class CHAMPIONNAMEPOPUP {}

class BASE {
    public static _guardianData: any[] = [];
    public static BuildingDeselect(): void {}
}
class CREATURES {
    public static _guardian: any = null;
    public static _guardianList: any[] = [];
    public static getGuardian(id: number): any { return null; }
}
class GRID {
    public static ToISO(x: number, y: number, z: number): Point { return new Point(x,y); }
    public static FromISO(x: number, y: number): Point { return new Point(x,y); }
}
class KEYS {
    public static Get(k: string): string { return k; }
}
class POPUPS {
    public static Push(p: any, a: any, b: any, c: any): void {}
    public static Next(): void {}
}
class SOUNDS {
    public static Play(s: string): void {}
}

export class CHAMPIONCAGE extends BFOUNDATION {
    public static TYPE: number = 114;
    public static _open: boolean = false;
    public static _popup: any;
    public static _select: any;
    public static _namepopup: any;

    private static _guardians: any = {
        "G1": { name: "Gorgo", props: { feedTime: 3600*24 } },
        "G2": { name: "Drull", props: { feedTime: 3600*24 } },
        "G3": { name: "Fomor", props: { feedTime: 3600*24 } },
        "G4": { name: "Korath", props: { feedTime: 3600*24 } }
        // ... simplified
    };

    constructor() {
        super();
        this._type = 114;
        this._footprint = [new Rectangle(0, 0, 160, 160)];
        this.SetProps();
    }

    public static Show(): void {
        if (!CHAMPIONCAGE._open) {
            CHAMPIONCAGE._open = true;
            GLOBAL.BlockerAdd();
            // Logic to show popup
            // CHAMPIONCAGE._popup = new CHAMPIONCAGEPOPUP(); // Stub
        }
    }

    public static Hide(e: any = null): void {
        if (CHAMPIONCAGE._open) {
            GLOBAL.BlockerRemove();
            CHAMPIONCAGE._open = false;
        }
    }

    public static GetGuardianProperty(id: string, level: number, prop: string): any {
        return null; // Stub
    }
}
