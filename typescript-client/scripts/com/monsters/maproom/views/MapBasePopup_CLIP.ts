import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";

import { Button_CLIP } from "../../../Button_CLIP";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.views.MapBasePopup_CLIP")]

/**
 * Map base popup clip - popup display for map base actions.
 */
export class MapBasePopup_CLIP extends MovieClip {
    public title_txt: TextField | null = null;
    public attackBtn: Button_CLIP | null = null;
    public helpBtn: Button_CLIP | null = null;
    public bg_mc: MovieClip | null = null;
    public msgBtn: Button_CLIP | null = null;
    public truceBtn: Button_CLIP | null = null;

    constructor() {
        super();
    }
}
