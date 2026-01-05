import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * descentDebuff_info_CLIP - Descent debuff info clip
 * Displays depth and debuff information
 * Converted from ActionScript to TypeScript
 */
export class descentDebuff_info_CLIP extends MovieClip {
    public depthBar!: MovieClip;
    public tDepth!: TextField;
    public tDesc!: TextField;
    public tDepth2!: TextField;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
