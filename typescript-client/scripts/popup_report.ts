import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame2_CLIP } from "./frame2_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_report")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_report" })
export class popup_report extends MovieClip {
    public sendBtn: Button_CLIP;
    public tDesc: TextField;
    public tTitle: TextField;
    public mcFrame: frame2_CLIP;

    constructor() {
        super();
    }
}
