import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="frontpage_stonebtn")]

/**
 * frontpage_stonebtn - Frontpage stone button component
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "frontpage_stonebtn" })
export class frontpage_stonebtn extends MovieClip {
    public mcBG: MovieClip;
    public tLabel: TextField;

    constructor() {
        super();
        this.mcBG = new MovieClip();
        this.tLabel = new TextField();
    }
}
