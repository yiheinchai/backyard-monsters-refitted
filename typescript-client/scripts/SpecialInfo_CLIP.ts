import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="SpecialInfo_CLIP")]

/**
 * SpecialInfo_CLIP - CLIP class for special info display
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "SpecialInfo_CLIP" })
export class SpecialInfo_CLIP extends MovieClip {
    public tName: TextField;
    public mcImage: MovieClip;

    constructor() {
        super();
        this.tName = new TextField();
        this.mcImage = new MovieClip();
    }
}
