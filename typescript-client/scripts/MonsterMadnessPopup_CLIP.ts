import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';
//    [Embed(source="/_assets/assets.swf", symbol="MonsterMadnessPopup_CLIP")]

/**
 * MonsterMadnessPopup_CLIP - CLIP class for monster madness popup
 * Converted from ActionScript to TypeScript
 */
export class MonsterMadnessPopup_CLIP extends MovieClip {
    public bAction2: Button_CLIP;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public mcLoading: MovieClip;
    public bAction: Button_CLIP;
    public tCopy: TextField;
    public mcVideo: MovieClip;

    constructor() {
        super();
        this.bAction2 = new Button_CLIP();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.mcLoading = new MovieClip();
        this.bAction = new Button_CLIP();
        this.tCopy = new TextField();
        this.mcVideo = new MovieClip();
    }
}
