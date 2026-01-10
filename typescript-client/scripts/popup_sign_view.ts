import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { buttonClose_CLIP } from "./buttonClose_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_sign_view")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_sign_view" })
export class popup_sign_view extends MovieClip {
    public subject_txt: TextField;
    public bClose: buttonClose_CLIP;
    public placeholder: MovieClip;
    public name_txt: TextField;
    public bg_mc: MovieClip;
    public photoRing: MovieClip;

    constructor() {
        super();
    }
}
