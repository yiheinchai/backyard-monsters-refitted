import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.attackBtn_380")]
@Embed({ source: "/_assets/assets.swf", symbol: "SWC_ALL_fla.attackBtn_380" })
export class attackBtn_380 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
