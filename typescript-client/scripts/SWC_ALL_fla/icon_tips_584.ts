import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.icon_tips_584")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.icon_tips_584" })
export class icon_tips_584 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
