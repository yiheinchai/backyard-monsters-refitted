import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3BookmarksPopup")]
export class MapRoom3BookmarksPopup extends MovieClip {
    public contentsMask: MovieClip;
    public contentsContainer: MovieClip;
    public contentsFrame: MovieClip;
    public frame: frame_CLIP;
    public titleText: TextField;

    constructor() {
        super();
    }
}
