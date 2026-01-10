import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_quest")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_quest" })
export class popup_quest extends MovieClip {
    public mcBG: frame_CLIP;
    public tA: TextField;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
