import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * DROPZONE_CLIP - Drop zone UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="DROPZONE_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "DROPZONE_CLIP" })
export class DROPZONE_CLIP extends MovieClip {
    public ring1: MovieClip;

    constructor() {
        super();
        this.ring1 = new MovieClip();
    }
}
