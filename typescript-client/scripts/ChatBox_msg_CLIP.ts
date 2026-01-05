import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';

/**
 * ChatBox_msg_CLIP - Base UI clip class for Chat Box Message
 * Contains all UI element declarations for chat messages
 * Converted from ActionScript to TypeScript
 */
export class ChatBox_msg_CLIP extends MovieClip {
    public ignoreBtn!: MovieClip;
    public txt!: TextField;
    public bg!: MovieClip;

    constructor() {
        super();
    }
}
