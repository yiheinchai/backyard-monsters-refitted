import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_pleasebuy")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_pleasebuy" })
export class popup_pleasebuy extends MovieClip {
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
    }
}
