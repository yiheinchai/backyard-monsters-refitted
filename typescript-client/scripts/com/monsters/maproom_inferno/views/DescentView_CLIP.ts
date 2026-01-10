import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.views.DescentView_CLIP")]

/**
 * Descent view clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.views.DescentView_CLIP" })
export class DescentView_CLIP extends MovieClip {
    public mask_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
