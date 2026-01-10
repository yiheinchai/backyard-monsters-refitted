import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="meterBar_rounded_blue_CLIP")]

/**
 * meterBar_rounded_blue_CLIP - CLIP class for blue rounded meter bar
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "meterBar_rounded_blue_CLIP" })
export class meterBar_rounded_blue_CLIP extends MovieClip {
    public mcFill: MovieClip;
    public mcBG: MovieClip;
    public mcFillMask: MovieClip;

    constructor() {
        super();
        this.mcFill = new MovieClip();
        this.mcBG = new MovieClip();
        this.mcFillMask = new MovieClip();
    }
}
