import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";

import { Button_CLIP } from "../../../../Button_CLIP";
import { Embed } from "../../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom_inferno.views.DescentBasePopup_CLIP")]

/**
 * Descent base popup clip - popup display for descent base actions.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom_inferno.views.DescentBasePopup_CLIP" })
export class DescentBasePopup_CLIP extends MovieClip {
    public depthBar: MovieClip | null = null;
    public tDepth: TextField | null = null;
    public attackBtn: Button_CLIP | null = null;
    public helpBtn: Button_CLIP | null = null;
    public tDepth2: TextField | null = null;
    public bg_mc: MovieClip | null = null;
    public msgBtn: Button_CLIP | null = null;
    public truceBtn: Button_CLIP | null = null;

    constructor() {
        super();
    }
}
