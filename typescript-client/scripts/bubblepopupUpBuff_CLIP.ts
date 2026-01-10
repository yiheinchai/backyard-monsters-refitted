import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="bubblepopupUpBuff_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "bubblepopupUpBuff_CLIP" })
export class bubblepopupUpBuff_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public mcBG: MovieClip;
    public mcTextDuration: TextField;
    public mcText: TextField;

    constructor() {
        super();
    }
}
