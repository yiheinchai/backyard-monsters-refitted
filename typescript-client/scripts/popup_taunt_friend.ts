import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_taunt_friend")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_taunt_friend" })
export class popup_taunt_friend extends MovieClip {
    public mcIcon1: MovieClip;
    public mcIcon2: MovieClip;
    public mcIcon3: MovieClip;
    public tTitle: TextField;
    public mcFrame: frame_CLIP;
    public bShare: Button_CLIP;

    constructor() {
        super();
    }
}
