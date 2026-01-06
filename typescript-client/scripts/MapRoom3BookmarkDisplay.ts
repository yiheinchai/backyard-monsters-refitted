import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3BookmarkDisplay")]
export class MapRoom3BookmarkDisplay extends MovieClip {
    public background: MovieClip;
    public imageHolder: MovieClip;
    public nameText: TextField;
    public healthBar: MovieClip;
    public descriptionText: TextField;

    constructor() {
        super();
    }
}
