import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ChatBox_CLIP")]

/**
 * ChatBox_CLIP - CLIP class for chat box
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ChatBox_CLIP" })
export class ChatBox_CLIP extends MovieClip {
    public input: MovieClip;
    public frame: MovieClip;

    constructor() {
        super();
        this.input = new MovieClip();
        this.frame = new MovieClip();
    }
}
