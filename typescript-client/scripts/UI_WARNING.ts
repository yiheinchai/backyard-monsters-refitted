import { UI_WARNING_CLIP } from './UI_WARNING_CLIP';

export class UI_WARNING extends UI_WARNING_CLIP {
    constructor() {
        super();
    }

    public Update(param1: string): void {
        if (this.mc && this.mc['tText']) {
            this.mc['tText'].htmlText = param1;
        }
    }
}
