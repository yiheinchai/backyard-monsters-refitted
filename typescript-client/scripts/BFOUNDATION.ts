import { GameObject } from './com/monsters/GameObject';
import MovieClip from 'openfl/display/MovieClip';
import Rectangle from 'openfl/geom/Rectangle';
import { SecNum } from './com/cc/utils/SecNum';

/**
 * BFOUNDATION - Base Foundation Building
 * Stub for conversion
 */
export class BFOUNDATION extends GameObject {
    public _footprint: Array<Rectangle> = [];
    public _gridCost: Array<Array<any>> = [];
    public _monsterQueue: Array<any> = [];
    public _finishCost: SecNum;
    public _finishQueue: Object = {};
    public _finishAll: boolean = true;
    public _mcHit: MovieClip;
    public _mcFootprint: MovieClip;
    public _type: number = 0;
    public _animRandomStart: boolean = true;
    public _animTick: number = 0;
    public anim2Container: MovieClip;
    public _buildingProps: any; // Stub
    public _range: number = 0;
    public _rate: number = 0;

    constructor() {
        super();
        this._finishCost = new SecNum(0);
        this._mcHit = new MovieClip();
        this._mcFootprint = new MovieClip();
        this.anim2Container = new MovieClip();
    }

    public Setup(param1: any): void {
        // Stub
    }

    public Constructed(): void {
        // Stub
    }

    public Cancel(): void {
        // Stub
    }

    public Tick(param1: number): void {
        // Stub
    }

    public TickAttack(): void {
        // Stub
    }

    protected onMove(): void {
        // Stub
    }
    
    public Bank(): void {}
    public Description(): void {}
    public RecycleC(): void {}
    public Upgraded(): void {}
    public Update(param1: boolean = false): void {}
    public Place(param1: any = null): void {}
    public Over(param1: any): void {}
    public Out(param1: any): void {}
    public ApplyJar(param1: number): void {}
    
    // Add missing properties used in GuardTower
    public get damage(): number { return 0; }
    public get isDamaged(): boolean { return false; }
    public get canAttack(): boolean { return true; }
    protected onEnterFrame(e: any): void {}
    public SetProps(): void {}
}
