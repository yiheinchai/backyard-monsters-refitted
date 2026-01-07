import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_outpost_secured")]
export class popup_outpost_secured extends MovieClip {
    public tfBody: TextField;
    public mcMap: Button_CLIP;
    public mcEnter: Button_CLIP;
    public tfTitle: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
