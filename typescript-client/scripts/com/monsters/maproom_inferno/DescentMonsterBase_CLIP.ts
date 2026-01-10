import MovieClip from "openfl/display/MovieClip";
import SimpleButton from "openfl/display/SimpleButton";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.DescentMonsterBase_CLIP")]

/**
 * Descent monster base clip - monster base display for inferno descent.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.DescentMonsterBase_CLIP" })
export class DescentMonsterBase_CLIP extends MovieClip {
    public mediumhit: SimpleButton | null = null;
    public smallhit: SimpleButton | null = null;
    public mcBase: MovieClip | null = null;
    public largehit: SimpleButton | null = null;

    constructor() {
        super();
    }
}
