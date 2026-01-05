import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * ROUNDCOMPLETEPOPUP_CLIP - Round complete popup clip
 * Contains UI elements for round completion display
 * Converted from ActionScript to TypeScript
 */
export class ROUNDCOMPLETEPOPUP_CLIP extends MovieClip {
    public mcTitle!: TextField;
    public mcBanner!: MovieClip;
    public rBtn!: Button_CLIP;
    public mcStats!: TextField;
    public mcText!: TextField;
    public mcImage!: MovieClip;
    public mcFrame!: frame_CLIP;
    public mBtn!: Button_CLIP;
    public lBtn!: Button_CLIP;
    public bragBtn!: Button_CLIP;

    constructor() {
        super();
        this.addFrameScript(1, this.frame2.bind(this));
    }

    protected frame2(): void {
        this.stop();
    }
}
