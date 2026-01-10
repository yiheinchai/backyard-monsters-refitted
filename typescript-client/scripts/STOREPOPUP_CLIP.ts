import { MovieClip } from "openfl/display/MovieClip";
import { TextField } from "openfl/text/TextField";
import { Button_CLIP } from "./Button_CLIP";
import { ButtonBrown_CLIP } from "./ButtonBrown_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="STOREPOPUP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "STOREPOPUP_CLIP" })
export class STOREPOPUP_CLIP extends MovieClip {
    public b1: ButtonBrown_CLIP;
    public tShinyBalance: TextField;
    public b2: ButtonBrown_CLIP;
    public b3: ButtonBrown_CLIP;
    public b4: ButtonBrown_CLIP;
    public bAdd: Button_CLIP;
    public b5: ButtonBrown_CLIP;
    public mcFrame: frame_CLIP;
    public window: MovieClip;

    constructor() {
        super();
    }
}
