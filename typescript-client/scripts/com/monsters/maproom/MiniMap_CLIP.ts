import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.MiniMap_CLIP")]

/**
 * Mini map clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.MiniMap_CLIP" })
export class MiniMap_CLIP extends MovieClip {
    public background_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
