import MovieClip from 'openfl/display/MovieClip';
import SimpleButton from 'openfl/display/SimpleButton';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ForeignBaseInferno_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "ForeignBaseInferno_CLIP" })
export class ForeignBaseInferno_CLIP extends MovieClip {
    public mediumhit: SimpleButton;
    public photoFrame_mc: MovieClip;
    public nail: MovieClip;
    public smallhit: SimpleButton;
    public name_txt: TextField;
    public placeholder: MovieClip;
    public largehit: SimpleButton;
    public frame_mc: MovieClip;
    public level: MovieClip;
    public box_mc: MovieClip;

    constructor() {
        super();
    }
}
