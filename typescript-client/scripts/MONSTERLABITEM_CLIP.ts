import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MONSTERLABITEM_CLIP")]
@Embed({ source: "/_assets/assets.swf", symbol: "MONSTERLABITEM_CLIP" })
export class MONSTERLABITEM_CLIP extends MovieClip {
    public mcBG: MovieClip;
    public tLabel: TextField;
    public mcIcon: MovieClip;
    public mcLevel: MovieClip;

    constructor() {
        super();
    }
}
