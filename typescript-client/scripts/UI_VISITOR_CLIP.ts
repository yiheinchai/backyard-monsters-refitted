import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_VISITOR_CLIP")]

/**
 * UI_VISITOR_CLIP - CLIP class for visitor UI
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_VISITOR_CLIP" })
export class UI_VISITOR_CLIP extends MovieClip {
    public mc: MovieClip;

    constructor() {
        super();
        this.mc = new MovieClip();
    }
}
