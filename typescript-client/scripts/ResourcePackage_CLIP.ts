import MovieClip from 'openfl/display/MovieClip';
import { packagedot } from './packagedot';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ResourcePackage_CLIP")]

/**
 * ResourcePackage_CLIP - CLIP class for resource package
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ResourcePackage_CLIP" })
export class ResourcePackage_CLIP extends MovieClip {
    public mcShadow: MovieClip;
    public mcDot: packagedot;

    constructor() {
        super();
        this.mcShadow = new MovieClip();
        this.mcDot = new packagedot();
    }
}
