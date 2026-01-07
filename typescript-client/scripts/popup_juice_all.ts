import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_juice_all")]
export class popup_juice_all extends MovieClip {
    public tfBody: TextField;
    public btnJuice: Button_CLIP;
    public btnCancel: Button_CLIP;
    public tfTitle: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
