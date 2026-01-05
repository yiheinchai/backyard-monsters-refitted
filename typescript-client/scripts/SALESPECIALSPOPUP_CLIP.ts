import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * SALESPECIALSPOPUP_CLIP - CLIP class for sale specials popup
 * Converted from ActionScript to TypeScript
 */
export class SALESPECIALSPOPUP_CLIP extends MovieClip {
    public bAction2: Button_CLIP;
    public bAction3: MovieClip;
    public bInfo: MovieClip;
    public tTitle: TextField;
    public tDesc: TextField;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;
    public bAction4: MovieClip;

    constructor() {
        super();
        this.bAction2 = new Button_CLIP();
        this.bAction3 = new MovieClip();
        this.bInfo = new MovieClip();
        this.tTitle = new TextField();
        this.tDesc = new TextField();
        this.mcFrame = new frame_CLIP();
        this.bAction = new Button_CLIP();
        this.bAction4 = new MovieClip();
        this.addFrameScript(0, this.frame1.bind(this), 1, this.frame2.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame2(): void {
        this.stop();
    }
}
