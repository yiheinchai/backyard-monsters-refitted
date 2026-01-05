import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

export class GUARDIANSELECTPOPUP_CLIP extends MovieClip {
    public mcMask!: MovieClip;
    public tTitle!: TextField;
    public frame!: frame_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1);
    }

    public frame1(): void {
        this.stop();
    }
}
