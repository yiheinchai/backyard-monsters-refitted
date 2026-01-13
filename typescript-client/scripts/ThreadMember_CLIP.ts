import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="ThreadMember_CLIP")]

/**
 * ThreadMember_CLIP - CLIP class for thread member display
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "ThreadMember_CLIP" })
export class ThreadMember_CLIP extends MovieClip {
    public leftbg_mc: MovieClip;
    public rightbg_mc: MovieClip;
    public placeholder: MovieClip;
    public body_txt: TextField;
    public photoRing: MovieClip;

    constructor() {
        super();
        this.leftbg_mc = new MovieClip();
        this.rightbg_mc = new MovieClip();
        this.placeholder = new MovieClip();
        this.body_txt = new TextField();
        this.photoRing = new MovieClip();
    }
}
