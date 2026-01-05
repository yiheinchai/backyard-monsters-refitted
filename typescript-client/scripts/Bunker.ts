
import { BFOUNDATION } from './BFOUNDATION';

export class Bunker extends BFOUNDATION {
    public _used: number = 0;
    public _monstersDispatched: any;
    public _monstersDispatchedTotal: number = 0;

    constructor() {
        super();
    }
}
