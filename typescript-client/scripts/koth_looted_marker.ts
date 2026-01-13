import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="koth_looted_marker")]
@Embed({ source: "/_assets/assets.swf", symbol: "koth_looted_marker" })
export class koth_looted_marker extends MovieClip {
    public mcBG: MovieClip;
    public check: MovieClip;

    constructor() {
        super();
    }
}
