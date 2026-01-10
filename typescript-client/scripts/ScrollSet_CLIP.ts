import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * ScrollSet_CLIP - Scroll set UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="ScrollSet_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ScrollSet_CLIP" })
export class ScrollSet_CLIP extends MovieClip {
    public mcBG: MovieClip;
    public mcScroller: MovieClip;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.mcScroller = new MovieClip();
    }
}
