import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.MapView_CLIP")]

/**
 * Map view clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.views.MapView_CLIP" })
export class MapView_CLIP extends MovieClip {
    public mask_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
