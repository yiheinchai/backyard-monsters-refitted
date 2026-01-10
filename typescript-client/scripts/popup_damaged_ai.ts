import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_damaged_ai")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_damaged_ai" })
export class popup_damaged_ai extends MovieClip {
    public bAction2: Button_CLIP;
    public tA: TextField;
    public tB: TextField;
    public tC: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
