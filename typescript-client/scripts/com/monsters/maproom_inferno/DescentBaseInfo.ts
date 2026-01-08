import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.DescentBaseInfo")]

/**
 * Descent base info - info display for inferno descent.
 */
export class DescentBaseInfo extends MovieClip {
    public info_txt: TextField | null = null;
    public mcArrow: MovieClip | null = null;
    public mcBG: MovieClip | null = null;

    constructor() {
        super();
    }
}
