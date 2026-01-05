import MovieClip from 'openfl/display/MovieClip';

/**
 * CheckBox_CLIP - Base UI clip class for Check Box
 * Contains frame script for checkbox control
 * Converted from ActionScript to TypeScript
 */
export class CheckBox_CLIP extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
