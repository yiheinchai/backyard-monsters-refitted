import { buttonFullscreen } from './buttonFullscreen';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="buttonFullscreen_CLIP")]

/**
 * buttonFullscreen_CLIP - CLIP class for fullscreen button
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "buttonFullscreen_CLIP" })
export class buttonFullscreen_CLIP extends buttonFullscreen {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this), 2, this.frame3.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame3(): void {
        this.stop();
    }
}
