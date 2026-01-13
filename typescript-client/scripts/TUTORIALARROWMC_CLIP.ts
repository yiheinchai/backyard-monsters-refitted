import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="TUTORIALARROWMC_CLIP")]

/**
 * TUTORIALARROWMC_CLIP - CLIP class for tutorial arrow
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "TUTORIALARROWMC_CLIP" })
export class TUTORIALARROWMC_CLIP extends MovieClip {
    public mcArrow: MovieClip;

    constructor() {
        super();
        this.mcArrow = new MovieClip();
    }
}
