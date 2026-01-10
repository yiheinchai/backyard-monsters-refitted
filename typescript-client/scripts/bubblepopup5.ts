import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="bubblepopup5")]

@Embed({ source: "/_assets/assets.swf", symbol: "bubblepopup5" })
export class bubblepopup5 extends MovieClip {
    public mcBG: MovieClip;
    public mcText: TextField;

    constructor() {
        super();
    }
}
