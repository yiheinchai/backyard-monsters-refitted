import MovieClip from 'openfl/display/MovieClip';
//    [Embed(source="/_assets/assets.swf", symbol="ChatBox_CLIP")]

/**
 * ChatBox_CLIP - CLIP class for chat box
 * Converted from ActionScript to TypeScript
 */
export class ChatBox_CLIP extends MovieClip {
    public input: MovieClip;
    public frame: MovieClip;

    constructor() {
        super();
        this.input = new MovieClip();
        this.frame = new MovieClip();
    }
}
