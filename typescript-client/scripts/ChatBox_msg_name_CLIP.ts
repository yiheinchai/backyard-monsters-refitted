import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ChatBox_msg_name_CLIP")]

/**
 * ChatBox_msg_name_CLIP - CLIP class for chat box message name
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ChatBox_msg_name_CLIP" })
export class ChatBox_msg_name_CLIP extends MovieClip {
    public bg: MovieClip;
    public label: TextField;

    constructor() {
        super();
        this.bg = new MovieClip();
        this.label = new TextField();
    }
}
