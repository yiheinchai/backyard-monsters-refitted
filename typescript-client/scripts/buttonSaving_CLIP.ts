import { buttonSaving } from './buttonSaving';

/**
 * buttonSaving_CLIP - Embedded saving button clip
 * Extends buttonSaving for asset embedding
 * Converted from ActionScript to TypeScript
 */
export class buttonSaving_CLIP extends buttonSaving {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 2, this.frame3.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }

    protected frame3(): void {
        this.stop();
    }
}
