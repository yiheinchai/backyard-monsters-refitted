import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.bubblepopupBG_10")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.bubblepopupBG_10" })
export class bubblepopupBG_10 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
