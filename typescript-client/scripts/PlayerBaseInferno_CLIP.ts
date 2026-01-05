import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * PlayerBaseInferno_CLIP - CLIP class for Inferno player base display
 * Converted from ActionScript to TypeScript
 */
export class PlayerBaseInferno_CLIP extends MovieClip {
    public photoFrame_mc: MovieClip;
    public nail: MovieClip;
    public name_txt: TextField;
    public placeholder: MovieClip;
    public frame_mc: MovieClip;
    public box_mc: MovieClip;

    constructor() {
        super();
        this.photoFrame_mc = new MovieClip();
        this.nail = new MovieClip();
        this.name_txt = new TextField();
        this.placeholder = new MovieClip();
        this.frame_mc = new MovieClip();
        this.box_mc = new MovieClip();
    }
}
