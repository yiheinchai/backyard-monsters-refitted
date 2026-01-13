import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ui_buffIcon_CLIP")]

/**
 * ui_buffIcon_CLIP - CLIP class for buff icon
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ui_buffIcon_CLIP" })
export class ui_buffIcon_CLIP extends MovieClip {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
    }

    private frame1(): void {
        this.stop();
    }
}
