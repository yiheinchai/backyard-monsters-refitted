import { MovieClip } from "openfl/display/MovieClip";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.PointsBar_Inferno_898")]
export class PointsBar_Inferno_898 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
