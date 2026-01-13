import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_attackedme")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_attackedme" })
export class popup_attackedme extends MovieClip {
    public b1: MovieClip;
    public b2: MovieClip;
    public b3: MovieClip;
    public tA: TextField;
    public mcPic: MovieClip;
    public bShare: Button_CLIP;

    constructor() {
        super();
    }
}
