import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_helpme")]
export class popup_helpme extends MovieClip {
    public tB: TextField;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
