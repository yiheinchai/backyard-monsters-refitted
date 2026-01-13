import MovieClip from "openfl/display/MovieClip";
import { Embed } from "../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="ChatUI_fla.ChatBox_ignoreBtn_17")]
@Embed({ source: "/_assets/assets.swf", symbol: "ChatUI_fla.ChatBox_ignoreBtn_17" })
export class ChatBox_ignoreBtn_17 extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
