import { MovieClip } from 'openfl/display/MovieClip';
import { TextField } from 'openfl/text/TextField';
import { frame_CLIP } from './frame_CLIP';

// [Embed(source="/_assets/assets.swf", symbol="QUESTSPOPUP_CLIP")]
export class QUESTSPOPUP_CLIP extends MovieClip {
    public title_txt: TextField;
    public mcFrame: frame_CLIP;

    constructor() {
        super();
    }
}
