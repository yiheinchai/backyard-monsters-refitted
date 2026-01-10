import { MovieClip } from "openfl/display/MovieClip";

// [Embed(source="/_assets/assets.swf", symbol="SWC_ALL_fla.scroller_H_621")]
export class scroller_H_621 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
