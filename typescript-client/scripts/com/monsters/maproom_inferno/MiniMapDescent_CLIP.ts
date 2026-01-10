import { MovieClip } from "openfl/display/MovieClip";

import { MiniMapBackgroundDescent_CLIP } from "./MiniMapBackgroundDescent_CLIP";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.MiniMapDescent_CLIP")]

/**
 * Mini map descent clip - map for inferno descent view.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.MiniMapDescent_CLIP" })
export class MiniMapDescent_CLIP extends MovieClip {
    public background_mc: MiniMapBackgroundDescent_CLIP | null = null;
    public mask_mc: MovieClip | null = null;
    public fow_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
