import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.ListView_CLIP")]

/**
 * List view clip - display for map room list view.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.views.ListView_CLIP" })
export class ListView_CLIP extends MovieClip {
    public nameBtn: MovieClip | null = null;
    public statusBtn: MovieClip | null = null;
    public lastSeenBtn: MovieClip | null = null;
    public mask_mc: MovieClip | null = null;
    public winBtn: MovieClip | null = null;
    public levelBtn: MovieClip | null = null;

    constructor() {
        super();
    }
}
