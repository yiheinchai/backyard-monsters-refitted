import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="PLANNERPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "PLANNERPOPUP_CLIP" })
export class PLANNERPOPUP_CLIP extends MovieClip {
    public tName: TextField;
    public mcMap: MovieClip;
    public title_txt: TextField;
    public bContinue: Button_CLIP;
    public txtGuide: TextField;
    public bExpand: Button_CLIP;
    public mcNameBG: MovieClip;
    public bZoom1: Button_CLIP;
    public bRanges: Button_CLIP;
    public bZoom2: Button_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
