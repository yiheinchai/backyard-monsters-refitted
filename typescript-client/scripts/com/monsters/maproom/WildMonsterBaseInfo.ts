import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.WildMonsterBaseInfo")]

/**
 * Wild monster base info - info display for wild monster bases.
 */
export class WildMonsterBaseInfo extends MovieClip {
    public info_txt: TextField | null = null;
    public mcArrow: MovieClip | null = null;
    public mcBG: MovieClip | null = null;

    constructor() {
        super();
    }
}
