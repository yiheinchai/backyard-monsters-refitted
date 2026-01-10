import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="bubblepopupDownBuff_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "bubblepopupDownBuff_CLIP" })
export class bubblepopupDownBuff_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public mcBG: MovieClip;
    public mcTextDuration: TextField;
    public mcText: TextField;

    constructor() {
        super();
    }
}
