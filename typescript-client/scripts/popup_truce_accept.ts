import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_truce_accept")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_truce_accept" })
export class popup_truce_accept extends MovieClip {
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
