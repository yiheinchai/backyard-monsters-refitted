import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="buttonDefenseEvent_CLIP")]

/**
 * buttonDefenseEvent_CLIP - CLIP class for defense event button
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "buttonDefenseEvent_CLIP" })
export class buttonDefenseEvent_CLIP extends MovieClip {
    public tCountdown: TextField;

    constructor() {
        super();
        this.tCountdown = new TextField();
    }
}
