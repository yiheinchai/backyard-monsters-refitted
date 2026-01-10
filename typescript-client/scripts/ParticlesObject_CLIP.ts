import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ParticlesObject_CLIP")]

/**
 * ParticlesObject_CLIP - CLIP class for general particle objects
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ParticlesObject_CLIP" })
export class ParticlesObject_CLIP extends MovieClip {
    public mcDot: MovieClip;

    constructor() {
        super();
        this.mcDot = new MovieClip();
    }
}
