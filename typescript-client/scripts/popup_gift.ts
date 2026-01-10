import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_gift")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_gift" })
export class popup_gift extends MovieClip {
    public bThanks: Button_CLIP;
    public bReturn: Button_CLIP;
    public tA: TextField;
    public tB: TextField;
    public mcPic: MovieClip;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
