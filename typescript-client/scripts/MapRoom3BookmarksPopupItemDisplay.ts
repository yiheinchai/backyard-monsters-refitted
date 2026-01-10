import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';
import { Embed } from "./core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3BookmarksPopupItemDisplay")]
@Embed({ source: "/_assets/assets.swf", symbol: "MapRoom3BookmarksPopupItemDisplay" })
export class MapRoom3BookmarksPopupItemDisplay extends MovieClip {
    public background: MovieClip;
    public nameText: TextField;
    public removeButton: Button_CLIP;
    public coordinatesText: TextField;

    constructor() {
        super();
    }
}
