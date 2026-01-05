import { BFOUNDATION } from './BFOUNDATION';
import { CHAMPIONCAGEPOPUP } from './CHAMPIONCAGEPOPUP';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { SOUNDS } from './SOUNDS';
import { BASE } from './BASE';
import Rectangle from 'openfl/geom/Rectangle';

class CHAMPIONCHAMBERPOPUP {
    public Center(): void {}
    public ScaleUp(): void {}
}

export class CHAMPIONCHAMBER extends BFOUNDATION {
    public static TYPE: number = 119;
    public static _open: boolean = false;
    public static _popup: CHAMPIONCHAMBERPOPUP | null = null;

    public _frozen: any[];

    constructor() {
        super();
        this._frozen = [];
        this._type = 119;
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this.SetProps();
    }

    public static Show(): void {
        if (!CHAMPIONCHAMBER._open) {
            CHAMPIONCHAMBER._open = true;
            GLOBAL.BlockerAdd();
            // CHAMPIONCHAMBER._popup = new CHAMPIONCHAMBERPOPUP(); // Stub
        }
    }

    public static Hide(): void {
        if (CHAMPIONCHAMBER._open) {
            GLOBAL.BlockerRemove();
            SOUNDS.Play("close");
            BASE.BuildingDeselect();
            CHAMPIONCHAMBER._open = false;
        }
    }

    public FreezeGuardian(): void {
        // Stub
    }
    
    public ThawGuardian(id: number): void {
        // Stub
    }
}
