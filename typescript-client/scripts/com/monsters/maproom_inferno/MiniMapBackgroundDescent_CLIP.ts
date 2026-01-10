import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.MiniMapBackgroundDescent_CLIP")]

/**
 * Mini map background descent clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.MiniMapBackgroundDescent_CLIP" })
export class MiniMapBackgroundDescent_CLIP extends MovieClip {
    constructor() {
        super();
    }
}
