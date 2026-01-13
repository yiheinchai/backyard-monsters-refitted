import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.ListViewArrow_CLIP")]

/**
 * List view arrow clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.views.ListViewArrow_CLIP" })
export class ListViewArrow_CLIP extends MovieClip {
    public mcArrow: MovieClip | null = null;

    constructor() {
        super();
    }
}
