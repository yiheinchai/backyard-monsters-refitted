import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_pleaserate")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_pleaserate" })
export class popup_pleaserate extends MovieClip {
    public tA: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
