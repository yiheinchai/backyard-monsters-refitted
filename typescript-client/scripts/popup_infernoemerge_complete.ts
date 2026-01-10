import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_infernoemerge_complete")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_infernoemerge_complete" })
export class popup_infernoemerge_complete extends MovieClip {
    public tBody: TextField;
    public frame: frame3_CLIP;
    public mcImage: MovieClip;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
