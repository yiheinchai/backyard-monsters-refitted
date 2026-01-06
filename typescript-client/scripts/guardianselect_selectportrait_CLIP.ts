import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

/**
 * guardianselect_selectportrait_CLIP - CLIP class for guardian selection portrait
 * Converted from ActionScript to TypeScript
 */
export class guardianselect_selectportrait_CLIP extends MovieClip {
    public bSelectBG: MovieClip;
    public tGuard_label: TextField;
    public mcImage: MovieClip;
    public tGuard_desc: TextField;
    public bAction: Button_CLIP;

    constructor() {
        super();
        this.bSelectBG = new MovieClip();
        this.tGuard_label = new TextField();
        this.mcImage = new MovieClip();
        this.tGuard_desc = new TextField();
        this.bAction = new Button_CLIP();
    }
}
