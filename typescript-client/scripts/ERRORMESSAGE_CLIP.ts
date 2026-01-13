import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

/**
 * ERRORMESSAGE_CLIP - Error message UI element CLIP
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="ERRORMESSAGE_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ERRORMESSAGE_CLIP" })
export class ERRORMESSAGE_CLIP extends MovieClip {
    public bg: MovieClip;
    public tMessage: TextField;

    constructor() {
        super();
        this.bg = new MovieClip();
        this.tMessage = new TextField();
    }
}
