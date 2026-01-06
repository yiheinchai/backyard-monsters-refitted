import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { frame_CLIP } from './frame_CLIP';

/**
 * WMIEXTENSIONPOPUP_CLIP - CLIP class for WMI extension popup
 * Converted from ActionScript to TypeScript
 */
export class WMIEXTENSIONPOPUP_CLIP extends MovieClip {
    public mcBanner: MovieClip;
    public mcText: TextField;
    public closeBtn: Button_CLIP;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
        this.mcBanner = new MovieClip();
        this.mcText = new TextField();
        this.closeBtn = new Button_CLIP();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
        this.addFrameScript(1, this.frame2.bind(this));
    }

    private frame2(): void {
        this.closeBtn.stop();
    }
}
