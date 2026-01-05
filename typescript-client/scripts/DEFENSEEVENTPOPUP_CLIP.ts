import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * DEFENSEEVENTPOPUP_CLIP - Defense event popup clip
 * Contains UI elements for defense event popup
 * Converted from ActionScript to TypeScript
 */
export class DEFENSEEVENTPOPUP_CLIP extends MovieClip {
    public mcBanner!: MovieClip;
    public mcText!: TextField;
    public rsvpBtn!: Button_CLIP;
    public mcImage!: MovieClip;
    public mcFrame!: frame_CLIP;

    constructor() {
        super();
        this.addFrameScript(1, this.frame2.bind(this));
    }

    protected frame2(): void {
        this.stop();
    }
}
