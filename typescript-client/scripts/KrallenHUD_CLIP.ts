import { MovieClip } from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="KrallenHUD_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "KrallenHUD_CLIP" })
export class KrallenHUD_CLIP extends MovieClip {
    public mcLevel: MovieClip;

    constructor() {
        super();
    }
}
