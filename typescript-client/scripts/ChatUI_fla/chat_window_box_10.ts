import { MovieClip } from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ChatUI_fla.chat_window_box_10")]
@Embed({ source: "/_assets/assets.swf", symbol: "ChatUI_fla.chat_window_box_10" })
export class chat_window_box_10 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 4, this.frame5.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame5(): void {
        this.stop();
    }
}
