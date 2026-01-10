import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="flingerLevel")]

/**
 * flingerLevel - Flinger level component with MovieClip
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "flingerLevel" })
export class flingerLevel extends MovieClip {
    public _mc: MovieClip;

    constructor() {
        super();
        this._mc = new MovieClip();
    }
}
