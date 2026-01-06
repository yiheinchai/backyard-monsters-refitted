import { buttonZoom } from './buttonZoom';

/**
 * buttonZoom_CLIP - CLIP class for zoom button
 * Converted from ActionScript to TypeScript
 */
export class buttonZoom_CLIP extends buttonZoom {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 3, this.frame4.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame4(): void {
        this.stop();
    }
}
