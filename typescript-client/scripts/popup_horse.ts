import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_horse")]
export class popup_horse extends MovieClip {
    public bA: Button_CLIP;
    public bB: Button_CLIP;
    public tName: TextField;
    public tA: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
