import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ChatBox_msg_CLIP")]

/**
 * ChatBox_msg_CLIP - CLIP class for chat box message
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ChatBox_msg_CLIP" })
export class ChatBox_msg_CLIP extends MovieClip {
    public ignoreBtn: MovieClip;
    public txt: TextField;
    public bg: MovieClip;

    constructor() {
        super();
        this.ignoreBtn = new MovieClip();
        this.txt = new TextField();
        this.bg = new MovieClip();
    }
}
