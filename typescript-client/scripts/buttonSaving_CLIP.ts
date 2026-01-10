import { buttonSaving } from './buttonSaving';
//    [Embed(source="/_assets/assets.swf", symbol="buttonSaving_CLIP")]

/**
 * buttonSaving_CLIP - CLIP class for saving button
 * Converted from ActionScript to TypeScript
 */
export class buttonSaving_CLIP extends buttonSaving {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 2, this.frame3.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame3(): void {
        this.stop();
    }
}
