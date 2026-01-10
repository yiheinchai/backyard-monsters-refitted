import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="WORKER_CLIP")]

/**
 * WORKER_CLIP - CLIP class for worker display
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "WORKER_CLIP" })
export class WORKER_CLIP extends MovieClip {
    public mcMarker: MovieClip;

    constructor() {
        super();
        this.mcMarker = new MovieClip();
    }
}
