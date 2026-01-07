import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_infernoemerge_upgrade")]
export class popup_infernoemerge_upgrade extends MovieClip {
    public tBody: TextField;
    public tTitle: TextField;
    public frame: frame3_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
