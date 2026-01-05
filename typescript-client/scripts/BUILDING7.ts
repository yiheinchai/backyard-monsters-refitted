import { BMUSHROOM } from './BMUSHROOM';
import Rectangle from 'openfl/geom/Rectangle';

export class BUILDING7 extends BMUSHROOM {
    constructor() {
        super();
        this._type = 7;
        this._footprint = [new Rectangle(0, 0, 30, 30)];
        this._gridCost = [[new Rectangle(0, 0, 30, 30), 10]];
        this.SetProps();
    }
}
