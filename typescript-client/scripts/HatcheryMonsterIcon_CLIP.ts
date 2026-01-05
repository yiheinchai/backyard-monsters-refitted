import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * HatcheryMonsterIcon_CLIP - Hatchery monster icon CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="HatcheryMonsterIcon_CLIP")]
 */
export class HatcheryMonsterIcon_CLIP extends MovieClip {
    public tLabel: TextField;
    public mcImage: MovieClip;
    public mcLoading: MovieClip;

    constructor() {
        super();
        this.tLabel = new TextField();
        this.mcImage = new MovieClip();
        this.mcLoading = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
