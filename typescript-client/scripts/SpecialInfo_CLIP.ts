import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * SpecialInfo_CLIP - CLIP class for special info display
 * Converted from ActionScript to TypeScript
 */
export class SpecialInfo_CLIP extends MovieClip {
    public tName: TextField;
    public mcImage: MovieClip;

    constructor() {
        super();
        this.tName = new TextField();
        this.mcImage = new MovieClip();
    }
}
