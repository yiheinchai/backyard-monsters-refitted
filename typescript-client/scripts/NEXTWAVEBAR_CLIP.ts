import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="NEXTWAVEBAR_CLIP")]

/**
 * NEXTWAVEBAR_CLIP - CLIP class for next wave bar in defense events
 * Converted from ActionScript to TypeScript
 */
export class NEXTWAVEBAR_CLIP extends MovieClip {
    public bNext: MovieClip;
    public mcHit: MovieClip;
    public tR: TextField;

    constructor() {
        super();
        this.bNext = new MovieClip();
        this.mcHit = new MovieClip();
        this.tR = new TextField();
    }
}
