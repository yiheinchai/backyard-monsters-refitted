import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="UI_WARNING_CLIP")]

/**
 * UI_WARNING_CLIP - CLIP class for warning UI
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "UI_WARNING_CLIP" })
export class UI_WARNING_CLIP extends MovieClip {
    public mc: MovieClip;

    constructor() {
        super();
        this.mc = new MovieClip();
    }
}
