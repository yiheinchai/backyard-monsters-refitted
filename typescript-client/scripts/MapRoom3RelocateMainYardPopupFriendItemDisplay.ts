import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MapRoom3RelocateMainYardPopupFriendItemDisplay")]
export class MapRoom3RelocateMainYardPopupFriendItemDisplay extends MovieClip {
    public worldText: TextField;
    public imageHolder: MovieClip;
    public nameText: TextField;
    public levelIcon: MovieClip;
    public coordinatesText: TextField;
    public relocateButton: Button_CLIP;

    constructor() {
        super();
    }
}
