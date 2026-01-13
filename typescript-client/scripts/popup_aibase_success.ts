import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_aibase_success")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_aibase_success" })
export class popup_aibase_success extends MovieClip {
    public title_txt: TextField;
    public b1: Button_CLIP;
    public headline_txt: TextField;
    public b2: Button_CLIP;
    public body_txt: TextField;

    constructor() {
        super();
    }
}
