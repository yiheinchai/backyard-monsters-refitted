import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="BasePlanner_fla.CheckBox_3")]
@Embed({ source: "/_assets/assets.swf", symbol: "BasePlanner_fla.CheckBox_3" })
export class CheckBox_3 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
