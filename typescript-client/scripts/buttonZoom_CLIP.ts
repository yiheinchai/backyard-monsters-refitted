import { buttonZoom } from './buttonZoom';

/**
 * buttonZoom_CLIP - Embedded zoom button clip
 * Extends buttonZoom for asset embedding
 * Converted from ActionScript to TypeScript
 */
export class buttonZoom_CLIP extends buttonZoom {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 3, this.frame4.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }

    protected frame4(): void {
        this.stop();
    }
}
