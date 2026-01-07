import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_dialogue")]
export class popup_dialogue extends MovieClip {
    public mcBG: frame3_CLIP;
    public tBody: TextField;
    public tTitle: TextField;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
