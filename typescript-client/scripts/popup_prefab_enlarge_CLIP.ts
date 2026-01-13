import MovieClip from 'openfl/display/MovieClip';
import { frame_CLIP } from './frame_CLIP';
import { Embed } from "./core/Embed";

/**
 * popup_prefab_enlarge_CLIP - Base CLIP class for popup prefab enlarge
 * Converted from ActionScript to TypeScript
 * 
 * Original: [Embed(source="/_assets/assets.swf", symbol="popup_prefab_enlarge_CLIP")]
 */
@Embed({ source: "/_assets/assets.swf", symbol: "popup_prefab_enlarge_CLIP" })
export class popup_prefab_enlarge_CLIP extends MovieClip {
    public mcImage: MovieClip;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
        this.mcImage = new MovieClip();
        this.mcFrame = new frame_CLIP();
    }
}
