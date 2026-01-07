import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_aibase_failure")]
export class popup_aibase_failure extends MovieClip {
    public title_txt: TextField;
    public b1: Button_CLIP;
    public headline_txt: TextField;
    public body_txt: TextField;

    constructor() {
        super();
    }
}
