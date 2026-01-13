import { buttonZoom } from './buttonZoom';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="buttonZoom_CLIP")]

/**
 * buttonZoom_CLIP - CLIP class for zoom button
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "buttonZoom_CLIP" })
export class buttonZoom_CLIP extends buttonZoom {
    constructor() {
        super();
        this.addFrameScript(0, this.frame1.bind(this));
        this.addFrameScript(3, this.frame4.bind(this));
    }

    private frame1(): void {
        this.stop();
    }

    private frame4(): void {
        this.stop();
    }
}
