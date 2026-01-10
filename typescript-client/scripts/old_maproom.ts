import { MovieClip } from "openfl/display/MovieClip";

import { Button_CLIP } from "./Button_CLIP";
import { frame_CLIP } from "./frame_CLIP";
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="old_maproom")]
@Embed({ source: "/_assets/assets.swf", symbol: "old_maproom" })
export class old_maproom extends MovieClip {
    public mcHolder: MovieClip;
    public mvBtn: Button_CLIP;
    public lvBtn: Button_CLIP;
    public background_mc: frame_CLIP;

    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
