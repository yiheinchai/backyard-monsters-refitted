import { buttonFullscreen } from './buttonFullscreen';

/**
 * buttonFullscreen_CLIP - CLIP class for fullscreen button
 * Converted from ActionScript to TypeScript
 */
export class buttonFullscreen_CLIP extends buttonFullscreen {
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
