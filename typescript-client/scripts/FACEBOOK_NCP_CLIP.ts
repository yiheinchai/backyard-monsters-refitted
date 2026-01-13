import MovieClip from 'openfl/display/MovieClip';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="FACEBOOK_NCP_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "FACEBOOK_NCP_CLIP" })
export class FACEBOOK_NCP_CLIP extends MovieClip {
    public mcArrow: MovieClip;
    public imageHolder: MovieClip;
    public bNo: MovieClip;
    public bYes: MovieClip;

    constructor() {
        super();
    }
}
