import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_attacksettings")]
export class popup_attacksettings extends MovieClip {
    public title_txt: TextField;
    public bLess: Button_CLIP;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public bSame: Button_CLIP;
    public bMore: Button_CLIP;
    public taunt_txt: TextField;

    constructor() {
        super();
    }
}
