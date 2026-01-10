import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * CheckBox_CLIP - Checkbox UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="CheckBox_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "CheckBox_CLIP" })
export class CheckBox_CLIP extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
