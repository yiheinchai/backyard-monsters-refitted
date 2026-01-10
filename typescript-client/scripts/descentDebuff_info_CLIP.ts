import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="descentDebuff_info_CLIP")]

/**
 * descentDebuff_info_CLIP - CLIP class for descent debuff info display
 * Converted from ActionScript to TypeScript
 */
export class descentDebuff_info_CLIP extends MovieClip {
    public depthBar: MovieClip;
    public tDepth: TextField;
    public tDesc: TextField;
    public tDepth2: TextField;

    constructor() {
        super();
        this.depthBar = new MovieClip();
        this.tDepth = new TextField();
        this.tDesc = new TextField();
        this.tDepth2 = new TextField();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
