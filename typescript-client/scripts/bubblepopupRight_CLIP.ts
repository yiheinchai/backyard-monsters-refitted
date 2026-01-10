import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="bubblepopupRight_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "bubblepopupRight_CLIP" })
export class bubblepopupRight_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public mcBG: MovieClip;
    public mcText: TextField;

    constructor() {
        super();
    }
}
