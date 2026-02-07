import Event from 'openfl/events/Event';
import Rectangle from 'openfl/geom/Rectangle';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import { MapRoom3Cell } from './com/monsters/maproom3/MapRoom3Cell';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }


export class ResourceOutpost extends BFOUNDATION implements ICoreBuilding {
    public static readonly k_TYPE: number = 139;

    constructor() {
        super();
        this._footprint = [new Rectangle(0, 0, 130, 130)];
        this._gridCost = [[new Rectangle(0, 0, 130, 130), 10], [new Rectangle(10, 10, 110, 110), 200]];
        this._type = ResourceOutpost.k_TYPE;
        this.SetProps();
    }

    public get resourcesPerSecond(): number {
        if ((getGLOBAL()._currentCell as MapRoom3Cell) == null || 
            !this._buildingProps.rps || 
            this._buildingProps.rps.length < Math.floor((getGLOBAL()._currentCell as MapRoom3Cell).baseLevel * 0.1 - 1)) {
            return 0;
        }
        return this._buildingProps.rps[Math.floor((getGLOBAL()._currentCell as MapRoom3Cell).baseLevel * 0.1 - 1)];
    }

    public override Setup(param1: any): void {
        super.Setup(param1);
        getGLOBAL().setTownHall(this);
    }

    public override Cancel(): void {
        getGLOBAL().setTownHall(null);
        super.Cancel();
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL().setTownHall(this);
    }

    public override TickFast(param1: Event = null): void {
        super.TickFast(param1);
        this.AnimFrame();
    }
}
