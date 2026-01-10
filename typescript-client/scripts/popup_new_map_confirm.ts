import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_new_map_confirm")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_new_map_confirm" })
export class popup_new_map_confirm extends MovieClip {
    public tfBody: TextField;
    public btnJuice: Button_CLIP;
    public btnCancel: Button_CLIP;
    public tfTitle: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
