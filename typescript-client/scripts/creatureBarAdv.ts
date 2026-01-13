import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

/**
 * creatureBarAdv - Advanced creature stat bar CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="creatureBarAdv")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "creatureBarAdv" })
export class creatureBarAdv extends MovieClip {
    public mcBar2: MovieClip;
    public mcBar: MovieClip;

    constructor() {
        super();
        this.mcBar2 = new MovieClip();
        this.mcBar = new MovieClip();
    }
}
