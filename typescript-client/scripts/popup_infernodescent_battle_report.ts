import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_infernodescent_battle_report")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_infernodescent_battle_report" })
export class popup_infernodescent_battle_report extends MovieClip {
    public bButton: Button_CLIP;
    public mcResource1: MovieClip;
    public mcResource2: MovieClip;
    public tBody: TextField;
    public mcResource3: MovieClip;
    public tTitle: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public mcResource4: MovieClip;

    constructor() {
        super();
    }
}
