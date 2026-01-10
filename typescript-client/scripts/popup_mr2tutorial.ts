import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";
import { emptyMc } from "./emptyMc";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_mr2tutorial")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_mr2tutorial" })
export class popup_mr2tutorial extends MovieClip {
    public tBody: TextField;
    public mcFrame: frame3_CLIP;
    public bAction: Button_CLIP;
    public mcImageContainer: emptyMc;

    constructor() {
        super();
    }
}
