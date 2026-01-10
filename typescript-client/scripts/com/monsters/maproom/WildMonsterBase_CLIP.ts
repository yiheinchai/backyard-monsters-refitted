import MovieClip from "openfl/display/MovieClip";
import SimpleButton from "openfl/display/SimpleButton";
import TextField from "openfl/text/TextField";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.WildMonsterBase_CLIP")]

/**
 * Wild monster base clip - display for wild monster base on map.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "com.monsters.maproom.WildMonsterBase_CLIP" })
export class WildMonsterBase_CLIP extends MovieClip {
    public mediumhit: SimpleButton | null = null;
    public photoFrame_mc: MovieClip | null = null;
    public smallhit: SimpleButton | null = null;
    public icon_mc: MovieClip | null = null;
    public name_txt: TextField | null = null;
    public placeholder: MovieClip | null = null;
    public largehit: SimpleButton | null = null;
    public frame_mc: MovieClip | null = null;
    public box_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
