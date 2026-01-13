import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_timeout")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_timeout" })
export class popup_timeout extends MovieClip {
    public bGift: Button_CLIP;
    public tA: TextField;
    public tB: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
