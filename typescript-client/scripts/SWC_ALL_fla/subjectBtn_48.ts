import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.subjectBtn_48")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.subjectBtn_48" })
export class subjectBtn_48 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
