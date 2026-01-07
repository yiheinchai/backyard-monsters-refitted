import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_siegebrag")]
export class popup_siegebrag extends MovieClip {
    public tText: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame3_CLIP;
    public bSpeedup: Button_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
