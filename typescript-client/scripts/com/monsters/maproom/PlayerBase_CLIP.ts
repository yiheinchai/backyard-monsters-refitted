import MovieClip from "openfl/display/MovieClip";
import TextField from "openfl/text/TextField";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.PlayerBase_CLIP")]

/**
 * Player base clip - display for player base on map.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.PlayerBase_CLIP" })
export class PlayerBase_CLIP extends MovieClip {
    public photoFrame_mc: MovieClip | null = null;
    public name_txt: TextField | null = null;
    public placeholder: MovieClip | null = null;
    public frame_mc: MovieClip | null = null;
    public box_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
