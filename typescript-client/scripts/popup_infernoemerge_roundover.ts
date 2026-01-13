import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "./Button_CLIP";
import { frame3_CLIP } from "./frame3_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_infernoemerge_roundover")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_infernoemerge_roundover" })
export class popup_infernoemerge_roundover extends MovieClip {
    public tBody: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame3_CLIP;
    public bAction: Button_CLIP;

    constructor() {
        super();
    }
}
