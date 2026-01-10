import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_truce")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_truce" })
export class popup_truce extends MovieClip {
    public tA: TextField;
    public tB: TextField;
    public bMessage: TextField;
    public bSend: Button_CLIP;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
