import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ScrollSetH_CLIP")]

/**
 * ScrollSetH_CLIP - CLIP class for horizontal scroll set
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ScrollSetH_CLIP" })
export class ScrollSetH_CLIP extends MovieClip {
    public mcBG: MovieClip;
    public mcScroller: MovieClip;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.mcScroller = new MovieClip();
    }
}
