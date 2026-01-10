import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ROUNDCOMPLETEPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "ROUNDCOMPLETEPOPUP_CLIP" })
export class ROUNDCOMPLETEPOPUP_CLIP extends MovieClip {
    public mcTitle: TextField;
    public mcBanner: MovieClip;
    public rBtn: Button_CLIP;
    public mcStats: TextField;
    public mcText: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public mBtn: Button_CLIP;
    public lBtn: Button_CLIP;
    public bragBtn: Button_CLIP;

    constructor() {
        super();
        this.addFrameScript(1, this.frame2.bind(this));
    }

    private frame2(): void {
        this.stop();
    }
}
