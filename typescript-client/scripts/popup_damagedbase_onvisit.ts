import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_damagedbase_onvisit")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_damagedbase_onvisit" })
export class popup_damagedbase_onvisit extends MovieClip {
    public title_txt: TextField;
    public mcImage: MovieClip;
    public body_txt: TextField;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
