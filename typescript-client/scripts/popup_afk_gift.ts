import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_afk_gift")]
export class popup_afk_gift extends MovieClip {
    public tA: TextField;
    public tB: TextField;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
