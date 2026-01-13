import Rectangle from 'openfl/geom/Rectangle';
import { SecNum } from './com/cc/utils/SecNum';
import { BFOUNDATION } from './BFOUNDATION';

/**
 * HatcheryBase - Base class for hatchery buildings
 * Converted from ActionScript to TypeScript
 */
export class HatcheryBase extends BFOUNDATION {
    public _finishCost: SecNum;
    public _finishQueue: any;
    public _finishAll: boolean = true;

    constructor() {
        super();
        this._finishQueue = {};
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this._monsterQueue = [];
        this._finishCost = new SecNum(0);
    }
}
