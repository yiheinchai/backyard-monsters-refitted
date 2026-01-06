import MovieClip from 'openfl/display/MovieClip';

/**
 * ui_buffIcon_CLIP - CLIP class for buff icon
 * Converted from ActionScript to TypeScript
 */
export class ui_buffIcon_CLIP extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
