import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';
import { Button_CLIP } from './Button_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="MapRoomPopup_LostMainBase_CLIP")]
export class MapRoomPopup_LostMainBase_CLIP extends MovieClip {
    public mcBG: frame_CLIP;
    public bNo: Button_CLIP;
    public tDesc: TextField;
    public tTitle: TextField;
    public mcImage: MovieClip;
    public tWarning: TextField;
    public bYes: Button_CLIP;

    constructor() {
        super();
    }
}
