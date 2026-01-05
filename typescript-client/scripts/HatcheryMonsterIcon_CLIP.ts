import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * HatcheryMonsterIcon_CLIP - Hatchery monster icon clip
 * Displays monster icons in hatchery UI
 * Converted from ActionScript to TypeScript
 */
export class HatcheryMonsterIcon_CLIP extends MovieClip {
    public tLabel!: TextField;
    public mcImage!: MovieClip;
    public mcLoading!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    protected frame1(): void {
        this.stop();
    }
}
