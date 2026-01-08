import { MovieClip } from "openfl/display/MovieClip";

import { MiniMapBackgroundDescent_CLIP } from "./MiniMapBackgroundDescent_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.MiniMapDescent_CLIP")]

/**
 * Mini map descent clip - map for inferno descent view.
 */
export class MiniMapDescent_CLIP extends MovieClip {
    public background_mc: MiniMapBackgroundDescent_CLIP | null = null;
    public mask_mc: MovieClip | null = null;
    public fow_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
