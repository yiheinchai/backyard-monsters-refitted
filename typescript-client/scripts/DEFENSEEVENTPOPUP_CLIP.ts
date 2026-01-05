import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * DEFENSEEVENTPOPUP_CLIP - Defense event popup CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="DEFENSEEVENTPOPUP_CLIP")]
 */
export class DEFENSEEVENTPOPUP_CLIP extends MovieClip {
    public mcBanner: MovieClip;
    public mcText: TextField;
    public rsvpBtn: Button_CLIP;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
        this.mcBanner = new MovieClip();
        this.mcText = new TextField();
        this.rsvpBtn = new Button_CLIP();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.addFrameScript(1, this.frame2.bind(this));
    }

    private frame2(): void {
        this.stop();
    }
}
