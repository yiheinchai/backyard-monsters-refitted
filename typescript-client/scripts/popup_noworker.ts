import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_noworker")]
export class popup_noworker extends MovieClip {
    public bGet: Button_CLIP;
    public tA: TextField;
    public tB: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
