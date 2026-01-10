import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="popup_mushroomshiny")]
@Embed({ source: "/_assets/assets.swf", symbol: "popup_mushroomshiny" })
export class popup_mushroomshiny extends MovieClip {
    public tTitle: TextField;
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;
    public tMessage: TextField;

    constructor() {
        super();
    }
}
