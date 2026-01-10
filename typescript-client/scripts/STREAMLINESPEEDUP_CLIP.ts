import MovieClip from 'openfl/display/MovieClip';
import TextField from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";
//    [Embed(source="/_assets/assets.swf", symbol="STREAMLINESPEEDUP_CLIP")]

/**
 * STREAMLINESPEEDUP_CLIP - CLIP class for streamline speedup popup
 * Converted from ActionScript to TypeScript
 */
@Embed({ source: "/_assets/assets.swf", symbol: "STREAMLINESPEEDUP_CLIP" })
export class STREAMLINESPEEDUP_CLIP extends MovieClip {
    public mcBG: frame_CLIP;
    public mcStoreIcon: MovieClip;
    public mcInstant: MovieClip;
    public tTitle: TextField;
    public tDescription: TextField;

    constructor() {
        super();
        this.mcBG = new frame_CLIP();
        this.mcStoreIcon = new MovieClip();
        this.mcInstant = new MovieClip();
        this.tTitle = new TextField();
        this.tDescription = new TextField();
    }
}
