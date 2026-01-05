import { BFOUNDATION } from './BFOUNDATION';
import { ILootable } from './com/monsters/interfaces/ILootable';
import { GLOBAL } from './GLOBAL';
import { SecNum } from './com/cc/utils/SecNum';
import MouseEvent from 'openfl/events/MouseEvent';
import MovieClip from 'openfl/display/MovieClip';

// Stubs for dependencies
class CModifiableProperty {
    public value: number = 0;
}
class mc_buildingalerticon extends MovieClip {}
class ResourcePackages {
    public static Create(type: number, source: any, amount: number): void {}
}
class ATTACK {
    public static Loot(type: number, amount: number, x: number, y: number, z: number, source: any): void {}
}
class BASE {
    public static isMainYardInfernoOnly: boolean = false;
    public static isOutpost: boolean = false;
    public static isInfernoMainYardOrOutpost: boolean = false;
    public static isOutpostMapRoom2Only: boolean = false;
    public static _resources: any = {};
    public static _hpResources: any = {};
    public static _deltaResources: any = { dirty: false };
    public static _hpDeltaResources: any = { dirty: false };
    public static Fund(type: number, amount: number, mock: boolean, source: any): number { return 0; }
    public static PointsAdd(amount: number): void {}
    public static CalcResources(): void {}
}
class KEYS {
    public static Get(key: string, data: any = null): string { return key; }
}
class POPUPS {
    public static Next(): void {}
    public static Push(popup: any, p2: any, p3: any, p4: any, p5: any = null): void {}
}
class TUTORIAL {
    public static _stage: number = 0;
}
class QUESTS {
    public static _global: any = { singleclickbank: 0 };
    public static Check(): void {}
}
class LOGGER {
    public static Log(type: string, msg: string): void { console.log(type, msg); }
    public static Stat(data: any): void {}
}
class MapRoomManager {
    public static instance: any = { isInMapRoom2: false };
}

export class BRESOURCE extends BFOUNDATION implements ILootable {
    public static RESOURCE_TWIGS: number = 1;
    public static RESOURCE_PEBBLES: number = 2;
    public static RESOURCE_PUTTY: number = 3;
    public static RESOURCE_GOO: number = 4;
    public static RESOURCE_BONE: number = 5;
    public static RESOURCE_COAL: number = 6;
    public static RESOURCE_SULFUR: number = 7;
    public static RESOURCE_MAGMA: number = 8;

    public productionRateProperty: CModifiableProperty;
    public productionCapacityProperty: CModifiableProperty;
    private _spriteAlert: any;

    constructor() {
        super();
        this.productionRateProperty = new CModifiableProperty();
        this.productionCapacityProperty = new CModifiableProperty();
    }

    public SetProps(): void {
        super.SetProps();
        this._spriteAlert = new mc_buildingalerticon();
        this._spriteAlert.cacheAsBitmap = true;
        this._spriteAlert.mouseChildren = false;
        this._spriteAlert.mouseEnabled = false;
    }

    public Loot(param1: number): number {
        // Stub
        return param1;
    }

    public StartProduction(): void {
        if (this.health > 0) {
            this._producing = 1;
        }
    }

    public get productionCapacity(): number {
        return this.productionCapacityProperty.value;
    }
    
    public get productionValue(): number {
        return this.productionRateProperty.value;
    }
}
