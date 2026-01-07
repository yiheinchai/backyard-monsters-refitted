import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="popup_truce_sent")]
export class popup_truce_sent extends MovieClip {
    public mcIcon1: MovieClip;
    public mcIcon2: MovieClip;
    public mcIcon3: MovieClip;
    public tTitle: TextField;
    public mcFrame: frame_CLIP;
    public bShare: Button_CLIP;

    constructor() {
        super();
    }
}
