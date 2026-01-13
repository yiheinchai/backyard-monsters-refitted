import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="doodad_mushroom_mc")]

/**
 * doodad_mushroom_mc - Mushroom doodad MovieClip component
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "doodad_mushroom_mc" })
export class doodad_mushroom_mc extends MovieClip {
    public mc: MovieClip;

    constructor() {
        super();
        this.mc = new MovieClip();
    }
}
