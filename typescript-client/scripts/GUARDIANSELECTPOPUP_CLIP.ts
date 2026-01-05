import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

/**
 * GUARDIANSELECTPOPUP_CLIP - Base UI clip class for Guardian Select Popup
 * Contains all UI element declarations for guardian selection popup
 * Converted from ActionScript to TypeScript
 */
export class GUARDIANSELECTPOPUP_CLIP extends MovieClip {
    public mcMask!: MovieClip;
    public tTitle!: TextField;
    public frame!: frame_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
