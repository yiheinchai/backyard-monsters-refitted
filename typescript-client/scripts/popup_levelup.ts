import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_levelup")]
export class popup_levelup extends MovieClip {
    public bPost: Button_CLIP;
    public title_txt: TextField;
    public headline_txt: TextField;
    public mcImage: MovieClip;
    public body_txt: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
