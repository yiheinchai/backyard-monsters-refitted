import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * GIBLET_CLIP - Giblet effect CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="GIBLET_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "GIBLET_CLIP" })
export class GIBLET_CLIP extends MovieClip {
    public mcDot: MovieClip;

    constructor() {
        super();
        this.mcDot = new MovieClip();
    }
}
