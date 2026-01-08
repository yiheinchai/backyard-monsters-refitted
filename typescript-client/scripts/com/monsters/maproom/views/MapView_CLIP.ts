import { MovieClip } from "openfl/display/MovieClip";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.MapView_CLIP")]

/**
 * Map view clip.
 */
export class MapView_CLIP extends MovieClip {
    public mask_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
