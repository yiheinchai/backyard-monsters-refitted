import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';
//    [Embed(source="/_assets/assets.swf", symbol="WildMonsterBaseInferno_CLIP")]

/**
 * WildMonsterBaseInferno_CLIP - CLIP class for Inferno wild monster base
 * Converted from ActionScript to TypeScript
 */
export class WildMonsterBaseInferno_CLIP extends MovieClip {
    public mediumhit: SimpleButton;
    public photoFrame_mc: MovieClip;
    public smallhit: SimpleButton;
    public name_txt: TextField;
    public placeholder: MovieClip;
    public level_txt: TextField;
    public largehit: SimpleButton;
    public frame_mc: MovieClip;
    public box_mc: MovieClip;

    constructor() {
        super();
        this.mediumhit = new SimpleButton();
        this.photoFrame_mc = new MovieClip();
        this.smallhit = new SimpleButton();
        this.name_txt = new TextField();
        this.placeholder = new MovieClip();
        this.level_txt = new TextField();
        this.largehit = new SimpleButton();
        this.frame_mc = new MovieClip();
        this.box_mc = new MovieClip();
    }
}
