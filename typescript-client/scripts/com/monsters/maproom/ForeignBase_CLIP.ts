import { MovieClip } from "openfl/display/MovieClip";
import { SimpleButton } from "openfl/display/SimpleButton";
import { TextField } from "openfl/text/TextField";

// [Embed(source="/_assets/assets.swf", symbol="com.monsters.maproom.ForeignBase_CLIP")]

/**
 * Foreign base clip - display for foreign player base on map.
 */
export class ForeignBase_CLIP extends MovieClip {
    public mediumhit: SimpleButton | null = null;
    public photoFrame_mc: MovieClip | null = null;
    public smallhit: SimpleButton | null = null;
    public name_txt: TextField | null = null;
    public placeholder: MovieClip | null = null;
    public largehit: SimpleButton | null = null;
    public frame_mc: MovieClip | null = null;
    public level: MovieClip | null = null;
    public box_mc: MovieClip | null = null;

    constructor() {
        super();
    }
}
