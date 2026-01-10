import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.MiniMapInferno_CLIP")]

/**
 * Mini map inferno clip.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.MiniMapInferno_CLIP" })
export class MiniMapInferno_CLIP extends MovieClip {
    public background_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
