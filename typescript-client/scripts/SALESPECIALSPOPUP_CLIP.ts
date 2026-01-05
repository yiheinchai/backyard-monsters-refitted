import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';

export class SALESPECIALSPOPUP_CLIP extends MovieClip {
    public bAction2!: Button_CLIP;
    public bAction3!: MovieClip;
    public bInfo!: MovieClip;
    public tTitle!: TextField;
    public tDesc!: TextField;
    public mcFrame!: frame_CLIP;
    public bAction!: Button_CLIP;
    public bAction4!: MovieClip;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1, 1, this.frame2);
    }

    public frame1(): void {
        this.stop();
    }

    public frame2(): void {
        this.stop();
    }
}
